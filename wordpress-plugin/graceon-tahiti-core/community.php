<?php
/**
 * Moderated community stories. New submissions remain pending until an editor approves them.
 * Image uploads are re-encoded server-side to reduce embedded metadata exposure.
 */
if (!defined('ABSPATH')) { exit; }

function gtc_register_community_content(): void {
    register_post_type('iot_community_story', [
        'labels' => ['name' => __('Community stories', 'graceon-tahiti-core'), 'singular_name' => __('Community story', 'graceon-tahiti-core')],
        'public' => true, 'show_in_rest' => true, 'has_archive' => true,
        'menu_icon' => 'dashicons-format-chat',
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'author', 'revisions'],
        'rewrite' => ['slug' => 'community-stories', 'with_front' => false],
    ]);
    register_taxonomy('iot_community_island', ['iot_community_story'], [
        'labels' => ['name' => __('Story island', 'graceon-tahiti-core')],
        'public' => true, 'hierarchical' => true, 'show_in_rest' => true,
    ]);
}
add_action('init', 'gtc_register_community_content', 8);

function gtc_community_submit_story(): void {
    if (!is_user_logged_in()) { auth_redirect(); }
    check_admin_referer('gtc_submit_story');

    $title = isset($_POST['story_title']) ? sanitize_text_field(wp_unslash($_POST['story_title'])) : '';
    $body = isset($_POST['story_text']) ? sanitize_textarea_field(wp_unslash($_POST['story_text'])) : '';
    $alias = isset($_POST['display_alias']) ? sanitize_text_field(wp_unslash($_POST['display_alias'])) : '';
    $island = isset($_POST['story_island']) ? sanitize_title(wp_unslash($_POST['story_island'])) : '';
    $consent = isset($_POST['community_consent']) && sanitize_text_field(wp_unslash($_POST['community_consent'])) === '1';

    if (!$consent || mb_strlen($title) < 4 || mb_strlen($title) > 90 || mb_strlen($body) < 20 || mb_strlen($body) > 1800 || mb_strlen($alias) < 2 || mb_strlen($alias) > 30) {
        wp_safe_redirect(add_query_arg('community', 'check-fields', wp_get_referer() ?: home_url('/community/')) . '#community-share');
        exit;
    }
    $island_post = get_page_by_path($island, OBJECT, 'iot_island');
    if (!$island_post || $island_post->post_status !== 'publish') { $island = ''; }

    $post_id = wp_insert_post([
        'post_type' => 'iot_community_story',
        'post_status' => 'pending',
        'post_title' => $title,
        'post_content' => $body,
        'post_excerpt' => wp_trim_words($body, 28),
        'post_author' => get_current_user_id(),
    ], true);
    if (is_wp_error($post_id)) {
        wp_safe_redirect(add_query_arg('community', 'error', wp_get_referer() ?: home_url('/community/')));
        exit;
    }
    update_post_meta($post_id, 'gtc_community_alias', $alias);
    if ($island !== '') { wp_set_object_terms($post_id, $island, 'iot_community_island', false); }

    if (!empty($_FILES['story_image']['name'])) {
        $file = $_FILES['story_image'];
        $max_size = 5 * MB_IN_BYTES;
        $allowed = ['jpg|jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp'];
        $checked = wp_check_filetype_and_ext($file['tmp_name'], $file['name'], $allowed);
        if ($file['size'] > $max_size || empty($checked['type']) || !in_array($checked['type'], array_values($allowed), true)) {
            wp_delete_post($post_id, true);
            wp_safe_redirect(add_query_arg('community', 'image-error', wp_get_referer() ?: home_url('/community/')));
            exit;
        }

        $editor = wp_get_image_editor($file['tmp_name']);
        if (is_wp_error($editor)) {
            wp_delete_post($post_id, true);
            wp_safe_redirect(add_query_arg('community', 'image-error', wp_get_referer() ?: home_url('/community/')));
            exit;
        }
        $clean_path = wp_tempnam('gtc-community-clean.jpg');
        if (!$clean_path) {
            wp_delete_post($post_id, true);
            wp_safe_redirect(add_query_arg('community', 'image-error', wp_get_referer() ?: home_url('/community/')));
            exit;
        }
        $cleaned = $editor->save($clean_path, 'image/jpeg');
        if (is_wp_error($cleaned) || empty($cleaned['path'])) {
            if (file_exists($clean_path)) { wp_delete_file($clean_path); }
            wp_delete_post($post_id, true);
            wp_safe_redirect(add_query_arg('community', 'image-error', wp_get_referer() ?: home_url('/community/')));
            exit;
        }

        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';
        $_FILES['story_image']['tmp_name'] = $cleaned['path'];
        $_FILES['story_image']['name'] = 'community-photo.jpg';
        $_FILES['story_image']['type'] = 'image/jpeg';
        $_FILES['story_image']['size'] = filesize($cleaned['path']);
        $attachment_id = media_handle_upload('story_image', $post_id, [], ['test_form' => false, 'mimes' => ['jpg|jpeg' => 'image/jpeg']]);
        if (is_wp_error($attachment_id)) {
            wp_delete_file($cleaned['path']);
            wp_delete_post($post_id, true);
            wp_safe_redirect(add_query_arg('community', 'image-error', wp_get_referer() ?: home_url('/community/')));
            exit;
        }
        set_post_thumbnail($post_id, $attachment_id);
    }

    wp_safe_redirect(add_query_arg('community', 'submitted', wp_get_referer() ?: home_url('/community/')) . '#community-share');
    exit;
}
add_action('admin_post_gtc_submit_community_story', 'gtc_community_submit_story');

