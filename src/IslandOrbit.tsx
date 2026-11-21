import {useMemo} from 'react';
import {ArrowDownRight,ArrowRight,Map,Search,X} from 'lucide-react';
import type {CSSProperties} from 'react';

type Island={name:string;kind:string;tag:string;image:string;description:string};
type Props={islands:Island[];language?:'EN'|'FR';query:string;onQueryChange:(value:string)=>void;onExplore:(name:string)=>void;onOpenMap:()=>void};
const islandKindFR:Record<string,string>={Tahiti:'Culture · Sommets · Vie urbaine',Moorea:'Lagons · Vallées · Belvédères','Bora Bora':'Lagons · Motu · Reliefs',Huahine:'Patrimoine · Nature · Lagons',Raiatea:'Patrimoine · Randonnées · Rivière','Taha’a':'Vanille · Motu · Lagons',Rangiroa:'Atoll · Plongée · Océan',Fakarava:'Réserve · Atoll · Biodiversité'};
const positions=[
 {left:'14%',top:'50%',size:'clamp(145px,18vw,235px)',delay:'-.4s'},
 {left:'25%',top:'25%',size:'clamp(105px,13vw,170px)',delay:'-2.2s'},
 {left:'50%',top:'15%',size:'clamp(165px,20vw,260px)',delay:'-1.1s'},
 {left:'75%',top:'25%',size:'clamp(112px,14vw,180px)',delay:'-3.1s'},
 {left:'86%',top:'50%',size:'clamp(112px,14vw,185px)',delay:'-2.7s'},
 {left:'75%',top:'75%',size:'clamp(145px,18vw,230px)',delay:'-1.8s'},
 {left:'50%',top:'85%',size:'clamp(110px,13vw,175px)',delay:'-3.5s'},
 {left:'25%',top:'75%',size:'clamp(138px,16vw,215px)',delay:'-.8s'}
];
export default function IslandOrbit({islands,language='EN',query,onQueryChange,onExplore,onOpenMap}:Props){
 const filtered=useMemo(()=>islands.filter(i=>(i.name+' '+i.kind+' '+(islandKindFR[i.name]||'')+' '+i.tag+' '+i.description).toLowerCase().includes(query.toLowerCase())),[islands,query]);
 return <section id="islands" className="island-orbit-section">
  <div className="island-orbit-top"><div><span className="island-orbit-kicker">{language==="FR"?"LES ÎLES DE TAHITI · 08 DESTINATIONS":"THE ISLANDS OF TAHITI · 08 DESTINATIONS"}</span><h2>{language==="FR"?<>Trouvez votre <em>île.</em></>:<>Find your <em>island.</em></>}</h2><p>{language==="FR"?"Huit univers dispersés dans le Pacifique. Suivez votre curiosité.":"Eight worlds scattered across the Pacific. Follow your curiosity."}</p></div><div className="island-orbit-tools"><label className="island-orbit-search"><Search size={15}/><input value={query} onChange={e=>onQueryChange(e.target.value)} placeholder={language==="FR"?"Rechercher une île…":"Search an island…"} aria-label={language==="FR"?"Rechercher une île":"Search an island"}/>{query&&<button type="button" aria-label={language==="FR"?"Effacer la recherche":"Clear search"} onClick={()=>onQueryChange('')}><X size={14}/></button>}</label><button className="island-map-open" onClick={onOpenMap}><Map size={16}/> {language==="FR"?"OUVRIR LA CARTE":"OPEN THE MAP"} <ArrowDownRight size={15}/></button></div></div>
  <div className="island-orbit-stage" aria-label="Eight island destinations">
   <div className="island-orbit-watermark">{language==="FR"?<>POLYNÉSIE<br/>FRANÇAISE</>:<>FRENCH<br/>POLYNESIA</>}</div><svg className="island-route-lines" viewBox="0 0 1000 820" preserveAspectRatio="none" aria-hidden="true"><path className="island-route-path" d="M500 72 C735 72 925 220 925 410 C925 600 735 748 500 748 C265 748 75 600 75 410 C75 220 265 72 500 72"/></svg>
   {filtered.map(island=>{const originalIndex=islands.findIndex(item=>item.name===island.name);const p=positions[originalIndex]||positions[0];return <button type="button" className="island-orbit-bubble" key={island.name} style={{'--bubble-left':p.left,'--bubble-top':p.top,'--bubble-size':p.size,'--bubble-delay':p.delay} as CSSProperties} onClick={()=>onExplore(island.name)} aria-label={(language==='FR'?'Explorer ':'Explore ')+island.name}><img src={island.image} alt=""/><span className="island-bubble-shade"/><span className="island-bubble-index">0{originalIndex+1}</span><span className="island-bubble-name">{island.name}</span><span className="island-bubble-kind">{language==='FR'?(islandKindFR[island.name]||island.kind):island.kind}</span><span className="island-bubble-arrow"><ArrowRight size={15}/></span></button>})}
   {filtered.length===0&&<p className="island-orbit-empty">{language==="FR"?"Aucune île trouvée. Essayez une autre recherche.":"No island found. Try another search."}</p>}
  </div>
  <div className="island-orbit-bottom"><span>{language==="FR"?"PARCOUREZ L’ARCHIPEL":"MOVE THROUGH THE ARCHIPELAGO"}</span><a href="#activities">{language==="FR"?"DÉCOUVRIR LES EXPÉRIENCES":"DISCOVER ISLAND EXPERIENCES"} <ArrowRight size={14}/></a><a href="#passport">{language==="FR"?"OUVRIR VOTRE PASSEPORT":"OPEN YOUR TAHITI PASSPORT"} <ArrowRight size={14}/></a></div>
 </section>;
}
