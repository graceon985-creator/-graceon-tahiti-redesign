<?php
/**
 * Smart Guide interface and secure provider adapter contract.
 * No API keys are stored in the browser or committed to this repository.
 */
if (!defined('ABSPATH')) { exit; }

function gtc_register_ai_guide_route(): void {
    register_rest_route('gtc/v1', '/guide', [
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'gtc_ai_guide_response',
        'permission_callback' => '__return_true',
        'args' => [
            'question' => ['required' => true, 'sanitize_callback' => 'sanitize_textarea_field'],
        ],
    ]);
}
add_action('rest_api_init', 'gtc_register_ai_guide_route');

function gtc_ai_guide_response(WP_REST_Request $request): WP_REST_Response {
    $question = trim((string) $request->get_param('question'));
    if (mb_strlen($question) < 3 || mb_strlen($question) > 500) {
        return new WP_REST_Response(['message' => __('Please enter a question between 3 and 500 characters.', 'graceon-tahiti-core')], 400);
    }

    $ip = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : 'unknown';
    $rate_key = 'gtc_guide_' . hash_hmac('sha256', $ip, wp_salt('auth'));
    $requests = (int) get_transient($rate_key);
    if ($requests >= 8) {
        return new WP_REST_Response(['message' => __('You have reached the guide request limit. Please try again in a little while.', 'graceon-tahiti-core')], 429);
    }
    set_transient($rate_key, $requests + 1, 10 * MINUTE_IN_SECONDS);

    $provider = apply_filters('gtc_ai_guide_provider', null);
    if (!is_callable($provider)) {
        return new WP_REST_Response([
            'message' => __('The Smart Guide is being prepared. Its AI service has not been connected yet.', 'graceon-tahiti-core'),
            'code' => 'guide_not_configured',
        ], 503);
    }

    try {
        $answer = call_user_func($provider, $question, determine_locale());
    } catch (Throwable $error) {
        return new WP_REST_Response(['message' => __('The guide could not answer right now. Please try again later.', 'graceon-tahiti-core')], 502);
    }
    if (is_wp_error($answer) || !is_string($answer) || trim($answer) === '') {
        return new WP_REST_Response(['message' => __('The guide could not find an answer right now. Please try again later.', 'graceon-tahiti-core')], 502);
    }
    return new WP_REST_Response(['answer' => wp_kses_post($answer)], 200);
}

function gtc_ai_guide_shortcode(): string {
    ob_start();
    ?>
    <section class="gtc-ai-guide" data-gtc-guide data-endpoint="<?php echo esc_url(rest_url('gtc/v1/guide')); ?>">
      <div class="gtc-ai-guide__intro">
        <p class="gtc-ai-guide__eyebrow"><?php esc_html_e('YOUR ISLAND COMPANION', 'graceon-tahiti-core'); ?></p>
        <h2><?php esc_html_e('Ask the Islands of Tahiti.', 'graceon-tahiti-core'); ?></h2>
        <p><?php esc_html_e('Ask about island highlights, local culture, getting around and ideas for your trip.', 'graceon-tahiti-core'); ?></p>
      </div>
      <div class="gtc-ai-guide__conversation" data-guide-messages aria-live="polite">
        <p class="gtc-ai-guide__welcome"><?php esc_html_e('What would you like to discover?', 'graceon-tahiti-core'); ?></p>
      </div>
      <form class="gtc-ai-guide__form" data-guide-form>
        <label class="screen-reader-text" for="gtc-guide-question"><?php esc_html_e('Your question', 'graceon-tahiti-core'); ?></label>
        <textarea id="gtc-guide-question" name="question" rows="2" maxlength="500" required placeholder="<?php esc_attr_e('e.g. What can I explore in Raiatea?', 'graceon-tahiti-core'); ?>"></textarea>
        <button type="submit"><?php esc_html_e('ASK THE GUIDE', 'graceon-tahiti-core'); ?> ↗</button>
      </form>
      <p class="gtc-ai-guide__disclaimer"><?php esc_html_e('Travel details can change. Confirm transport, opening times and safety guidance with official local sources before travelling.', 'graceon-tahiti-core'); ?></p>
    </section>
    <?php
    return (string) ob_get_clean();
}
add_shortcode('gtc_ai_guide', 'gtc_ai_guide_shortcode');

function gtc_ensure_smart_guide_page(): void {
    if (!current_user_can('manage_options') || get_page_by_path('smart-guide')) { return; }
    wp_insert_post([
        'post_type' => 'page',
        'post_status' => 'publish',
        'post_title' => __('Smart Guide', 'graceon-tahiti-core'),
        'post_name' => 'smart-guide',
        'post_content' => '[gtc_ai_guide]',
    ]);
}
add_action('admin_init', 'gtc_ensure_smart_guide_page', 45);

function gtc_ai_guide_styles(): void {
    wp_register_style('gtc-ai-guide', false, [], GTC_VERSION);
    wp_enqueue_style('gtc-ai-guide');
    wp_add_inline_style('gtc-ai-guide', '
      .gtc-ai-guide{max-width:900px;margin:48px auto;padding:clamp(24px,5vw,58px);background:#e9e6dc;color:#153c43;border:1px solid #d6d0c3}
      .gtc-ai-guide__intro{max-width:650px;margin:0 auto 30px;text-align:center}
      .gtc-ai-guide__eyebrow{font-size:.68rem;font-weight:800;letter-spacing:.17em;color:#9a7058}
      .gtc-ai-guide__intro h2{font:normal clamp(36px,5vw,58px)/1.05 Georgia,serif;margin:12px 0}
      .gtc-ai-guide__intro>p:last-child{color:#62736d;line-height:1.8}
      .gtc-ai-guide__conversation{min-height:150px;max-height:420px;overflow:auto;padding:20px;background:#f7f4ec;border:1px solid #d8d2c6}
      .gtc-ai-guide__welcome{color:#71817a;text-align:center;padding:24px 0}
      .gtc-ai-guide__message{max-width:85%;padding:14px 16px;margin:10px 0;background:#e6e2d8;line-height:1.7;font-size:.92rem}
      .gtc-ai-guide__message.is-user{margin-left:auto;background:#d5e4dc}
      .gtc-ai-guide__form{display:flex;gap:10px;margin-top:12px;align-items:stretch}
      .gtc-ai-guide__form textarea{flex:1;min-width:0;padding:14px;border:1px solid #c9c4b8;background:#fff;color:#153c43;font:inherit;resize:vertical}
      .gtc-ai-guide__form button{border:0;background:#153c43;color:#fff;padding:0 20px;font-size:.7rem;font-weight:800;letter-spacing:.1em;cursor:pointer}
      .gtc-ai-guide__form button:disabled{opacity:.55;cursor:wait}
      .gtc-ai-guide__disclaimer{font-size:.72rem;line-height:1.6;color:#748079;margin-top:14px}
      @media(max-width:600px){.gtc-ai-guide{margin:28px 12px;padding:22px 16px}.gtc-ai-guide__form{flex-direction:column}.gtc-ai-guide__form button{min-height:48px}}
    ');
}
add_action('wp_enqueue_scripts', 'gtc_ai_guide_styles');
