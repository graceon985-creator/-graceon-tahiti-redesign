<?php
/**
 * Digital passport MVP: user-owned island stamps and progress.
 * Stamps are self-reported achievements, not verified proof of physical travel.
 */
if (!defined('ABSPATH')) { exit; }

function gtc_passport_island_slugs(): array {
    return ['tahiti', 'moorea', 'bora-bora', 'huahine', 'raiatea', 'tahaa', 'rangiroa', 'fakarava'];
}

function gtc_passport_get_stamps(int $user_id): array {
    $saved = get_user_meta($user_id, 'gtc_passport_stamps', true);
    if (!is_array($saved)) { return []; }
    return array_values(array_intersect(gtc_passport_island_slugs(), array_map('sanitize_title', $saved)));
}

function gtc_passport_handle_stamp(): void {
    if (!is_user_logged_in()) { auth_redirect(); }
    check_admin_referer('gtc_passport_stamp');
    $slug = isset($_POST['island']) ? sanitize_title(wp_unslash($_POST['island'])) : '';
    if (!in_array($slug, gtc_passport_island_slugs(), true)) {
        wp_die(esc_html__('That island is not part of this passport.', 'graceon-tahiti-core'), 400);
    }
    $island = get_page_by_path($slug, OBJECT, 'iot_island');
    if (!$island || $island->post_status !== 'publish') {
        wp_die(esc_html__('This island passport page is not available yet.', 'graceon-tahiti-core'), 404);
    }
    $stamps = gtc_passport_get_stamps(get_current_user_id());
    if (!in_array($slug, $stamps, true)) {
        $stamps[] = $slug;
        update_user_meta(get_current_user_id(), 'gtc_passport_stamps', $stamps);
    }
    $redirect = wp_get_referer() ?: home_url('/');
    wp_safe_redirect(add_query_arg('passport', 'updated', $redirect) . '#my-tahiti-passport');
    exit;
}
add_action('admin_post_gtc_passport_stamp', 'gtc_passport_handle_stamp');

function gtc_tahiti_passport_shortcode(): string {
    $islands = get_posts([
        'post_type' => 'iot_island', 'post_status' => 'publish',
        'posts_per_page' => 8, 'orderby' => 'menu_order', 'order' => 'ASC',
    ]);
    if (!is_user_logged_in()) {
        $login_url = wp_login_url(get_permalink());
        return '<section class="gtc-passport" id="my-tahiti-passport"><h2>' . esc_html__('Your Tahiti Passport', 'graceon-tahiti-core') . '</h2><p>' . esc_html__('Sign in to collect digital island stamps and keep your exploration progress in one place.', 'graceon-tahiti-core') . '</p><a class="gtc-passport__button" href="' . esc_url($login_url) . '">' . esc_html__('Sign in to start your passport', 'graceon-tahiti-core') . '</a></section>';
    }
    $stamps = gtc_passport_get_stamps(get_current_user_id());
    $count = count($stamps);
    ob_start();
    ?>
    <section class="gtc-passport" id="my-tahiti-passport">
      <div class="gtc-passport__intro">
        <p class="gtc-passport__eyebrow"><?php esc_html_e('MY JOURNEY · DIGITAL PASSPORT', 'graceon-tahiti-core'); ?></p>
        <h2><?php esc_html_e('Collect your Islands of Tahiti stamps', 'graceon-tahiti-core'); ?></h2>
        <p><?php esc_html_e('Explore each island page and mark the places you have discovered. Your progress is saved to your account.', 'graceon-tahiti-core'); ?></p>
        <div class="gtc-passport__progress"><strong><?php echo esc_html((string) $count); ?>/8</strong><span><?php esc_html_e('island stamps collected', 'graceon-tahiti-core'); ?></span></div>
        <div class="gtc-passport__track" role="progressbar" aria-valuemin="0" aria-valuemax="8" aria-valuenow="<?php echo esc_attr((string) $count); ?>"><span style="width:<?php echo esc_attr((string) (($count / 8) * 100)); ?>%"></span></div>
      </div>
      <div class="gtc-passport__grid">
      <?php foreach ($islands as $island) :
          $slug = $island->post_name;
          $collected = in_array($slug, $stamps, true);
          $image = get_the_post_thumbnail_url($island, 'iot-card');
      ?>
        <article class="gtc-passport__island<?php echo $collected ? ' is-collected' : ''; ?>">
          <?php if ($image) : ?><img src="<?php echo esc_url($image); ?>" alt="" loading="lazy"><?php endif; ?>
          <div class="gtc-passport__island-content">
            <h3><?php echo esc_html(get_the_title($island)); ?></h3>
            <p><?php echo $collected ? esc_html__('Stamp collected', 'graceon-tahiti-core') : esc_html__('Your next discovery awaits', 'graceon-tahiti-core'); ?></p>
            <a href="<?php echo esc_url(get_permalink($island)); ?>"><?php esc_html_e('Explore island', 'graceon-tahiti-core'); ?></a>
            <?php if ($collected) : ?>
              <span class="gtc-passport__stamp" aria-label="<?php esc_attr_e('Stamp collected', 'graceon-tahiti-core'); ?>">✓</span>
            <?php else : ?>
              <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <input type="hidden" name="action" value="gtc_passport_stamp">
                <input type="hidden" name="island" value="<?php echo esc_attr($slug); ?>">
                <?php wp_nonce_field('gtc_passport_stamp'); ?>
                <button class="gtc-passport__button" type="submit"><?php esc_html_e('Add my stamp', 'graceon-tahiti-core'); ?></button>
              </form>
            <?php endif; ?>
          </div>
        </article>
      <?php endforeach; ?>
      </div>
      <p class="gtc-passport__note"><?php esc_html_e('Passport stamps are currently self-reported by the account holder. They do not verify physical visits.', 'graceon-tahiti-core'); ?></p>
    </section>
    <?php
    return (string) ob_get_clean();
}
add_shortcode('gtc_tahiti_passport', 'gtc_tahiti_passport_shortcode');

