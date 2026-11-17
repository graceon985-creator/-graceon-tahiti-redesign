import { useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowDown, ArrowRight, Search, Menu, X, Send, Sparkles, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { experiences } from './data';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const scenes = [
  { image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2200&q=90', title: 'A thousand shades of blue', label: 'THE PACIFIC, UNFOLDED' },
  { image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=2200&q=90', title: 'Find your own horizon', label: 'MOOREA · FRENCH POLYNESIA' },
  { image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=90', title: 'Let the islands move you', label: 'BORA BORA · SOUTH PACIFIC' }
];

const islandDetails = [
  { name: 'Tahiti', tag: 'The vibrant heart', kind: 'Culture · Peaks · City life', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=85', description: 'Black-sand shores, green valleys and the energy of Papeete meet beneath the island’s volcanic peaks.' },
  { name: 'Moorea', tag: 'A garden in the sea', kind: 'Bays · Mountains · Lagoon', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=900&q=85', description: 'Twin bays, pineapple fields and dramatic green peaks shape this island’s unforgettable landscape.' },
  { name: 'Bora Bora', tag: 'The iconic lagoon', kind: 'Lagoon · Motu · Heritage', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85', description: 'A luminous lagoon surrounds small motu islets beneath the unmistakable silhouette of Mount Otemanu.' },
  { name: 'Huahine', tag: 'The secret island', kind: 'Villages · Archaeology · Nature', image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=900&q=85', description: 'A quieter island of lush landscapes, traditional villages and important cultural heritage sites.' },
  { name: 'Raiatea', tag: 'The sacred island', kind: 'Heritage · Sailing · Green valleys', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=85', description: 'Explore deep cultural roots, green valleys and the waters shared with neighbouring Taha’a.' },
  { name: 'Taha’a', tag: 'The vanilla island', kind: 'Vanilla · Motu · Lagoon', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=85', description: 'A tranquil island known for fragrant vanilla, quiet motu and a beautiful shared lagoon.' },
  { name: 'Rangiroa', tag: 'A world of blue', kind: 'Atoll · Ocean · Marine life', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=85', description: 'One of the great atolls of the Tuamotu, with a vast lagoon and extraordinary ocean life.' },
  { name: 'Fakarava', tag: 'The wild atoll', kind: 'Biosphere · Lagoon · Nature', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=85', description: 'A remarkable atoll recognised for its exceptional natural environment and fragile marine ecosystems.' }
];

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIsland, setSelectedIsland] = useState<(typeof islandDetails)[number] | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideText, setGuideText] = useState('');
  const [guideReply, setGuideReply] = useState('Ia Ora Na! I can help you discover the islands and find inspiration for your journey.');
  const [menuOpen, setMenuOpen] = useState(false);

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
    if (paused) return;
    const timer = window.setInterval(() => setScene(s => (s + 1) % scenes.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused]);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.from('.blue-opening-inner > *', { y: 35, opacity: 0, duration: 1, stagger: 0.14, ease: 'power3.out' });
    gsap.utils.toArray<HTMLElement>('.reveal').forEach(el => gsap.from(el, {
      y: 48, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%' }
    }));
    gsap.to('.thread-dash', { strokeDashoffset: -900, duration: 24, repeat: -1, ease: 'none' });
    gsap.utils.toArray<HTMLElement>('.parallax-image').forEach(img => gsap.to(img, {
      yPercent: -10, ease: 'none', scrollTrigger: { trigger: img, scrub: true }
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
    return [...islandDetails, ...experiences].filter((item: any) =>
      [item.name, item.tag, item.kind, item.description, item.title, item.copy].filter(Boolean).join(' ').toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  const sendGuide = (value = guideText) => {
    const q = value.trim().toLowerCase();
    if (!q) return;
    if (q.includes('bora')) setGuideReply('Bora Bora is known for its remarkable lagoon and the dramatic Mount Otemanu. Explore the island to learn more.');
    else if (q.includes('moorea')) setGuideReply('Moorea is loved for its twin bays, lush mountain scenery and welcoming island atmosphere.');
    else if (q.includes('culture')) setGuideReply('Discover living Polynesian culture through language, dance, craft, food and heritage places across the islands.');
    else if (q.includes('plan') || q.includes('trip')) setGuideReply('A good first step is choosing the kind of experience you want: lagoons, nature, culture or a little of everything. Explore the islands above to compare.');
    else setGuideReply('I can help you explore Tahiti, Moorea, Bora Bora, Huahine, Raiatea, Taha’a, Rangiroa and Fakarava. Ask me about an island, culture or trip inspiration.');
    setGuideText('');
  };

  return <div className="site-v2" ref={root}>
    <div className="topline"><span>THE ISLANDS OF TAHITI</span><span>FRENCH POLYNESIA · SOUTH PACIFIC</span><span>DISCOVER THE BLUE</span></div>
    <header className="main-nav">
      <a className="wordmark" href="#home"><span className="wordmark-symbol">T</span><span>TAHITI<small>ISLANDS OF</small></span></a>
      <nav className={menuOpen ? 'nav-items is-open' : 'nav-items'}>
        <a href="#islands" onClick={() => setMenuOpen(false)}>The islands</a>
        <a href="#experiences" onClick={() => setMenuOpen(false)}>Experiences</a>
        <a href="#culture" onClick={() => setMenuOpen(false)}>Culture & nature</a>
      </nav>
      <div className="nav-right">
        <label className="nav-search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search Tahiti..." aria-label="Search the site"/>{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={14}/></button>}</label>
        <a className="nav-plan" href="#islands">Explore <ArrowRight size={15}/></a>
        <button className="nav-menu" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle navigation">{menuOpen ? <X/> : <Menu/>}</button>
      </div>
      {query && <div className="search-suggestions">{results.length ? results.map((item: any, i) => <a key={i} href={item.name ? '#islands' : '#experiences'} onClick={() => { if (item.name) setSelectedIsland(item); else document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' }); setQuery(''); }}><span>{item.name || item.title}</span><small>{item.tag || item.kind || item.type}</small><ArrowRight size={15}/></a>) : <p>No matches yet. Try “lagoon”, “culture” or an island name.</p>}</div>}
    </header>

    <main id="home">
      <section className="blue-opening">
        <div className="blue-opening-inner">
          <p className="eyebrow-light"><span/> THE SOUTH PACIFIC · 118 ISLANDS & ATOLLS</p>
          <h1>There is a blue<br/>that <em>stays with you.</em></h1>
          <p className="blue-lead">A world of islands, living culture and endless ocean. Your journey begins in The Islands of Tahiti.</p>
          <a href="#islands" className="opening-discover">DISCOVER TAHITI <span><ArrowDown size={18}/></span></a>
        </div>
        <div className="opening-coordinate">17°40′S<br/>149°25′W</div>
        <div className="opening-bottom"><span>IA ORA NA</span><span>FRENCH POLYNESIA</span><span>01 / THE JOURNEY</span></div>
      </section>

      <section className="moving-gallery" aria-label="Changing scenes of the islands">
        {scenes.map((s, i) => <div key={s.label} className={i === scene ? 'scene is-active' : 'scene'}><img src={s.image} alt={s.label} /><div className="scene-shade"/></div>)}
        <div className="scene-copy"><span className="section-kicker-light">{scenes[scene].label}</span><h2>{scenes[scene].title}</h2><p>LET THE OCEAN SET THE PACE</p>
          <div className="scene-controls"><button onClick={() => setScene(s => (s + scenes.length - 1) % scenes.length)} aria-label="Previous scene"><ChevronLeft/></button><button onClick={() => setPaused(p => !p)} aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}>{paused ? 'PLAY' : 'PAUSE'}</button><button onClick={() => setScene(s => (s + 1) % scenes.length)} aria-label="Next scene"><ChevronRight/></button><span>0{scene + 1} / 0{scenes.length}</span></div>
        </div>
        <div className="scene-dots">{scenes.map((s, i) => <button key={s.label} className={i === scene ? 'active' : ''} onClick={() => setScene(i)} aria-label={'Show scene ' + (i + 1)}/>)}</div>
      </section>

      <section className="intro-story reveal">
        <span className="section-kicker">01 / THE ARCHIPELAGO</span>
        <div><h2>Not just a place.<br/><em>A different way of feeling.</em></h2><p>Scattered across the South Pacific, the islands of Tahiti invite you to move with the rhythm of the ocean — from volcanic peaks and deep valleys to coral gardens and welcoming villages.</p></div>
        <div className="intro-number"><strong>118</strong><span>ISLANDS & ATOLLS<br/>FIVE ARCHIPELAGOS</span></div>
      </section>

      <section className="island-discovery" id="islands">
        <div className="island-heading reveal"><div><span className="section-kicker">02 / FIND YOUR ISLAND</span><h2>Eight islands.<br/><em>Infinite shades of blue.</em></h2></div><p>Move across the constellation. Choose an island and let its story unfold.</p></div>
        <div className="island-constellation">
          <svg className="constellation-lines" viewBox="0 0 1000 720" preserveAspectRatio="none" aria-hidden="true"><path d="M90 170 C220 20 330 300 470 150 S740 40 900 210 S760 520 600 430 S300 600 90 540" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 9"/><path className="thread-dash" d="M90 170 C220 20 330 300 470 150 S740 40 900 210 S760 520 600 430 S300 600 90 540" fill="none" stroke="#d38f70" strokeWidth="2.2" strokeDasharray="7 13"/></svg>
          {islandDetails.map((island, i) => <button key={island.name} className={'island-orbit island-orbit-' + (i + 1)} onClick={() => setSelectedIsland(island)} onMouseEnter={e => e.currentTarget.classList.add('hovered')} onMouseLeave={e => e.currentTarget.classList.remove('hovered')}>
            <img src={island.image} alt=""/><span className="island-orbit-shade"/><span className="orbit-index">0{i + 1}</span><span className="orbit-title">{island.name}</span><span className="orbit-explore">EXPLORE <ArrowRight size={13}/></span>
          </button>)}
        </div>
        <p className="constellation-caption"><MapPin size={13}/> SELECT AN ISLAND TO DISCOVER ITS STORY</p>
      </section>

      {selectedIsland && <div className="island-modal" role="dialog" aria-modal="true" aria-label={selectedIsland.name} onClick={() => setSelectedIsland(null)}><div className="island-modal-card" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelectedIsland(null)} aria-label="Close island details"><X/></button><img src={selectedIsland.image} alt={selectedIsland.name}/><div className="modal-copy"><span className="section-kicker">{selectedIsland.kind}</span><h2>{selectedIsland.name}</h2><h3>{selectedIsland.tag}</h3><p>{selectedIsland.description}</p><button onClick={() => { setSelectedIsland(null); document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' }); }}>DISCOVER EXPERIENCES <ArrowRight size={16}/></button></div></div></div>}

      <section className="experience-section" id="experiences"><div className="experience-heading reveal"><span className="section-kicker-light">03 / MAKE IT YOURS</span><h2>Follow what<br/><em>moves you.</em></h2><p>Some journeys are measured in miles. The best ones are measured in moments.</p></div>
        <div className="experience-rows">{experiences.map((e, i) => <article className="experience-item reveal" key={e.n}><span>{e.n}</span><div><small>{e.type}</small><h3>{e.title}</h3><p>{e.copy}</p></div><img src={e.image} alt=""/><ArrowRight className="experience-arrow"/></article>)}</div>
      </section>

      <section className="culture-section" id="culture"><div className="culture-image"><img className="parallax-image" src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1800&q=90" alt="Ocean waves"/></div><div className="culture-copy reveal"><span className="section-kicker">04 / MORE THAN A VIEW</span><h2>A culture<br/>that moves<br/><em>with the sea.</em></h2><p>Here, heritage lives in language, dance, navigation, craft, food and the generous spirit of the people who call these islands home.</p><a href="#journey">DISCOVER THE CULTURE <ArrowRight size={16}/></a></div><div className="culture-script">TE FENUA<br/>TE MOANA<small>THE LAND · THE OCEAN</small></div></section>

      <section className="journey-cta" id="journey"><div className="journey-copy reveal"><span className="section-kicker-light">YOUR STORY STARTS HERE</span><h2>Let the islands<br/><em>find you.</em></h2><p>Start with a feeling. Follow it across the blue.</p><a href="#islands">EXPLORE THE ARCHIPELAGO <ArrowRight size={16}/></a></div><div className="journey-image"><img className="parallax-image" src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=90" alt="Island lagoon"/></div></section>
    </main>

    <footer className="site-footer"><a className="wordmark footer-mark" href="#home"><span className="wordmark-symbol">T</span><span>TAHITI<small>ISLANDS OF</small></span></a><p>THE ISLANDS OF TAHITI · FRENCH POLYNESIA</p><div className="footer-note">AN INDEPENDENT REDESIGN CONCEPT — NOT COMMISSIONED, APPROVED OR ENDORSED BY TAHITI TOURISME.<br/>DESIGNED & DEVELOPED BY GRACEON DIGITAL STUDIO</div></footer>

    <button className="guide-launcher" onClick={() => setGuideOpen(v => !v)} aria-label="Open GRACEON island guide" aria-expanded={guideOpen} aria-controls="island-guide-panel"><span className="guide-orbit"><Sparkles size={20}/></span><span className="guide-pulse"/></button>
    {guideOpen && <aside className="guide-panel" id="island-guide-panel" role="dialog" aria-label="GRACEON island guide"><div className="guide-header"><span className="guide-avatar"><Sparkles size={18}/></span><div><strong>Island Guide</strong><small>GRACEON · TAHITI DISCOVERY</small></div><button onClick={() => setGuideOpen(false)} aria-label="Close guide"><X/></button></div><div className="guide-body"><p className="guide-greeting">{guideReply}</p><div className="guide-prompts"><button onClick={() => sendGuide('Tell me about Bora Bora')}>Discover Bora Bora</button><button onClick={() => sendGuide('Help me plan a trip')}>Plan my journey</button><button onClick={() => sendGuide('Tell me about culture')}>Culture & heritage</button></div></div><form className="guide-input" onSubmit={e => { e.preventDefault(); sendGuide(); }}><input value={guideText} onChange={e => setGuideText(e.target.value)} placeholder="Ask about the islands..." aria-label="Ask the island guide"/><button aria-label="Send message"><Send size={17}/></button></form><small className="guide-disclaimer">Concept guide · Answers are currently pre-written, not live AI.</small></aside>}
  </div>;
}
