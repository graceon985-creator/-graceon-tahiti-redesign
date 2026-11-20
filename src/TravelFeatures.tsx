import {useMemo,useState} from 'react';
import {ArrowRight,BookmarkPlus,Download,Flag,Heart,MapPin,Plus,ShieldAlert,Sparkles,UserRound,Plane,Ship,Phone,Info,UtensilsCrossed} from 'lucide-react';
import {islands} from './data';
import './TravelFeatures.css';

type Island = typeof islands[number];
type Post = {id:string;author:string;text:string;image:string;place:string;createdAt:string;reports:number};
type Props = {savedIslands:string[];journeyIslands:string[];onToggleJourneyIsland:(name:string)=>void};

const read=(key:string,fallback:any)=>{try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback}catch{return fallback}};
const write=(key:string,value:unknown)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
const isSafeCommunityImage=(value:string)=>!value||(value.length<=2200000&&(/^data:image\/(?:png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(value)||/^https:\/\/\S+$/i.test(value)));
function readProfile():{name:string}{
 const stored=read('graceon-profile-v1',{});
 if(!stored||typeof stored!=='object'||Array.isArray(stored))return {name:''};
 return {name:typeof stored.name==='string'?stored.name.slice(0,80):''};
}
function readCommunityPosts():Post[]{
 const stored=read('graceon-community-posts-v1',[]);
 if(!Array.isArray(stored))return [];
 return stored.flatMap((item):Post[]=>{
  if(!item||typeof item!=='object'||Array.isArray(item))return [];
  const post=item as Record<string,unknown>;
  if(typeof post.id!=='string'||!post.id.trim()||post.id.length>80)return [];
  if(typeof post.text!=='string'||!post.text.trim()||post.text.length>500)return [];
  if(typeof post.author!=='string'||typeof post.place!=='string'||!islands.some(island=>island.name===post.place))return [];
  if(typeof post.createdAt!=='string'||!Number.isFinite(Date.parse(post.createdAt)))return [];
  const image=typeof post.image==='string'?post.image:'';
  if(!isSafeCommunityImage(image))return [];
  const reports=typeof post.reports==='number'&&Number.isFinite(post.reports)?Math.max(0,Math.floor(post.reports)):0;
  return [{id:post.id,author:post.author.slice(0,80),text:post.text.trim(),image,place:post.place,createdAt:post.createdAt,reports}];
 }).slice(0,100);
}
const interests=['Lagoon & beaches','Nature & hiking','Marine life','Culture & heritage','Food & local life','Quiet & slow travel'];
const interestTerms:Record<string,string[]>={'Lagoon & beaches':['lagoon','beach','motu','water'],'Nature & hiking':['nature','mountain','valley','trail','waterfall'],'Marine life':['marine','reef','ocean','diving','lagoon'],'Culture & heritage':['culture','heritage','marae','village','history'],'Food & local life':['food','market','vanilla','village','local'],'Quiet & slow travel':['quiet','slow','remote','peaceful','village']};

function readTripPlan():{day:number;island:Island;activity:string}[]{
 const stored=read('graceon-trip-plan-v1',[]);
 if(!Array.isArray(stored))return [];
 return stored.flatMap((item)=>{
  if(!item||typeof item!=='object'||!Number.isInteger(item.day)||item.day<1||typeof item.activity!=='string')return [];
  const islandName=typeof item.island==='string'?item.island:item.island?.name;
  const island=islands.find(candidate=>candidate.name===islandName);
  return island?[{day:item.day,island,activity:item.activity.slice(0,500)}]:[];
 }).sort((a,b)=>a.day-b.day);
}

export default function TravelFeatures({savedIslands,journeyIslands,onToggleJourneyIsland}:Props){
 const [profile,setProfile]=useState(readProfile);
 const [profileEditing,setProfileEditing]=useState(()=>!read('graceon-profile-v1',null));
 const [days,setDays]=useState(5);
 const [stayIsland,setStayIsland]=useState('All'); const [stayType,setStayType]=useState('Any');
 const [foodIsland,setFoodIsland]=useState('Tahiti');
 const [selectedInterests,setSelectedInterests]=useState<string[]>(['Nature & hiking','Culture & heritage']);
 const [plan,setPlan]=useState<{day:number;island:Island;activity:string}[]>(readTripPlan);
 const [posts,setPosts]=useState<Post[]>(readCommunityPosts);
 const [reported,setReported]=useState<string[]>(()=>{const value=read('graceon-community-reports-v1',[]);return Array.isArray(value)?value.filter((id):id is string=>typeof id==='string'&&id.length<=80):[]});
 const [postText,setPostText]=useState('');
 const [postPlace,setPostPlace]=useState('Tahiti');
 const [postImage,setPostImage]=useState('');
 const [activeTab,setActiveTab]=useState<'all'|'saved'|'plan'>('all');
 const [notice,setNotice]=useState('');
 const visiblePosts=useMemo(()=>posts.filter(p=>!reported.includes(p.id)),[posts,reported]);
 const journeyCount=new Set([...journeyIslands,...savedIslands]).size;
 const toggleInterest=(item:string)=>setSelectedInterests(old=>old.includes(item)?old.filter(x=>x!==item):[...old,item]);
 const makePlan=()=>{
  if(selectedInterests.length===0){setNotice('Choose at least one interest to shape your island route.');return;}
  const ranked=islands.map(island=>{const hay=(island.kind+' '+island.description+' '+(island.detail||'')+' '+(island.culture||'')+' '+(island.signature||'')).toLowerCase();const score=selectedInterests.reduce((n,p)=>n+(((interestTerms[p]||[]).some(term=>hay.includes(term.toLowerCase())))?1:0),0);return {island,score}}).sort((a,b)=>b.score-a.score);
  const picks=ranked.filter(x=>x.score>0).map(x=>x.island).slice(0,Math.min(days,8));
  if(!picks.length){setPlan([]);setNotice('No island matched the selected interests in the current guide. Try another interest combination.');return;}
  const next:{day:number;island:Island;activity:string}[]=[];
  for(let day=0;day<days;day++){const islandIndex=Math.floor(day*picks.length/days);const island=picks[islandIndex];const visitDay=next.filter(x=>x.island.name===island.name).length;const curated=island.guide?.itinerary||[];const activities=island.explore?.length?island.explore:island.highlights;const safeActivities=activities?.length?activities:['Explore the island at your own pace'];const entry=curated[visitDay%Math.max(curated.length,1)];const activity=entry?(entry.title+(entry.description?' — '+entry.description:'')):safeActivities[visitDay%safeActivities.length];next.push({day:day+1,island,activity});}
  setPlan(next);const persisted=write('graceon-trip-plan-v1',next);setNotice(!persisted?'Itinerary created, but this browser could not save it. Keep this tab open to avoid losing it.':days>8?'Your '+days+'-day draft includes stays across up to eight islands, with extra days allocated as longer stays. Save islands to My Journey to keep building it.':'Your sample itinerary is ready. Save islands to My Journey to keep building it.');
 };
 const addPost=()=>{
  const cleanText=postText.trim();
  const cleanImage=postImage.trim();
  if(!cleanText){setNotice('Write a short story or recommendation before publishing.');return;}
  if(posts.length>=100){setNotice('The local demo feed is full (100 posts). Clear this browser’s community storage before adding more.');return;}
  if(cleanText.length>500){setNotice('Keep your post under 500 characters.');return;}
  if(!isSafeCommunityImage(cleanImage)){setNotice('Use a secure https image link or upload a JPG, PNG, WebP or GIF under 1.5 MB.');return;}
  const next:Post={id:Date.now().toString(),author:profile.name.trim()||'Island traveller',text:cleanText,image:cleanImage,place:postPlace,createdAt:new Date().toISOString(),reports:0};
  const updated=[next,...posts];setPosts(updated);const persisted=write('graceon-community-posts-v1',updated);setPostText('');setPostImage('');setNotice(persisted?'Post added to this browser’s demo community.':'Post shown temporarily, but browser storage is full or unavailable.');
 };
 const reportPost=(id:string)=>{
  if(reported.includes(id)){setNotice('This post is already hidden in your demo view.');return;}
  const next=[...reported,id];setReported(next);const persisted=write('graceon-community-reports-v1',next);setNotice(persisted?'Thanks. This post is now hidden in this browser’s demo view.':'Post hidden for this session, but this browser could not save the report.');
 };
 const saveProfile=()=>{
  const cleanProfile={name:profile.name.trim()};setProfile(cleanProfile);const persisted=write('graceon-profile-v1',cleanProfile);setProfileEditing(false);setNotice(persisted?'Your local travel profile is saved on this device.':'Profile updated for this session, but browser storage is full or unavailable.');
 };
 const downloadPlan=()=>{if(!plan.length){setNotice('Create an itinerary before downloading it.');return;}const lines=['TAHITI ISLANDS — SAMPLE ITINERARY','Generated by GRACEON · '+new Date().toLocaleDateString(),'','This is an inspiration draft, not a confirmed booking. Transport, opening hours, weather and activity availability must be checked with local operators.','',...plan.flatMap(item=>['DAY '+String(item.day).padStart(2,'0')+' — '+item.island.name,item.activity,'']),'','Before travelling: confirm inter-island transfers, accommodation, activity schedules and local guidance.'];const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='graceon-tahiti-itinerary.txt';document.body.appendChild(link);link.click();link.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice('Your sample itinerary has been downloaded. Confirm island transfers and activity availability with local providers.');};
 const addPlanIslands=()=>{
  if(!plan.length){setNotice('Create an itinerary first, then save its islands to My Journey.');return;}
  const additions=[...new Set(plan.map(item=>item.island.name))].filter(name=>!allJourney.includes(name));
  additions.forEach(name=>onToggleJourneyIsland(name));
  setNotice(additions.length?additions.length+' new island'+(additions.length===1?'':'s')+' added to My Journey. Already-added islands were skipped.':'All itinerary islands are already in My Journey.');
 };
 const allJourney=[...new Set([...journeyIslands,...savedIslands])];
 return <div className="travel-features">
  <section id="stays" className="tf-section tf-stays">
  <div className="tf-heading"><div><span className="tf-kicker">01 / WHERE TO STAY</span><h2>Find your <em>island stay.</em></h2></div><p>Discover accommodation options across the archipelago, from lagoon resorts to family-run pensions and locally hosted stays.</p></div>
  <div className="tf-stays-intro"><div className="tf-stays-controls"><label>CHOOSE AN ISLAND<select value={stayIsland} onChange={e=>setStayIsland(e.target.value)}><option value="All">All islands</option>{islands.map(i=><option key={i.name} value={i.name}>{i.name}</option>)}</select></label><label>TYPE OF STAY<select value={stayType} onChange={e=>setStayType(e.target.value)}><option value="Any">Any type</option><option value="Hotel">Hotels & resorts</option><option value="Guesthouse">Guesthouses & pensions</option></select></label></div><div className="tf-stays-note"><strong>Find a stay that fits your island.</strong><span>These sample properties are discovery leads, not a verified/live booking inventory. Use the official island accommodation directory to confirm the property, current rates, dates and booking terms.</span><a href="https://tahititourisme.pf/en-pf/vacation/choice-of-accommodation/where-to-stay-accommodation/" target="_blank" rel="noreferrer">OFFICIAL ACCOMMODATION DIRECTORY <ArrowRight size={14}/></a></div></div>
  <div className="tf-stays-resultsbar"><span>EXPLORE ACCOMMODATION BY ISLAND</span><strong>{islands.filter(island=>stayIsland==="All"||island.name===stayIsland).length} ISLANDS IN VIEW · {stayType==="Any"?"ALL STAY TYPES":stayType==="Hotel"?"HOTELS & RESORTS":"GUESTHOUSES & PENSIONS"}</strong><a href="https://www.tahititourisme.com/preparing-you-trip/accommodations-in-the-islands-of-tahiti/" target="_blank" rel="noreferrer">OFFICIAL DIRECTORY · LIVE FILTERS <ArrowRight size={12}/></a></div><div className="tf-stays-grid">{islands.filter(island=>stayIsland==="All"||island.name===stayIsland).map(island=>{const places:Record<string,{name:string;type:string;url?:string}[]>={'Tahiti':[{name:'Intercontinental Tahiti Resort & Spa',type:'Hotel',url:'https://tahititourisme.pf/en-pf/vacation/choice-of-accommodation/where-to-stay-accommodation/hotel/intercontinental-tahiti-resort-faaa-en-en-pf-3343343/'},{name:'Manava Suite Resort Tahiti',type:'Hotel'},{name:'Pension De La Plage',type:'Guesthouse',url:'https://tahititourisme.pf/en-pf/vacation/choice-of-accommodation/where-to-stay-accommodation/pension-de-la-plage-punaauia-en-en-pf-3349603/'},{name:'Vanira Lodge',type:'Guesthouse',url:'https://tahititourisme.pf/en-pf/vacation/choice-of-accommodation/where-to-stay-accommodation/vanira-lodge-taiarapu-ouest-en-en-pf-3438406/'}],'Moorea':[{name:'Sofitel Kia Ora Moorea Beach Resort',type:'Hotel'},{name:'Hilton Moorea Lagoon Resort & Spa',type:'Hotel'},{name:'Manava Beach Resort & Spa Moorea',type:'Hotel'},{name:'Les Tipaniers',type:'Hotel'}],'Bora Bora':[{name:'Intercontinental Bora Bora Le Moana Resort',type:'Hotel'},{name:'Four Seasons Resort Bora Bora',type:'Hotel'},{name:'Le Maitai Polynesia Bora Bora',type:'Hotel'},{name:'Conrad Bora Bora Nui',type:'Hotel'}],'Huahine':[{name:'Maitai Lapita Village Huahine',type:'Hotel'},{name:'Blue Lagoon Lodge Huahine',type:'Guesthouse'},{name:'Chez Here Ata',type:'Guesthouse'},{name:'Moanaiti Lodge',type:'Guesthouse'}],'Raiatea':[{name:'Raiatea Lodge Hotel',type:'Hotel'},{name:'Opoa Beach Hotel',type:'Hotel'},{name:'Teavapiti Lodge',type:'Guesthouse'},{name:'Villa Hokulea',type:'Guesthouse'}],'Taha’a':[{name:'Vahine Private Island',type:'Hotel'},{name:'Le Taha’a by Pearl Resorts',type:'Hotel'},{name:'Eden Private Island Tahaa',type:'Hotel',url:'https://www.tahititourisme.com/hotel/eden-private-island-tahaa/'},{name:'Apatoa Beach & Garden Village',type:'Hotel'}],'Rangiroa':[{name:'Hotel Maitai Rangiroa',type:'Hotel'},{name:'Kia Ora Resort & Spa',type:'Hotel'},{name:'Les Relais de Joséphine',type:'Guesthouse'},{name:'Tihimani Lodge',type:'Guesthouse'}],'Fakarava':[{name:'Havaiki Fakarava Guest House',type:'Guesthouse'},{name:'Tokerau Village',type:'Guesthouse',url:'https://tahititourisme.pf/en-pf/vacation/choice-of-accommodation/where-to-stay-accommodation/tokerau-village-fakarava-en-en-pf-3363329/'},{name:'Pension Tetamanu Village',type:'Guesthouse',url:'https://www.tahititourisme.com/accommodation/pension-tetamanu-village/'},{name:'Motu Aito Paradise',type:'Guesthouse'}]};const chosen=(places[island.name]||[]).filter(p=>stayType==='Any'||p.type===stayType);return <article className="tf-stay-card" key={island.name}><div className="tf-stay-image"><img src={island.image} alt={island.name} loading="lazy" decoding="async"/><span>ACCOMMODATION · {island.name.toUpperCase()}</span><strong>{island.name}</strong></div><div className="tf-stay-body"><p>{island.signature}</p><div className="tf-stay-list">{chosen.map(p=><div className="tf-stay-place" key={p.name}><span>{p.type.toUpperCase()}</span><strong>{p.name}</strong><div className="tf-stay-links"><a href={'https://www.google.com/maps/search/'+encodeURIComponent(p.name+' '+island.name+' French Polynesia')} target="_blank" rel="noreferrer">VIEW ON MAP <ArrowRight size={12}/></a><a href={p.url||'https://www.google.com/search?q='+encodeURIComponent(p.name+' '+island.name+' French Polynesia official website')} target="_blank" rel="noreferrer">{p.url?'OFFICIAL PROPERTY PROFILE':'SEARCH PROPERTY'} <ArrowRight size={12}/></a></div></div>)}{chosen.length===0&&<span className="tf-stay-empty">No matches for this type in this island card.</span>}</div><div className="tf-stay-quicklinks"><a className="tf-stay-guide" href={island.officialGuide} target="_blank" rel="noreferrer">ISLAND GUIDE</a><a className="tf-stay-guide tf-stay-directory" href="https://www.tahititourisme.com/preparing-you-trip/accommodations-in-the-islands-of-tahiti/" target="_blank" rel="noreferrer">OFFICIAL ACCOMMODATION SEARCH <ArrowRight size={12}/></a></div></div></article>})}</div>
 </section>
<section id="food" className="tf-section tf-food">
   <div className="tf-heading"><div><span className="tf-kicker">02 / TASTE THE ISLANDS</span><h2>Find a table <em>worth sharing.</em></h2></div><p>Explore local dining searches by island and discover restaurants, food trucks, cafés and Polynesian specialties. Listings open live map results—check details directly with each place.</p></div>
   <div className="tf-food-controls"><label>CHOOSE AN ISLAND<select value={foodIsland} onChange={e=>setFoodIsland(e.target.value)}><option value="Tahiti">Tahiti</option>{islands.filter(i=>i.name!=="Tahiti").map(i=><option key={i.name} value={i.name}>{i.name}</option>)}</select></label><span className="tf-food-note"><UtensilsCrossed size={16}/> These are live discovery searches, not a verified restaurant directory.</span></div>
   <div className="tf-food-grid">{[
    {name:'Local restaurants',query:'local restaurants'},
    {name:'Polynesian cuisine',query:'Polynesian food restaurants'},
    {name:'Seafood & fish',query:'seafood restaurants'},
    {name:'Cafés & breakfast',query:'cafes breakfast'},
    {name:'Food trucks',query:'food trucks'},
    {name:'Vegetarian options',query:'vegetarian restaurants'}
   ].map(item=><a className="tf-food-card" key={item.name} href={'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(item.query+' '+foodIsland+' French Polynesia')} target="_blank" rel="noreferrer"><span className="tf-food-card-icon"><UtensilsCrossed size={20}/></span><span><strong>{item.name}</strong><small>Explore on map · {foodIsland}</small></span><ArrowRight size={16}/></a>)}</div>
   <div className="tf-food-footer"><a href="https://tahititourisme.com/" target="_blank" rel="noreferrer">Official destination guide <ArrowRight size={13}/></a><span>Confirm opening hours, menus, dietary options and reservations with the restaurant.</span></div>
  </section>
<section id="travel-essentials" className="tf-section tf-essentials">
   <div className="tf-heading"><div><span className="tf-kicker">04 / BEFORE YOU GO</span><h2>Travel <em>Essentials.</em></h2></div><p>Practical information for a smoother visit. Always verify entry rules and schedules for your nationality and travel dates.</p></div>
   <div className="tf-essential-grid">
    <article className="tf-essential-card"><span className="tf-essential-icon"><Plane/></span><span className="tf-label">01 · ENTRY & VISAS</span><h3>Know before you arrive.</h3><p>Entry requirements depend on your nationality, passport, trip length and route. Check the official French visa service and Tahiti Tourisme guidance before booking.</p><a href="https://france-visas.gouv.fr/en/" target="_blank" rel="noreferrer">French visa information <ArrowRight size={14}/></a><a href="https://tahititourisme.com/" target="_blank" rel="noreferrer">Tahiti Tourisme <ArrowRight size={14}/></a></article>
    <article className="tf-essential-card"><span className="tf-essential-icon"><Ship/></span><span className="tf-label">02 · BETWEEN ISLANDS</span><h3>Plan your connections.</h3><p>Flights and passenger ferries connect different island groups. Routes, luggage rules and timetables vary, so check operators directly and leave sensible connection time.</p><a href="https://www.airtahiti.com/" target="_blank" rel="noreferrer">Air Tahiti flights <ArrowRight size={14}/></a><a href="https://www.aremiti.pf/" target="_blank" rel="noreferrer">Aremiti ferry <ArrowRight size={14}/></a></article>
    <article className="tf-essential-card tf-emergency"><span className="tf-essential-icon"><Phone/></span><span className="tf-label">03 · EMERGENCY CONTACTS</span><h3>Keep these numbers close.</h3><div className="tf-emergency-numbers"><div><strong>15</strong><span>Medical / SAMU</span></div><div><strong>16</strong><span>Sea rescue</span></div><div><strong>17</strong><span>Police</span></div><div><strong>18</strong><span>Fire service</span></div></div><a href="https://tahititourisme.pf/en-pf/emergency-contacts-and-risk-management-measures/" target="_blank" rel="noreferrer">Official emergency guidance <ArrowRight size={14}/></a></article>
    <article className="tf-essential-card"><span className="tf-essential-icon"><MapPin/></span><span className="tf-label">04 · VISITOR INFORMATION</span><h3>Find local guidance.</h3><p>Tahiti Tourisme’s information team in Papeete can help visitors with practical guidance. Look up current visitor information and local contacts before travelling onward.</p><a href="https://tahititourisme.pf/en-pf/islands-and-archipelagos/the-society-islands/tahiti/tahiti-practical-information/" target="_blank" rel="noreferrer">Papeete visitor information <ArrowRight size={14}/></a><a href="https://tahititourisme.com/" target="_blank" rel="noreferrer">Official visitor website <ArrowRight size={14}/></a></article>
   </div>
   <div className="tf-source-note"><Info size={15}/> Emergency numbers are published by Tahiti Tourisme. Entry rules, routes and visitor-centre hours can change; check official sources before departure.</div>
  </section>

  <section id="my-journey" className="tf-section tf-journey">
   <div className="tf-heading"><div><span className="tf-kicker">01 / YOUR PERSONAL SPACE</span><h2>My <em>Journey.</em></h2></div><p>Keep the places you love, shape your island route and bring your trip ideas together in one place.</p></div>
   <div className="tf-journey-grid">
    <aside className="tf-profile-card"><div className="tf-profile-icon"><UserRound/></div><span className="tf-label">TRAVELLER PROFILE</span>
     {profileEditing?<div className="tf-profile-fields"><label>Your name (optional)<input value={profile.name} maxLength={80} onChange={e=>setProfile({...profile,name:e.target.value})} placeholder="How should we call you?"/></label><button className="tf-button" onClick={saveProfile}>Save profile <ArrowRight size={15}/></button></div>:<><h3>{profile.name||'Your travel profile'}</h3><p>Your island plans, saved on this device.</p><button className="tf-text-button" onClick={()=>setProfileEditing(true)}>EDIT PROFILE <ArrowRight size={13}/></button></>}
     <div className="tf-profile-stats"><div><strong>{allJourney.length}</strong><span>ISLANDS</span></div><div><strong>{plan.length}</strong><span>ITINERARY DAYS</span></div></div>
     <small className="tf-local-note">Demo profile · stored in this browser only. No account or cloud sync is connected yet.</small>
    </aside>
    <div className="tf-journey-content">
     <div className="tf-tabs"><button className={activeTab==='all'?'active':''} onClick={()=>setActiveTab('all')}>All saved</button><button className={activeTab==='saved'?'active':''} onClick={()=>setActiveTab('saved')}>Saved islands</button><button className={activeTab==='plan'?'active':''} onClick={()=>setActiveTab('plan')}>My itinerary</button></div>
     {activeTab==='plan'?<div className="tf-itinerary-list">{plan.length?plan.map(item=><article className="tf-itinerary-row" key={item.day}><span>DAY {String(item.day).padStart(2,'0')}</span><div><strong>{item.island.name}</strong><p>{item.activity}</p></div><MapPin size={16}/></article>):<p className="tf-empty">Your itinerary is waiting. Use the GRACEON AI Guide below to create a first draft.</p>}</div>:<div className="tf-saved-grid">{(activeTab==='saved'?savedIslands:allJourney).map(name=>{const island=islands.find(i=>i.name===name);if(!island)return null;return <article className="tf-saved-card" key={name}><img src={island.image} alt={name} loading="lazy" decoding="async"/><div><span>THE ISLANDS OF TAHITI</span><h3>{name}</h3><button onClick={()=>onToggleJourneyIsland(name)}>{journeyIslands.includes(name)?'REMOVE FROM JOURNEY':'ADD TO JOURNEY'} <ArrowRight size={12}/></button></div></article>})}{(activeTab==='saved'?savedIslands:allJourney).length===0&&<p className="tf-empty">No islands saved yet. Explore the eight islands above and add your favourites to your journey.</p>}</div>}
    </div>
   </div>
  </section>

  <section id="community" className="tf-section tf-community">
   <div className="tf-heading"><div><span className="tf-kicker">03 / NOTES FROM THE ISLANDS</span><h2>Island <em>Community.</em></h2></div><p>A simple space for travellers to exchange moments, helpful tips and local recommendations. Keep it kind and respectful.</p></div>
   <div className="tf-community-grid"><div className="tf-compose"><span className="tf-label">SHARE A MOMENT</span><h3>What did you discover?</h3><textarea maxLength={500} value={postText} onChange={e=>setPostText(e.target.value)} placeholder="Share a photo story, experience or recommendation…"/><small className="tf-post-counter">{postText.length}/500 characters</small><label>Island<select value={postPlace} onChange={e=>setPostPlace(e.target.value)}>{islands.map(i=><option key={i.name}>{i.name}</option>)}</select></label><label>Image URL (optional)<input value={postImage} onChange={e=>setPostImage(e.target.value)} placeholder="Paste a public image link"/></label><label>Or upload a photo<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={e=>{const input=e.currentTarget;const file=input.files?.[0];if(!file)return;if(!["image/jpeg","image/png","image/webp","image/gif"].includes(file.type)){setNotice("Choose a JPG, PNG, WebP or GIF image.");input.value="";return;}if(file.size>1500000){setNotice("Please choose an image smaller than 1.5 MB.");input.value="";return;}const reader=new FileReader();reader.onload=()=>setPostImage(String(reader.result||""));reader.onerror=()=>{setNotice("The photo could not be read. Try again.");input.value="";};reader.readAsDataURL(file);}}/></label><button className="tf-button" onClick={addPost}><Plus size={15}/> Publish post <ArrowRight size={14}/></button><small>Posts are saved locally in this demo. Public sharing needs a connected community backend.</small></div>
    <div className="tf-feed"><div className="tf-feed-heading"><span className="tf-label">COMMUNITY FIELD NOTES</span><span>{visiblePosts.length} POSTS</span></div>{visiblePosts.length?visiblePosts.map(post=><article className="tf-post" key={post.id}>{post.image&&<img className="tf-post-image" src={post.image} alt={`Photo shared from ${post.place}`} loading="lazy" onError={e=>{e.currentTarget.hidden=true;}}/>}<div className="tf-post-body"><div className="tf-post-meta"><strong>{post.author}</strong><span>{post.place} · {new Date(post.createdAt).toLocaleDateString()}</span></div><p>{post.text}</p><button className="tf-report" onClick={()=>reportPost(post.id)}><Flag size={13}/> Report content</button></div></article>):<div className="tf-empty tf-feed-empty"><Heart/><strong>Be the first to share a story.</strong><p>Your community feed will grow with traveller recommendations and island moments.</p></div>}</div>
   </div>
   <p className="tf-moderation-note"><ShieldAlert size={15}/> Reporting hides the post in this browser demo only. Shared moderation and public posting require backend authentication and moderation tools.</p>
  </section>

  <section id="ai-guide" className="tf-section tf-guide">
   <div className="tf-heading"><div><span className="tf-kicker">02 / YOUR PERSONAL ISLAND CONCIERGE</span><h2>Meet your <em>AI Guide.</em></h2></div><p>Tell GRACEON what matters to you. Build a day-by-day island route around your interests and the time you have.</p></div>
   <div className="tf-guide-panel"><div className="tf-guide-intro"><span className="tf-guide-orbit"><Sparkles/></span><span className="tf-label">GRACEON · TRAVEL PLANNER</span><h3>A journey shaped<br/>around <em>you.</em></h3><p>Choose your travel interests and trip length. GRACEON will create a suggested route using the destination information in this guide.</p><div className="tf-guide-disclaimer">Personalized demo recommendations · not live generative AI. Confirm transport, opening hours and availability with local operators.</div></div>
    <div className="tf-guide-builder"><label className="tf-days-label">HOW MANY DAYS? <strong>{days} DAYS</strong></label><input className="tf-range" type="range" min="2" max="10" value={days} onChange={e=>setDays(Number(e.target.value))}/><div className="tf-interest-heading"><span>WHAT DO YOU LOVE?</span><small>SELECT ALL THAT APPLY</small></div><div className="tf-interest-grid">{interests.map(item=><button key={item} className={selectedInterests.includes(item)?'selected':''} onClick={()=>toggleInterest(item)}>{selectedInterests.includes(item)?'✓':'+'} {item}</button>)}</div><button className="tf-button tf-generate" onClick={makePlan}><Sparkles size={16}/> Create my itinerary <ArrowRight size={15}/></button></div>
   </div>
   {plan.length>0&&<div className="tf-plan-result"><div className="tf-plan-top"><div><span className="tf-kicker">YOUR SUGGESTED ROUTE</span><h3>{plan.length} days across the islands</h3></div><div className="tf-plan-actions"><button className="tf-button" onClick={downloadPlan}><Download size={15}/> Download itinerary</button><button className="tf-button" onClick={addPlanIslands}><BookmarkPlus size={15}/> Save to My Journey</button></div></div><div className="tf-plan-days">{plan.map(item=><article key={item.day}><span>DAY {String(item.day).padStart(2,'0')}</span><img src={item.island.image} alt="" loading="lazy" decoding="async"/><div><h4>{item.island.name}</h4><p>{item.activity}</p></div></article>)}</div></div>}
  </section>
  {notice&&<div className="tf-toast" role="status"><span>{notice}</span><button onClick={()=>setNotice('')}>×</button></div>}
 </div>;
}