function gtc_passport_enqueue_styles(): void {
    wp_register_style('gtc-passport', false, [], GTC_VERSION);
    wp_enqueue_style('gtc-passport');
    wp_add_inline_style('gtc-passport', '
      .gtc-passport{--gtc-ink:#153c43;--gtc-sea:#177d79;--gtc-sand:#f3eee3;color:var(--gtc-ink);background:var(--gtc-sand);padding:clamp(24px,5vw,64px);border-radius:22px;margin:32px 0}
      .gtc-passport__intro{max-width:720px;margin:0 auto 30px;text-align:center}
      .gtc-passport__eyebrow{letter-spacing:.16em;font-size:.72rem;font-weight:700;color:var(--gtc-sea)}
      .gtc-passport__intro h2{font-size:clamp(2rem,4vw,3.5rem);line-height:1.08;margin:.4em 0}
      .gtc-passport__progress{display:flex;justify-content:center;align-items:baseline;gap:10px;margin:22px 0 8px}
      .gtc-passport__progress strong{font-size:2rem}.gtc-passport__track{height:7px;background:#d8d4c9;border-radius:99px;overflow:hidden}.gtc-passport__track span{display:block;height:100%;background:var(--gtc-sea);transition:width .3s}
      .gtc-passport__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:16px}
      .gtc-passport__island{position:relative;overflow:hidden;border:1px solid #d9d2c4;border-radius:16px;background:#fff}
      .gtc-passport__island img{display:block;width:100%;height:140px;object-fit:cover}
      .gtc-passport__island-content{padding:18px}.gtc-passport__island h3{margin:0 0 6px}.gtc-passport__island p{margin:0 0 10px;font-size:.9rem}
      .gtc-passport__island a{color:var(--gtc-sea);font-weight:700}.gtc-passport__button{display:inline-block;border:0;border-radius:99px;background:var(--gtc-ink);color:#fff;padding:10px 16px;margin-top:12px;text-decoration:none;cursor:pointer;font:inherit;font-weight:700}
      .gtc-passport__island.is-collected{border-color:var(--gtc-sea)}.gtc-passport__stamp{position:absolute;right:14px;top:14px;width:38px;height:38px;display:grid;place-items:center;border:2px solid var(--gtc-sea);border-radius:50%;background:#fff;color:var(--gtc-sea);font-weight:800}
      .gtc-passport__note{font-size:.8rem;opacity:.75;margin-top:22px}
      @media(max-width:600px){.gtc-passport{padding:22px 16px}.gtc-passport__island img{height:120px}}
    ');
}
add_action('wp_enqueue_scripts', 'gtc_passport_enqueue_styles');
