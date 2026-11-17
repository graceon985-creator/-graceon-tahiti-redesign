<?php get_header(); ?>
<main id="main-content" class="iot-content-wrap">
<?php while (have_posts()) : the_post(); ?>
<article <?php post_class('iot-article'); ?>>
  <?php if (has_post_thumbnail()) : ?><div class="iot-article-image"><?php the_post_thumbnail('iot-hero'); ?></div><?php endif; ?>
  <header class="iot-page-heading"><span class="iot-eyebrow"><?php echo esc_html(get_post_type_object(get_post_type())->labels->singular_name ?? ''); ?></span><h1><?php the_title(); ?></h1><?php if (has_excerpt()) : ?><p><?php echo esc_html(get_the_excerpt()); ?></p><?php endif; ?></header>
  <div class="iot-detail-content"><?php the_content(); ?></div>
</article>
<?php endwhile; ?>
</main>
<?php get_footer(); ?>
