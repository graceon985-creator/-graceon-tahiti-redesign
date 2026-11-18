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
  if(busy||visit)return;
  if(!zone){setStatus('A check-in point is not configured for this island yet.');return;}
  if(!window.isSecureContext){setStatus('Browser location access requires a secure HTTPS connection. Open the published HTTPS site and try again.');return;}
  if(!navigator.geolocation){setStatus('Location services are not supported by this browser.');return;}
  setBusy(true);setStatus('Requesting a fresh location reading…');
  try{
   navigator.geolocation.getCurrentPosition(position=>{
    const {latitude,longitude,accuracy}=position.coords;
    if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||!Number.isFinite(accuracy)||accuracy<=0||Math.abs(latitude)>90||Math.abs(longitude)>180){
     setStatus('The device returned an invalid location reading. Please try again.');setBusy(false);return;
    }
    if(accuracy>100){
     setStatus('The location reading is not precise enough yet (±'+Math.round(accuracy)+' m). Move to an open area and try again.');setBusy(false);return;
    }
    const distance=distanceMetres(latitude,longitude,zone.lat,zone.lng);
    // Require the full reported accuracy circle to fit inside the check-in zone.
    if(distance+accuracy>zone.radius){
     setStatus('This reading is outside the '+zone.name+' check-in area, or its accuracy overlaps the boundary. The check-in area is within 800 m of this visitor hub.');setBusy(false);return;
    }
    const verifiedAt=new Date().toISOString();
    onVerified({verifiedAt,accuracy:Math.round(accuracy)});
    setStatus('Location check passed on this device. Your prototype stamp has been added locally.');setBusy(false);
   },error=>{
    const message=error.code===1?'Location permission was denied. You can allow it in your browser settings and try again.':error.code===2?'Your device could not determine a location. Check location services and try again.':error.code===3?'The location request timed out. Try again with a clearer view of the sky.':'The browser could not complete the location request. Please try again.';
    setStatus(message);setBusy(false);
   },{enableHighAccuracy:true,timeout:25000,maximumAge:0});
  }catch{
   setStatus('The browser could not start a location request. Check your site permissions and try again.');setBusy(false);
  }
 };
 return <section className='island-checkin' aria-live='polite'>
  <div className='island-checkin-icon'>{visit?<ShieldCheck size={22}/>:<MapPin size={22}/>}</div>
  <div className='island-checkin-copy'><span className='detail-label'>{visit?'LOCATION CHECK PASSED':'GPS ISLAND CHECK-IN'}</span>
   <h3>{visit?'Your '+islandName+' check-in is recorded on this device.':'Check in near '+islandName}</h3>
   <p>{visit?'Checked in '+new Date(visit.verifiedAt).toLocaleString()+' · GPS accuracy ±'+visit.accuracy+' m':'Allow one-time location access within 800 m of '+(zone?.name||'the island check-in point')+'. A fresh location reading is checked on this device; coordinates are not saved.'}</p>
   {!visit&&<><a href={mapUrl} target='_blank' rel='noopener noreferrer'>VIEW CHECK-IN AREA IN GOOGLE MAPS <Navigation size={13}/></a><p className='island-checkin-note'>Prototype limitation: the check-in record is stored in this browser only. Browser location can be manipulated, so this is not server-authenticated proof of a visit.</p></>}
   {status&&<p className='island-checkin-status' role='status'>{status}</p>}
  </div>
  {!visit&&<button type='button' onClick={verify} disabled={busy} aria-busy={busy}>{busy?<><LoaderCircle size={14} className='spin'/> CHECKING</>:<>VERIFY MY VISIT <ShieldCheck size={14}/></>}</button>}
 </section>;
}
