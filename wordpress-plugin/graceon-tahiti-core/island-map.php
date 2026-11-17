<?php
/**
 * Lightweight OpenStreetMap view for curated island highlights.
 */
if (!defined('ABSPATH')) { exit; }

function gtc_register_island_map_assets(): void {
    wp_register_style('gtc-leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', [], '1.9.4');
    wp_register_script('gtc-leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', [], '1.9.4', true);
}
add_action('wp_enqueue_scripts', 'gtc_register_island_map_assets');

function gtc_island_map_shortcode($atts = []): string {
    $atts = shortcode_atts(['island' => ''], $atts, 'gtc_island_map');
    $island = sanitize_title($atts['island']);
    if (!$island && is_singular('iot_island')) {
        $island = get_post_field('post_name', get_queried_object_id());
    } elseif (!$island && is_singular('iot_highlight')) {
        $terms = get_the_terms(get_queried_object_id(), 'iot_highlight_island');
        if ($terms && !is_wp_error($terms)) { $island = $terms[0]->slug; }
    }
    if (!$island) { return '<p class="gtc-map-empty">' . esc_html__('Choose an island to view its map.', 'graceon-tahiti-core') . '</p>'; }

    $query = new WP_Query([
        'post_type' => 'iot_highlight', 'post_status' => 'publish', 'posts_per_page' => 100,
        'orderby' => ['menu_order' => 'ASC', 'title' => 'ASC'],
        'tax_query' => [[ 'taxonomy' => 'iot_highlight_island', 'field' => 'slug', 'terms' => $island ]],
        'meta_query' => [
            ['key' => 'gtc_highlight_latitude', 'compare' => 'EXISTS'],
            ['key' => 'gtc_highlight_longitude', 'compare' => 'EXISTS'],
        ],
    ]);
    $markers = [];
    foreach ($query->posts as $post) {
        $lat = get_post_meta($post->ID, 'gtc_highlight_latitude', true);
        $lng = get_post_meta($post->ID, 'gtc_highlight_longitude', true);
        if ($lat === '' || $lng === '' || !is_numeric($lat) || !is_numeric($lng)) { continue; }
        $markers[] = [
            'title' => get_the_title($post),
            'location' => (string) get_post_meta($post->ID, 'gtc_highlight_location', true),
            'url' => get_permalink($post),
            'lat' => (float) $lat,
            'lng' => (float) $lng,
        ];
    }
    if (!$markers) {
        return '<div class="gtc-map-empty"><p>' . esc_html__('Map locations are being curated for this island.', 'graceon-tahiti-core') . '</p></div>';
    }
    wp_enqueue_style('gtc-leaflet');
    wp_enqueue_script('gtc-leaflet');
    wp_register_script('gtc-island-map', false, ['gtc-leaflet'], GTC_VERSION, true);
    wp_enqueue_script('gtc-island-map');
    $script = <<<'JS'
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.gtc-island-map[data-markers]').forEach(function (node) {
    if (node.dataset.mapReady === '1' || typeof window.L === 'undefined') return;
    node.dataset.mapReady = '1';
    let markers = [];
    try { markers = JSON.parse(node.dataset.markers); } catch (error) { return; }
    if (!markers.length) return;
    const first = markers[0];
    const map = window.L.map(node, { scrollWheelZoom: false }).setView([first.lat, first.lng], 11);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    const bounds = [];
    markers.forEach(function (item) {
      const marker = window.L.marker([item.lat, item.lng]).addTo(map);
      const popup = document.createElement('div');
      const heading = document.createElement('strong');
      heading.textContent = item.title;
      popup.appendChild(heading);
      if (item.location) {
        const detail = document.createElement('p');
        detail.textContent = item.location;
        popup.appendChild(detail);
      }
      const link = document.createElement('a');
      link.href = item.url;
      link.textContent = 'Explore place';
      popup.appendChild(link);
      marker.bindPopup(popup);
      bounds.push([item.lat, item.lng]);
    });
    if (bounds.length > 1) map.fitBounds(bounds, { padding: [28, 28] });
  });
});
JS;
    wp_add_inline_script('gtc-island-map', $script);
    $center = $markers[0];
    $json = wp_json_encode($markers);
    $list = '<ul class="gtc-map-place-list">';
    foreach ($markers as $marker) {
        $list .= '<li><a href="' . esc_url($marker['url']) . '">' . esc_html($marker['title']) . '</a>';
        if ($marker['location']) { $list .= '<span>' . esc_html($marker['location']) . '</span>'; }
        $list .= '</li>';
    }
    $list .= '</ul>';
    return '<section class="gtc-map-section" aria-label="' . esc_attr__('Island map and places', 'graceon-tahiti-core') . '"><div class="gtc-island-map" role="application" aria-label="' . esc_attr__('Interactive map of island highlights', 'graceon-tahiti-core') . '" data-markers="' . esc_attr($json) . '"></div><p class="gtc-map-attribution">' . esc_html__('Map data © OpenStreetMap contributors', 'graceon-tahiti-core') . '</p>' . $list . '</section>';
}
add_shortcode('gtc_island_map', 'gtc_island_map_shortcode');
