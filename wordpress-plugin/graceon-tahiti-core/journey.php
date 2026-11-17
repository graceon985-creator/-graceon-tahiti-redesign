<?php
/**
 * Private, account-based saved places for the My Journey feature.
 */
if (!defined('ABSPATH')) { exit; }

function gtc_get_saved_journey_ids(int $user_id = 0): array {
    $user_id = $user_id ?: get_current_user_id();
    if (!$user_id) { return []; }
    $ids = get_user_meta($user_id, 'gtc_saved_journey', true);
    if (!is_array($ids)) { return []; }
    return array_values(array_unique(array_filter(array_map('absint', $ids))));
}

function gtc_journey_save_button(int $post_id): string {
    $post = get_post($post_id);
    if (!$post || $post->post_status !== 'publish' || !in_array($post->post_type, ['iot_island', 'iot_highlight'], true)) {
        return '';
    }
    if (!is_user_logged_in()) {
        return '<a class="gtc-journey-login" href="' . esc_url(wp_login_url(get_permalink($post_id))) . '">' . esc_html__('SIGN IN TO SAVE ↗', 'graceon-tahiti-core') . '</a>';
    }
    $saved = in_array($post_id, gtc_get_saved_journey_ids(), true);
    return sprintf(
        '<button type="button" class="gtc-journey-save" data-gtc-save data-post-id="%1$d" data-saved="%2$s" aria-pressed="%3$s">%4$s</button>',
        $post_id,
        $saved ? '1' : '0',
        $saved ? 'true' : 'false',
        esc_html($saved ? __('SAVED TO MY JOURNEY ✓', 'graceon-tahiti-core') : __('SAVE TO MY JOURNEY ↗', 'graceon-tahiti-core'))
    );
}

function gtc_ajax_toggle_journey_item(): void {
    check_ajax_referer('gtc_journey_toggle', 'nonce');
    if (!is_user_logged_in()) {
        wp_send_json_error(['message' => __('Please sign in first.', 'graceon-tahiti-core')], 401);
    }
    $post_id = isset($_POST['post_id']) ? absint($_POST['post_id']) : 0;
    $post = get_post($post_id);
    if (!$post || $post->post_status !== 'publish' || !in_array($post->post_type, ['iot_island', 'iot_highlight'], true)) {
        wp_send_json_error(['message' => __('This item cannot be saved.', 'graceon-tahiti-core')], 400);
    }
    $user_id = get_current_user_id();
    $ids = gtc_get_saved_journey_ids($user_id);
    $saved = in_array($post_id, $ids, true);
    if ($saved) {
        $ids = array_values(array_diff($ids, [$post_id]));
    } else {
        $ids[] = $post_id;
        $ids = array_values(array_unique($ids));
    }
    update_user_meta($user_id, 'gtc_saved_journey', $ids);
    wp_send_json_success(['saved' => !$saved, 'count' => count($ids)]);
}
add_action('wp_ajax_gtc_toggle_journey_item', 'gtc_ajax_toggle_journey_item');

