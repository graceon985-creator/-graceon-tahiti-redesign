<?php
/**
 * Island editorial highlights: places, experiences, culture and history.
 */
if (!defined('ABSPATH')) { exit; }

function gtc_register_highlight_content(): void {
    register_post_type('iot_highlight', [
        'labels' => [
            'name' => __('Island highlights', 'graceon-tahiti-core'),
            'singular_name' => __('Island highlight', 'graceon-tahiti-core'),
            'add_new_item' => __('Add island highlight', 'graceon-tahiti-core'),
            'edit_item' => __('Edit island highlight', 'graceon-tahiti-core'),
        ],
        'public' => true,
        'show_in_rest' => true,
        'has_archive' => false,
        'menu_icon' => 'dashicons-camera',
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'page-attributes'],
        'rewrite' => ['with_front' => false],
    ]);
    register_taxonomy('iot_highlight_island', ['iot_highlight'], [
        'labels' => ['name' => __('Highlight islands', 'graceon-tahiti-core'), 'singular_name' => __('Highlight island', 'graceon-tahiti-core')],
        'public' => true, 'hierarchical' => true, 'show_in_rest' => true,
        'rewrite' => ['with_front' => false],
    ]);
    register_taxonomy('iot_highlight_type', ['iot_highlight'], [
        'labels' => ['name' => __('Highlight types', 'graceon-tahiti-core'), 'singular_name' => __('Highlight type', 'graceon-tahiti-core')],
        'public' => true, 'hierarchical' => true, 'show_in_rest' => true,
    ]);
}
add_action('init', 'gtc_register_highlight_content', 9);

function gtc_highlight_meta_fields(): array {
    return [
        'gtc_highlight_image_url' => ['Image URL', 'url'],
        'gtc_highlight_image_credit' => ['Image credit', 'text'],
        'gtc_highlight_license_url' => ['Image license URL', 'url'],
        'gtc_highlight_location' => ['Location label', 'text'],
        'gtc_highlight_map_url' => ['Map link', 'url'],
        'gtc_highlight_kicker' => ['Short category label', 'text'],
    ];
}

function gtc_highlight_add_meta_boxes(): void {
    add_meta_box('gtc_highlight_details', __('Highlight details', 'graceon-tahiti-core'), 'gtc_highlight_render_meta_box', 'iot_highlight', 'normal', 'high');
}
add_action('add_meta_boxes', 'gtc_highlight_add_meta_boxes');

function gtc_highlight_render_meta_box(WP_Post $post): void {
    wp_nonce_field('gtc_highlight_save', 'gtc_highlight_nonce');
    foreach (gtc_highlight_meta_fields() as $key => $field) {
        $value = get_post_meta($post->ID, $key, true);
        printf(
            '<p><label style="display:block;font-weight:600;margin-bottom:5px" for="%1$s">%2$s</label><input style="width:100%%" id="%1$s" type="%3$s" name="%1$s" value="%4$s"></p>',
            esc_attr($key), esc_html($field[0]), esc_attr($field[1]), esc_attr($value)
        );
    }
    echo '<p class="description">' . esc_html__('Use images you have permission to publish. Keep the photographer credit and license link when required.', 'graceon-tahiti-core') . '</p>';
}

function gtc_highlight_save_meta(int $post_id): void {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) { return; }
    if (get_post_type($post_id) !== 'iot_highlight' || !isset($_POST['gtc_highlight_nonce'])) { return; }
    if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['gtc_highlight_nonce'])), 'gtc_highlight_save')) { return; }
    if (!current_user_can('edit_post', $post_id)) { return; }
    foreach (gtc_highlight_meta_fields() as $key => $field) {
        if (!isset($_POST[$key])) { continue; }
        $raw = wp_unslash($_POST[$key]);
        $value = $field[1] === 'url' ? esc_url_raw($raw) : sanitize_text_field($raw);
        update_post_meta($post_id, $key, $value);
    }
}
add_action('save_post_iot_highlight', 'gtc_highlight_save_meta');

