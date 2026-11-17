<?php
/**
 * Islands of Tahiti — GRACEON WordPress theme.
 * Presentation layer only. Tourism data integrations belong in a companion plugin.
 */
if (!defined('ABSPATH')) { exit; }

define('IOT_THEME_VERSION', '1.0.0');
define('IOT_THEME_DIR', get_template_directory());
define('IOT_THEME_URI', get_template_directory_uri());

function iot_theme_setup(): void {
    load_theme_textdomain('islands-of-tahiti', IOT_THEME_DIR . '/languages');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script', 'navigation-widgets']);
    add_theme_support('responsive-embeds');
    add_theme_support('custom-logo', ['height' => 80, 'width' => 220, 'flex-height' => true, 'flex-width' => true]);
    register_nav_menus([
        'primary' => __('Primary navigation', 'islands-of-tahiti'),
        'footer' => __('Footer navigation', 'islands-of-tahiti'),
    ]);
}
add_action('after_setup_theme', 'iot_theme_setup');

function iot_enqueue_assets(): void {
    wp_enqueue_style('iot-theme', get_stylesheet_uri(), [], IOT_THEME_VERSION);
    wp_enqueue_style('iot-site', IOT_THEME_URI . '/assets/css/site.css', ['iot-theme'], IOT_THEME_VERSION);
    wp_enqueue_script('iot-site', IOT_THEME_URI . '/assets/js/site.js', [], IOT_THEME_VERSION, true);
    wp_localize_script('iot-site', 'IOT_SITE', [
        'homeUrl' => home_url('/'),
        'restUrl' => esc_url_raw(rest_url()),
        'nonce' => wp_create_nonce('wp_rest'),
        'language' => determine_locale(),
    ]);
}
add_action('wp_enqueue_scripts', 'iot_enqueue_assets');

function iot_excerpt_length(int $length): int { return 26; }
add_filter('excerpt_length', 'iot_excerpt_length', 99);

function iot_body_classes(array $classes): array {
    $classes[] = 'iot-wordpress';
    if (is_front_page()) { $classes[] = 'iot-home'; }
    return $classes;
}
add_filter('body_class', 'iot_body_classes');

/** Add useful image sizes for responsive editorial cards. */
add_action('after_setup_theme', function (): void {
    add_image_size('iot-hero', 2000, 1200, true);
    add_image_size('iot-card', 900, 700, true);
});
