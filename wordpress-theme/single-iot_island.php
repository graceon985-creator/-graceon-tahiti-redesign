<?php get_header(); ?>
<main id="main-content" class="iot-single-island">
<?php while (have_posts()) : the_post(); ?>
  <section class="iot-detail-hero">
    <?php if (has_post_thumbnail()) the_post_thumbnail('iot-hero', ['class' => 'iot-detail-image']); ?>
    <div class="iot-detail-shade"></div>
    <div class="iot-detail-title"><span class="iot-eyebrow"><?php echo esc_html(get_post_meta(get_the_ID(), 'iot_island_archipelago', true)); ?></span><h1><?php the_title(); ?></h1><?php if (has_excerpt()) : ?><p><?php echo esc_html(get_the_excerpt()); ?></p><?php endif; ?></div>
  </section>
  <article class="iot-detail-content"><?php the_content(); ?></article>
  <?php
  $related = new WP_Query(['post_type' => ['iot_experience','iot_event','iot_provider','iot_accommodation','iot_tip'], 'posts_per_page' => 8, 'tax_query' => [[ 'taxonomy' => 'iot_island_group', 'field' => 'term_id', 'terms' => wp_get_post_terms(get_the_ID(), 'iot_island_group', ['fields' => 'ids']), 'operator' => 'IN' ]]]);
  if ($related->have_posts()) : ?>
    <section class="iot-section"><div class="iot-section-heading"><div><span class="iot-eyebrow"><?php esc_html_e('EXPLORE THIS ISLAND', 'islands-of-tahiti'); ?></span><h2><?php esc_html_e('Make it your own.', 'islands-of-tahiti'); ?></h2></div></div><div class="iot-post-grid">
    <?php while ($related->have_posts()) : $related->the_post(); ?><article class="iot-post-card"><a href="<?php the_permalink(); ?>"><?php if (has_post_thumbnail()) the_post_thumbnail('iot-card'); ?><div class="iot-post-card-copy"><h3><?php the_title(); ?></h3><?php the_excerpt(); ?><span class="iot-text-link"><?php esc_html_e('Discover more', 'islands-of-tahiti'); ?> ↗</span></div></a></article><?php endwhile; ?>
    </div></section>
  <?php endif; wp_reset_postdata(); ?>
<?php endwhile; ?>
</main>
<?php get_footer(); ?>
