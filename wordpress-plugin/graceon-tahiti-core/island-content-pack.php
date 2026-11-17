<?php
/**
 * Starter editorial content for the seven islands beyond the Bora Bora pilot.
 * Descriptions are original summaries; source URLs are retained for editors.
 */
if (!defined('ABSPATH')) { exit; }

function gtc_seed_island_editorial_pack(): void {
    if (!current_user_can('manage_options')) { return; }
    $entries = [
        [
            'tahiti','arahurahu-marae','Marae Arahurahu','landmark','HISTORY & HERITAGE',
            'A restored archaeological site that offers a window into Ma’ohi heritage.',
            'Marae Arahurahu sits in the Tefa’aiti valley near Paea. Restored in the 1950s, its stone platforms, enclosing walls and carved wooden unu help visitors understand the role of marae in earlier Polynesian cultural life. It remains a place of deep cultural significance and should be approached respectfully.',
            'Paea · Tefa’aiti valley','https://www.google.com/maps/search/?api=1&query=Marae+Arahurahu+Tahiti',
            'https://tahititourisme.pf/en-pf/activities/points-of-interest/marae-arahurahu-paea-en-en-pf-3299136/'
        ],
        [
            'tahiti','papeete-market','Papeete Market','culture','LOCAL LIFE & FLAVOURS',
            'A lively meeting point for island produce, food and Polynesian crafts.',
            'The covered market is one of the best places to encounter everyday life in Papeete. Browse seasonal fruit, fresh fish, flowers, prepared local dishes and handmade crafts. The market is especially lively on Sunday mornings, when many families shop for the week and traditional meals.',
            'Central Papeete','https://www.google.com/maps/search/?api=1&query=Papeete+Market+Tahiti',
            'https://tahititourisme.pf/en-pf/islands-and-archipelagos/the-society-islands/papeete-the-capital-of-tahiti/what-to-do-in-papeete/'
        ],
        [
            'tahiti','vaipahi-water-gardens','Vaipahi Water Gardens','hidden-gem','GARDENS & NATURE',
            'A peaceful garden stop among Tahiti’s varied landscapes.',
            'Vaipahi Water Garden is one of the nature stops highlighted on island itineraries. It offers a quieter change of pace from the capital and coastal viewpoints, making it a thoughtful place to include in a wider exploration of Tahiti’s west coast.',
            'Mataiea · Tahiti Iti side of the west coast','https://www.google.com/maps/search/?api=1&query=Vaipahi+Water+Garden+Tahiti',
            'https://tahititourisme.pf/en-pf/activities/so-much-to-do/papeete-discovery-papeete-en-en-pf-5182175/'
        ],
        [
            'moorea','opunohu-lookout','Opunohu Lookout','landmark','PANORAMIC VIEWPOINT',
            'A sweeping viewpoint over Moorea’s twin bays and Mount Rotui.',
            'The Opunohu viewpoint sits around 240 metres above sea level and opens onto a remarkable panorama of the island’s two great bays and Mount Rotui. Visit earlier or later in the day for clearer views and softer light.',
            'Opunohu Valley','https://www.google.com/maps/search/?api=1&query=Belvedere+Lookout+Moorea',
            'https://tahititourisme.pf/en-pf/islands-and-archipelagos/the-society-islands/moorea/what-to-do-in-moorea/'
        ],
        [
            'moorea','opunohu-valley','Walk through Opunohu Valley','activity','WALKS & LANDSCAPES',
            'A gentle way to discover the island’s green interior and ancient sites.',
            'The Opunohu Valley route is described as an accessible walk through tropical vegetation, with ancient marae along the way. It offers a different perspective on Moorea beyond the bays and lagoon; check local conditions and trail access before setting out.',
            'Opunohu Valley','https://www.google.com/maps/search/?api=1&query=Opunohu+Valley+Moorea',
            'https://tahititourisme.pf/en-pf/islands-and-archipelagos/the-society-islands/moorea/what-to-do-in-moorea/'
        ],
        [
            'moorea','moorea-pineapple-and-cuisine','Pineapple & Island Cuisine','culture','TASTE OF MOOREA',
            'Discover the island through its fruit, food traditions and shared meals.',
            'Moorea is known for its pineapple-growing tradition. Local flavours also include poisson cru and ma’a Tahiti, a traditional meal prepared in an ahima’a earth oven. Farm visits and local food stops connect the island’s landscape with its everyday food culture.',
            'Around Moorea · Opunohu area','https://www.google.com/maps/search/?api=1&query=Opunohu+Agricultural+College+Moorea',
            'https://tahititourisme.pf/en-pf/islands-and-archipelagos/the-society-islands/moorea/what-to-do-in-moorea/'
        ],
        [
            'huahine','maeva-archaeological-area','Maeva Archaeological Area','landmark','ANCESTRAL HERITAGE',
            'An important landscape of marae, a museum fare and historic fish traps.',
            'The Maeva area in northern Huahine brings together a remarkable concentration of archaeological remains. The fare pote’e introduces visitors to local heritage, while nearby marae and traditional stone fish traps reveal how communities shaped and used the landscape.',
            'Maeva · Northern Huahine','https://www.google.com/maps/search/?api=1&query=Maeva+Archaeological+Site+Huahine',
            'https://tahititourisme.pf/en-pf/islands-and-archipelagos/the-society-islands/huahine/what-to-do-in-huahine/'
        ],
        [
            'huahine','faie-sacred-eels','The Sacred Eels of Faie','culture','LOCAL STORIES',
            'A remarkable natural and cultural site cared for by the local community.',
            'The stream at Faie is known for its sacred eels, recognised by their striking blue eyes. The place is part of Huahine’s living cultural landscape. Visitors should follow local guidance, observe quietly and treat the site and its animals with respect.',
            'Faie · Huahine','https://www.google.com/maps/search/?api=1&query=Sacred+Eels+Faie+Huahine',
            'https://tahititourisme.pf/en-pf/islands-and-archipelagos/the-society-islands/huahine/cultural-immersion-in-huahine/'
        ],
        [
            'huahine','huahine-island-discovery','Discover Huahine at Your Own Pace','activity','ISLAND EXPLORATION',
            'Connect villages, coastlines and heritage sites on a relaxed island circuit.',
            'Huahine can be explored through a mix of village stops, coastal viewpoints, archaeological sites and time by the lagoon. Bicycles and guided island outings are among the ways visitors discover the island; choose routes suited to the day’s conditions.',
            'Huahine Nui & Huahine Iti','https://www.google.com/maps/search/?api=1&query=Huahine+Island',
            'https://tahititourisme.pf/en-pf/islands-and-archipelagos/the-society-islands/huahine/what-to-do-in-huahine/'
        ],
        [
            'raiatea','taputapuatea-marae','Marae Taputapuātea','landmark','UNESCO WORLD HERITAGE',
            'A sacred cultural landscape central to the heritage of the Polynesian triangle.',
            'Taputapuātea is one of the most significant archaeological and spiritual sites in the Pacific. The marae complex preserves the memory of a thousand-year-old mā’ohi civilisation and was inscribed on the UNESCO World Heritage List in 2017. Visitors are asked to treat the site with care and respect.',
            'Opoa · South-west Raiatea','https://www.google.com/maps/search/?api=1&query=Marae+Taputapuatea+Raiatea',
            'https://tahititourisme.pf/en-pf/activities/points-of-interest/marae-taputapuatea-taputapuatea-en-en-pf-3329661/'
        ],
        [
            'raiatea','faaroa-river','Faaroa River','activity','RIVER & NATURE',
            'Explore a lush river valley in one of Raiatea’s distinctive natural settings.',
            'The Faaroa River is described by Tahiti Tourisme as the only navigable river in Polynesia. A guided outing offers a close look at the island’s tropical vegetation and a quieter perspective on Raiatea’s interior. Follow local operator guidance and weather advice.',
            'Faaroa · Raiatea','https://www.google.com/maps/search/?api=1&query=Faaroa+River+Raiatea',
            'https://tahititourisme.pf/en-pf/islands-and-archipelagos/the-society-islands/raiatea/what-to-do-in-raiatea/'
        ],
        [
            'raiatea','mount-temehani','Mount Temehani','hidden-gem','RARE ISLAND NATURE',
            'A remarkable mountain landscape associated with the rare tiare apetahi.',
            'Mount Temehani is known for the tiare apetahi, a rare flower that grows naturally only on this mountain. Its ecological and cultural importance makes it a special part of Raiatea’s identity. Access to sensitive natural areas should follow local conservation guidance.',
            'Mount Temehani · Raiatea','https://www.google.com/maps/search/?api=1&query=Mount+Temehani+Raiatea',
            'https://tahititourisme.pf/en-pf/islands-and-archipelagos/the-society-islands/raiatea/what-to-do-in-raiatea/'
        ],
        [
            'tahaa','vanilla-valley','Vanilla Valley','landmark','THE VANILLA ISLAND',
            'Learn how Taha’a’s celebrated vanilla is cultivated and prepared.',
            'Taha’a is closely associated with vanilla. At plantations in the island’s east, visitors can learn about the careful process of pollinating the flowers by hand and drying the aromatic beans. A guided visit offers context on the craft and patience behind this local product.',
            'East coast · Taha’a','https://www.google.com/maps/search/?api=1&query=Vallee+De+La+Vanille+Taha%27a',
            'https://tahititourisme.pf/en-pf/activities/a-taste-of-the-islands/vallee-de-la-vanille-tahaa-en-en-pf-4272543/'
        ],
        [
            'tahaa','tahaa-coral-garden','Taha’a Coral Garden','activity','LAGOON DISCOVERY',
            'A celebrated lagoon setting among the island’s natural attractions.',
            'The coral garden is listed among Taha’a’s points of interest. Explore the lagoon only with responsible local guidance, respect marked areas and avoid touching coral or disturbing marine life.',
            'Taha’a lagoon','https://www.google.com/maps/search/?api=1&query=Coral+Garden+Taha%27a',
            'https://tahititourisme.pf/en-pf/activities/points-of-interest/what-to-see-in-tahaa/'
        ],
        [
            'tahaa','tahaa-pearl-farms','Pearl Farms of Taha’a','culture','CRAFT & ISLAND LIFE',
            'Discover the skilled work behind one of French Polynesia’s best-known crafts.',
            'Pearl farms are among the places visitors can discover on Taha’a. A visit can introduce the care, patience and specialist knowledge involved in pearl cultivation, while connecting the lagoon environment with local livelihoods.',
            'Around Taha’a','https://www.google.com/maps/search/?api=1&query=Pearl+Farm+Taha%27a',
            'https://tahititourisme.pf/en-pf/islands-and-archipelagos/the-society-islands/tahaa/what-to-do-in-tahaa/'
        ],
        [
            'rangiroa','tiputa-pass','Tiputa Pass','landmark','OCEAN & WILDLIFE',
            'A renowned natural passage between the lagoon and the open ocean.',
            'Tiputa Pass separates the villages of Tiputa and Avatoru and is known for its rich marine biodiversity. Dolphins are sometimes seen in the pass. Enjoy the view from a safe shore location or through a reputable, locally guided excursion; wildlife should never be chased or disturbed.',
            'Between Avatoru and Tiputa · Rangiroa','https://www.google.com/maps/search/?api=1&query=Tiputa+Pass+Rangiroa',
            'https://tahititourisme.pf/en-pf/activities/points-of-interest/passe-de-tiputa-rangiroa-en-en-pf-3337195/'
        ],
        [
            'rangiroa','blue-lagoon','The Blue Lagoon','hidden-gem','MOTU & LAGOON',
            'A striking lagoon landscape reached as part of a locally organised outing.',
            'The Blue Lagoon is one of Rangiroa’s best-known natural attractions. Its shallow turquoise setting and surrounding motu create a different atmosphere from the atoll’s open-ocean passes. Plan visits with established local operators and follow their environmental guidance.',
            'Rangiroa atoll','https://www.google.com/maps/search/?api=1&query=Blue+Lagoon+Rangiroa',
            'https://tahititourisme.pf/en-pf/islands-and-archipelagos/tuamotu-islands/rangiroa/what-to-do-in-rangiroa/'
        ],
        [
            'rangiroa','avatoru-and-tiputa','Avatoru & Tiputa Villages','culture','ATOLL LIFE',
            'Discover the everyday rhythm of life on a vast coral atoll.',
            'The villages of Avatoru and Tiputa sit on either side of Tiputa Pass. A visit is an opportunity to slow down, discover local services and meet the communities whose daily lives are shaped by the lagoon, reef and ocean.',
            'North-east Rangiroa','https://www.google.com/maps/search/?api=1&query=Avatoru+Rangiroa',
            'https://tahititourisme.pf/en-pf/activities/points-of-interest/passe-de-tiputa-rangiroa-en-en-pf-3337195/'
        ],
        [
            'fakarava','fakarava-biosphere-reserve','Fakarava Biosphere Reserve','landmark','PROTECTED NATURAL HERITAGE',
            'A protected atoll landscape recognised for its exceptional natural value.',
            'Fakarava is part of a UNESCO Biosphere Reserve, recognised for its natural environments and the relationship between island communities and their ecosystems. Visitors can help protect this fragile setting by following local rules and choosing responsible services.',
            'Fakarava atoll','https://www.google.com/maps/search/?api=1&query=Fakarava+Biosphere+Reserve',
            'https://tahititourisme.pf/en-pf/islands-and-archipelagos/tuamotu-islands/fakarava/what-to-do-in-fakarava/'
        ],
        [
            'fakarava','rotoava-weaving','Rotoava Weaving & Crafts','culture','LOCAL CRAFT',
            'Meet the craft traditions that connect everyday life with island materials.',
            'Craft workshops on Fakarava offer visitors a chance to learn about local weaving, including the making of hats from natural fibres. These skills are part of the atoll’s living cultural heritage; support local artisans and ask before photographing people or their work.',
            'Rotoava · Fakarava','https://www.google.com/maps/search/?api=1&query=Rotoava+Fakarava',
            'https://tahititourisme.pf/en-pf/islands-and-archipelagos/tuamotu-islands/fakarava/what-to-do-in-fakarava/'
        ],
        [
            'fakarava','pink-sand-motu','Pink-Sand Motu','hidden-gem','QUIET LAGOON LANDSCAPES',
            'A memorable natural setting within Fakarava’s wide lagoon.',
            'Fakarava’s pink-sand motu are among the natural scenes highlighted by local tourism information. A locally organised day outing can help visitors appreciate the atoll’s scale and fragile shoreline while following guidance on waste, wildlife and reef protection.',
            'Fakarava lagoon','https://www.google.com/maps/search/?api=1&query=Pink+Sand+Beach+Fakarava',
            'https://tahititourisme.pf/en-pf/islands-and-archipelagos/tuamotu-islands/fakarava/what-to-do-in-fakarava/'
        ],
    ];

    foreach ($entries as $entry) {
        [$island, $slug, $title, $type, $kicker, $excerpt, $body, $location, $map, $source] = $entry;
        if (get_page_by_path($slug, OBJECT, 'iot_highlight')) { continue; }
        $id = wp_insert_post([
            'post_type' => 'iot_highlight',
            'post_status' => 'publish',
            'post_title' => $title,
            'post_name' => $slug,
            'post_excerpt' => $excerpt,
            'post_content' => '<p>' . esc_html($body) . '</p>',
        ], true);
        if (is_wp_error($id)) { continue; }
        update_post_meta($id, 'gtc_highlight_kicker', sanitize_text_field($kicker));
        update_post_meta($id, 'gtc_highlight_location', sanitize_text_field($location));
        update_post_meta($id, 'gtc_highlight_map_url', esc_url_raw($map));
        update_post_meta($id, 'gtc_highlight_source_url', esc_url_raw($source));
        wp_set_object_terms($id, $island, 'iot_highlight_island', false);
        wp_set_object_terms($id, $type, 'iot_highlight_type', false);
    }
}
add_action('admin_init', 'gtc_seed_island_editorial_pack', 50);
