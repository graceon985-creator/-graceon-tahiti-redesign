<footer class="iot-footer">
  <a class="iot-brand iot-footer-brand" href="<?php echo esc_url(home_url('/')); ?>"><span class="iot-brand-mark">T</span><span class="iot-brand-name">TAHITI<small>ISLANDS OF</small></span></a>
  <p><?php esc_html_e('THE ISLANDS OF TAHITI · FRENCH POLYNESIA', 'islands-of-tahiti'); ?></p>
  <nav aria-label="<?php esc_attr_e('Footer navigation', 'islands-of-tahiti'); ?>"><?php wp_nav_menu(['theme_location' => 'footer', 'container' => false, 'fallback_cb' => '__return_empty_string']); ?></nav>
  <small class="iot-independent-note"><?php esc_html_e('Independent redesign demonstration by GRACEON Digital Studio. Not commissioned, approved or endorsed by Tahiti Tourisme.', 'islands-of-tahiti'); ?></small>
</footer>
<?php wp_footer(); ?>
</body>
</html>