function gtc_seed_bora_bora_highlights(): void {
    $items = [
        [
            'otemanu', 'Mount Otemanu', 'LANDMARK', 'The island’s unmistakable volcanic landmark',
            'Rising 727 metres above Bora Bora, Mount Otemanu shapes the island’s skyline and can be admired from the lagoon, the coast and many viewpoints. Guided outings are the right way to explore the mountain trails.',
            'https://commons.wikimedia.org/wiki/Special:FilePath/Mount_Otemanu_Bora_Bora.jpg?width=1400',
            'Athos33320 · Wikimedia Commons', 'https://creativecommons.org/licenses/by-sa/4.0/',
            'Central Bora Bora', 'https://www.google.com/maps/search/?api=1&query=Mount+Otemanu+Bora+Bora'
        ],
        [
            'matira-beach', 'Matira Beach', 'BEACH & LAGOON', 'A celebrated stretch of white sand',
            'Matira is Bora Bora’s best-known public beach, with a long shoreline, shallow lagoon water and beautiful views. It is also associated with the finish of the Hawaiki Nui Va’a outrigger canoe race.',
            'https://commons.wikimedia.org/wiki/Special:FilePath/Matira_Beach%2C_Bora_Bora%2C_French_Polynesia.jpg?width=1400',
            'Scott Williams · Wikimedia Commons', 'https://creativecommons.org/licenses/by/2.5/',
            'Southern Bora Bora', 'https://www.google.com/maps/search/?api=1&query=Matira+Beach+Bora+Bora'
        ],
        [
            'motu-tapu', 'Motu Tapu', 'MOTU & LAGOON', 'A small islet in the lagoon',
            'Motu Tapu is one of the small islets within Bora Bora’s lagoon. It is best understood as part of the wider lagoon landscape and is generally approached as part of a boat excursion.',
            'https://commons.wikimedia.org/wiki/Special:FilePath/Motu_Tapu_%28Bottom-Centre%29%2C_Bora_Bora_French_Polynesia.jpg?width=1200',
            'Planet Labs, Inc · Wikimedia Commons', 'https://creativecommons.org/licenses/by-sa/4.0/',
            'Bora Bora lagoon', 'https://www.google.com/maps/search/?api=1&query=Motu+Tapu+Bora+Bora'
        ],
        [
            'hawaiki-nui-vaa', 'Hawaiki Nui Va’a', 'CULTURE & SPORT', 'A celebrated outrigger canoe race',
            'Hawaiki Nui Va’a is a major annual outrigger canoe race linking Huahine, Raiatea, Taha’a and Bora Bora. The final arrival at Matira makes the event a memorable part of the islands’ sporting and cultural calendar.',
            'https://commons.wikimedia.org/wiki/Special:FilePath/Hawaiki_Nui_Va%27a_3.jpg?width=1200',
            'Bianca Henry · Wikimedia Commons', 'https://creativecommons.org/licenses/by/2.0/',
            'Matira Beach · event finish', 'https://www.google.com/maps/search/?api=1&query=Matira+Beach+Bora+Bora'
        ],
        [
            'vaitape', 'Vaitape', 'LOCAL LIFE', 'The island’s main village',
            'Vaitape is the main village and an everyday point of reference for local life on Bora Bora. It is a useful place to discover the waterfront, shops, food and the rhythm of the island beyond the resort motu.',
            'https://commons.wikimedia.org/wiki/Special:FilePath/FP-bora-hafen.jpg?width=1200',
            'Balou46 · Wikimedia Commons', 'https://creativecommons.org/licenses/by-sa/4.0/',
            'Vaitape', 'https://www.google.com/maps/search/?api=1&query=Vaitape+Bora+Bora'
        ],
    ];
    foreach ($items as $item) {
        [$slug, $title, $kicker, $excerpt, $body, $image, $credit, $license, $location, $map] = $item;
        $existing = get_page_by_path($slug, OBJECT, 'iot_highlight');
        if ($existing) { continue; }
        $id = wp_insert_post([
            'post_type' => 'iot_highlight', 'post_status' => 'publish',
            'post_title' => $title, 'post_name' => $slug,
            'post_excerpt' => $excerpt, 'post_content' => '<p>' . esc_html($body) . '</p>',
            'menu_order' => count($items),
        ], true);
        if (is_wp_error($id)) { continue; }
        update_post_meta($id, 'gtc_highlight_image_url', esc_url_raw($image));
        update_post_meta($id, 'gtc_highlight_image_credit', sanitize_text_field($credit));
        update_post_meta($id, 'gtc_highlight_license_url', esc_url_raw($license));
        update_post_meta($id, 'gtc_highlight_location', sanitize_text_field($location));
        update_post_meta($id, 'gtc_highlight_map_url', esc_url_raw($map));
        update_post_meta($id, 'gtc_highlight_kicker', sanitize_text_field($kicker));
        wp_set_object_terms($id, 'bora-bora', 'iot_highlight_island', false);
    }
}
