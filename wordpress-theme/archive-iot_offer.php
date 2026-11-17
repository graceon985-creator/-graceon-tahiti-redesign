<?php get_header(); ?>
<main id="main-content" class="iot-content-wrap">
  <header class="iot-page-heading">
    <span class="iot-eyebrow">MAKE YOUR STAY GO FURTHER</span>
    <h1><?php esc_html_e('Offers across the islands.', 'islands-of-tahiti'); ?></h1>
    <p><?php esc_html_e('Explore current offers published by tourism providers. Always confirm conditions and availability with the provider.', 'islands-of-tahiti'); ?></p>
  </header>
  <?php if (have_posts()) : ?><div class="iot-post-grid"><?php while (have_posts()) : the_post();
    $start = get_post_meta(get_the_ID(), 'iot_offer_start', true);
    $end = get_post_meta(get_the_ID(), 'iot_offer_end', true);
    $location = get_post_meta(get_the_ID(), 'iot_location_name', true); ?>
    <article class="iot-post-card"><a href="<?php the_permalink(); ?>"><?php if (has_post_thumbnail()) the_post_thumbnail('iot-card'); ?><div class="iot-post-card-copy"><h2><?php the_title(); ?></h2><?php if ($location) : ?><p><?php echo esc_html($location); ?></p><?php endif; ?><?php if ($start || $end) : ?><p><?php esc_html_e('Validity:', 'islands-of-tahiti'); ?> <?php echo esc_html($start ?: '—'); ?> – <?php echo esc_html($end ?: '—'); ?></p><?php endif; ?><?php the_excerpt(); ?><span class="iot-text-link"><?php esc_html_e('View offer', 'islands-of-tahiti'); ?> ↗</span></div></a></article>
  <?php endwhile; ?></div><?php the_posts_pagination(); else : ?><p class="iot-integration-note"><?php esc_html_e('There are no current offers published at the moment.', 'islands-of-tahiti'); ?></p><?php endif; ?>
</main>
<?php get_footer(); ?>
