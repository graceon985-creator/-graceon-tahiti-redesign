import {useState} from 'react';
import {MessageCircle, X, Send, Sparkles} from 'lucide-react';

const quickPrompts = ['Which island is best for nature?','Help me plan 5 days','I want culture and local life'];

function getDemoReply(message:string){
  const text=message.toLowerCase();
  if(text.includes('nature') || text.includes('green') || text.includes('hike')) return 'For lush valleys and scenic trails, start with Moorea or Tahiti. If you want a quieter, heritage-rich atmosphere, Huahine is also a great direction. Explore each island page to see highlights.';
  if(text.includes('5 day') || text.includes('five day') || text.includes('plan')) return 'A sample 5-day idea: 2 days in Tahiti for markets, culture and the coast, then 3 days in Moorea for lagoon and mountain scenery. This is a starting point—travel times and availability need checking.';
  if(text.includes('culture') || text.includes('local') || text.includes('heritage')) return 'For cultural discovery, consider Tahiti for markets and everyday life, and Raiatea or Huahine for deeper heritage and historic sites. Choose local guides and follow site-specific guidance.';
  if(text.includes('bora')) return 'Bora Bora is known for its lagoon and mountain views. You can explore the destination guide for Matira Beach, Vaitape, lagoon outings and heritage highlights.';
  return 'I can help you explore the islands, compare destinations, and sketch a trip. Try choosing a theme—nature, culture, beaches, adventure—or open an island guide for more detail.';
}

export default function GraceonAssistant(){
 const [open,setOpen]=useState(false);
 const [message,setMessage]=useState('');
 const [messages,setMessages]=useState<{role:'user'|'assistant';text:string}[]>([]);
 const send=(text:string)=>{
  const value=text.trim(); if(!value) return;
  setMessages(prev=>[...prev,{role:'user',text:value},{role:'assistant',text:getDemoReply(value)}]);
  setMessage('');
 };
 const styles = ` .graceon-assistant{position:fixed;right:24px;bottom:24px;z-index:1200;font-family:inherit;color:#163e3c}.ga-launcher{display:flex;align-items:center;gap:11px;border:0;background:#163e3c;color:#f5f2e9;padding:12px 16px;border-radius:999px;box-shadow:0 12px 32px #102e2e35;cursor:pointer;font-size:10px;letter-spacing:.12em}.ga-launcher small{display:block;font-size:7px;letter-spacing:.15em;color:#d4b6a2;margin-top:3px}.ga-launch-icon{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#c87956;color:white}.ga-panel{width:min(360px,calc(100vw - 32px));height:470px;max-height:calc(100vh - 105px);display:flex;flex-direction:column;background:#f5f2e9;border:1px solid #ded9cd;box-shadow:0 18px 55px #102e2e28;border-radius:18px;overflow:hidden;margin-bottom:12px}.ga-header{display:flex;align-items:center;gap:10px;padding:15px 16px;background:#163e3c;color:#f5f2e9}.ga-avatar{width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:#c87956}.ga-header b{font-size:11px;letter-spacing:.15em;display:block}.ga-header small{font-size:7px;letter-spacing:.13em;color:#dfc3af;display:block;margin-top:3px}.ga-header button{margin-left:auto;border:0;background:transparent;color:white;cursor:pointer}.ga-body{padding:16px;overflow:auto;flex:1}.ga-welcome .ga-kicker{font-size:8px;letter-spacing:.15em;color:#b16e51}.ga-welcome h3{font:25px 'Playfair Display',serif;font-weight:400;margin:12px 0 8px}.ga-welcome p{font-size:11px;line-height:1.7;color:#657671}.ga-quick{display:grid;gap:8px;margin-top:18px}.ga-quick button{border:1px solid #d8d4c9;background:#fff;padding:10px 12px;text-align:left;font-size:10px;color:#345c55;border-radius:9px;cursor:pointer}.ga-message{max-width:90%;padding:10px 12px;border-radius:12px;margin:8px 0;font-size:11px;line-height:1.7;white-space:pre-wrap}.ga-user{margin-left:auto;background:#163e3c;color:#fff;border-bottom-right-radius:3px}.ga-bot{background:#e8e4d9;color:#284d48;border-bottom-left-radius:3px}.ga-input{display:flex;gap:7px;padding:10px;border-top:1px solid #ded9cd}.ga-input input{flex:1;min-width:0;border:1px solid #ded9cd;background:#fff;border-radius:999px;padding:10px 13px;font-size:11px;outline:none}.ga-input button{border:0;background:#c87956;color:white;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;cursor:pointer}.ga-note{text-align:center;font-size:7px;color:#8d978e;padding:0 0 10px}@media(max-width:640px){.graceon-assistant{right:12px;bottom:12px}.ga-launcher{padding:9px 12px}.ga-panel{height:440px}}`;
 return <div className="graceon-assistant"><style>{styles}</style>
  {open&&<section className="ga-panel" aria-label="GRACEON travel assistant">
   <header className="ga-header"><div className="ga-avatar"><Sparkles size={17}/></div><div><b>GRACEON</b><small>ISLAND GUIDE · DEMO</small></div><button onClick={()=>setOpen(false)} aria-label="Close assistant"><X size={18}/></button></header>
   <div className="ga-body">
    {messages.length===0&&<div className="ga-welcome"><span className="ga-kicker">YOUR ISLAND COMPANION</span><h3>Where would you like to go?</h3><p>Tell me what you love and I’ll help you find an island to explore.</p><div className="ga-quick">{quickPrompts.map(prompt=><button key={prompt} onClick={()=>send(prompt)}>{prompt}</button>)}</div></div>}
    {messages.map((item,i)=><div key={i} className={item.role==='user'?'ga-message ga-user':'ga-message ga-bot'}>{item.text}</div>)}
   </div>
   <form className="ga-input" onSubmit={e=>{e.preventDefault();send(message)}}><input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Ask about the islands…" aria-label="Ask GRACEON"/><button type="submit" aria-label="Send message"><Send size={16}/></button></form>
   <div className="ga-note">Concept demo · responses are prewritten, not live AI</div>
  </section>}
  <button className="ga-launcher" onClick={()=>setOpen(v=>!v)} aria-expanded={open}><span className="ga-launch-icon"><MessageCircle size={18}/></span><span>GRACEON <small>ISLAND GUIDE</small></span>{open?<X size={16}/>:<Sparkles size={16}/>}</button>
 </div>;
}