function gtc_community_report_story(): void {
    if (!is_user_logged_in()) { wp_send_json_error(['message' => __('Please sign in to report a story.', 'graceon-tahiti-core')], 401); }
    $post_id = isset($_POST['post_id']) ? absint($_POST['post_id']) : 0;
    check_ajax_referer('gtc_report_story_' . $post_id, 'nonce');
    $story = get_post($post_id);
    if (!$story || $story->post_type !== 'iot_community_story' || $story->post_status !== 'publish' || (int) $story->post_author === get_current_user_id()) {
        wp_send_json_error(['message' => __('This story cannot be reported.', 'graceon-tahiti-core')], 400);
    }
    $reporters = get_post_meta($post_id, 'gtc_community_reporters', true);
    if (!is_array($reporters)) { $reporters = []; }
    $user_id = get_current_user_id();
    if (!in_array($user_id, $reporters, true)) {
        $reporters[] = $user_id;
        update_post_meta($post_id, 'gtc_community_reporters', $reporters);
    }
    if (count($reporters) >= 3) {
        wp_update_post(['ID' => $post_id, 'post_status' => 'pending']);
    }
    wp_send_json_success(['message' => __('Thank you. The community team will review this story.', 'graceon-tahiti-core')]);
}
add_action('wp_ajax_gtc_report_community_story', 'gtc_community_report_story');

