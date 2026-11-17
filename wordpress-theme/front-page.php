<?php get_header(); ?>
<main id="main-content">
<?php
$hero_title = get_theme_mod('iot_hero_title', __('Not just a place. A world to feel.', 'islands-of-tahiti'));
$hero_copy = get_theme_mod('iot_hero_copy', __('From the pulse of island culture to volcanic valleys, quiet lagoons and open-ocean horizons — discover a world shaped by its people, traditions and extraordinary nature.', 'islands-of-tahiti'));
$hero_image = get_theme_mod('iot_hero_image');
?>
<section class="iot-hero" <?php if ($hero_image) : ?>style="--iot-hero-image:url('<?php echo esc_url($hero_image); ?>')"<?php endif; ?>>
  <div class="iot-hero-shade"></div>
  <div class="iot-hero-title"><span class="iot-eyebrow"><?php esc_html_e('THE ISLANDS OF TAHITI', 'islands-of-tahiti'); ?></span><h1><?php echo wp_kses_post(nl2br(esc_html($hero_title))); ?></h1></div>
  <p class="iot-hero-caption"><?php echo esc_html($hero_copy); ?></p>
  <a class="iot-scroll-cue" href="#islands"><?php esc_html_e('SCROLL TO DISCOVER', 'islands-of-tahiti'); ?> <span>↓</span></a>
</section>

<section class="iot-section iot-islands" id="islands">
  <div class="iot-section-heading"><div><span class="iot-eyebrow">01 / <?php esc_html_e('FIND YOUR ISLAND', 'islands-of-tahiti'); ?></span><h2><?php esc_html_e('Eight islands.', 'islands-of-tahiti'); ?><br><em><?php esc_html_e('Infinite shades of blue.', 'islands-of-tahiti'); ?></em></h2></div><p><?php esc_html_e('Move across the archipelago. Choose an island and let its story unfold.', 'islands-of-tahiti'); ?></p></div>
  <div class="iot-island-grid">
  <?php
  $islands = new WP_Query(['post_type' => 'iot_island', 'posts_per_page' => 8, 'orderby' => 'menu_order', 'order' => 'ASC']);
  if ($islands->have_posts()) :
    while ($islands->have_posts()) : $islands->the_post(); ?>
      <a class="iot-island-card" href="<?php the_permalink(); ?>">
        <?php if (has_post_thumbnail()) { the_post_thumbnail('iot-card'); } else { echo '<span class="iot-image-placeholder"></span>'; } ?>
        <span class="iot-island-card-shade"></span><span class="iot-island-card-copy"><small><?php echo esc_html(get_post_meta(get_the_ID(), 'iot_island_archipelago', true)); ?></small><strong><?php the_title(); ?></strong><span><?php esc_html_e('EXPLORE', 'islands-of-tahiti'); ?> ↗</span></span>
      </a>
    <?php endwhile; wp_reset_postdata();
  else : ?>
    <div class="iot-editorial-note"><strong><?php esc_html_e('Island stories are ready to be added.', 'islands-of-tahiti'); ?></strong><p><?php esc_html_e('Add the eight island profiles from the WordPress dashboard to populate this section.', 'islands-of-tahiti'); ?></p></div>
  <?php endif; ?>
  </div>
</section>

<?php
$sections = [
 ['iot_experience', __('Choose your experience.', 'islands-of-tahiti'), __('From lagoon days to mountain trails, find an experience that brings the islands closer.', 'islands-of-tahiti'), 'experiences'],
 ['iot_event', __('Island moments.', 'islands-of-tahiti'), __('Discover cultural celebrations, sporting gatherings and local events across the islands.', 'islands-of-tahiti'), 'events'],
 ['iot_tip', __('Everything you need.', 'islands-of-tahiti'), __('Clear, practical information for visitors exploring French Polynesia.', 'islands-of-tahiti'), 'practical-information'],
 ['iot_offer', __('Special offers.', 'islands-of-tahiti'), __('Current offers from tourism providers across the Islands of Tahiti.', 'islands-of-tahiti'), 'special-offers']
];
foreach ($sections as $section) :
  $items = new WP_Query(['post_type' => $section[0], 'posts_per_page' => 3, 'post_status' => 'publish']);
?>
<section class="iot-section iot-editorial-section" id="<?php echo esc_attr($section[3]); ?>">
 <div class="iot-section-heading"><div><span class="iot-eyebrow"><?php echo esc_html(strtoupper($section[3])); ?></span><h2><?php echo esc_html($section[1]); ?></h2></div><p><?php echo esc_html($section[2]); ?></p></div>
 <?php if ($items->have_posts()) : ?><div class="iot-post-grid"><?php while ($items->have_posts()) : $items->the_post(); ?><article class="iot-post-card"><a href="<?php the_permalink(); ?>"><?php if (has_post_thumbnail()) the_post_thumbnail('iot-card'); ?><div class="iot-post-card-copy"><h3><?php the_title(); ?></h3><?php the_excerpt(); ?><span class="iot-text-link"><?php esc_html_e('Discover more', 'islands-of-tahiti'); ?> ↗</span></div></a></article><?php endwhile; ?></div><?php else : ?><p class="iot-integration-note"><?php esc_html_e('This section is prepared for managed WordPress content and approved tourism data integrations.', 'islands-of-tahiti'); ?></p><?php endif; wp_reset_postdata(); ?>
</section>
<?php endforeach; ?>
</main>
<?php get_footer(); ?>
