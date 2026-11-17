import { useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowRight, Search, Menu, X, Send, Sparkles, MapPin } from 'lucide-react';
import { experiences } from './data';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const scenes = [
  { image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2200&q=90', title: 'Tahiti', label: 'TAHITI · SOCIETY ISLANDS' },
  { image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=2200&q=90', title: 'Moorea', label: 'MOOREA · SOCIETY ISLANDS' },
  { image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=90', title: 'Bora Bora', label: 'BORA BORA · SOCIETY ISLANDS' },
  { image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=2200&q=90', title: 'Huahine', label: 'HUAHINE · SOCIETY ISLANDS' },
  { image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2200&q=90', title: 'Raiatea', label: 'RAIATEA · SOCIETY ISLANDS' },
  { image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2200&q=90', title: 'Taha’a', label: 'TAHA’A · SOCIETY ISLANDS' },
  { image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2200&q=90', title: 'Rangiroa', label: 'RANGIROA · TUAMOTU ISLANDS' },
  { image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2200&q=90', title: 'Fakarava', label: 'FAKARAVA · TUAMOTU ISLANDS' }
];

const islandDetails = [
  { name: 'Tahiti', slug:'tahiti', archipelago:'Society Islands', tag: 'The vibrant heart', kind: 'Culture · Peaks · City life', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=85', description: 'Black-sand shores, green valleys and the energy of Papeete meet beneath the island’s volcanic peaks.', places:['Papeete Market and waterfront','Point Venus and its black-sand coast','Vaipahi Water Gardens','Papenoo Valley and its waterfalls'], activities:['Explore local markets and museums','Discover the island by guided nature tour','Enjoy coastal viewpoints and cultural experiences'], mapNote:'Tahiti is the main island and the gateway to French Polynesia.' },
  { name: 'Moorea', slug:'moorea', archipelago:'Society Islands', tag: 'A garden in the sea', kind: 'Bays · Mountains · Lagoon', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1400&q=85', description: 'Twin bays, pineapple fields and dramatic green peaks shape this island’s unforgettable landscape.', places:['Cook’s Bay','Opunohu Bay','Belvedere Lookout','Tiahura lagoon area'], activities:['Take a lagoon excursion','Explore mountain trails and viewpoints','Discover pineapple plantations and local food'], mapNote:'Moorea lies about 17 km northwest of Tahiti and is connected by regular boat services.' },
  { name: 'Bora Bora', slug:'bora-bora', archipelago:'Society Islands', tag: 'The iconic lagoon', kind: 'Lagoon · Motu · Heritage', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85', description: 'A luminous lagoon surrounds small motu islets beneath the unmistakable silhouette of Mount Otemanu.', places:['Matira Beach','Mount Otemanu viewpoints','Vaitape village','Lagoon coral gardens'], activities:['Explore the lagoon by boat','Snorkel in designated areas with a local guide','Discover island heritage and local crafts'], mapNote:'Bora Bora is part of the Leeward Islands in the Society archipelago.' },
  { name: 'Huahine', slug:'huahine', archipelago:'Society Islands', tag: 'The secret island', kind: 'Villages · Archaeology · Nature', image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1400&q=85', description: 'A quieter island of lush landscapes, traditional villages and important cultural heritage sites.', places:['Maeva archaeological area','Fare village','Faie village','Hana Iti Beach'], activities:['Visit marae and heritage sites with a local guide','Explore the island’s villages','Enjoy lagoon and nature outings'], mapNote:'Huahine is made up of Huahine Nui and Huahine Iti, linked by a bridge.' },
  { name: 'Raiatea', slug:'raiatea', archipelago:'Society Islands', tag: 'The sacred island', kind: 'Heritage · Sailing · Green valleys', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=85', description: 'Explore deep cultural roots, green valleys and the waters shared with neighbouring Taha’a.', places:['Taputapuātea Marae','Uturoa town and market','Faaroa River','Faaroa botanical garden'], activities:['Discover Polynesian heritage at Taputapuātea','Take a boat or kayak outing on Faaroa River','Explore green valleys and coastal scenery'], mapNote:'Raiatea shares a lagoon with neighbouring Taha’a.' },
  { name: 'Taha’a', slug:'tahaa', archipelago:'Society Islands', tag: 'The vanilla island', kind: 'Vanilla · Motu · Lagoon', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=85', description: 'A tranquil island known for fragrant vanilla, quiet motu and a beautiful shared lagoon.', places:['Vanilla plantations','Taha’a coral garden','Motu Ceran area','Traditional villages'], activities:['Learn how local vanilla is cultivated','Explore the coral garden with a licensed local operator','Take a motu and lagoon excursion'], mapNote:'Taha’a shares its lagoon with Raiatea and is reached by boat or domestic air connections.' },
  { name: 'Rangiroa', slug:'rangiroa', archipelago:'Tuamotu Archipelago', tag: 'A world of blue', kind: 'Atoll · Ocean · Marine life', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=85', description: 'A vast coral atoll where lagoon life, small villages and the open ocean shape a very different island rhythm.', places:['Avatoru village','Tiputa Pass','Blue Lagoon','Île aux Récifs'], activities:['Discover the lagoon by boat','Explore the villages by bicycle','Choose guided marine and nature experiences'], mapNote:'Rangiroa is one of the Tuamotu atolls, reached by domestic flight from Tahiti.' },
  { name: 'Fakarava', slug:'fakarava', archipelago:'Tuamotu Archipelago', tag: 'The wild atoll', kind: 'Biosphere · Lagoon · Nature', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1400&q=85', description: 'A remarkable atoll recognised for its exceptional natural environment and fragile marine ecosystems.', places:['Garuae Pass','Tetamanu village area','Pink-sand motu','Rotoava village'], activities:['Explore the atoll by bicycle or kayak','Discover the lagoon with local guides','Learn about the protected biosphere environment'], mapNote:'Fakarava is part of the Tuamotu Archipelago and is known for its protected natural environment.' }
];

const placeDetails = [
  { slug:'heiva', title:'Heiva i Tahiti', island:'Tahiti', islandSlug:'tahiti', category:'Culture · Dance · Heritage', location:'Papeete and festival venues across Tahiti', description:'A major celebration of Polynesian culture through traditional dance, music, sport and community gatherings. Festival venues and programme details vary by edition.', image:'https://www.tahititourisme.com/app/uploads/iris-images/25627/spectacle-de-ori-tahiti-au-heiva-i-tahiti-a-kmh-media-production-765x550-f50_50.webp', note:'Check the official annual programme for dates and exact performance locations.' },
  { slug:'market', title:'Papeete Market', island:'Tahiti', islandSlug:'tahiti', category:'Local life · Food · Crafts', location:'Marché de Papeete, central Papeete, Tahiti', description:'A lively central market where visitors can discover local produce, flowers, crafts, vanilla and flavours from across French Polynesia.', image:'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1400&q=85', note:'The market is in central Papeete. Check local opening hours before visiting.' },
  { slug:'vaa', title:'Hawaiki Nui Va’a', island:'Leeward Islands · Society Islands', islandSlug:'raiatea', category:'Ocean · Sport · Tradition', location:'Leeward Islands; race route and stages vary by year', description:'A celebrated outrigger canoe race across the Leeward Islands. Its route links islands including Huahine, Raiatea, Taha’a and Bora Bora; stages and schedules are edition-specific.', image:'https://www.tahititourisme.com/app/uploads/iris-images/26222/hawaiki-nui-vaa-a-steve-dickinson-5-380x600-f50_50.webp', note:'Use the official race programme for the current year’s route and spectator locations.' },
  { slug:'belvedere', title:'Belvedere Lookout', island:'Moorea', islandSlug:'moorea', category:'Nature · Viewpoint · Hiking', location:'Belvedere Lookout, Moorea, Society Islands', description:'A celebrated viewpoint above Moorea’s volcanic interior, with sweeping views towards Cook’s Bay, Opunohu Bay and the green mountain ridges.', image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85', note:'Road and trail conditions can change; check local guidance before setting out.' }
];

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const [activeCulture, setActiveCulture] = useState(new URLSearchParams(window.location.search).get('culture') === '1');
  const [activePlace, setActivePlace] = useState(() => new URLSearchParams(window.location.search).get('place'));
  const [activeIsland, setActiveIsland] = useState<(typeof islandDetails)[number] | null>(() => { const slug = new URLSearchParams(window.location.search).get('island'); return islandDetails.find(item => item.slug === slug) || null; });
  const openCulture = () => { window.history.pushState({}, '', window.location.pathname + '?culture=1'); setActiveIsland(null); setActivePlace(null); setActiveCulture(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const openPlace = (place: (typeof placeDetails)[number]) => { window.history.pushState({}, '', window.location.pathname + '?place=' + place.slug); setActiveCulture(false); setActiveIsland(null); setActivePlace(place.slug); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const openIsland = (island: (typeof islandDetails)[number]) => { window.history.pushState({}, '', `${window.location.pathname}?island=${island.slug}`); setActiveCulture(false); setActivePlace(null); setActiveIsland(island); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const closeIslandPage = () => { window.history.pushState({}, '', window.location.pathname); setActiveCulture(false); setActiveIsland(null); setActivePlace(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  useEffect(() => { const sync = () => { const params = new URLSearchParams(window.location.search); const slug = params.get('island'); setActiveIsland(islandDetails.find(item => item.slug === slug) || null); setActivePlace(params.get('place')); setActiveCulture(params.get('culture') === '1'); }; window.addEventListener('popstate', sync); return () => window.removeEventListener('popstate', sync); }, []);
  const [scene, setScene] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedIsland, setSelectedIsland] = useState<(typeof islandDetails)[number] | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideText, setGuideText] = useState('');
  const [guideReply, setGuideReply] = useState('Ia Ora Na! I can help you discover the islands and find inspiration for your journey.');
  const [menuOpen, setMenuOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true, lerp: 0.085 });
    let raf = 0;
    const tick = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  useEffect(() => {
    let previousY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 90 || currentY < previousY - 5) setNavVisible(true);
      else if (currentY > previousY + 5) setNavVisible(false);
      previousY = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setScene(s => (s + 1) % scenes.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.from('.blue-opening-inner > *', { y: 35, opacity: 0, duration: 1, stagger: 0.14, ease: 'power3.out' });
    gsap.utils.toArray<HTMLElement>('.reveal').forEach(el => gsap.from(el, {
      y: 48, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%' }
    }));
    gsap.fromTo('.thread-dash', { strokeDashoffset: 1000, opacity: 0.15 }, {
      strokeDashoffset: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: '.island-discovery', start: 'top 82%', end: 'bottom 25%', scrub: 1 }
    });
    gsap.utils.toArray<HTMLElement>('.parallax-image, .scene img').forEach(img => gsap.to(img, {
      yPercent: -10, ease: 'none', scrollTrigger: { trigger: img.closest('section') || img, scrub: true }
    }));
  }, { scope: root });

  useEffect(() => {
    if (!selectedIsland && !guideOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedIsland(null);
        setGuideOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedIsland, guideOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return [...islandDetails.map(item => ({...item, resultType:'island'})), ...experiences.map(item => ({...item, resultType:'experience'})), ...placeDetails.map(item => ({...item, name:item.title, resultType:'place'}))].filter((item: any) =>
      [item.name, item.tag, item.kind, item.description, item.title, item.copy, item.location, item.island, ...(item.places || []), ...(item.activities || [])].filter(Boolean).join(' ').toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  const sendGuide = async (value = guideText) => {
    const q = value.trim().toLowerCase();
    if (!q) return;
    setGuideReply('One moment — let me check that for you…');
    setGuideText('');
    if (/(weather|temperature|\btemp\b|hot|warm|rain|forecast|degrees|°c)/i.test(q)) {
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-17.535&longitude=-149.569&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=Pacific%2FTahiti');
        if (!response.ok) throw new Error('Weather service unavailable');
        const data = await response.json();
        const current = data.current;
        const labels: Record<number,string> = {0:'clear sky',1:'mainly clear',2:'partly cloudy',3:'overcast',45:'foggy',48:'foggy',51:'light drizzle',53:'drizzle',55:'heavy drizzle',61:'light rain',63:'rain',65:'heavy rain',80:'rain showers',81:'rain showers',82:'heavy rain showers',95:'thunderstorms',96:'thunderstorms',99:'thunderstorms'};
        const condition = labels[current.weather_code] || 'changing conditions';
        setGuideReply('Right now in Papeete, Tahiti: ' + Math.round(current.temperature_2m) + '°C, feels like ' + Math.round(current.apparent_temperature) + '°C, with ' + condition + '. Humidity is ' + Math.round(current.relative_humidity_2m) + '% and wind is ' + Math.round(current.wind_speed_10m) + ' km/h. This is live weather for Tahiti — other islands can be different.');
      } catch {
        setGuideReply('I could not reach the live weather service just now. For the most accurate current temperature, check the weather for Papeete, Tahiti. Conditions can differ across the islands.');
      }
    } else if (/(bora|otemanu)/i.test(q)) setGuideReply('Bora Bora is famous for its turquoise lagoon, small motu islets and Mount Otemanu. You can explore Vaitape, Matira Beach and the lagoon with a licensed local operator.');
    else if (/moorea/i.test(q)) setGuideReply('Moorea is known for Cook’s Bay, Opunohu Bay, green volcanic peaks and the Belvedere Lookout. Visitors often enjoy lagoon trips, local food and guided nature walks.');
    else if (/huahine/i.test(q)) setGuideReply('Huahine is a quieter Society Island with traditional villages and important archaeological sites around Maeva. It is a lovely choice for culture, history and a slower island pace.');
    else if (/raiatea/i.test(q)) setGuideReply('Raiatea is deeply connected to Polynesian heritage. Taputapuātea, a UNESCO World Heritage site, is one of its most important cultural places. The island also has green valleys and the Faaroa River.');
    else if (/taha.?a/i.test(q)) setGuideReply('Taha’a is often called the vanilla island. It shares a lagoon with Raiatea and is known for vanilla farms, quiet motu and lagoon excursions.');
    else if (/rangiroa/i.test(q)) setGuideReply('Rangiroa is a vast atoll in the Tuamotu archipelago, known for its immense lagoon, Tiputa Pass and small island communities. Explore with local guides and respect marine-life rules.');
    else if (/fakarava/i.test(q)) setGuideReply('Fakarava is a protected biosphere atoll in the Tuamotu archipelago, celebrated for its lagoon and fragile natural environment. Choose responsible local operators.');
    else if (/tahiti|papeete/i.test(q)) setGuideReply('Tahiti is the main gateway to French Polynesia. In Papeete you can visit the market and waterfront, while the island also offers black-sand beaches, waterfalls and green valleys.');
    else if (/culture|dance|heiva|tradition|heritage/i.test(q)) setGuideReply('Polynesian culture is lived through language, dance, music, navigation, craft, food and community gatherings. Heiva i Tahiti is a major annual celebration; dates and venues vary each year.');
    else if (/plan|trip|itinerary|visit|where should/i.test(q)) setGuideReply('Start by choosing your travel mood: culture and city life on Tahiti, dramatic bays on Moorea, lagoon scenery in Bora Bora, heritage on Raiatea and Huahine, or wide-open atolls in Rangiroa and Fakarava. Travel times and inter-island transport should be checked with official operators.');
    else if (/activity|activities|snorkel|hike|boat|things to do/i.test(q)) setGuideReply('Popular experiences include guided lagoon outings, cultural and food tours, mountain viewpoints, village markets and nature walks. Always follow local guidance and use licensed operators for water activities.');
    else if (/map|location|where is/i.test(q)) setGuideReply('Use the island map section to choose one of the eight featured islands. Each island page includes a Google Maps view and links to explore nearby places.');
    else setGuideReply('I can answer common questions about the eight featured islands, local culture, activities, trip ideas and the current weather in Papeete. Try asking “What is the temperature in Tahiti?” or “What can I do in Moorea?”');
  };

  const activePlaceData = placeDetails.find(place => place.slug === activePlace);

  return <div className="site-v2" ref={root}>
    <div className="topline"><span>THE ISLANDS OF TAHITI</span><span>FRENCH POLYNESIA · SOUTH PACIFIC</span><span>DISCOVER THE BLUE</span></div>
    {!activeIsland && !activePlaceData && !activeCulture && <header className={navVisible ? "main-nav nav-visible" : "main-nav nav-hidden"}>
      <a className="wordmark" href="#home"><span className="wordmark-symbol">T</span><span>TAHITI<small>ISLANDS OF</small></span></a>
      <nav className={menuOpen ? 'nav-items is-open' : 'nav-items'}>
        <a href="#islands" onClick={() => setMenuOpen(false)}>The islands</a>
        <a href="#experiences" onClick={() => setMenuOpen(false)}>Experiences</a>
        <a href="#culture" onClick={() => setMenuOpen(false)}>Culture & nature</a>
      </nav>
      <div className="nav-right">
        <label className="nav-search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search islands, places, experiences..." aria-label="Search the site"/>{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={14}/></button>}</label>
        <a className="nav-plan" href="#islands">Find your island <ArrowRight size={15}/></a>
        <button className="nav-menu" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle navigation">{menuOpen ? <X/> : <Menu/>}</button>
      </div>
      {query && <div className="search-suggestions">{results.length ? results.map((item: any, i) => <a key={i} href={item.name ? '#islands' : '#experiences'} onClick={() => { if (item.resultType === 'island') openIsland(item); else if (item.resultType === 'place') openPlace(item); else document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' }); setQuery(''); }}><span>{item.name || item.title}</span><small>{item.tag || item.kind || item.type}</small><ArrowRight size={15}/></a>) : <p>No matches yet. Try an island, a place or an experience.</p>}</div>}
    </header>}

    {activeCulture ? <main className="culture-detail-page">
      <div className="detail-topbar"><button onClick={closeIslandPage}><ArrowRight size={15}/> BACK TO DISCOVERY</button><span>CULTURE · NATURE · ISLAND LIFE</span></div>
      <section className="culture-detail-heading"><span className="section-kicker">THE ISLANDS BEYOND THE VIEW</span><h1>A culture<br/><em>that moves with the sea.</em></h1><p>Meet the traditions, places and people that give every island its own rhythm. Choose a story to discover where it belongs.</p></section>
      <section className="culture-detail-grid">
        <button onClick={() => openPlace(placeDetails[0])}><img src={placeDetails[0].image} alt="Heiva i Tahiti dance"/><span>TAHITI · CULTURE</span><h2>Heiva i Tahiti</h2><small>Dance, celebration and heritage <ArrowRight size={14}/></small></button>
        <button onClick={() => openPlace(placeDetails[1])}><img src={placeDetails[1].image} alt="Papeete Market"/><span>TAHITI · LOCAL LIFE</span><h2>Papeete Market</h2><small>Flavours, crafts and colour <ArrowRight size={14}/></small></button>
        <button onClick={() => openPlace(placeDetails[2])}><img src={placeDetails[2].image} alt="Hawaiki Nui Va’a canoe race"/><span>LEEWARD ISLANDS · OCEAN</span><h2>Hawaiki Nui Va’a</h2><small>A race across island waters <ArrowRight size={14}/></small></button>
        <button onClick={() => openPlace(placeDetails[3])}><img src={placeDetails[3].image} alt="Moorea Belvedere landscape"/><span>MOOREA · NATURE</span><h2>Belvedere Lookout</h2><small>Mountain views and green valleys <ArrowRight size={14}/></small></button>
      </section>
    </main> : activePlaceData ? <main className="place-detail-page" id="place-detail">
      <div className="detail-topbar"><button onClick={closeIslandPage}><ArrowRight size={15}/> BACK TO DISCOVERY</button><span>PLACE DISCOVERY · FRENCH POLYNESIA</span></div>
      <section className="place-detail-hero"><img src={activePlaceData.image} alt={activePlaceData.title}/><div className="place-detail-shade"/><div className="place-detail-heading"><span>{activePlaceData.category} · {activePlaceData.island.toUpperCase()}</span><h1>{activePlaceData.title}</h1><p>{activePlaceData.location}</p></div></section>
      <section className="place-detail-copy"><span className="section-kicker">THE STORY BEHIND THE PLACE</span><h2>A moment<br/><em>to remember.</em></h2><p>{activePlaceData.description}</p><div className="place-location"><MapPin/><div><strong>WHERE TO FIND IT</strong><span>{activePlaceData.location}</span><small>{activePlaceData.note}</small></div></div><a href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(activePlaceData.location + ' French Polynesia')} target="_blank" rel="noreferrer">OPEN THIS LOCATION IN GOOGLE MAPS <ArrowRight size={15}/></a><button className="place-island-link" onClick={() => openIsland(islandDetails.find(i => i.slug === activePlaceData.islandSlug)!)}>EXPLORE THE {activePlaceData.island.toUpperCase()} ISLAND PAGE <ArrowRight size={15}/></button></section>
    </main> : activeIsland ? <main className="island-detail-page" id="island-detail">
      <div className="detail-topbar"><button onClick={closeIslandPage}><ArrowRight size={15}/> BACK TO ALL ISLANDS</button><span>{activeIsland.archipelago} · FRENCH POLYNESIA</span></div>
      <section className="detail-hero"><img src={activeIsland.image} alt={`${activeIsland.name} island landscape`} /><div className="detail-hero-shade"/><div className="detail-hero-copy"><span>{activeIsland.kind}</span><h1>{activeIsland.name}</h1><p>{activeIsland.tag}</p></div><div className="detail-hero-index">THE ISLANDS OF TAHITI<br/>DISCOVERY SERIES / 0{islandDetails.findIndex(i=>i.slug===activeIsland.slug)+1}</div></section>
      <section className="detail-intro"><span className="section-kicker">A CLOSER LOOK · {activeIsland.archipelago.toUpperCase()}</span><h2>Find your own<br/><em>island rhythm.</em></h2><p>{activeIsland.description} {activeIsland.mapNote}</p></section>
      <section className="detail-explore"><div className="detail-section-heading"><span className="section-kicker">PLACES TO DISCOVER</span><h2>Let curiosity<br/><em>lead the way.</em></h2></div><div className="detail-place-grid">{activeIsland.places.map((place,i)=><a key={place} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place+', '+activeIsland.name+', French Polynesia')}`} target="_blank" rel="noreferrer"><span>0{i+1}</span><strong>{place}</strong><small>OPEN IN GOOGLE MAPS <ArrowRight size={13}/></small></a>)}</div></section>
      <section className="detail-activities"><div><span className="section-kicker-light">EXPERIENCE THE ISLAND</span><h2>Make room for<br/><em>the unexpected.</em></h2></div><div className="detail-activity-list">{activeIsland.activities.map((activity,i)=><p key={activity}><span>0{i+1}</span>{activity}</p>)}</div></section>
      <section className="detail-map"><div className="detail-map-copy"><span className="section-kicker">FIND YOUR WAY</span><h2>Meet me<br/><em>on the map.</em></h2><p>{activeIsland.mapNote} Open the map to explore the island and nearby places. Inter-island transfers should be checked separately with local transport operators.</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeIsland.name+', French Polynesia')}`} target="_blank" rel="noreferrer">OPEN GOOGLE MAPS <ArrowRight size={15}/></a></div><iframe title={`${activeIsland.name} on Google Maps`} src={`https://www.google.com/maps?q=${encodeURIComponent(activeIsland.name+', French Polynesia')}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></section>
      <section className="detail-next"><span>KEEP EXPLORING</span><div>{islandDetails.filter(i=>i.slug!==activeIsland.slug).slice(0,3).map(i=><button key={i.slug} onClick={()=>openIsland(i)}>{i.name}<ArrowRight size={15}/></button>)}</div></section>
    </main> : <main id="home">
      <section className="moving-gallery" aria-label="Changing scenes of the islands">
        {scenes.map((s, i) => <div key={s.label} className={i === scene ? 'scene is-active' : 'scene'}><img src={s.image} alt={s.label} /><div className="scene-shade"/></div>)}
        <div className="hero-editorial-title"><span>THE ISLANDS OF TAHITI</span><h1>Not just a place.<br/><em>A world to feel.</em></h1></div>
        <p className="hero-editorial-caption">From the pulse of island culture to volcanic valleys, quiet lagoons and open-ocean horizons — discover a world shaped by its people, traditions and extraordinary nature.</p>
        <div className="scene-dots">{scenes.map((s, i) => <button key={s.label} className={i === scene ? 'active' : ''} onClick={() => setScene(i)} aria-label={'Show scene ' + (i + 1)}/>)}</div>
      </section>

      <section className="island-discovery" id="islands">
        <div className="island-heading reveal"><div><span className="section-kicker">02 / FIND YOUR ISLAND</span><h2>Eight islands.<br/><em>Infinite shades of blue.</em></h2></div><p>Move across the constellation. Choose an island and let its story unfold.</p></div>
        <div className="island-constellation">
          <svg className="constellation-lines" viewBox="0 0 1000 720" preserveAspectRatio="none" aria-hidden="true"><path d="M90 170 C220 20 330 300 470 150 S740 40 900 210 S760 520 600 430 S300 600 90 540" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 9"/><path className="thread-dash" d="M90 170 C220 20 330 300 470 150 S740 40 900 210 S760 520 600 430 S300 600 90 540" fill="none" stroke="#d38f70" strokeWidth="2.2" pathLength="1000" strokeDasharray="1000" strokeDashoffset="1000"/></svg>
          {islandDetails.map((island, i) => <button key={island.name} className={'island-orbit island-orbit-' + (i + 1)} onClick={() => openIsland(island)} onMouseEnter={e => e.currentTarget.classList.add('hovered')} onMouseLeave={e => e.currentTarget.classList.remove('hovered')}>
            <img src={island.image} alt=""/><span className="island-orbit-shade"/><span className="orbit-index">0{i + 1}</span><span className="orbit-title">{island.name}</span><span className="orbit-explore">EXPLORE <ArrowRight size={13}/></span>
          </button>)}
        </div>
        <div className="constellation-motivation"><span>LET THE BLUE GUIDE YOU</span><strong>Every island<br/><em>has a story.</em></strong><small>Find the one that feels like yours.</small></div><p className="constellation-caption"><MapPin size={13}/> SELECT AN ISLAND TO DISCOVER ITS STORY</p>
      </section>

      {selectedIsland && <div className="island-modal" role="dialog" aria-modal="true" aria-label={selectedIsland.name} onClick={() => setSelectedIsland(null)}><div className="island-modal-card" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelectedIsland(null)} aria-label="Close island details"><X/></button><img src={selectedIsland.image} alt={selectedIsland.name}/><div className="modal-copy"><span className="section-kicker">{selectedIsland.kind}</span><h2>{selectedIsland.name}</h2><h3>{selectedIsland.tag}</h3><p>{selectedIsland.description}</p><button onClick={() => { setSelectedIsland(null); document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' }); }}>DISCOVER EXPERIENCES <ArrowRight size={16}/></button></div></div></div>}

      <section className="experience-section" id="experiences"><div className="experience-heading reveal"><span className="section-kicker-light">03 / CHOOSE YOUR EXPERIENCE</span><h2>Discover what<br/><em>calls to you.</em></h2><p>From lagoon days to mountain trails, find an experience that brings the islands closer.</p></div>
        <div className="experience-rows">{experiences.map((e, i) => <article className="experience-item reveal" key={e.n}><span>{e.n}</span><div><small>{e.type}</small><h3>{e.title}</h3><p>{e.copy}</p></div><img src={e.image} alt=""/><ArrowRight className="experience-arrow"/></article>)}</div>
      </section>


      <section className="archipelago-map" id="map"><div className="map-intro"><span className="section-kicker">03 / FIND YOUR WAY</span><h2>Eight islands.<br/><em>One living map.</em></h2><p>Explore the archipelago, choose an island and open its location in Google Maps.</p></div><div className="map-layout"><iframe title="The Islands of Tahiti map" src="https://www.google.com/maps?q=The+Islands+of+Tahiti+French+Polynesia&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/><div className="map-island-list">{islandDetails.map((island,i)=><button key={island.slug} onClick={()=>openIsland(island)}><span>0{i+1}</span><strong>{island.name}</strong><small>{island.archipelago}</small><ArrowRight size={15}/></button>)}</div></div><p className="map-footnote">Google Maps is provided for geographic orientation. Sea and air connections between islands are not represented as guaranteed routes.</p></section>

      <section className="culture-section" id="culture"><div className="culture-image"><img className="parallax-image" src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1800&q=90" alt="Ocean waves"/></div><div className="culture-copy reveal"><span className="section-kicker">04 / MORE THAN A VIEW</span><h2>A culture<br/>that moves<br/><em>with the sea.</em></h2><p>Here, heritage lives in language, dance, navigation, craft, food and the generous spirit of the people who call these islands home.</p><button className="culture-open" onClick={openCulture}>EXPLORE CULTURE & NATURE <ArrowRight size={16}/></button></div><div className="culture-script">TE FENUA<br/>TE MOANA<small>THE LAND · THE OCEAN</small></div></section>


      <section className="island-life" id="island-life">
        <div className="island-life-heading reveal"><span className="section-kicker">05 / THE ISLANDS IN MOTION</span><h2>Feel the life<br/><em>between the waves.</em></h2><p>Tradition, celebration and adventure are part of everyday island life.</p></div>
        <div className="life-mosaic">
          <button className="life-photo life-photo-main" onClick={() => openPlace(placeDetails[0])}><img src="https://www.tahititourisme.com/app/uploads/iris-images/25627/spectacle-de-ori-tahiti-au-heiva-i-tahiti-a-kmh-media-production-765x550-f50_50.webp" alt="Ori Tahiti dancers performing at Heiva i Tahiti"/><div><small>CULTURE · HEIVA I TAHITI</small><h3>When the islands dance</h3><span className="life-open">DISCOVER THIS PLACE ↗</span></div></button>
          <button className="life-photo life-photo-market" onClick={() => openPlace(placeDetails[1])}><img src="https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1100&q=85" alt="Colourful market produce"/><div><small>FLAVOURS · PAPEETE</small><h3>Meet the rhythm of the market</h3><span className="life-open">DISCOVER THIS PLACE ↗</span></div></button>
          <button className="life-photo life-photo-ocean" onClick={() => openPlace(placeDetails[2])}><img src="https://www.tahititourisme.com/app/uploads/iris-images/26222/hawaiki-nui-vaa-a-steve-dickinson-5-380x600-f50_50.webp" alt="Hawaiki Nui Va’a outrigger canoe race"/><div><small>OCEAN · HAWAIKI NUI VA’A</small><h3>Follow the ocean voyagers</h3><span className="life-open">DISCOVER THIS PLACE ↗</span></div></button>
          <button className="life-photo life-photo-trails" onClick={() => openPlace(placeDetails[3])}><img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85" alt="Mountain trail landscape"/><div><small>NATURE · ADVENTURE</small><h3>Find your way into the green</h3><span className="life-open">DISCOVER THIS PLACE ↗</span></div></button>
        </div>
        <p className="life-credit">Festival imagery: Tahiti Tourisme · Heiva i Tahiti, KMH Media Production. Event and activity details should be checked against official listings.</p>
      </section>
\n      <section className="journey-cta" id="journey"><div className="journey-copy reveal"><span className="section-kicker-light">YOUR STORY STARTS HERE</span><h2>Let the islands<br/><em>find you.</em></h2><p>Start with a feeling. Follow it across the blue.</p><a href="#islands">EXPLORE THE ARCHIPELAGO <ArrowRight size={16}/></a></div><div className="journey-image"><img className="parallax-image" src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=90" alt="Island lagoon"/></div></section>
    </main>}

    <footer className="site-footer"><a className="wordmark footer-mark" href="#home"><span className="wordmark-symbol">T</span><span>TAHITI<small>ISLANDS OF</small></span></a><p>THE ISLANDS OF TAHITI · FRENCH POLYNESIA</p><div className="footer-note">AN INDEPENDENT REDESIGN CONCEPT — NOT COMMISSIONED, APPROVED OR ENDORSED BY TAHITI TOURISME.<br/>DESIGNED & DEVELOPED BY GRACEON DIGITAL STUDIO</div></footer>

    <button className="guide-launcher" onClick={() => setGuideOpen(v => !v)} aria-label="Open GRACEON island guide" aria-expanded={guideOpen} aria-controls="island-guide-panel"><span className="guide-orbit"><Sparkles size={20}/></span><span className="guide-pulse"/></button>
    {guideOpen && <aside className="guide-panel" id="island-guide-panel" role="dialog" aria-label="GRACEON island guide"><div className="guide-header"><span className="guide-avatar"><Sparkles size={18}/></span><div><strong>Island Guide</strong><small>GRACEON · TAHITI DISCOVERY</small></div><button onClick={() => setGuideOpen(false)} aria-label="Close guide"><X/></button></div><div className="guide-search-wrap"><label><Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search islands, places, activities..." aria-label="Search islands and places"/></label>{query && <div className="guide-search-results">{results.length ? results.map((item: any, i) => <button key={i} onClick={() => { if (item.resultType === 'island') openIsland(item); else if (item.resultType === 'place') openPlace(item); else { setGuideOpen(false); document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' }); } setQuery(''); }}><span>{item.name || item.title}</span><small>{item.tag || item.kind || item.type}</small><ArrowRight size={13}/></button>) : <p>No matches found. Try an island or activity.</p>}</div>}</div><div className="guide-body"><p className="guide-greeting">{guideReply}</p><div className="guide-prompts"><button onClick={() => sendGuide('Tell me about Bora Bora')}>Discover Bora Bora</button><button onClick={() => sendGuide('What is the temperature in Tahiti?')}>Weather in Tahiti</button><button onClick={() => sendGuide('Tell me about culture')}>Culture & heritage</button></div></div><form className="guide-input" onSubmit={e => { e.preventDefault(); sendGuide(); }}><input value={guideText} onChange={e => setGuideText(e.target.value)} placeholder="Ask about islands, weather, places..." aria-label="Ask the island guide"/><button aria-label="Send message"><Send size={17}/></button></form><small className="guide-disclaimer">Travel discovery assistant · Weather is live for Papeete; other answers use destination information.</small></aside>}
  </div>;
}
