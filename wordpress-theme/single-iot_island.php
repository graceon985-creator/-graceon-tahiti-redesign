<?php
get_header();
?>
<main id="main-content" class="iot-island-experience">
<?php while (have_posts()) : the_post();
  $island_id = get_the_ID();
  $slug = get_post_field('post_name', $island_id);
  $archipelago = get_post_meta($island_id, 'iot_island_archipelago', true);
  $hero_image = has_post_thumbnail() ? get_the_post_thumbnail_url($island_id, 'iot-hero') : '';
  if (!$hero_image && $slug === 'bora-bora') {
      $hero_image = 'https://commons.wikimedia.org/wiki/Special:FilePath/Matira_Beach%2C_Bora_Bora%2C_French_Polynesia.jpg?width=2000';
  }
  $highlights = new WP_Query([
      'post_type' => 'iot_highlight',
      'post_status' => 'publish',
      'posts_per_page' => 12,
      'orderby' => ['menu_order' => 'ASC', 'title' => 'ASC'],
      'tax_query' => [[
          'taxonomy' => 'iot_highlight_island',
          'field' => 'slug',
          'terms' => $slug,
      ]],
  ]);
  $items = $highlights->posts;
  $first = $items ? array_shift($items) : null;
?>
  <section class="iot-island-hero" <?php if ($hero_image) : ?>style="--iot-island-hero:url('<?php echo esc_url($hero_image); ?>')"<?php endif; ?>>
    <div class="iot-island-hero__overlay"></div>
    <div class="iot-island-hero__topline"><span><?php echo esc_html($archipelago ?: 'THE ISLANDS OF TAHITI'); ?></span><span>01 / ISLAND STORIES</span></div>
    <div class="iot-island-hero__copy">
      <p class="iot-island-eyebrow">A PLACE TO DISCOVER</p>
      <h1><?php the_title(); ?></h1>
      <p class="iot-island-hero__description"><?php echo esc_html(get_the_excerpt() ?: __('Discover the landscapes, stories and experiences that make this island unique.', 'islands-of-tahiti')); ?></p>
      <a class="iot-island-hero__link" href="#island-highlights">EXPLORE THE ISLAND <span>↓</span></a>
    </div>
    <div class="iot-island-hero__side-note">THE PACIFIC · FRENCH POLYNESIA</div>
    <?php if ($slug === 'bora-bora' && !has_post_thumbnail()) : ?><div class="iot-island-hero__credit">Matira Beach · Scott Williams · <a href="https://creativecommons.org/licenses/by/2.5/" target="_blank" rel="noopener noreferrer">CC BY 2.5</a></div><?php endif; ?>
  </section>

  <section class="iot-island-intro">
    <div class="iot-island-intro__index">01 <span>—</span> THE ESSENCE</div>
    <div class="iot-island-intro__body">
      <p class="iot-island-eyebrow">BEYOND THE POSTCARD</p>
      <h2><?php echo esc_html(sprintf(__('There is more to %s.', 'islands-of-tahiti'), get_the_title())); ?></h2>
      <div class="iot-island-intro__text"><?php the_content(); ?></div>
    </div>
    <aside class="iot-island-intro__aside">
      <span class="iot-island-aside-mark">✳</span>
      <p><?php esc_html_e('A collection of places, people and experiences to help you see the island from more than one perspective.', 'islands-of-tahiti'); ?></p>
    </aside>
  </section>

  <?php if ($first) :
    $image = get_post_meta($first->ID, 'gtc_highlight_image_url', true);
    $credit = get_post_meta($first->ID, 'gtc_highlight_image_credit', true);
    $license = get_post_meta($first->ID, 'gtc_highlight_license_url', true);
    $kicker = get_post_meta($first->ID, 'gtc_highlight_kicker', true);
    $location = get_post_meta($first->ID, 'gtc_highlight_location', true);
    $map = get_post_meta($first->ID, 'gtc_highlight_map_url', true);
  ?>
  <section class="iot-island-feature" id="island-highlights">
    <div class="iot-island-section-head">
      <div><p class="iot-island-eyebrow">THE ICONIC ONE</p><h2>Landmarks that stay with you.</h2></div>
      <span>02 / SIGNATURE PLACES</span>
    </div>
    <article class="iot-island-feature-card">
      <div class="iot-island-feature-card__image">
        <?php if ($image) : ?><img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr(get_the_title($first)); ?>" loading="lazy"><?php elseif (has_post_thumbnail($first)) : echo get_the_post_thumbnail($first, 'iot-hero'); endif; ?>
        <?php if ($credit) : ?><small class="iot-image-credit"><?php echo esc_html($credit); ?><?php if ($license) : ?> · <a href="<?php echo esc_url($license); ?>" target="_blank" rel="noopener noreferrer">License</a><?php endif; ?></small><?php endif; ?>
      </div>
      <div class="iot-island-feature-card__copy">
        <p class="iot-island-eyebrow"><?php echo esc_html($kicker ?: 'MUST-SEE'); ?></p>
        <h3><?php echo esc_html(get_the_title($first)); ?></h3>
        <p class="iot-island-feature-card__excerpt"><?php echo esc_html(get_the_excerpt($first)); ?></p>
        <div class="iot-island-feature-card__content"><?php echo wp_kses_post(apply_filters('the_content', $first->post_content)); ?></div>
        <?php if ($location) : ?><p class="iot-island-location"><?php echo esc_html($location); ?></p><?php endif; ?>
        <?php if ($map) : ?><a class="iot-island-text-link" href="<?php echo esc_url($map); ?>" target="_blank" rel="noopener noreferrer">FIND IT ON THE MAP ↗</a><?php endif; ?>
      </div>
    </article>
  </section>
  <?php endif; ?>

  <?php if ($items) : ?>
  <section class="iot-island-discover">
    <div class="iot-island-section-head">
      <div><p class="iot-island-eyebrow">GO A LITTLE FURTHER</p><h2>Places with a story.</h2></div>
      <span>03 / EXPLORE MORE</span>
    </div>
    <div class="iot-island-highlight-grid">
      <?php foreach ($items as $item) :
        $image = get_post_meta($item->ID, 'gtc_highlight_image_url', true);
        $credit = get_post_meta($item->ID, 'gtc_highlight_image_credit', true);
        $license = get_post_meta($item->ID, 'gtc_highlight_license_url', true);
        $kicker = get_post_meta($item->ID, 'gtc_highlight_kicker', true);
        $location = get_post_meta($item->ID, 'gtc_highlight_location', true);
        $map = get_post_meta($item->ID, 'gtc_highlight_map_url', true);
      ?>
      <article class="iot-island-highlight-card">
        <div class="iot-island-highlight-card__image">
          <?php if ($image) : ?><img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr(get_the_title($item)); ?>" loading="lazy"><?php elseif (has_post_thumbnail($item)) : echo get_the_post_thumbnail($item, 'iot-card'); endif; ?>
          <?php if ($credit) : ?><small class="iot-image-credit"><?php echo esc_html($credit); ?><?php if ($license) : ?> · <a href="<?php echo esc_url($license); ?>" target="_blank" rel="noopener noreferrer">License</a><?php endif; ?></small><?php endif; ?>
        </div>
        <div class="iot-island-highlight-card__copy">
          <p class="iot-island-eyebrow"><?php echo esc_html($kicker ?: 'DISCOVER'); ?></p>
          <h3><?php echo esc_html(get_the_title($item)); ?></h3>
          <p><?php echo esc_html(get_the_excerpt($item)); ?></p>
          <?php if ($location) : ?><span class="iot-island-location"><?php echo esc_html($location); ?></span><?php endif; ?>
          <?php if ($map) : ?><a class="iot-island-text-link" href="<?php echo esc_url($map); ?>" target="_blank" rel="noopener noreferrer">OPEN MAP ↗</a><?php endif; ?>
        </div>
      </article>
      <?php endforeach; ?>
    </div>
  </section>
  <?php endif; ?>

  <section class="iot-island-culture">
    <div class="iot-island-culture__copy">
      <p class="iot-island-eyebrow">PEOPLE · CULTURE · MEMORY</p>
      <h2>A place is more than its view.</h2>
      <p><?php esc_html_e('Discover local life, food, craft, stories and events. The most meaningful journeys make room for the people and traditions that give each island its character.', 'islands-of-tahiti'); ?></p>
      <a class="iot-island-text-link" href="<?php echo esc_url(get_post_type_archive_link('iot_experience')); ?>">EXPLORE EXPERIENCES ↗</a>
    </div>
    <div class="iot-island-culture__visual"><span>THE ISLANDS<br>ARE STORIES<br>IN MOTION.</span></div>
  </section>

  <section class="iot-island-plan">
    <div><p class="iot-island-eyebrow">MAKE IT YOUR JOURNEY</p><h2>Keep the places that call to you.</h2><p>Save this island to your personal journey and collect your digital passport stamps as you explore.</p></div>
    <div class="iot-island-plan__actions">
      <a href="<?php echo esc_url(wp_login_url(get_permalink())); ?>">SAVE TO MY JOURNEY ↗</a>
      <a href="<?php echo esc_url(home_url('/my-passport/')); ?>">OPEN MY PASSPORT ↗</a>
    </div>
  </section>
  <?php if (shortcode_exists('gtc_tahiti_passport')) : ?>
    <section class="iot-island-passport"><?php echo do_shortcode('[gtc_tahiti_passport]'); ?></section>
  <?php endif; ?>
<?php endwhile; wp_reset_postdata(); ?>
</main>
<?php get_footer(); ?>
