<?php
/**
 * Context retrieval for the GRACEON Smart Guide.
 * Uses published WordPress destination content as its grounding source.
 */
if (!defined('ABSPATH')) { exit; }

function gtc_ai_guide_island_aliases(): array {
    return [
        'tahiti' => ['tahiti'],
        'moorea' => ['moorea'],
        'bora-bora' => ['bora bora', 'bora-bora'],
        'huahine' => ['huahine'],
        'raiatea' => ['raiatea'],
        'taha-a' => ["taha'a", 'tahaa', 'taha a'],
        'rangiroa' => ['rangiroa'],
        'fakarava' => ['fakarava'],
    ];
}

function gtc_ai_guide_detect_island(string $question): string {
    $text = mb_strtolower(remove_accents($question));
    foreach (gtc_ai_guide_island_aliases() as $slug => $aliases) {
        foreach ($aliases as $alias) {
            if (strpos($text, remove_accents($alias)) !== false) { return $slug; }
        }
    }
    return '';
}

function gtc_ai_guide_retrieve_context(string $question, string $locale = ''): string {
    $post_types = ['iot_island','iot_highlight','iot_experience','iot_event','iot_tip','iot_provider','iot_accommodation','iot_offer'];
    $found = [];
    $queries = [];
    $clean = trim(wp_strip_all_tags($question));
    if ($clean !== '') { $queries[] = $clean; }
    $island_slug = gtc_ai_guide_detect_island($clean);
    if ($island_slug !== '') {
        $island_post = get_page_by_path($island_slug, OBJECT, 'iot_island');
        if ($island_post && $island_post->post_status === 'publish') { $found[$island_post->ID] = $island_post; }
        $island_term = get_term_by('slug', $island_slug, 'iot_highlight_island');
        if ($island_term && !is_wp_error($island_term)) {
            $q = new WP_Query([
                'post_type' => 'iot_highlight', 'post_status' => 'publish',
                'posts_per_page' => 10, 'no_found_rows' => true,
                'tax_query' => [[ 'taxonomy' => 'iot_highlight_island', 'field' => 'slug', 'terms' => $island_slug ]],
            ]);
            foreach ($q->posts as $p) { $found[$p->ID] = $p; }
        }
        $queries[] = get_the_title($island_post ?: $island_slug);
    }
    foreach ($queries as $search_term) {
        $q = new WP_Query([
            'post_type' => $post_types, 'post_status' => 'publish',
            'posts_per_page' => 6, 'no_found_rows' => true,
            's' => $search_term,
        ]);
        foreach ($q->posts as $p) { $found[$p->ID] = $p; }
    }
    $entries = [];
    foreach (array_slice(array_values($found), 0, 8) as $post) {
        $title = get_the_title($post);
        $content = trim(wp_strip_all_tags($post->post_content));
        $excerpt = trim(wp_strip_all_tags(get_the_excerpt($post)));
        $text = $excerpt !== '' ? $excerpt : $content;
        if ($content !== '' && $excerpt !== '' && mb_strlen($text) < 450) { $text .= ' ' . $content; }
        $text = mb_substr(preg_replace('/\s+/', ' ', $text), 0, 900);
        $line = "CONTENT TYPE: {$post->post_type}\nTITLE: {$title}\nDETAILS: {$text}\nURL: " . get_permalink($post);
        foreach (['iot_location_name','gtc_highlight_location','gtc_highlight_kicker','iot_island_archipelago'] as $meta) {
            $value = get_post_meta($post->ID, $meta, true);
            if ($value) { $line .= "\n{$meta}: " . sanitize_text_field($value); }
        }
        $entries[] = $line;
    }
    $context = implode("\n\n---\n\n", $entries);
    return (string) apply_filters('gtc_ai_guide_context', $context, $question, $locale, $found);
}
