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
 return <div className="graceon-assistant">
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
