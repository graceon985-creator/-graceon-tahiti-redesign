<?php
/**
 * Islands of Tahiti — GRACEON WordPress theme.
 * Presentation layer only. Tourism data integrations belong in a companion plugin.
 */
if (!defined('ABSPATH')) { exit; }

define('IOT_THEME_VERSION', '1.0.6');
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
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'journeyNonce' => wp_create_nonce('gtc_journey_toggle'),
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


function iot_customize_register(WP_Customize_Manager $wp_customize): void {
    $wp_customize->add_section('iot_home_hero', ['title' => __('Islands homepage hero', 'islands-of-tahiti'), 'priority' => 30]);
    $wp_customize->add_setting('iot_hero_title', ['default' => __('Not just a place. A world to feel.', 'islands-of-tahiti'), 'sanitize_callback' => 'sanitize_textarea_field']);
    $wp_customize->add_control('iot_hero_title', ['label' => __('Hero heading', 'islands-of-tahiti'), 'section' => 'iot_home_hero', 'type' => 'textarea']);
    $wp_customize->add_setting('iot_hero_copy', ['default' => __('From the pulse of island culture to volcanic valleys, quiet lagoons and open-ocean horizons — discover a world shaped by its people, traditions and extraordinary nature.', 'islands-of-tahiti'), 'sanitize_callback' => 'sanitize_textarea_field']);
    $wp_customize->add_control('iot_hero_copy', ['label' => __('Hero supporting text', 'islands-of-tahiti'), 'section' => 'iot_home_hero', 'type' => 'textarea']);
    $wp_customize->add_setting('iot_hero_image', ['default' => '', 'sanitize_callback' => 'esc_url_raw']);
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'iot_hero_image', ['label' => __('Hero photograph', 'islands-of-tahiti'), 'section' => 'iot_home_hero']));
}
add_action('customize_register', 'iot_customize_register');

/** Safe, useful fallback navigation when no menu has been assigned yet. */
function iot_fallback_menu(): void {
    echo '<ul class="iot-fallback-menu">';
    $links = [
        __('Islands', 'islands-of-tahiti') => home_url('/#islands'),
        __('My Journey', 'islands-of-tahiti') => home_url('/my-journey/'),
        __('Tahiti Passport', 'islands-of-tahiti') => home_url('/my-passport/'),
        __('Experiences', 'islands-of-tahiti') => get_post_type_archive_link('iot_experience'),
        __('Events', 'islands-of-tahiti') => get_post_type_archive_link('iot_event'),
        __('Practical information', 'islands-of-tahiti') => get_post_type_archive_link('iot_tip'),
        __('Accommodation', 'islands-of-tahiti') => get_post_type_archive_link('iot_accommodation'),
        __('Special offers', 'islands-of-tahiti') => get_post_type_archive_link('iot_offer'),
    ];
    foreach ($links as $label => $url) {
        if ($url) { printf('<li><a href="%1$s">%2$s</a></li>', esc_url($url), esc_html($label)); }
    }
    echo '</ul>';
}
