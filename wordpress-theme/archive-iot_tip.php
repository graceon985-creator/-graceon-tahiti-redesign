<?php get_header(); ?>
<main id="main-content" class="iot-content-wrap">
  <header class="iot-page-heading">
    <span class="iot-eyebrow">PLAN WITH CONFIDENCE</span>
    <h1><?php esc_html_e('Practical information.', 'islands-of-tahiti'); ?></h1>
    <p><?php esc_html_e('Useful guidance for getting around, preparing your stay and making the most of your time in the islands.', 'islands-of-tahiti'); ?></p>
  </header>
  <?php if (have_posts()) : ?><div class="iot-post-grid"><?php while (have_posts()) : the_post(); ?>
    <article class="iot-post-card"><a href="<?php the_permalink(); ?>"><?php if (has_post_thumbnail()) the_post_thumbnail('iot-card'); ?><div class="iot-post-card-copy"><h2><?php the_title(); ?></h2><?php the_excerpt(); ?><span class="iot-text-link"><?php esc_html_e('Read practical guide', 'islands-of-tahiti'); ?> ↗</span></div></a></article>
  <?php endwhile; ?></div><?php the_posts_pagination(); else : ?><p class="iot-integration-note"><?php esc_html_e('Practical guides will appear here as they are added in WordPress.', 'islands-of-tahiti'); ?></p><?php endif; ?>
</main>
<?php get_footer(); ?>
