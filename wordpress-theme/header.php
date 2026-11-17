<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="iot-skip-link" href="#main-content"><?php esc_html_e('Skip to content', 'islands-of-tahiti'); ?></a>
<div class="iot-topline"><span><?php esc_html_e('THE ISLANDS OF TAHITI', 'islands-of-tahiti'); ?></span><span><?php esc_html_e('FRENCH POLYNESIA · SOUTH PACIFIC', 'islands-of-tahiti'); ?></span><span><?php esc_html_e('DISCOVER THE BLUE', 'islands-of-tahiti'); ?></span></div>
<header class="iot-header">
  <a class="iot-brand" href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php echo esc_attr(get_bloginfo('name')); ?>">
    <span class="iot-brand-mark">T</span><span class="iot-brand-name">TAHITI<small>ISLANDS OF</small></span>
  </a>
  <button class="iot-menu-toggle" aria-expanded="false" aria-controls="iot-primary-nav"><span class="screen-reader-text"><?php esc_html_e('Toggle menu', 'islands-of-tahiti'); ?></span><i></i><i></i></button>
  <nav class="iot-primary-nav" id="iot-primary-nav" aria-label="<?php esc_attr_e('Primary navigation', 'islands-of-tahiti'); ?>">
    <?php wp_nav_menu(['theme_location' => 'primary', 'container' => false, 'fallback_cb' => 'iot_fallback_menu']); ?>
  </nav>
  <a class="iot-header-cta" href="<?php echo esc_url(get_post_type_archive_link('iot_island') ?: home_url('/#islands')); ?>"><?php esc_html_e('Find your island', 'islands-of-tahiti'); ?> <span>↗</span></a>
</header>