function gtc_community_shortcode(): string {
    $stories = new WP_Query(['post_type' => 'iot_community_story', 'post_status' => 'publish', 'posts_per_page' => 12, 'orderby' => 'date', 'order' => 'DESC']);
    $islands = get_posts(['post_type' => 'iot_island', 'post_status' => 'publish', 'posts_per_page' => 8, 'orderby' => 'menu_order', 'order' => 'ASC']);
    ob_start();
    ?>
    <main class="gtc-community">
      <header class="gtc-community__intro"><p class="iot-island-eyebrow"><?php esc_html_e('STORIES FROM THE ISLANDS', 'graceon-tahiti-core'); ?></p><h1><?php esc_html_e('The journey, told by you.', 'graceon-tahiti-core'); ?></h1><p><?php esc_html_e('Discover thoughtful moments and recommendations shared by fellow travellers. Every story is reviewed before it appears here.', 'graceon-tahiti-core'); ?></p></header>
      <?php if (is_user_logged_in()) : ?>
      <section class="gtc-community__share" id="community-share">
        <p class="iot-island-eyebrow"><?php esc_html_e('ADD YOUR STORY', 'graceon-tahiti-core'); ?></p><h2><?php esc_html_e('Share a moment worth remembering.', 'graceon-tahiti-core'); ?></h2>
        <?php if (isset($_GET['community']) && sanitize_key(wp_unslash($_GET['community'])) === 'submitted') : ?><p class="gtc-community__notice"><?php esc_html_e('Thank you. Your story is awaiting moderator review.', 'graceon-tahiti-core'); ?></p><?php elseif (isset($_GET['community'])) : ?><p class="gtc-community__notice"><?php esc_html_e('Please check your story details and photo, then try again.', 'graceon-tahiti-core'); ?></p><?php endif; ?>
        <form method="post" enctype="multipart/form-data" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
          <input type="hidden" name="action" value="gtc_submit_community_story">
          <?php wp_nonce_field('gtc_submit_story'); ?>
          <label><?php esc_html_e('Display name or nickname', 'graceon-tahiti-core'); ?><input name="display_alias" maxlength="30" required placeholder="<?php esc_attr_e('Choose a nickname, not your full name', 'graceon-tahiti-core'); ?>"></label>
          <label><?php esc_html_e('Story title', 'graceon-tahiti-core'); ?><input name="story_title" maxlength="90" required></label>
          <label><?php esc_html_e('Your story', 'graceon-tahiti-core'); ?><textarea name="story_text" rows="5" maxlength="1800" required placeholder="<?php esc_attr_e('Share a tip or a moment. Avoid private details and exact accommodation information.', 'graceon-tahiti-core'); ?>"></textarea></label>
          <label><?php esc_html_e('Island', 'graceon-tahiti-core'); ?><select name="story_island"><option value=""><?php esc_html_e('Choose an island (optional)', 'graceon-tahiti-core'); ?></option><?php foreach ($islands as $island) : ?><option value="<?php echo esc_attr($island->post_name); ?>"><?php echo esc_html(get_the_title($island)); ?></option><?php endforeach; ?></select></label>
          <label><?php esc_html_e('Photo (optional · JPG, PNG or WebP · max 5 MB)', 'graceon-tahiti-core'); ?><input type="file" name="story_image" accept="image/jpeg,image/png,image/webp"></label>
          <label class="gtc-community__consent"><input type="checkbox" name="community_consent" value="1" required><span><?php esc_html_e('I own this content or have permission to share it. I have permission from recognizable people in the photo. I have not included private contact details or sensitive location information.', 'graceon-tahiti-core'); ?></span></label>
          <button type="submit"><?php esc_html_e('SUBMIT FOR REVIEW', 'graceon-tahiti-core'); ?> ↗</button>
        </form>
      </section>
      <?php else : ?>
      <section class="gtc-community__share"><h2><?php esc_html_e('Have a story to share?', 'graceon-tahiti-core'); ?></h2><p><?php esc_html_e('Sign in to submit a story. New submissions are reviewed before publication.', 'graceon-tahiti-core'); ?></p><a href="<?php echo esc_url(wp_login_url(get_permalink())); ?>"><?php esc_html_e('SIGN IN ↗', 'graceon-tahiti-core'); ?></a></section>
      <?php endif; ?>
      <section class="gtc-community__stories"><div class="gtc-community__stories-heading"><p class="iot-island-eyebrow"><?php esc_html_e('COMMUNITY NOTES', 'graceon-tahiti-core'); ?></p><h2><?php esc_html_e('Small moments. Big memories.', 'graceon-tahiti-core'); ?></h2></div>
      <?php if ($stories->have_posts()) : ?><div class="gtc-community__grid">
        <?php while ($stories->have_posts()) : $stories->the_post(); $story_id = get_the_ID(); $alias = get_post_meta($story_id, 'gtc_community_alias', true) ?: __('Island visitor', 'graceon-tahiti-core'); ?>
          <article class="gtc-community__card">
            <?php if (has_post_thumbnail()) : ?><div class="gtc-community__image"><?php the_post_thumbnail('iot-card', ['loading' => 'lazy']); ?></div><?php endif; ?>
            <div class="gtc-community__card-copy"><small><?php echo esc_html($alias); ?></small><h3><?php the_title(); ?></h3><p><?php echo esc_html(get_the_excerpt()); ?></p><div class="gtc-community__card-actions"><a href="<?php the_permalink(); ?>"><?php esc_html_e('READ STORY ↗', 'graceon-tahiti-core'); ?></a>
            <?php if (is_user_logged_in() && (int) get_post_field('post_author', $story_id) !== get_current_user_id()) : ?><button type="button" data-gtc-report data-post-id="<?php echo esc_attr((string) $story_id); ?>" data-nonce="<?php echo esc_attr(wp_create_nonce('gtc_report_story_' . $story_id)); ?>"><?php esc_html_e('REPORT', 'graceon-tahiti-core'); ?></button><?php endif; ?></div></div>
          </article>
        <?php endwhile; wp_reset_postdata(); ?>
      </div><?php else : ?><p class="gtc-community__empty"><?php esc_html_e('The first community stories are being reviewed. Check back soon.', 'graceon-tahiti-core'); ?></p><?php endif; ?>
      </section>
      <p class="gtc-community__safety"><?php esc_html_e('Community submissions are moderated. Do not share phone numbers, private addresses, booking references or other personal information.', 'graceon-tahiti-core'); ?></p>
    </main>
    <?php
    return (string) ob_get_clean();
}
add_shortcode('gtc_community', 'gtc_community_shortcode');

