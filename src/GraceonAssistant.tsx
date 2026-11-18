import {useState} from 'react';
import {X, Send, Sparkles} from 'lucide-react';

type Message={role:'user'|'assistant';text:string};
type GraceonAssistantProps={journeyIslands:string[]};
const quickPrompts=['I love nature and hiking','I want culture and local life','Help me plan a 5-day trip'];

const destinationTips=[
 {name:'Moorea',keys:['nature','green','hike','mountain','trail','scenery','landscape'],why:'Twin bays, green mountain ridges, valley trails and pineapple-growing landscapes.'},
 {name:'Huahine',keys:['culture','heritage','history','quiet','peace','authentic','local'],why:'Archaeological sites, village life, lagoon scenery and a slower island atmosphere.'},
 {name:'Tahiti',keys:['city','food','market','dance','festival','shopping','waterfall'],why:'Papeete markets, cultural events, volcanic valleys, waterfalls and black-sand coast.'},
 {name:'Bora Bora',keys:['beach','lagoon','romantic','luxury','turquoise','snorkel'],why:'Iconic lagoon scenery, Matira Beach, motu outings and Mount Otemanu views.'},
 {name:'Taha’a',keys:['vanilla','farm','coral','garden','snorkel'],why:'Vanilla-growing traditions, coral garden excursions and a calm lagoon setting.'},
 {name:'Raiatea',keys:['sailing','boat','sacred','marae','river','voyage'],why:'Taputapuātea heritage, sailing, the Faaroa River and lush inland landscapes.'},
 {name:'Rangiroa',keys:['atoll','dive','diving','ocean','dolphin','marine'],why:'Huge lagoon, Tiputa Pass, village cycling and guided marine experiences.'},
 {name:'Fakarava',keys:['remote','wildlife','biosphere','conservation','quiet','nature'],why:'Remote atoll villages, protected ecosystems and nature-led lagoon excursions.'}
];

function getDemoReply(message:string,journeyIslands:string[]){
 const text=message.toLowerCase();
 if(/(my journey|my route|selected islands|plan.*route|plan.*journey)/.test(text)){
  if(!journeyIslands.length) return 'Your personal journey is empty for now. Add one or more islands to “My Tahiti Journey” on the page, then come back and I can help you shape a route.';
  return 'Your current island route is:\\n'+journeyIslands.map((name,index)=>(index+1)+'. '+name).join('\\n')+'\\n\\nA useful next step is to decide how many nights you want on each island and check inter-island transport. I can help you think through the order, but this concept does not check live ferry or flight schedules, accommodation or bookings.';
 }

 if(/\b(5 day|five day|5 days|five days|plan|itinerary)\b/.test(text)){
  return 'Here is a flexible 5-day starting idea:\n• Days 1–2: Tahiti — markets, culture, coast and a valley excursion.\n• Days 3–5: Moorea — lagoon, viewpoints and green landscapes.\n\nThis is only a sample; ferry and flight schedules, lodging and seasonal conditions should be checked before booking.';
 }
 const islandMention=destinationTips.find(d=>text.includes(d.name.toLowerCase()));
 if(islandMention){
  return 'Great choice — '+islandMention.name+' could be a good starting point. '+islandMention.why+'\\n\\nA flexible 3-day idea:\\n• Day 1: Settle in and explore a nearby village or coastline.\\n• Day 2: Choose a guided nature, lagoon or cultural activity that matches the island.\\n• Day 3: Keep time for a local food stop and an easy scenic outing.\\n\\nOpen the island guide to see specific places. This concept does not check live schedules, weather or bookings.';
 }
 const matches=destinationTips.filter(d=>d.keys.some(k=>text.includes(k)));
 if(matches.length){
  const chosen=matches.slice(0,3);
  return 'Based on what you mentioned, I would start with:\\n\\n'+chosen.map(d=>'• '+d.name+' — '+d.why).join('\\n\\n')+'\\n\\nIf you select more than one interest, I can suggest a simple combination. Open Island Discovery to compare matches and explore each guide. These are inspiration suggestions, not live booking or weather information.';
 }
 if(/\b(hello|hi|hey|bonjour)\b/.test(text)) return 'Hello! Tell me what you enjoy most—lagoon days, nature, culture, food, adventure or a quiet escape—and I’ll suggest islands to explore.';
 return 'I can help you choose islands by the kind of trip you imagine. Try mentioning what you love—lagoon, nature, hiking, culture, food, vanilla, sailing or a quiet getaway. I can also sketch a sample itinerary, but this demo does not check live availability.';
}

