<?php
/**
 * Plugin Name: GRACEON Tahiti Content & Integration Core
 * Description: Structured tourism content types and integration extension points for the independent Islands of Tahiti WordPress concept.
 * Version: 1.0.0
 * Requires at least: 6.4
 * Requires PHP: 8.0
 * Author: GRACEON Digital Studio
 * Text Domain: graceon-tahiti-core
 */
if (!defined('ABSPATH')) { exit; }

define('GTC_VERSION', '1.0.0');

function gtc_register_content_types(): void {
    $types = [
        'iot_island' => ['Island', 'Islands', 'dashicons-location-alt', true],
        'iot_experience' => ['Experience', 'Experiences', 'dashicons-palmtree', true],
        'iot_event' => ['Event', 'Events', 'dashicons-calendar-alt', true],
        'iot_provider' => ['Tourism provider', 'Tourism providers', 'dashicons-store', true],
        'iot_accommodation' => ['Accommodation', 'Accommodation', 'dashicons-admin-home', true],
        'iot_offer' => ['Special offer', 'Special offers', 'dashicons-tag', true],
        'iot_tip' => ['Practical tip', 'Practical information', 'dashicons-lightbulb', true],
    ];
    foreach ($types as $type => $data) {
        [$singular, $plural, $icon, $archive] = $data;
        register_post_type($type, [
            'labels' => ['name' => __($plural, 'graceon-tahiti-core'), 'singular_name' => __($singular, 'graceon-tahiti-core'), 'add_new_item' => sprintf(__('Add %s', 'graceon-tahiti-core'), $singular), 'edit_item' => sprintf(__('Edit %s', 'graceon-tahiti-core'), $singular)],
            'public' => true,
            'has_archive' => $archive,
            'show_in_rest' => true,
            'menu_icon' => $icon,
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'page-attributes'],
            'rewrite' => ['with_front' => false],
        ]);
    }
}
add_action('init', 'gtc_register_content_types');

function gtc_register_taxonomies(): void {
    $taxonomies = [
        'iot_island_group' => ['Island group', 'Island groups', ['iot_island', 'iot_experience', 'iot_event', 'iot_provider', 'iot_accommodation', 'iot_offer', 'iot_tip']],
        'iot_experience_type' => ['Experience type', 'Experience types', ['iot_experience']],
        'iot_tip_topic' => ['Practical topic', 'Practical topics', ['iot_tip']],
        'iot_provider_category' => ['Provider category', 'Provider categories', ['iot_provider', 'iot_accommodation']],
    ];
    foreach ($taxonomies as $taxonomy => $data) {
        [$singular, $plural, $objects] = $data;
        register_taxonomy($taxonomy, $objects, [
            'labels' => ['name' => __($plural, 'graceon-tahiti-core'), 'singular_name' => __($singular, 'graceon-tahiti-core')],
            'public' => true, 'hierarchical' => true, 'show_in_rest' => true,
            'rewrite' => ['with_front' => false],
        ]);
    }
}
add_action('init', 'gtc_register_taxonomies');

function gtc_meta_fields(): array {
    return [
        'iot_island_archipelago' => ['Island group / archipelago', ['iot_island'], 'text'],
        'iot_external_source_id' => ['External source record ID', ['iot_provider', 'iot_event', 'iot_accommodation', 'iot_offer'], 'text'],
        'iot_location_name' => ['Location', ['iot_event', 'iot_provider', 'iot_accommodation', 'iot_offer', 'iot_tip', 'iot_experience'], 'text'],
        'iot_event_start' => ['Event start (ISO 8601)', ['iot_event'], 'text'],
        'iot_event_end' => ['Event end (ISO 8601)', ['iot_event'], 'text'],
        'iot_offer_start' => ['Offer valid from (YYYY-MM-DD)', ['iot_offer'], 'date'],
        'iot_offer_end' => ['Offer valid until (YYYY-MM-DD)', ['iot_offer'], 'date'],
        'iot_provider_url' => ['Official provider website', ['iot_provider', 'iot_accommodation'], 'url'],
        'iot_contact_email' => ['Public contact email', ['iot_provider', 'iot_accommodation'], 'email'],
    ];
}
function gtc_register_meta(): void {
    foreach (gtc_meta_fields() as $key => $field) {
        foreach ($field[1] as $post_type) {
            register_post_meta($post_type, $key, [
                'type' => 'string', 'single' => true, 'show_in_rest' => true,
                'sanitize_callback' => $field[2] === 'email' ? 'sanitize_email' : ($field[2] === 'url' ? 'esc_url_raw' : 'sanitize_text_field'),
                'auth_callback' => static function (): bool { return current_user_can('edit_posts'); },
            ]);
        }
    }
}
add_action('init', 'gtc_register_meta');

function gtc_add_meta_boxes(): void {
    foreach (gtc_meta_fields() as $key => $field) {
        foreach ($field[1] as $post_type) {
            add_meta_box('gtc_' . $key, esc_html__($field[0], 'graceon-tahiti-core'), 'gtc_render_meta_box', $post_type, 'normal', 'default', ['key' => $key, 'type' => $field[2]]);
        }
    }
}
add_action('add_meta_boxes', 'gtc_add_meta_boxes');

