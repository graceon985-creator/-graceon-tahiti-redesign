import {useMemo,useState} from 'react';
import {ArrowDownRight,ArrowRight,Map,Search,X} from 'lucide-react';
import type {CSSProperties} from 'react';

type Island={name:string;kind:string;tag:string;image:string;description:string};
type Props={islands:Island[];onExplore:(name:string)=>void;onOpenMap:()=>void};
const positions=[
 {left:'2%',top:'12%',size:'clamp(145px,18vw,235px)',delay:'-.4s'},
 {left:'27%',top:'0%',size:'clamp(105px,13vw,170px)',delay:'-2.2s'},
 {left:'56%',top:'17%',size:'clamp(165px,20vw,260px)',delay:'-1.1s'},
 {left:'84%',top:'3%',size:'clamp(112px,14vw,180px)',delay:'-3.1s'},
 {left:'12%',top:'57%',size:'clamp(112px,14vw,185px)',delay:'-2.7s'},
 {left:'38%',top:'43%',size:'clamp(145px,18vw,230px)',delay:'-1.8s'},
 {left:'69%',top:'63%',size:'clamp(110px,13vw,175px)',delay:'-3.5s'},
 {left:'87%',top:'43%',size:'clamp(138px,16vw,215px)',delay:'-.8s'}
];
export default function IslandOrbit({islands,onExplore,onOpenMap}:Props){
 const [query,setQuery]=useState('');
 const filtered=useMemo(()=>islands.filter(i=>(i.name+' '+i.kind+' '+i.tag+' '+i.description).toLowerCase().includes(query.toLowerCase())),[islands,query]);
 return <section id="islands" className="island-orbit-section">
  <div className="island-orbit-top"><div><span className="island-orbit-kicker">THE ISLANDS OF TAHITI · 08 DESTINATIONS</span><h2>Find your <em>island.</em></h2><p>Eight worlds scattered across the Pacific. Follow your curiosity.</p></div><div className="island-orbit-tools"><label className="island-orbit-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search islands, nature, culture…"/>{query&&<button onClick={()=>setQuery('')} aria-label="Clear search"><X size={14}/></button>}</label><button className="island-map-open" onClick={onOpenMap}><Map size={16}/> OPEN THE MAP <ArrowDownRight size={15}/></button></div></div>
  <div className="island-orbit-stage" aria-label="Eight island destinations">
   <div className="island-orbit-watermark">FRENCH<br/>POLYNESIA</div><svg className="island-route-lines" viewBox="0 0 1000 820" preserveAspectRatio="none" aria-hidden="true"><path className="island-route-path" d="M105 165 C185 110 245 80 330 95 S520 165 620 210 S825 115 900 110 S845 380 760 545 S560 520 470 475 S230 560 150 640 S510 760 760 700 S890 500 930 410"/></svg>
   {filtered.map(island=>{const originalIndex=islands.findIndex(item=>item.name===island.name);const p=positions[originalIndex]||positions[0];return <button type="button" className="island-orbit-bubble" key={island.name} style={{'--bubble-left':p.left,'--bubble-top':p.top,'--bubble-size':p.size,'--bubble-delay':p.delay} as CSSProperties} onClick={()=>onExplore(island.name)} aria-label={'Explore '+island.name}><img src={island.image} alt=""/><span className="island-bubble-shade"/><span className="island-bubble-index">0{originalIndex+1}</span><span className="island-bubble-name">{island.name}</span><span className="island-bubble-kind">{island.kind}</span><span className="island-bubble-arrow"><ArrowRight size={15}/></span></button>})}
   {filtered.length===0&&<p className="island-orbit-empty">No island found. Try another search.</p>}
  </div>
  <div className="island-orbit-bottom"><span>MOVE THROUGH THE ARCHIPELAGO</span><a href="#experiences">DISCOVER ISLAND EXPERIENCES <ArrowRight size={14}/></a><a href="#passport">OPEN YOUR TAHITI PASSPORT <ArrowRight size={14}/></a></div>
 </section>;
}
