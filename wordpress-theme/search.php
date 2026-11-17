<?php get_header(); ?>
<main id="main-content" class="iot-content-wrap">
<header class="iot-page-heading"><span class="iot-eyebrow"><?php esc_html_e('SEARCH THE ISLANDS', 'islands-of-tahiti'); ?></span><h1><?php printf(esc_html__('Results for: %s', 'islands-of-tahiti'), esc_html(get_search_query())); ?></h1><?php get_search_form(); ?></header>
<?php if (have_posts()) : ?><div class="iot-post-grid"><?php while (have_posts()) : the_post(); ?><article class="iot-post-card"><a href="<?php the_permalink(); ?>"><?php if (has_post_thumbnail()) the_post_thumbnail('iot-card'); ?><div class="iot-post-card-copy"><h2><?php the_title(); ?></h2><?php the_excerpt(); ?><span class="iot-text-link"><?php esc_html_e('Discover more', 'islands-of-tahiti'); ?> ↗</span></div></a></article><?php endwhile; ?></div><?php the_posts_pagination(); ?><?php else : ?><p><?php esc_html_e('No results found. Try another search.', 'islands-of-tahiti'); ?></p><?php endif; ?>
</main>
<?php get_footer(); ?>
