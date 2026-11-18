import {useState} from 'react';
import {MapPin, ShieldCheck, LoaderCircle, Navigation} from 'lucide-react';
type VerifiedVisit = {verifiedAt:string; accuracy:number};
type Props = {islandName:string; visit?:VerifiedVisit; onVerified:(visit:VerifiedVisit)=>void};
// Each check-in is tied to a specific visitor hub, not the whole island.
// The 800 m radius is intentionally tighter than the earlier concept version.
const checkInZones:Record<string,{name:string;lat:number;lng:number;radius:number}>={
 Tahiti:{name:'Papeete waterfront',lat:-17.5347,lng:-149.5684,radius:800},
 Moorea:{name:'Paopao village',lat:-17.5186,lng:-149.8219,radius:800},
 'Bora Bora':{name:'Vaitape village',lat:-16.5074,lng:-151.7491,radius:800},
 Huahine:{name:'Fare village',lat:-16.7123,lng:-151.0349,radius:800},
 Raiatea:{name:'Uturoa waterfront',lat:-16.7302,lng:-151.4426,radius:800},
 'Taha’a':{name:'Vaitoare village',lat:-16.6762,lng:-151.4574,radius:800},
 Rangiroa:{name:'Avatoru village',lat:-14.9417,lng:-147.7020,radius:800},
 Fakarava:{name:'Rotoava village',lat:-16.05586,lng:-145.61987,radius:800}
};
function distanceMetres(a:number,b:number,c:number,d:number){const rad=(n:number)=>n*Math.PI/180;const earth=6371000;const dLat=rad(c-a),dLng=rad(d-b);const h=Math.sin(dLat/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(dLng/2)**2;return 2*earth*Math.asin(Math.sqrt(h));}
export default function IslandCheckIn({islandName,visit,onVerified}:Props){
 const [status,setStatus]=useState(''); const [busy,setBusy]=useState(false); const zone=checkInZones[islandName];
 const mapUrl=zone?'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(zone.lat+','+zone.lng):'#';
 const verify=()=>{
  if(!zone){setStatus('A verified check-in point is not configured for this island yet.');return;}
  if(!('geolocation' in navigator)){setStatus('Location services are not supported by this browser.');return;}
  setBusy(true);setStatus('Checking your current location…');
  navigator.geolocation.getCurrentPosition(position=>{
   const latitude=position.coords.latitude,longitude=position.coords.longitude,accuracy=position.coords.accuracy;
   if(accuracy>100){setStatus('Your location accuracy is too low for a reliable check-in. Move to an open area and try again.');setBusy(false);return;}
   const distance=distanceMetres(latitude,longitude,zone.lat,zone.lng);
   if(distance+accuracy>zone.radius){setStatus('You are outside the '+zone.name+' check-in area. The check-in zone is within 800 m of this visitor hub.');setBusy(false);return;}
   const verifiedAt=new Date().toISOString();onVerified({verifiedAt,accuracy:Math.round(accuracy)});setStatus('Location check passed. Your island stamp has been added to this device’s passport.');setBusy(false);
  },error=>{const message=error.code===1?'Location permission was not granted. Allow location access in your browser settings to check in.':error.code===2?'Your location could not be determined. Check your device location settings and try again.':'Location request timed out. Try again in an open area.';setStatus(message);setBusy(false);},{enableHighAccuracy:true,timeout:20000,maximumAge:0});
 };
 return <section className='island-checkin' aria-live='polite'>
  <div className='island-checkin-icon'>{visit?<ShieldCheck size={22}/>:<MapPin size={22}/>}</div>
  <div className='island-checkin-copy'><span className='detail-label'>{visit?'VISIT VERIFIED':'GPS ISLAND CHECK-IN'}</span>
   <h3>{visit?'Your '+islandName+' stamp is secured.':'Verify your visit to '+islandName}</h3>
   <p>{visit?'Checked in '+new Date(visit.verifiedAt).toLocaleString()+' · GPS accuracy ±'+visit.accuracy+' m':'Allow one-time location access within 800 m of '+(zone?.name||'the island check-in point')+'. Your coordinates are checked on this device and are not saved.'}</p>
   {!visit&&<><a href={mapUrl} target='_blank' rel='noopener noreferrer'>VIEW CHECK-IN AREA IN GOOGLE MAPS <Navigation size={13}/></a><p className='island-checkin-note'>Prototype note: check-ins are stored in this browser only. This client-side demo is not a server-authenticated anti-fraud system.</p></>}
   {status&&<p className='island-checkin-status' role='status'>{status}</p>}
  </div>
  {!visit&&<button type='button' onClick={verify} disabled={busy}>{busy?<><LoaderCircle size={14} className='spin'/> CHECKING</>:<>VERIFY MY VISIT <ShieldCheck size={14}/></>}</button>}
 </section>;
}
