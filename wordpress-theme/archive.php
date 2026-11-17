<?php get_header(); ?>
<main id="main-content" class="iot-content-wrap">
<header class="iot-page-heading"><span class="iot-eyebrow"><?php esc_html_e('DISCOVER THE ISLANDS', 'islands-of-tahiti'); ?></span><h1><?php the_archive_title(); ?></h1><?php the_archive_description('<div class="iot-archive-description">', '</div>'); ?></header>
<?php if (have_posts()) : ?><div class="iot-post-grid"><?php while (have_posts()) : the_post(); ?><article <?php post_class('iot-post-card'); ?>><a href="<?php the_permalink(); ?>"><?php if (has_post_thumbnail()) the_post_thumbnail('iot-card'); ?><div class="iot-post-card-copy"><h2><?php the_title(); ?></h2><?php the_excerpt(); ?><span class="iot-text-link"><?php esc_html_e('Discover more', 'islands-of-tahiti'); ?> ↗</span></div></a></article><?php endwhile; ?></div><?php the_posts_pagination(); ?><?php else : ?><p><?php esc_html_e('No entries have been published here yet.', 'islands-of-tahiti'); ?></p><?php endif; ?>
</main>
<?php get_footer(); ?>
