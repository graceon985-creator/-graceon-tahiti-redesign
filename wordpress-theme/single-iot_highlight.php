<?php
get_header();
?>
<main id="main-content" class="iot-place-detail">
<?php while (have_posts()) : the_post();
  $place_id = get_the_ID();
  $image = get_post_meta($place_id, 'gtc_highlight_image_url', true);
  $credit = get_post_meta($place_id, 'gtc_highlight_image_credit', true);
  $license = get_post_meta($place_id, 'gtc_highlight_license_url', true);
  $location = get_post_meta($place_id, 'gtc_highlight_location', true);
  $map = get_post_meta($place_id, 'gtc_highlight_map_url', true);
  $source = get_post_meta($place_id, 'gtc_highlight_source_url', true);
  $place_type_terms = get_the_terms($place_id, 'iot_highlight_type');
  $place_type = ($place_type_terms && !is_wp_error($place_type_terms)) ? $place_type_terms[0]->name : '';
  $related_places = [];
  if ($island_term) { $related_places = get_posts(['post_type'=>'iot_highlight','post_status'=>'publish','posts_per_page'=>3,'post__not_in'=>[$place_id],'tax_query'=>[['taxonomy'=>'iot_highlight_island','field'=>'slug','terms'=>$island_term->slug]],'orderby'=>'menu_order','order'=>'ASC']); }
  $kicker = get_post_meta($place_id, 'gtc_highlight_kicker', true);
  $terms = get_the_terms($place_id, 'iot_highlight_island');
  $island_term = ($terms && !is_wp_error($terms)) ? $terms[0] : null;
  $island_url = $island_term ? get_post_type_archive_link('iot_island') : home_url('/');
  if ($island_term) {
    $island_post = get_page_by_path($island_term->slug, OBJECT, 'iot_island');
    if ($island_post) { $island_url = get_permalink($island_post); }
  }
?>
  <section class="iot-place-hero">
    <?php if ($image) : ?><img class="iot-place-hero__image" src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr(get_the_title()); ?>"><?php elseif (has_post_thumbnail()) : the_post_thumbnail('iot-hero', ['class' => 'iot-place-hero__image']); endif; ?>
    <div class="iot-place-hero__shade"></div>
    <div class="iot-place-hero__content">
      <a class="iot-place-back" href="<?php echo esc_url($island_url); ?>">← BACK TO <?php echo esc_html($island_term ? strtoupper($island_term->name) : 'THE ISLAND'); ?></a>
      <p class="iot-island-eyebrow"><?php echo esc_html($kicker ?: 'A PLACE TO DISCOVER'); ?></p>
      <h1><?php the_title(); ?></h1>
      <?php if ($location) : ?><p class="iot-place-location"><?php echo esc_html($location); ?></p><?php endif; ?>
      <?php if (function_exists('gtc_journey_save_button')) { echo gtc_journey_save_button($place_id); } ?>
    </div>
    <?php if ($credit) : ?><small class="iot-place-credit"><?php echo esc_html($credit); ?><?php if ($license) : ?> · <a href="<?php echo esc_url($license); ?>" target="_blank" rel="noopener noreferrer">Image license</a><?php endif; ?></small><?php endif; ?>
  </section>

  <section class="iot-place-story">
    <div class="iot-place-story__label"><span>THE STORY</span><span>01 — DISCOVER</span></div>
    <article class="iot-place-story__body">
      <p class="iot-island-eyebrow">BEYOND THE VIEW</p>
      <h2><?php echo esc_html(get_the_excerpt() ?: get_the_title()); ?></h2>
      <div class="iot-place-content"><?php the_content(); ?></div>
      <div class="iot-place-actions">
        <?php if ($map) : ?><a class="iot-island-text-link" href="<?php echo esc_url($map); ?>" target="_blank" rel="noopener noreferrer">OPEN DIRECTIONS ↗</a><?php endif; ?>
        <?php if ($source) : ?><a class="iot-island-text-link iot-place-source" href="<?php echo esc_url($source); ?>" target="_blank" rel="noopener noreferrer">OFFICIAL TOURISM INFORMATION ↗</a><?php endif; ?>
      </div>
    </article>
  </section>


  <?php if (!empty($related_places)) : ?>
  <section class="iot-place-related">
    <div class="iot-island-section-head"><div><p class="iot-island-eyebrow"><?php echo esc_html($island_term ? $island_term->name : 'THE ISLAND'); ?> · <?php esc_html_e('MORE TO EXPLORE','islands-of-tahiti'); ?></p><h2>Keep discovering.</h2></div><span><?php esc_html_e('A FEW MORE PLACES','islands-of-tahiti'); ?></span></div>
    <div class="iot-place-related__grid">
      <?php foreach ($related_places as $related_place) : ?>
      <a class="iot-place-related-card" href="<?php echo esc_url(get_permalink($related_place)); ?>">
        <div class="iot-place-related-card__image"><?php if (has_post_thumbnail($related_place)) { echo get_the_post_thumbnail($related_place,'iot-card'); } ?></div>
        <small><?php echo esc_html(get_post_meta($related_place->ID,'gtc_highlight_kicker',true)); ?></small><h3><?php echo esc_html(get_the_title($related_place)); ?></h3><span>DISCOVER PLACE ↗</span>
      </a>
      <?php endforeach; ?>
    </div>
  </section>
  <?php endif; ?>

  <section class="iot-place-map">
    <div class="iot-island-section-head">
      <div><p class="iot-island-eyebrow">LOCATION</p><h2>Find this place.</h2></div>
      <?php if ($location) : ?><span><?php echo esc_html($location); ?></span><?php endif; ?>
    </div>
    <?php echo do_shortcode('[gtc_island_map]'); ?>
  </section>

  <section class="iot-place-return">
    <p class="iot-island-eyebrow">KEEP EXPLORING</p>
    <h2>There is more to discover.</h2>
    <a class="iot-island-hero__link" href="<?php echo esc_url($island_url); ?>">RETURN TO <?php echo esc_html($island_term ? strtoupper($island_term->name) : 'THE ISLAND'); ?> <span>↗</span></a>
  </section>
<?php endwhile; ?>
</main>
<?php get_footer(); ?>
