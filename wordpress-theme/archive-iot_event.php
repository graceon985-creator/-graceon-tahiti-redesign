<?php
get_header();
$from = isset($_GET['from']) ? sanitize_text_field(wp_unslash($_GET['from'])) : '';
$to = isset($_GET['to']) ? sanitize_text_field(wp_unslash($_GET['to'])) : '';
$is_valid_date = static function (string $value): bool {
    $date = DateTime::createFromFormat('Y-m-d', $value);
    return $date && $date->format('Y-m-d') === $value;
};
if (!$is_valid_date($from)) { $from = ''; }
if (!$is_valid_date($to)) { $to = ''; }
$meta_query = [];
if ($from || $to) {
    $start = $from ?: current_time('Y-m-d');
    $end = $to ?: '2099-12-31';
    $meta_query[] = [
        'relation' => 'OR',
        ['key' => 'iot_event_end', 'value' => $start, 'compare' => '>=', 'type' => 'CHAR'],
        ['key' => 'iot_event_start', 'value' => $start, 'compare' => '>=', 'type' => 'CHAR'],
        ['key' => 'iot_event_start', 'compare' => 'NOT EXISTS'],
    ];
    $meta_query[] = [
        'key' => 'iot_event_start', 'value' => $end, 'compare' => '<=', 'type' => 'CHAR',
    ];
}
$events = new WP_Query([
    'post_type' => 'iot_event', 'post_status' => 'publish', 'posts_per_page' => 18,
    'meta_key' => 'iot_event_start', 'orderby' => 'meta_value', 'order' => 'ASC',
    'meta_query' => $meta_query,
]);
?>
<main id="main-content" class="iot-content-wrap">
  <header class="iot-page-heading">
    <span class="iot-eyebrow">THE ISLAND CALENDAR</span>
    <h1><?php esc_html_e('Moments worth travelling for.', 'islands-of-tahiti'); ?></h1>
    <p><?php esc_html_e('Explore cultural celebrations, local gatherings and events across the Islands of Tahiti.', 'islands-of-tahiti'); ?></p>
  </header>
  <form class="iot-event-filters" method="get" action="<?php echo esc_url(get_post_type_archive_link('iot_event')); ?>">
    <label><?php esc_html_e('From', 'islands-of-tahiti'); ?><input type="date" name="from" value="<?php echo esc_attr($from); ?>"></label>
    <label><?php esc_html_e('Until', 'islands-of-tahiti'); ?><input type="date" name="to" value="<?php echo esc_attr($to); ?>"></label>
    <button type="submit"><?php esc_html_e('Filter events', 'islands-of-tahiti'); ?></button>
    <a href="<?php echo esc_url(get_post_type_archive_link('iot_event')); ?>"><?php esc_html_e('Clear', 'islands-of-tahiti'); ?></a>
  </form>
  <?php if ($events->have_posts()) : ?>
    <div class="iot-post-grid">
    <?php while ($events->have_posts()) : $events->the_post();
      $start_date = get_post_meta(get_the_ID(), 'iot_event_start', true);
      $end_date = get_post_meta(get_the_ID(), 'iot_event_end', true);
      $location = get_post_meta(get_the_ID(), 'iot_location_name', true); ?>
      <article class="iot-post-card"><a href="<?php the_permalink(); ?>">
        <?php if (has_post_thumbnail()) { the_post_thumbnail('iot-card'); } ?>
        <div class="iot-post-card-copy">
          <?php if ($start_date) : ?><span class="iot-event-date"><?php echo esc_html(mysql2date(get_option('date_format'), $start_date)); ?><?php if ($end_date) : ?> – <?php echo esc_html(mysql2date(get_option('date_format'), $end_date)); ?><?php endif; ?></span><?php endif; ?>
          <h2><?php the_title(); ?></h2><?php if ($location) : ?><p><?php echo esc_html($location); ?></p><?php endif; ?>
          <?php the_excerpt(); ?><span class="iot-text-link"><?php esc_html_e('Event details', 'islands-of-tahiti'); ?> ↗</span>
        </div>
      </a></article>
    <?php endwhile; wp_reset_postdata(); ?>
    </div>
  <?php else : ?><p class="iot-integration-note"><?php esc_html_e('No events match these dates yet. Please try a wider date range or clear the filters.', 'islands-of-tahiti'); ?></p><?php endif; ?>
</main>
<?php get_footer(); ?>