function gtc_render_meta_box(WP_Post $post, array $box): void {
    $key = sanitize_key($box['args']['key']);
    $type = $box['args']['type'];
    $value = get_post_meta($post->ID, $key, true);
    wp_nonce_field('gtc_save_meta_' . $key, 'gtc_nonce_' . $key);
    printf('<label class="screen-reader-text" for="%1$s">%2$s</label><input style="width:100%%" id="%1$s" type="%3$s" name="%1$s" value="%4$s">', esc_attr($key), esc_attr($box['title']), esc_attr($type), esc_attr($value));
}
function gtc_save_meta(int $post_id): void {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) { return; }
    $type = get_post_type($post_id);
    foreach (gtc_meta_fields() as $key => $field) {
        if (!in_array($type, $field[1], true)) { continue; }
        $nonce_name = 'gtc_nonce_' . $key;
        if (!isset($_POST[$nonce_name]) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST[$nonce_name])), 'gtc_save_meta_' . $key)) { continue; }
        if (!current_user_can('edit_post', $post_id) || !isset($_POST[$key])) { continue; }
        $raw = wp_unslash($_POST[$key]);
        $value = $field[2] === 'email' ? sanitize_email($raw) : ($field[2] === 'url' ? esc_url_raw($raw) : sanitize_text_field($raw));
        update_post_meta($post_id, $key, $value);
    }
}
add_action('save_post', 'gtc_save_meta');

/**
 * Integration contract:
 * - Define GTC_APIDAE_ENABLED and provide a client via the gtc_apidae_client filter.
 * - Implement client methods against the official API documentation and credentials supplied by Tahiti Tourisme.
 * - Connect FairGuest through gtc_fairguest_reviews; never scrape private endpoints.
 */
function gtc_apidae_client() {
    if (!defined('GTC_APIDAE_ENABLED') || !GTC_APIDAE_ENABLED) {
        return new WP_Error('gtc_apidae_not_configured', __('APIDAE integration is not configured. Official credentials and API documentation are required.', 'graceon-tahiti-core'));
    }
    $client = apply_filters('gtc_apidae_client', null);
    if (!$client) {
        return new WP_Error('gtc_apidae_adapter_missing', __('APIDAE is enabled but no approved API adapter has been provided.', 'graceon-tahiti-core'));
    }
    return $client;
}
function gtc_get_fairguest_reviews($provider_id) {
    return apply_filters('gtc_fairguest_reviews', new WP_Error('gtc_fairguest_not_configured', __('FairGuest integration requires the official API specification and access.', 'graceon-tahiti-core')), $provider_id);
}

function gtc_admin_notice(): void {
    if (!current_user_can('manage_options')) { return; }
    $missing = [];
    if (!defined('GTC_APIDAE_ENABLED') || !GTC_APIDAE_ENABLED) { $missing[] = 'APIDAE credentials / approved API adapter'; }
    if (!has_filter('gtc_fairguest_reviews')) { $missing[] = 'FairGuest API adapter'; }
    if ($missing) {
        echo '<div class="notice notice-info"><p><strong>GRACEON Tahiti Core:</strong> ' . esc_html__('Live tourism integrations are not connected yet. Required:', 'graceon-tahiti-core') . ' ' . esc_html(implode('; ', $missing)) . '.</p></div>';
    }
}
add_action('admin_notices', 'gtc_admin_notice');

register_activation_hook(__FILE__, function (): void {
    gtc_register_content_types();
    gtc_register_taxonomies();
    flush_rewrite_rules();
});
register_deactivation_hook(__FILE__, 'flush_rewrite_rules');


/** Show only offers that are currently within their validity window. */
function gtc_filter_public_offers(WP_Query $query): void {
    if (is_admin() || !$query->is_main_query() || !$query->is_post_type_archive('iot_offer')) { return; }
    $today = current_time('Y-m-d');
    $query->set('meta_query', [
        'relation' => 'AND',
        [
            'relation' => 'OR',
            ['key' => 'iot_offer_start', 'value' => $today, 'compare' => '<=', 'type' => 'DATE'],
            ['key' => 'iot_offer_start', 'compare' => 'NOT EXISTS'],
            ['key' => 'iot_offer_start', 'value' => '', 'compare' => '='],
        ],
        [
            'relation' => 'OR',
            ['key' => 'iot_offer_end', 'value' => $today, 'compare' => '>=', 'type' => 'DATE'],
            ['key' => 'iot_offer_end', 'compare' => 'NOT EXISTS'],
            ['key' => 'iot_offer_end', 'value' => '', 'compare' => '='],
        ],
    ]);
}
add_action('pre_get_posts', 'gtc_filter_public_offers');

/** Lightweight internal search endpoint across the structured tourism content. */
function gtc_register_search_route(): void {
    register_rest_route('gtc/v1', '/search', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'gtc_search_content',
        'permission_callback' => '__return_true',
        'args' => [
            'q' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field'],
            'limit' => ['default' => 12, 'sanitize_callback' => 'absint'],
        ],
    ]);
}
add_action('rest_api_init', 'gtc_register_search_route');

function gtc_search_content(WP_REST_Request $request): WP_REST_Response {
    $term = trim((string) $request->get_param('q'));
    if (mb_strlen($term) < 2) {
        return new WP_REST_Response(['items' => [], 'message' => __('Enter at least two characters.', 'graceon-tahiti-core')], 200);
    }
    $limit = min(20, max(1, (int) $request->get_param('limit')));
    $query = new WP_Query([
        'post_type' => ['iot_island','iot_experience','iot_event','iot_provider','iot_accommodation','iot_offer','iot_tip','post','page'],
        'post_status' => 'publish', 'posts_per_page' => $limit,
        's' => $term, 'no_found_rows' => true,
    ]);
    $items = [];
    foreach ($query->posts as $post) {
        $items[] = [
            'id' => $post->ID,
            'type' => $post->post_type,
            'title' => get_the_title($post),
            'url' => get_permalink($post),
            'excerpt' => wp_strip_all_tags(get_the_excerpt($post)),
            'image' => get_the_post_thumbnail_url($post, 'iot-card') ?: null,
        ];
    }
    return new WP_REST_Response(['items' => $items], 200);
}
