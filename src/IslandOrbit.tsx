import {useMemo,useState} from 'react';
import {ArrowDownRight,ArrowRight,Map,Search,X} from 'lucide-react';
import type {CSSProperties} from 'react';

type Island={name:string;kind:string;tag:string;image:string;description:string};
type Props={islands:Island[];onExplore:(name:string)=>void;onOpenMap:()=>void};
const positions=[
 {left:'5%',top:'7%',size:'clamp(150px,19vw,250px)',delay:'-.4s'},
 {left:'31%',top:'1%',size:'clamp(118px,15vw,190px)',delay:'-2.2s'},
 {left:'58%',top:'9%',size:'clamp(160px,20vw,260px)',delay:'-1.1s'},
 {left:'81%',top:'0%',size:'clamp(112px,14vw,180px)',delay:'-3.1s'},
 {left:'14%',top:'53%',size:'clamp(115px,15vw,190px)',delay:'-2.7s'},
 {left:'39%',top:'48%',size:'clamp(150px,18vw,235px)',delay:'-1.8s'},
 {left:'67%',top:'56%',size:'clamp(112px,14vw,180px)',delay:'-3.5s'},
 {left:'86%',top:'47%',size:'clamp(140px,17vw,220px)',delay:'-.8s'}
];
export default function IslandOrbit({islands,onExplore,onOpenMap}:Props){
 const [query,setQuery]=useState('');
 const filtered=useMemo(()=>islands.filter(i=>(i.name+' '+i.kind+' '+i.tag+' '+i.description).toLowerCase().includes(query.toLowerCase())),[islands,query]);
 return <section id="islands" className="island-orbit-section">
  <div className="island-orbit-top"><div><span className="island-orbit-kicker">THE ISLANDS OF TAHITI · 08 DESTINATIONS</span><h2>Find your <em>island.</em></h2><p>Eight worlds scattered across the Pacific. Follow your curiosity.</p></div><div className="island-orbit-tools"><label className="island-orbit-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search islands, nature, culture…"/>{query&&<button onClick={()=>setQuery('')} aria-label="Clear search"><X size={14}/></button>}</label><button className="island-map-open" onClick={onOpenMap}><Map size={16}/> OPEN THE MAP <ArrowDownRight size={15}/></button></div></div>
  <div className="island-orbit-stage" aria-label="Eight island destinations">
   <div className="island-orbit-watermark">FRENCH<br/>POLYNESIA</div>
   {filtered.map(island=>{const originalIndex=islands.findIndex(item=>item.name===island.name);const p=positions[originalIndex]||positions[0];return <button type="button" className="island-orbit-bubble" key={island.name} style={{'--bubble-left':p.left,'--bubble-top':p.top,'--bubble-size':p.size,'--bubble-delay':p.delay} as CSSProperties} onClick={()=>onExplore(island.name)} aria-label={'Explore '+island.name}><img src={island.image} alt=""/><span className="island-bubble-shade"/><span className="island-bubble-index">0{originalIndex+1}</span><span className="island-bubble-name">{island.name}</span><span className="island-bubble-kind">{island.kind}</span><span className="island-bubble-arrow"><ArrowRight size={15}/></span></button>})}
   {filtered.length===0&&<p className="island-orbit-empty">No island found. Try another search.</p>}
  </div>
  <div className="island-orbit-bottom"><span>MOVE THROUGH THE ARCHIPELAGO</span><a href="#experiences">DISCOVER ISLAND EXPERIENCES <ArrowRight size={14}/></a><a href="#passport">OPEN YOUR TAHITI PASSPORT <ArrowRight size={14}/></a></div>
 </section>;
}
