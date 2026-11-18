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
    $all_query = new WP_Query([
        'post_type' => 'iot_highlight', 'post_status' => 'publish', 'posts_per_page' => 100,
        'orderby' => ['menu_order' => 'ASC', 'title' => 'ASC'],
        'tax_query' => [[ 'taxonomy' => 'iot_highlight_island', 'field' => 'slug', 'terms' => $island ]],
    ]);
    if (!$all_query->posts) {
        return '<div class="gtc-map-empty"><p>' . esc_html__('Place information is being prepared for this island.', 'graceon-tahiti-core') . '</p></div>';
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
    $json = wp_json_encode($markers);
    $list = '<ul class="gtc-map-place-list">';
    foreach ($all_query->posts as $place) {
        $location = (string) get_post_meta($place->ID, 'gtc_highlight_location', true);
        $map_url = (string) get_post_meta($place->ID, 'gtc_highlight_map_url', true);
        $list .= '<li><a href="' . esc_url(get_permalink($place)) . '">' . esc_html(get_the_title($place)) . '</a>';
        if ($location) { $list .= '<span>' . esc_html($location) . '</span>'; }
        if ($map_url) { $list .= '<a class="gtc-map-directions" href="' . esc_url($map_url) . '" target="_blank" rel="noopener noreferrer">' . esc_html__('OPEN DIRECTIONS ↗', 'graceon-tahiti-core') . '</a>'; }
        $list .= '</li>';
    }
    $list .= '</ul>';
    if (!$markers) {
        return '<section class="gtc-map-section gtc-map-section--pending" aria-label="' . esc_attr__('Island places and directions', 'graceon-tahiti-core') . '"><div class="gtc-map-empty"><p>' . esc_html__('Exact map pins for these places are still being checked. You can open each place for details or directions.', 'graceon-tahiti-core') . '</p></div>' . $list . '</section>';
    }
    return '<section class="gtc-map-section" aria-label="' . esc_attr__('Island map and places', 'graceon-tahiti-core') . '"><div class="gtc-island-map" role="application" aria-label="' . esc_attr__('Interactive map of island highlights', 'graceon-tahiti-core') . '" data-markers="' . esc_attr($json) . '"></div><p class="gtc-map-attribution">' . esc_html__('Map data © OpenStreetMap contributors', 'graceon-tahiti-core') . '</p>' . $list . '</section>';
}
add_shortcode('gtc_island_map', 'gtc_island_map_shortcode');


/**
 * Reusable editorial section for an island highlight category.
 * Usage: [gtc_highlights_section type="activity" title="Things to do"]
 */
function gtc_highlights_section_shortcode($atts = []): string {
    $atts = shortcode_atts([
        'type' => '',
        'title' => '',
        'eyebrow' => 'DISCOVER MORE',
        'island' => '',
    ], $atts, 'gtc_highlights_section');
    $type = sanitize_title($atts['type']);
    $island = sanitize_title($atts['island']);
    if (!$island && is_singular('iot_island')) {
        $island = get_post_field('post_name', get_queried_object_id());
    }
    if (!$island || !$type) { return ''; }
    $query = new WP_Query([
        'post_type' => 'iot_highlight', 'post_status' => 'publish', 'posts_per_page' => 12,
        'orderby' => ['menu_order' => 'ASC', 'title' => 'ASC'],
        'tax_query' => [
            'relation' => 'AND',
            ['taxonomy' => 'iot_highlight_island', 'field' => 'slug', 'terms' => $island],
            ['taxonomy' => 'iot_highlight_type', 'field' => 'slug', 'terms' => $type],
        ],
    ]);
    if (!$query->have_posts()) { return ''; }
    ob_start();
    ?>
    <section class="iot-curated-section iot-curated-section--<?php echo esc_attr($type); ?>">
      <div class="iot-island-section-head">
        <div><p class="iot-island-eyebrow"><?php echo esc_html($atts['eyebrow']); ?></p><h2><?php echo esc_html($atts['title'] ?: __('Explore more of the island', 'graceon-tahiti-core')); ?></h2></div>
        <span><?php echo esc_html(strtoupper(str_replace('-', ' ', $type))); ?></span>
      </div>
      <div class="iot-curated-grid">
      <?php foreach ($query->posts as $place) :
        $image = get_post_meta($place->ID, 'gtc_highlight_image_url', true);
        $credit = get_post_meta($place->ID, 'gtc_highlight_image_credit', true);
        $license = get_post_meta($place->ID, 'gtc_highlight_license_url', true);
        $location = get_post_meta($place->ID, 'gtc_highlight_location', true);
        $source = get_post_meta($place->ID, 'gtc_highlight_source_url', true);
      ?>
        <article class="iot-curated-card">
          <a class="iot-curated-card__visual<?php echo $image || has_post_thumbnail($place) ? '' : ' is-placeholder'; ?>" href="<?php echo esc_url(get_permalink($place)); ?>">
            <?php if ($image) : ?><img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr(get_the_title($place)); ?>" loading="lazy"><?php elseif (has_post_thumbnail($place)) : echo get_the_post_thumbnail($place, 'iot-card'); endif; ?>
            <?php if ($credit) : ?><small class="iot-image-credit"><?php echo esc_html($credit); ?><?php if ($license) : ?> · <?php echo esc_html__('license noted', 'graceon-tahiti-core'); ?><?php endif; ?></small><?php endif; ?>
          </a>
          <div class="iot-curated-card__copy">
            <h3><a href="<?php echo esc_url(get_permalink($place)); ?>"><?php echo esc_html(get_the_title($place)); ?></a></h3>
            <p><?php echo esc_html(get_the_excerpt($place)); ?></p>
            <?php if ($location) : ?><span><?php echo esc_html($location); ?></span><?php endif; ?>
            <a class="iot-island-text-link" href="<?php echo esc_url(get_permalink($place)); ?>">DISCOVER THIS STORY ↗</a>
            <?php if ($source) : ?><a class="iot-island-text-link" href="<?php echo esc_url($source); ?>" target="_blank" rel="noopener noreferrer">OFFICIAL DESTINATION GUIDE ↗</a><?php endif;>
          </div>
        </article>
      <?php endforeach; ?>
      </div>
    </section>
    <?php
    return (string) ob_get_clean();
}
add_shortcode('gtc_highlights_section', 'gtc_highlights_section_shortcode');
