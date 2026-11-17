<?php
/**
 * Lightweight installable PWA shell for the public destination experience.
 * Private account pages and WordPress administration are deliberately excluded
 * from service-worker caching.
 */
if (!defined('ABSPATH')) { exit; }

function gtc_pwa_register_rewrites(): void {
    add_rewrite_rule('^graceon-sw\\.js$', 'index.php?gtc_pwa_asset=sw', 'top');
    add_rewrite_rule('^graceon-manifest\\.webmanifest$', 'index.php?gtc_pwa_asset=manifest', 'top');
}
add_action('init', 'gtc_pwa_register_rewrites', 1);

function gtc_pwa_query_vars(array $vars): array {
    $vars[] = 'gtc_pwa_asset';
    return $vars;
}
add_filter('query_vars', 'gtc_pwa_query_vars');

function gtc_pwa_asset_response(): void {
    $asset = get_query_var('gtc_pwa_asset');
    if (!$asset) { return; }

    if ($asset === 'manifest') {
        status_header(200);
        header('Content-Type: application/manifest+json; charset=utf-8');
        header('Cache-Control: public, max-age=3600');
        echo wp_json_encode([
            'id' => home_url('/'),
            'name' => get_bloginfo('name') ?: 'The Islands of Tahiti',
            'short_name' => 'Islands of Tahiti',
            'description' => __('Explore the islands, save places and collect your digital passport stamps.', 'graceon-tahiti-core'),
            'start_url' => home_url('/'),
            'scope' => home_url('/'),
            'display' => 'standalone',
            'orientation' => 'portrait-primary',
            'background_color' => '#f3f0e8',
            'theme_color' => '#153c43',
            'icons' => [[
                'src' => get_template_directory_uri() . '/assets/images/pwa-icon.svg',
                'sizes' => 'any',
                'type' => 'image/svg+xml',
                'purpose' => 'any maskable',
            ]],
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($asset === 'sw') {
        status_header(200);
        header('Content-Type: application/javascript; charset=utf-8');
        header('Service-Worker-Allowed: ' . trailingslashit((string) wp_parse_url(home_url('/'), PHP_URL_PATH)));
        header('Cache-Control: no-cache, no-store, must-revalidate');
        $home = wp_json_encode(home_url('/'));
        $offline = wp_json_encode(get_template_directory_uri() . '/offline.html');
        $theme = wp_json_encode(get_template_directory_uri());
        echo "const CACHE='gtc-tahiti-shell-v1';\n";
        echo "const HOME={$home};\nconst OFFLINE={$offline};\nconst THEME={$theme};\n";
        ?>
const SHELL=[HOME,OFFLINE,THEME+'/assets/css/site.css',THEME+'/assets/js/site.js',THEME+'/assets/images/pwa-icon.svg'];
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);await Promise.allSettled(SHELL.map(url=>cache.add(url)));await self.skipWaiting();})());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith('gtc-tahiti-')&&key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim();})());});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(/\/(wp-admin|wp-login\.php|wp-json|my-journey|my-passport)(\/|$)/.test(url.pathname)||url.pathname.includes('admin-ajax.php'))return;
  if(request.mode==='navigate'){
    event.respondWith((async()=>{try{const response=await fetch(request);if(response&&response.ok){const cache=await caches.open(CACHE);cache.put(request,response.clone());}return response;}catch(error){return (await caches.match(request))||(await caches.match(OFFLINE));}})());
    return;
  }
  if(/\.(css|js|svg|woff2?)$/i.test(url.pathname)){
    event.respondWith((async()=>{const cached=await caches.match(request);if(cached)return cached;try{const response=await fetch(request);if(response&&response.ok){const cache=await caches.open(CACHE);cache.put(request,response.clone());}return response;}catch(error){return cached||Response.error();}})());
  }
});
        <?php
        exit;
    }
}
add_action('template_redirect', 'gtc_pwa_asset_response', 0);

function gtc_pwa_head_tags(): void {
    echo '<link rel="manifest" href="' . esc_url(home_url('/graceon-manifest.webmanifest')) . '">' . "\n";
    echo '<meta name="theme-color" content="#153c43">' . "\n";
}
add_action('wp_head', 'gtc_pwa_head_tags', 2);

function gtc_pwa_register_service_worker(): void {
    if (is_admin()) { return; }
    $url = wp_json_encode(home_url('/graceon-sw.js'));
    $scope = wp_json_encode(trailingslashit(home_url('/')));
    echo "<script>if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register({$url},{scope:{$scope}}).catch(function(error){console.warn('Offline support is unavailable on this connection.',error);});});}</script>\n";
}
add_action('wp_footer', 'gtc_pwa_register_service_worker', 30);
