import {ArrowRight, Check, Compass, Award, MapPinned, Route, Flag} from 'lucide-react';

type Island = {name:string;tag:string;kind:string;image:string;signature:string};
type Props = {islands:Island[];stamps:string[];exploredPlaces:string[];journeyIslands:string[];onExplore:(name:string)=>void};

export default function TahitiPassport({islands,stamps,exploredPlaces,journeyIslands,onExplore}:Props){
 const total=islands.length;
 const collected=islands.filter(island=>stamps.includes(island.name)).length;
 const next=islands.find(island=>!stamps.includes(island.name));
 const achievements=[
  {name:'First Discovery',detail:'Mark your first place as explored.',unlocked:exploredPlaces.length>=1,progress:Math.min(exploredPlaces.length,1),goal:1,Icon:Flag},
  {name:'Curious Explorer',detail:'Explore three places across the islands.',unlocked:exploredPlaces.length>=3,progress:Math.min(exploredPlaces.length,3),goal:3,Icon:MapPinned},
  {name:'Island Collector',detail:'Collect stamps from four different islands.',unlocked:collected>=4,progress:Math.min(collected,4),goal:4,Icon:Award},
  {name:'Route Maker',detail:'Add three islands to your personal journey.',unlocked:journeyIslands.length>=3,progress:Math.min(journeyIslands.length,3),goal:3,Icon:Route},
  {name:'Archipelago Explorer',detail:'Collect all eight island stamps.',unlocked:collected===total,progress:collected,goal:total,Icon:Compass}
 ];
 const unlocked=achievements.filter(item=>item.unlocked).length;
 return <section id="passport" className="passport-section section-pad">
  <div className="passport-heading">
   <div><div className="section-kicker">03 / YOUR DISCOVERY RECORD</div><h2>The Tahiti<br/><em>Passport.</em></h2><p>Every island has a story. Explore destination guides, mark places you have discovered and collect digital stamps as your journey unfolds.</p></div>
   <div className="passport-cover" aria-label="Tahiti Passport digital cover"><div className="passport-cover-orbit">✳ &nbsp; ✳ &nbsp; ✳</div><span>THE ISLANDS OF</span><strong>TAHITI</strong><small>DISCOVERY PASSPORT</small><div className="passport-cover-mark">T</div><span className="passport-cover-bottom">FRENCH POLYNESIA · SOUTH PACIFIC</span></div>
  </div>
  <div className="passport-progress"><div><span className="detail-label">YOUR ISLAND COLLECTION</span><strong>{collected}<small> / {total} STAMPS</small></strong></div><div className="passport-progress-track" role="progressbar" aria-label="Island stamps collected" aria-valuemin={0} aria-valuemax={total} aria-valuenow={collected}><span style={{width:`${total?collected/total*100:0}%`}}/></div><p>{collected===total?'All eight island stamps collected. Your archipelago discovery is complete.':collected===0?'Your passport is ready. Choose an island and begin exploring.':`${total-collected} more island ${total-collected===1?'stamp':'stamps'} to complete your collection.`}</p></div>
  <div className="passport-stats"><div><strong>{exploredPlaces.length}</strong><span>PLACES EXPLORED</span></div><div><strong>{unlocked} / {achievements.length}</strong><span>ACHIEVEMENTS UNLOCKED</span></div><div><strong>{journeyIslands.length}</strong><span>ISLANDS IN YOUR ROUTE</span></div></div>
  <div className="passport-achievements"><div className="passport-subhead"><span className="detail-label">MILESTONES & ACHIEVEMENTS</span><p>Discover places, build your route and collect island stamps to unlock these milestones.</p></div><div className="passport-achievement-grid">{achievements.map(({name,detail,unlocked,progress,goal,Icon})=><article className={unlocked?'passport-achievement unlocked':'passport-achievement'} key={name}><div className="passport-achievement-icon"><Icon size={20}/>{unlocked&&<span><Check size={10}/></span>}</div><div className="passport-achievement-copy"><h3>{name}</h3><p>{detail}</p><div className="passport-achievement-track"><span style={{width:`${progress/goal*100}%`}}/></div><small>{unlocked?'UNLOCKED':`${progress} / ${goal} COMPLETE`}</small></div></article>)}</div></div>
  <div className="passport-stamp-grid">{islands.map((island,index)=>{const earned=stamps.includes(island.name);return <article className={earned?'passport-stamp-card earned':'passport-stamp-card'} key={island.name}><div className="passport-stamp-art"><span className="passport-stamp-number">{String(index+1).padStart(2,'0')}</span><div className="passport-stamp-ring"><span>{earned?'DISCOVERED':'ISLAND STAMP'}</span><strong>{island.name}</strong><small>{earned?'✳ COLLECTED':'✳ TO BE EXPLORED'}</small></div>{earned&&<span className="passport-check"><Check size={14}/></span>}</div><div className="passport-stamp-meta"><span>{island.kind}</span><h3>{island.name}</h3><p>{earned?'Added to your discovery record.':island.tag}</p><button onClick={()=>onExplore(island.name)}>{earned?'VIEW ISLAND':'EXPLORE ISLAND'} <ArrowRight size={14}/></button></div></article>})}</div>
  <div className="passport-next"><div className="passport-next-icon"><Compass size={22}/></div><div><span className="detail-label">{next?'YOUR NEXT DISCOVERY':'COLLECTION COMPLETE'}</span><h3>{next?next.name+' is waiting.':'Eight islands. Eight stories.'}</h3><p>{next?'Open the island guide, discover its places and collect your stamp.':'Your digital passport now holds a stamp from every featured island.'}</p></div>{next&&<button onClick={()=>onExplore(next.name)}>CONTINUE EXPLORING <ArrowRight size={15}/></button>}</div>
 </section>
}
