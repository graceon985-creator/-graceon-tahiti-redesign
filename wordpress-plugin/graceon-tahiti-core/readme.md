# GRACEON Tahiti WordPress implementation

This repository contains an independent redesign demonstration. It is not commissioned, approved, endorsed, or affiliated with Tahiti Tourisme.

## Architecture
- `wordpress-theme/`: presentation theme. Install as a theme folder named `islands-of-tahiti`.
- `wordpress-plugin/graceon-tahiti-core/`: companion plugin for structured tourism content.
- Existing React/Vite work remains in the repository as a separate visual prototype.

## Install locally
1. Use a clean WordPress 6.4+ installation with PHP 8.0+.
2. Copy `wordpress-theme` into `wp-content/themes/islands-of-tahiti`.
3. Copy `wordpress-plugin/graceon-tahiti-core` into `wp-content/plugins/graceon-tahiti-core`.
4. Activate the plugin, then activate the theme.
5. Create a WordPress menu and assign it to Primary navigation.
6. Add Island, Experience, Event, Tourism provider, Accommodation, Special offer and Practical tip entries. Add featured images and island-group taxonomy terms.
7. Set a static front page under Settings → Reading if desired.

## Integrations
APIDAE and FairGuest are deliberately not represented as live integrations. Production integration requires official API documentation, credentials, permitted scopes, data mapping, rate-limit rules and acceptance testing from Tahiti Tourisme. The plugin exposes adapter hooks and clearly reports when the adapters are absent. Credentials should be stored in server configuration (for example wp-config.php or environment variables), never committed to this repository.

## Bilingual content
Use the multilingual solution selected by the site owner (for example WPML or Polylang) and configure translated menus, content and URL structure. This repository does not include a paid multilingual plugin or claim bilingual publishing is already configured.

## Production readiness still required
- Import/validate approved French and English content.
- Implement and test APIDAE synchronization and FairGuest reviews against official specifications.
- Implement offer validity, provider association, geographic access rules and filters.
- Complete event date filters and practical-information content.
- Add SEO/AIO requirements supplied by the client.
- Configure hosting, staging, backups, security, monitoring, privacy/cookie requirements and support.
- Test accessibility, performance, responsive layouts, roles, editorial workflows and restore procedures.