function gtc_ensure_community_page(): void {
    if (!current_user_can('manage_options') || get_page_by_path('community')) { return; }
    wp_insert_post(['post_type' => 'page', 'post_status' => 'publish', 'post_title' => __('Community', 'graceon-tahiti-core'), 'post_name' => 'community', 'post_content' => '[gtc_community]']);
}
add_action('admin_init', 'gtc_ensure_community_page', 46);

function gtc_community_styles(): void {
    wp_register_style('gtc-community', false, [], GTC_VERSION);
    wp_enqueue_style('gtc-community');
    wp_add_inline_style('gtc-community', '
      .gtc-community{background:#f3f0e8;color:#153c43;padding:clamp(24px,6vw,76px) 7vw}
      .gtc-community__intro{max-width:800px;margin:0 auto 55px;text-align:center}.gtc-community__intro h1{font:normal clamp(42px,6vw,76px)/.98 Georgia,serif;margin:14px 0}.gtc-community__intro>p:last-child{max-width:620px;margin:18px auto;color:#66756f;line-height:1.8}
      .gtc-community__share{max-width:820px;margin:0 auto 70px;padding:clamp(22px,4vw,42px);background:#e8e4d9;border:1px solid #d7d0c1}.gtc-community__share h2,.gtc-community__stories h2{font:normal clamp(30px,4vw,48px)/1.05 Georgia,serif;margin:8px 0 24px}
      .gtc-community__share form{display:grid;gap:15px}.gtc-community__share label{display:grid;gap:7px;font-size:.8rem;font-weight:700}.gtc-community__share input:not([type=checkbox]),.gtc-community__share textarea,.gtc-community__share select{width:100%;padding:13px;border:1px solid #c9c2b5;background:#fff;color:#153c43;font:inherit}.gtc-community__share input[type=file]{padding:8px}.gtc-community__share .gtc-community__consent{grid-template-columns:20px 1fr;align-items:start;font-weight:400;line-height:1.6}.gtc-community__share button{justify-self:start;padding:14px 20px;background:#153c43;color:#fff;border:0;font-size:.7rem;letter-spacing:.1em;font-weight:800;cursor:pointer}
      .gtc-community__notice{padding:12px;background:#dce9df}.gtc-community__stories{max-width:1200px;margin:auto}.gtc-community__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.gtc-community__card{background:#e8e4d9;min-width:0}.gtc-community__image img{display:block;width:100%;height:230px;object-fit:cover}.gtc-community__card-copy{padding:22px}.gtc-community__card-copy small{color:#9a7058;font-size:.68rem;letter-spacing:.12em}.gtc-community__card-copy h3{font:normal 28px/1.1 Georgia,serif;margin:9px 0}.gtc-community__card-copy p{font-size:.86rem;line-height:1.7;color:#687772}.gtc-community__card-actions{display:flex;gap:18px;align-items:center}.gtc-community__card-actions a,.gtc-community__card-actions button{border:0;background:none;padding:0;color:#155c5b;text-decoration:none;font-size:.65rem;letter-spacing:.1em;font-weight:800;cursor:pointer}.gtc-community__empty,.gtc-community__safety{color:#6b7972;line-height:1.7;font-size:.82rem}.gtc-community__safety{max-width:1000px;margin:40px auto 0}
      @media(max-width:900px){.gtc-community__grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.gtc-community{padding:50px 16px}.gtc-community__grid{grid-template-columns:1fr}.gtc-community__image img{height:210px}}
    ');
}
add_action('wp_enqueue_scripts', 'gtc_community_styles');