export default function GraceonAssistant({journeyIslands}:GraceonAssistantProps){
 const [open,setOpen]=useState(false);
 const [message,setMessage]=useState('');
 const [messages,setMessages]=useState<Message[]>([]);
 const quickPrompts=language==='FR'?['J’aime la nature et la randonnée','Je veux découvrir la culture locale','Aidez-moi à préparer 5 jours']:quickPromptsDefault;
 const send=(text:string)=>{
  const value=text.trim(); if(!value) return;
  setMessages(prev=>[...prev,{role:'user',text:value},{role:'assistant',text:getDemoReply(value,journeyIslands)}]);
  setMessage('');
 };
 const styles=` .graceon-assistant{position:fixed;right:24px;bottom:24px;z-index:1200;font-family:inherit;color:#163e3c}.ga-launcher{display:flex;align-items:center;gap:11px;border:0;background:#163e3c;color:#f5f2e9;padding:12px 16px;border-radius:999px;box-shadow:0 12px 32px #102e2e35;cursor:pointer;font-size:10px;letter-spacing:.12em}.ga-launcher small{display:block;font-size:7px;letter-spacing:.15em;color:#d4b6a2;margin-top:3px}.ga-launch-icon{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#c87956;color:white}.ga-panel{width:min(360px,calc(100vw - 32px));height:470px;max-height:calc(100vh - 105px);display:flex;flex-direction:column;background:#f5f2e9;border:1px solid #ded9cd;box-shadow:0 18px 55px #102e2e28;border-radius:18px;overflow:hidden;margin-bottom:12px}.ga-header{display:flex;align-items:center;gap:10px;padding:15px 16px;background:#163e3c;color:#f5f2e9}.ga-avatar{width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:#c87956}.ga-header b{font-size:11px;letter-spacing:.15em;display:block}.ga-header small{font-size:7px;letter-spacing:.13em;color:#dfc3af;display:block;margin-top:3px}.ga-header button{margin-left:auto;border:0;background:transparent;color:white;cursor:pointer}.ga-body{padding:16px;overflow:auto;flex:1}.ga-welcome .ga-kicker{font-size:8px;letter-spacing:.15em;color:#b16e51}.ga-welcome h3{font:25px 'Playfair Display',serif;font-weight:400;margin:12px 0 8px}.ga-welcome p{font-size:11px;line-height:1.7;color:#657671}.ga-quick{display:grid;gap:8px;margin-top:18px}.ga-route-context{display:grid;gap:8px;margin:14px 0;padding:12px;background:#e8e4d9;border:1px solid #d8d4c9;border-radius:10px}.ga-route-context b{font-size:8px;letter-spacing:.12em;color:#b16e51}.ga-route-context span{font-size:10px;line-height:1.6;color:#284d48}.ga-route-context button{display:flex;align-items:center;justify-content:center;gap:7px;border:0;border-radius:7px;background:#163e3c;color:#fff;padding:9px;font-size:8px;letter-spacing:.1em;cursor:pointer}.ga-quick button{border:1px solid #d8d4c9;background:#fff;padding:10px 12px;text-align:left;font-size:10px;color:#345c55;border-radius:9px;cursor:pointer}.ga-message{max-width:90%;padding:10px 12px;border-radius:12px;margin:8px 0;font-size:11px;line-height:1.7;white-space:pre-wrap}.ga-user{margin-left:auto;background:#163e3c;color:#fff;border-bottom-right-radius:3px}.ga-bot{background:#e8e4d9;color:#284d48;border-bottom-left-radius:3px}.ga-input{display:flex;gap:7px;padding:10px;border-top:1px solid #ded9cd}.ga-input input{flex:1;min-width:0;border:1px solid #ded9cd;background:#fff;border-radius:999px;padding:10px 13px;font-size:11px;outline:none}.ga-input button{border:0;background:#c87956;color:white;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;cursor:pointer}.ga-note{text-align:center;font-size:7px;color:#8d978e;padding:0 0 10px}.ga-welcome p strong{color:#315d55;font-weight:700}@media(max-width:640px){.graceon-assistant{right:12px;bottom:12px}.ga-launcher{padding:9px 12px}.ga-panel{height:440px}}`;
 return <div className="graceon-assistant"><style>{styles}</style>
  {open&&<section className="ga-panel" aria-label="GRACEON travel assistant">
   <header className="ga-header"><div className="ga-avatar"><Sparkles size={17}/></div><div><b>GRACEON</b><small>{language==="FR"?"GUIDE DES ÎLES · CONCEPT":"ISLAND GUIDE · CONCEPT"}</small></div><button onClick={()=>setOpen(false)} aria-label="Close assistant"><X size={18}/></button></header>
   <div className="ga-body">
    {messages.length===0&&<div className="ga-welcome"><span className="ga-kicker">{language==="FR"?"BONJOUR · BIENVENUE DANS LES ÎLES":"HELLO · WELCOME TO THE ISLANDS"}</span><h3>{language==="FR"?"Bonjour, je suis GRACEON.":"Hello, I’m GRACEON."}</h3><p>{language==="FR"?<>Votre assistant de voyage, créé par <strong>GRACEON Digital Studio</strong>. Je vous aide à découvrir les huit îles de Tahiti, à trouver des expériences selon vos envies et à imaginer votre voyage.</>:<>Your island travel assistant, created by <strong>GRACEON Digital Studio</strong>. I’m here to help you discover the eight islands of Tahiti, find experiences that match your interests and shape ideas for your journey. Tell me what you love, and let’s explore.</>}</p>{journeyIslands.length>0&&<div className="ga-route-context"><b>YOUR CURRENT ROUTE · {journeyIslands.length} ISLANDS</b><span>{journeyIslands.join('  →  ')}</span><button type="button" onClick={()=>send('Help me plan my journey')}>PLAN MY SELECTED ISLANDS <Send size={12}/></button></div>}<div className="ga-quick">{quickPrompts.map(prompt=><button key={prompt} onClick={()=>send(prompt)}>{prompt}</button>)}</div></div>}
    {messages.map((item,i)=><div key={i} className={item.role==='user'?'ga-message ga-user':'ga-message ga-bot'}>{item.text}</div>)}
   </div>
   <form className="ga-input" onSubmit={e=>{e.preventDefault();send(message)}}><input value={message} onChange={e=>setMessage(e.target.value)} placeholder={language==="FR"?"Posez une question sur les îles…":"Ask about the islands…"} aria-label="Ask GRACEON"/><button type="submit" aria-label="Send message"><Send size={16}/></button></form>
   <div className="ga-note">{language==="FR"?"Démo conceptuelle · suggestions prédéfinies, sans IA en direct":"Concept demo · preset recommendations, no live AI"}</div>
  </section>}
  <button className="ga-launcher" onClick={()=>setOpen(v=>!v)} aria-expanded={open}><span className="ga-launch-icon">G</span></button>
 </div>;
}
