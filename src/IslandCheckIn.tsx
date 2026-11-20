import {useState} from 'react';
import {checkInZones} from './checkInZones';
import {MapPin, ShieldCheck, LoaderCircle, Navigation} from 'lucide-react';
type VerifiedVisit = {verifiedAt:string; accuracy:number};
type Props = {islandName:string; visit?:VerifiedVisit; onVerified:(visit:VerifiedVisit)=>void; language?:'EN'|'FR'};
// Each check-in is tied to a specific visitor hub, not the whole island.
// The radius is intentionally tighter than the earlier concept version.
function distanceMetres(a:number,b:number,c:number,d:number){const rad=(n:number)=>n*Math.PI/180;const earth=6371000;const dLat=rad(c-a),dLng=rad(d-b);const h=Math.sin(dLat/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(dLng/2)**2;return 2*earth*Math.asin(Math.sqrt(h));}
export default function IslandCheckIn({islandName,visit,onVerified,language='EN'}:Props){
 const [status,setStatus]=useState(''); const [busy,setBusy]=useState(false); const zone=checkInZones[islandName]; const fr=language==='FR';
 const mapUrl=zone?'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(zone.lat+','+zone.lng):null;
 const copy=fr?{
  passed:'VÉRIFICATION DE POSITION RÉUSSIE',title:'Votre visite à '+islandName+' est enregistrée sur cet appareil.',checked:'Visite vérifiée le ',accuracy:' · précision GPS ±',
  label:'POINTAGE GPS SUR L’ÎLE',heading:'Confirmez votre présence près de '+islandName,
  instruction:'Autorisez une seule lecture de votre position dans un rayon de '+(zone?.radius||800)+' m autour de '+(zone?.name||'ce point de visite')+'. Ce point de référence est approximatif et doit être confirmé localement. La position est vérifiée sur cet appareil ; les coordonnées ne sont pas enregistrées.',
  map:'VOIR LA ZONE DE POINTAGE SUR GOOGLE MAPS',note:'Limite du prototype : le pointage est enregistré uniquement dans ce navigateur. La position du navigateur peut être falsifiée ; elle ne constitue pas une preuve de visite authentifiée par un serveur.',
  unavailable:'Aucun point de visite n’est encore configuré pour cette île.',secure:'L’accès à la position nécessite une connexion HTTPS sécurisée. Ouvrez le site publié en HTTPS puis réessayez.',unsupported:'La géolocalisation n’est pas prise en charge par ce navigateur.',request:'Demande d’une nouvelle position…',invalid:'L’appareil a fourni une position invalide. Veuillez réessayer.',imprecise:'La position manque de précision (±'+Math.round(0)+' m). Attendez une meilleure précision puis réessayez.',
  outside:'Cette position est en dehors de la zone de pointage de '+(zone?.name||islandName)+' ou sa marge de précision dépasse la limite. La zone se trouve dans un rayon de '+(zone?.radius||800)+' m autour du point de visite.',
  success:'Position vérifiée sur cet appareil. Le tampon de démonstration a été ajouté localement.',
  denied:'Autorisation de localisation refusée. Vous pouvez l’autoriser dans les paramètres du navigateur puis réessayer.',unknown:'Votre appareil n’a pas pu déterminer votre position. Vérifiez les services de localisation.',timeout:'La demande de position a expiré. Réessayez dans un endroit dégagé.',failed:'Le navigateur n’a pas pu obtenir votre position. Veuillez réessayer.',start:'Impossible de démarrer la demande de position. Vérifiez les autorisations du site puis réessayez.',
  button:'VÉRIFIER MA VISITE',checking:'VÉRIFICATION EN COURS'
 }:{
  passed:'LOCATION CHECK PASSED',title:'Your '+islandName+' check-in is recorded on this device.',checked:'Checked in ',accuracy:' · GPS accuracy ±',
  label:'GPS ISLAND CHECK-IN',heading:'Check in near '+islandName,
  instruction:'Allow one-time location access within '+(zone?.radius||800)+' m of '+(zone?.name||'the island check-in point')+'. The hub is an approximate reference point and needs local confirmation. A fresh reading is checked on this device; coordinates are not saved.',
  map:'VIEW CHECK-IN AREA IN GOOGLE MAPS',note:'Prototype limitation: the check-in record is stored in this browser only. Browser location can be manipulated, so this is not server-authenticated proof of a visit.',
  unavailable:'A check-in point is not configured for this island yet.',secure:'Browser location access requires a secure HTTPS connection. Open the published HTTPS site and try again.',unsupported:'Location services are not supported by this browser.',request:'Requesting a fresh location reading…',invalid:'The device returned an invalid location reading. Please try again.',imprecise:'The location reading is not precise enough yet. Wait for a clearer reading and try again.',
  outside:'This reading is outside the '+(zone?.name||islandName)+' check-in area, or its accuracy overlaps the boundary. The check-in area is within '+(zone?.radius||800)+' m of this visitor hub.',
  success:'Location check passed on this device. Your prototype stamp has been added locally.',
  denied:'Location permission was denied. You can allow it in your browser settings and try again.',unknown:'Your device could not determine a location. Check location services and try again.',timeout:'The location request timed out. Try again with a clearer view of the sky.',failed:'The browser could not complete the location request. Please try again.',start:'The browser could not start a location request. Check your site permissions and try again.',
  button:'VERIFY MY VISIT',checking:'CHECKING'
 };
 const verify=()=>{
  if(busy||visit)return;
  if(!zone){setStatus(copy.unavailable);return;}
  if(!window.isSecureContext){setStatus(copy.secure);return;}
  if(!navigator.geolocation){setStatus(copy.unsupported);return;}
  setBusy(true);setStatus(copy.request);
  try{
   navigator.geolocation.getCurrentPosition(position=>{
    const {latitude,longitude,accuracy}=position.coords;
    if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||!Number.isFinite(accuracy)||accuracy<=0||Math.abs(latitude)>90||Math.abs(longitude)>180){
     setStatus(copy.invalid);setBusy(false);return;
    }
    if(accuracy>100){
     setStatus(fr?'La position manque de précision (±'+Math.round(accuracy)+' m). Réessayez lorsque le signal sera meilleur.':'The location reading is not precise enough yet (±'+Math.round(accuracy)+' m). Move to an open area and try again.');setBusy(false);return;
    }
    const distance=distanceMetres(latitude,longitude,zone.lat,zone.lng);
    // Require the full reported accuracy circle to fit inside the check-in zone.
    if(distance+accuracy>zone.radius){
     setStatus(copy.outside);setBusy(false);return;
    }
    const verifiedAt=new Date().toISOString();
    onVerified({verifiedAt,accuracy:Math.max(1,Math.round(accuracy))});
    setStatus(copy.success);setBusy(false);
   },error=>{
    const message=error.code===1?copy.denied:error.code===2?copy.unknown:error.code===3?copy.timeout:copy.failed;
    setStatus(message);setBusy(false);
   },{enableHighAccuracy:true,timeout:25000,maximumAge:0});
  }catch{setStatus(copy.start);setBusy(false);}
 };
 return <section className='island-checkin' aria-live='polite'>
  <div className='island-checkin-icon'>{visit?<ShieldCheck size={22}/>:<MapPin size={22}/>}</div>
  <div className='island-checkin-copy'><span className='detail-label'>{visit?copy.passed:copy.label}</span>
   <h3>{visit?copy.title:copy.heading}</h3>
   <p>{visit?copy.checked+new Date(visit.verifiedAt).toLocaleString(fr?'fr-FR':undefined)+(fr?' · précision GPS ±':' · GPS accuracy ±')+visit.accuracy+' m':copy.instruction}</p>
   {!visit&&<>{mapUrl&&<a href={mapUrl} target='_blank' rel='noopener noreferrer'>{copy.map} <Navigation size={13}/></a>}<p className='island-checkin-note'>{copy.note}</p></>}
   {status&&<p className='island-checkin-status' role='status'>{status}</p>}
  </div>
  {!visit&&<button type='button' onClick={verify} disabled={busy} aria-busy={busy}>{busy?<><LoaderCircle size={14} className='spin'/> {copy.checking}</>:<>{copy.button} <ShieldCheck size={14}/></>}</button>}
 </section>;
}