function gtc_my_journey_shortcode(): string {
    if (!is_user_logged_in()) {
        return '<section class="gtc-my-journey-empty"><h2>' . esc_html__('Your journey starts here.', 'graceon-tahiti-core') . '</h2><p>' . esc_html__('Sign in to keep a private collection of islands and places you want to explore.', 'graceon-tahiti-core') . '</p><a href="' . esc_url(wp_login_url(get_permalink())) . '">' . esc_html__('SIGN IN ↗', 'graceon-tahiti-core') . '</a></section>';
    }
    $ids = gtc_get_saved_journey_ids();
    if (!$ids) {
        return '<section class="gtc-my-journey-empty"><p class="iot-island-eyebrow">' . esc_html__('YOUR PERSONAL COLLECTION', 'graceon-tahiti-core') . '</p><h2>' . esc_html__('Your journey is waiting.', 'graceon-tahiti-core') . '</h2><p>' . esc_html__('Save an island or a place as you explore, and it will appear here.', 'graceon-tahiti-core') . '</p><a href="' . esc_url(home_url('/#islands')) . '">' . esc_html__('EXPLORE THE ISLANDS ↗', 'graceon-tahiti-core') . '</a></section>';
    }
    $query = new WP_Query([
        'post_type' => ['iot_island', 'iot_highlight'],
        'post_status' => 'publish',
        'post__in' => $ids,
        'orderby' => 'post__in',
        'posts_per_page' => count($ids),
    ]);
    ob_start();
    ?>
    <section class="gtc-my-journey">
      <div class="gtc-my-journey__heading"><p class="iot-island-eyebrow"><?php esc_html_e('YOUR PERSONAL COLLECTION', 'graceon-tahiti-core'); ?></p><h2><?php esc_html_e('Places to remember.', 'graceon-tahiti-core'); ?></h2><span><?php echo esc_html(sprintf(_n('%d saved place', '%d saved places', count($ids), 'graceon-tahiti-core'), count($ids))); ?></span></div>
      <div class="gtc-my-journey__grid">
      <?php foreach ($query->posts as $item) :
        $image = get_the_post_thumbnail_url($item, 'iot-card');
        if (!$image && $item->post_type === 'iot_highlight') { $image = get_post_meta($item->ID, 'gtc_highlight_image_url', true); }
      ?>
        <article class="gtc-my-journey__card">
          <a class="gtc-my-journey__image" href="<?php echo esc_url(get_permalink($item)); ?>">
            <?php if ($image) : ?><img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr(get_the_title($item)); ?>" loading="lazy"><?php endif; ?>
          </a>
          <div><small><?php echo esc_html($item->post_type === 'iot_island' ? __('ISLAND', 'graceon-tahiti-core') : __('PLACE', 'graceon-tahiti-core')); ?></small><h3><a href="<?php echo esc_url(get_permalink($item)); ?>"><?php echo esc_html(get_the_title($item)); ?></a></h3><p><?php echo esc_html(get_the_excerpt($item)); ?></p><?php echo gtc_journey_save_button($item->ID); ?></div>
        </article>
      <?php endforeach; ?>
      </div>
    </section>
    <?php
    return (string) ob_get_clean();
}
add_shortcode('gtc_my_journey', 'gtc_my_journey_shortcode');

/** Create My Journey and Passport pages without overwriting any existing page content. */
function gtc_ensure_journey_pages(): void {
    if (!current_user_can('manage_options')) { return; }

    $journey = get_page_by_path('my-journey');
    if (!$journey) {
        $journey_id = wp_insert_post([
            'post_type' => 'page',
            'post_status' => 'publish',
            'post_title' => __('My Journey', 'graceon-tahiti-core'),
            'post_name' => 'my-journey',
            'post_content' => "[gtc_tahiti_passport]\n\n[gtc_my_journey]",
        ], true);
        if (is_wp_error($journey_id)) { return; }
    } elseif (strpos($journey->post_content, '[gtc_tahiti_passport]') === false) {
        $content = "[gtc_tahiti_passport]\n\n" . $journey->post_content;
        wp_update_post(['ID' => $journey->ID, 'post_content' => $content]);
    }

    $passport = get_page_by_path('my-passport');
    if (!$passport) {
        $passport_id = wp_insert_post([
            'post_type' => 'page',
            'post_status' => 'publish',
            'post_title' => __('My Tahiti Passport', 'graceon-tahiti-core'),
            'post_name' => 'my-passport',
            'post_content' => '[gtc_tahiti_passport]',
        ], true);
        if (is_wp_error($passport_id)) { return; }
    }

    update_option('gtc_my_journey_page_created', 1, false);
    update_option('gtc_my_passport_page_created', 1, false);
}
add_action('admin_init', 'gtc_ensure_journey_pages', 40);
