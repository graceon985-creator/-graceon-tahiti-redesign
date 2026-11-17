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
        wp_die(esc_html__('That island is not part of this passport.', 'graceon-tahiti-core'), '', ['response' => 400]);
    }
    $island = get_page_by_path($slug, OBJECT, 'iot_island');
    if (!$island || $island->post_status !== 'publish') {
        wp_die(esc_html__('This island passport page is not available yet.', 'graceon-tahiti-core'), '', ['response' => 404]);
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


/** Visual island constellation: a clickable, explicitly schematic overview, not a navigation map. */
function gtc_passport_island_positions(): array {
    return [
        'tahiti' => [18, 66], 'moorea' => [25, 55], 'huahine' => [39, 42],
        'raiatea' => [48, 53], 'tahaa' => [55, 40], 'bora-bora' => [65, 55],
        'rangiroa' => [83, 27], 'fakarava' => [91, 46],
    ];
}

function gtc_passport_achievement_data(int $count): array {
    return [
        ['title' => __('First Discovery', 'graceon-tahiti-core'), 'detail' => __('Collect your first island stamp.', 'graceon-tahiti-core'), 'unlocked' => $count >= 1, 'mark' => '01'],
        ['title' => __('Island Explorer', 'graceon-tahiti-core'), 'detail' => __('Discover four of the eight featured islands.', 'graceon-tahiti-core'), 'unlocked' => $count >= 4, 'mark' => '04'],
        ['title' => __('Voyager of Tahiti', 'graceon-tahiti-core'), 'detail' => __('Collect all eight island stamps.', 'graceon-tahiti-core'), 'unlocked' => $count >= 8, 'mark' => '08'],
    ];
}

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
      <div class="gtc-passport__map-wrap">
        <div class="gtc-passport__map-heading"><div><p class="gtc-passport__eyebrow"><?php esc_html_e('YOUR ISLAND TRAIL', 'graceon-tahiti-core'); ?></p><h3><?php esc_html_e('Eight islands. Your own story.', 'graceon-tahiti-core'); ?></h3></div><span><?php esc_html_e('Schematic overview · not to scale', 'graceon-tahiti-core'); ?></span></div>
        <div class="gtc-passport__map" role="group" aria-label="<?php esc_attr_e('Select an island to open its page. Collected stamps are marked.', 'graceon-tahiti-core'); ?>">
          <span class="gtc-passport__map-group gtc-passport__map-group--society">SOCIETY ISLANDS</span>
          <span class="gtc-passport__map-group gtc-passport__map-group--tuamotu">TUAMOTU ISLANDS</span>
          <?php $positions = gtc_passport_island_positions(); foreach ($islands as $map_island) :
              $map_slug = $map_island->post_name;
              if (!isset($positions[$map_slug])) { continue; }
              [$x, $y] = $positions[$map_slug];
              $is_collected = in_array($map_slug, $stamps, true);
          ?>
            <a class="gtc-passport__map-pin<?php echo $is_collected ? ' is-collected' : ''; ?>" style="--pin-x:<?php echo esc_attr((string) $x); ?>%;--pin-y:<?php echo esc_attr((string) $y); ?>%" href="<?php echo esc_url(get_permalink($map_island)); ?>" aria-label="<?php echo esc_attr(get_the_title($map_island) . ($is_collected ? ' — stamp collected' : ' — not yet collected')); ?>">
              <i><?php echo $is_collected ? '✓' : '＋'; ?></i><span><?php echo esc_html(get_the_title($map_island)); ?></span>
            </a>
          <?php endforeach; ?>
        </div>
      </div>
      <div class="gtc-passport__achievements">
        <div class="gtc-passport__map-heading"><div><p class="gtc-passport__eyebrow"><?php esc_html_e('MILESTONES', 'graceon-tahiti-core'); ?></p><h3><?php esc_html_e('Every journey earns a story.', 'graceon-tahiti-core'); ?></h3></div></div>
        <div class="gtc-passport__achievement-grid">
          <?php foreach (gtc_passport_achievement_data($count) as $achievement) : ?>
            <article class="gtc-passport__achievement<?php echo $achievement['unlocked'] ? ' is-unlocked' : ''; ?>">
              <span><?php echo esc_html($achievement['mark']); ?></span><div><h4><?php echo esc_html($achievement['title']); ?></h4><p><?php echo esc_html($achievement['detail']); ?></p></div>
              <small><?php echo $achievement['unlocked'] ? esc_html__('UNLOCKED', 'graceon-tahiti-core') : esc_html__('LOCKED', 'graceon-tahiti-core'); ?></small>
            </article>
          <?php endforeach; ?>
        </div>
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
      .gtc-passport__map-wrap{margin:42px 0 34px}.gtc-passport__map-heading{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:16px}.gtc-passport__map-heading h3{font-size:clamp(1.4rem,3vw,2.2rem);margin:5px 0 0}.gtc-passport__map-heading>span{font-size:.72rem;opacity:.65}
      .gtc-passport__map{height:340px;position:relative;overflow:hidden;border:1px solid #c9d2c9;border-radius:18px;background:radial-gradient(ellipse at 30% 55%,rgba(255,255,255,.55),transparent 42%),linear-gradient(145deg,#d7e4dc,#b7d0c8 54%,#dbe5d9)}
      .gtc-passport__map:before,.gtc-passport__map:after{content:"";position:absolute;inset:12% -10%;border:1px solid rgba(21,60,67,.12);border-radius:50%;transform:rotate(-14deg)}.gtc-passport__map:after{inset:28% -8%;transform:rotate(17deg)}
      .gtc-passport__map-group{position:absolute;font-size:.58rem;letter-spacing:.17em;color:#466c69;font-weight:800}.gtc-passport__map-group--society{left:12%;bottom:12%}.gtc-passport__map-group--tuamotu{right:7%;top:12%}
      .gtc-passport__map-pin{position:absolute;z-index:2;left:var(--pin-x);top:var(--pin-y);display:flex;align-items:center;gap:6px;transform:translate(-50%,-50%);text-decoration:none;color:#153c43;font-size:.72rem;font-weight:800;white-space:nowrap}
      .gtc-passport__map-pin i{width:27px;height:27px;border-radius:50%;display:grid;place-items:center;background:#f8f4e9;border:1px solid #64847b;color:#17484b;font-style:normal;box-shadow:0 3px 10px rgba(21,60,67,.12)}
      .gtc-passport__map-pin.is-collected i{background:#17484b;color:#fff;border-color:#17484b}
      .gtc-passport__map-pin span{padding:4px 7px;background:rgba(248,244,233,.8);border-radius:5px}
      .gtc-passport__achievements{margin:34px 0}.gtc-passport__achievement-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
      .gtc-passport__achievement{display:flex;align-items:center;gap:12px;padding:16px;background:#e6e2d7;border:1px solid #d7d0c1;border-radius:12px;opacity:.65}
      .gtc-passport__achievement.is-unlocked{opacity:1;border-color:#7da49a;background:#e5eee7}
      .gtc-passport__achievement>span{width:38px;height:38px;flex:0 0 38px;border-radius:50%;display:grid;place-items:center;border:1px solid #8ca59b;font-weight:800;font-size:.75rem}
      .gtc-passport__achievement h4{margin:0 0 4px;font-size:.95rem}.gtc-passport__achievement p{margin:0;font-size:.75rem;line-height:1.4}
      .gtc-passport__achievement small{margin-left:auto;font-size:.55rem;letter-spacing:.1em}
      .gtc-passport__note{font-size:.8rem;opacity:.75;margin-top:22px}
      @media(max-width:700px){.gtc-passport__map{height:300px}.gtc-passport__map-pin{font-size:.62rem}.gtc-passport__map-pin i{width:23px;height:23px}.gtc-passport__achievement-grid{grid-template-columns:1fr}.gtc-passport__map-heading{display:block}.gtc-passport__map-heading>span{display:block;margin-top:8px}} @media(max-width:600px){.gtc-passport{padding:22px 16px}.gtc-passport__island img{height:120px}.gtc-passport__map{height:270px}.gtc-passport__map-pin span{padding:3px 4px}.gtc-passport__map-group{font-size:.48rem}}
    ');
}
add_action('wp_enqueue_scripts', 'gtc_passport_enqueue_styles');
