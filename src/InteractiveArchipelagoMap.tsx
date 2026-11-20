import {useEffect,useMemo,useState} from 'react';
import {Circle,CircleMarker,MapContainer,Popup,TileLayer,useMap} from 'react-leaflet';
import {checkInZones} from './checkInZones';
import type {LatLngExpression} from 'leaflet';
import {ArrowRight,MapPin} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './InteractiveArchipelagoMap.css';

type Island = {name:string;kind:string;description:string};
type Activity = {title:string;category:string;location:string;description:string;mapQuery:string;officialUrl:string};
type Props = {islands:Island[];activities:Record<string,Activity[]>;focusRequest?:{islandName:string;title:string;nonce:number}|null;language?:'EN'|'FR'};
type Pin = {island:string;title:string;category:string;location:string;description:string;officialUrl:string;mapQuery:string;lat:number;lng:number;precision:string};

// Map references are approximate; valley/village markers identify the named geographic
// area, not a precise trailhead or access point. Confirm pins with local partners before launch.
const verifiedPins:Record<string,{lat:number;lng:number;precision:string}> = {
  'Papeete Market & Waterfront':{lat:-17.52946,lng:-149.55213,precision:'Marketplace location'},
  'Faarumai Waterfalls':{lat:-17.53865,lng:-149.40065,precision:'Waterfall location'},
  'Papenoo Valley':{lat:-17.51667,lng:-149.41667,precision:'Valley reference point'},
  'Point Venus':{lat:-17.49443,lng:-149.49427,precision:'Coastal landmark'},
  'Belvedere Lookout':{lat:-17.54038,lng:-149.82682,precision:'Viewpoint location'},
  'Ta’ahiamanu Beach':{lat:-17.49173,lng:-149.85022,precision:'Beach location'},
  'Matira Beach':{lat:-16.53766,lng:-151.74206,precision:'Beach location'},
  'Vaitape Village':{lat:-16.50652,lng:-151.75143,precision:'Village centre'},
  'Maeva Archaeological Area':{lat:-16.7002,lng:-150.98738,precision:'Maeva village area; exact site pin pending'},
  'Faaroa River':{lat:-16.8418,lng:-151.4243,precision:'Faaroa valley reference point'},
  'Vanilla Plantations':{lat:-16.62423,lng:-151.43587,precision:'Vallée de la Vanille attraction'},
  'Coral Garden':{lat:-16.64447,lng:-151.42601,precision:'Jardin de corail viewpoint'},
  'Tiputa Pass':{lat:-14.97049,lng:-147.62793,precision:'Pass location'},
  'Avatoru & Tiputa Villages':{lat:-14.94197,lng:-147.70615,precision:'Avatoru village centre'},
  'Garuae Pass':{lat:-16.08213,lng:-145.71654,precision:'Pass location'}
};

const islandCoordinates:Record<string,[number,number]> = {
  'Tahiti':[-17.667,-149.467],
  'Moorea':[-17.517,-149.817],
  'Bora Bora':[-16.498,-151.736],
  'Huahine':[-16.733,-151.033],
  'Raiatea':[-16.820,-151.440],
  'Taha’a':[-16.610,-151.500],
  'Rangiroa':[-15.117,-147.633],
  'Fakarava':[-16.310,-145.625]
};

function MapIslandAutoFocus({position}:{position:LatLngExpression}) {
  const map = useMap();
  useEffect(()=>{map.flyTo(position,7,{duration:1.1})},[map,position]);
  return null;
}

function MapActivityPinFocus({pin}:{pin:Pin|null}) {
  const map = useMap();
  useEffect(()=>{if(pin) map.flyTo([pin.lat,pin.lng],11,{duration:1.1})},[map,pin]);
  return null;
}


export default function InteractiveArchipelagoMap({islands,activities,focusRequest,language='EN'}:Props) {
  const islandDescriptionsFR:Record<string,string>={Tahiti:'Papeete animée, montagnes volcaniques, plages de sable noir et vallées verdoyantes.',Moorea:'Deux baies spectaculaires, des montagnes verdoyantes, des champs d’ananas et un lagon lumineux.', 'Bora Bora':'Un lagon turquoise, des motu bordés de palmiers et le mont Otemanu.',Huahine:'Deux îles reliées, des villages paisibles, des sites anciens et un lagon luxuriant.',Raiatea:'Une île verdoyante au riche patrimoine culturel, avec la rivière Faaroa et un lagon partagé avec Taha’a.', 'Taha’a':'Plantations de vanille, petits motu, jardins de corail et lagon paisible.',Rangiroa:'Un vaste atoll aux horizons océaniques, aux villages lagonaires et aux passes riches en vie marine.',Fakarava:'Une réserve de biosphère de l’UNESCO, avec un vaste lagon, des villages isolés et des récifs fragiles.'};
const fr=language==='FR';
  const categoryLabel=(value:string)=>fr?({'All':'Tout','LANDSCAPE':'PAYSAGE','GREEN HEART':'CŒUR VERT','CULTURAL HERITAGE':'PATRIMOINE CULTUREL','VIEWPOINT & WALK':'BELVÉDÈRE ET RANDONNÉE','BEACH & LAGOON':'PLAGE ET LAGON','THE TWIN BAYS':'LES DEUX BAIES','OCEAN EXPERIENCES':'EXPÉRIENCES OCÉANIQUES','LOCAL AGRICULTURE':'AGRICULTURE LOCALE','FOOD & LOCAL LIFE':'GASTRONOMIE ET VIE LOCALE','CULTURE & HISTORY':'CULTURE ET HISTOIRE','LAGOON':'LAGON','COAST':'CÔTE','NATURE':'NATURE','HISTORY':'HISTOIRE','LOCAL LIFE':'VIE LOCALE','HERITAGE':'PATRIMOINE'} as Record<string,string>)[value]||value:value;
  const [selected,setSelected] = useState('Tahiti');
  const [filter,setFilter] = useState('All');
  const [focusedTitle,setFocusedTitle] = useState<string|null>(null);
  const activeIsland = islands.find(island=>island.name===selected) ?? islands[0];
  const position = (islandCoordinates[selected] ?? islandCoordinates.Tahiti) as LatLngExpression;
  const checkInZone = checkInZones[selected];
  const selectedActivities = useMemo(()=>activities[selected] ?? [],[activities,selected]);
  const categories = ['All',...Array.from(new Set(selectedActivities.map(item=>item.category.split(' · ')[0])))];
  const pins:Pin[] = selectedActivities.flatMap(activity=>{
    const point=verifiedPins[activity.title];
    return point?[{...activity,island:selected,...point}]:[];
  });
  const focusedPin = pins.find(pin=>pin.title===focusedTitle) ?? null;
  useEffect(()=>{if(!focusRequest)return;setSelected(focusRequest.islandName);setFilter('All');setFocusedTitle(focusRequest.title)},[focusRequest?.nonce]);
  const focusedPlaceIsUnpinned=Boolean(focusRequest&&selected===focusRequest.islandName&&!verifiedPins[focusRequest.title]);
  const visibleActivities = selectedActivities.filter(item=>filter==='All'||item.category.startsWith(filter));
  return <section id="explore-map" className="archipelago-map-section">
    <div className="archipelago-map-heading">
      <div><span className="section-kicker">{fr?"03 / EXPLORER L’ARCHIPEL":"03 / EXPLORE THE ARCHIPELAGO"}</span><h2>{fr?"Trouvez votre place":"Find your place"}<br/><em>{fr?"sur la carte.":"on the map."}</em></h2></div>
      <p>{fr?"Explorez les huit îles, les lieux sélectionnés et la zone approximative du point de visite GPS. Le cercle en pointillés indique le rayon de démonstration.":"Explore the eight islands, featured places and the approximate GPS check-in hub. The dashed circle shows the local prototype check-in radius."}</p>
    </div>
    <div className="archipelago-map-controls">
      <label htmlFor="archipelago-island-select">{fr?"CHOISIR UNE ÎLE":"SELECT AN ISLAND"}</label>
      <select id="archipelago-island-select" value={selected} onChange={event=>{setSelected(event.target.value);setFilter('All');setFocusedTitle(null)}}>
        {islands.filter(island=>islandCoordinates[island.name]).map(island=><option key={island.name} value={island.name}>{island.name}</option>)}
      </select>
      <span><MapPin size={14}/> {pins.length} {fr?"LIEUX CARTOGRAPHIÉS":"MAP REFERENCES"} · {selectedActivities.length-pins.length} {fr?"À VÉRIFIER":"PENDING"}</span>
    </div>
    <div className="archipelago-map-layout">
      <div className="archipelago-map-frame">
        <MapContainer center={[-16.5,-149.5]} zoom={4.6} minZoom={3} maxZoom={13} scrollWheelZoom={false} className="archipelago-leaflet-map">
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          <MapIslandAutoFocus position={position}/>
          {checkInZone&&<><Circle center={[checkInZone.lat,checkInZone.lng]} radius={checkInZone.radius} pathOptions={{color:'#bd7656',weight:2,fillColor:'#bd7656',fillOpacity:0.12,dashArray:'6 6'}}/><CircleMarker center={[checkInZone.lat,checkInZone.lng]} radius={8} pathOptions={{color:'#fff8ec',weight:2,fillColor:'#bd7656',fillOpacity:1}}><Popup><strong>{checkInZone.name}</strong><br/>GPS check-in reference area · {checkInZone.radius} m radius<br/><small>{checkInZone.precision}</small></Popup></CircleMarker></>}
          <MapActivityPinFocus pin={focusedPin}/>
          {Object.entries(islandCoordinates).map(([name,coords])=><CircleMarker key={name} center={coords} radius={selected===name?9:6} pathOptions={{color:'#f5f0e5',weight:2,fillColor:selected===name?'#bd7656':'#1c5550',fillOpacity:1}} eventHandlers={{click:()=>{setSelected(name);setFilter('All');setFocusedTitle(null)}}}>
            <Popup><strong>{name}</strong><br/>{fr?"Repère géographique de l’île":"Island reference location"}</Popup>
          </CircleMarker>)}
          {pins.map(pin=><CircleMarker key={pin.title} center={[pin.lat,pin.lng]} radius={focusedTitle===pin.title?10:7} pathOptions={{color:'#f8f4e9',weight:2,fillColor:'#bd7656',fillOpacity:1}} eventHandlers={{click:()=>setFocusedTitle(pin.title)}}>
            <Popup><strong>{pin.title}</strong><br/>{pin.location}<br/><small>{fr?({"Marketplace location":"Emplacement du marché","Waterfall location":"Emplacement des cascades","Valley reference point":"Repère de la vallée","Coastal landmark":"Site côtier","Viewpoint location":"Point de vue","Beach location":"Emplacement de la plage","Village centre":"Centre du village","Faaroa valley reference point":"Repère de la vallée de Faaroa","Vallée de la Vanille attraction":"Site de la Vallée de la Vanille","Jardin de corail viewpoint":"Point de vue du jardin de corail","Pass location":"Emplacement de la passe","Avatoru village centre":"Centre du village d’Avatoru"} as Record<string,string>)[pin.precision]||pin.precision:pin.precision}</small><br/><a href={pin.officialUrl} target="_blank" rel="noreferrer">{fr?"Guide officiel":"Official guide"}</a></Popup>
          </CircleMarker>)}
        </MapContainer>
        <div className="map-attribution-note">MAP DATA © OPENSTREETMAP CONTRIBUTORS</div>
      </div>
      <aside className="archipelago-map-sidebar">
        <span className="detail-label">{fr?"GUIDE DE L’ÎLE":"ISLAND GUIDE"}</span>
        <h3>{activeIsland?.name ?? selected}</h3>
        <p>{(fr&&activeIsland?islandDescriptionsFR[activeIsland.name]:activeIsland?.description) ?? (fr?'Explorez cette île de la Polynésie française.':'Explore this island in French Polynesia.')}</p>
        <div className="map-activity-count">{pins.length} {fr?"LIEUX CARTOGRAPHIÉS":"MAPPED REFERENCES"} · {selectedActivities.length} {fr?"LIEUX À DÉCOUVRIR":"FEATURED PLACES"}</div>
        {focusedPlaceIsUnpinned&&<div className="map-focus-notice">“{focusRequest?.title}” {fr?"est enregistré dans votre passeport, mais son emplacement précis est encore en cours de vérification. La zone de l’île est affichée.":"is saved in your passport, but its exact map pin is still being checked. Showing the island area instead."}</div>}
        <div className="map-category-filters">{categories.map(category=><button key={category} className={filter===category?'active':''} onClick={()=>setFilter(category)}>{categoryLabel(category)}</button>)}</div>
        <div className="map-activity-list">{visibleActivities.map((activity,index)=>{
          const pin=verifiedPins[activity.title];
          return <article key={activity.title} className={focusedTitle===activity.title?'is-focused':''} ref={focusedTitle===activity.title?(el)=>el?.scrollIntoView({behavior:'smooth',block:'nearest'}):undefined}>
            <span>0{index+1}</span><div><h4>{activity.title}</h4><small>{activity.location} · {activity.category}</small><p>{activity.description}</p><div className="map-activity-links">
              {pin?<button type="button" onClick={()=>setFocusedTitle(activity.title)}>{fr?"VOIR SUR LA CARTE":"VIEW ON MAP"} <MapPin size={12}/></button>:<span className="map-pin-pending">{fr?"EMPLACEMENT À VÉRIFIER":"PIN AWAITING LOCATION CHECK"}</span>}
              <a href={activity.officialUrl} target="_blank" rel="noreferrer">{fr?"GUIDE OFFICIEL":"OFFICIAL GUIDE"} <ArrowRight size={12}/></a>
              <a href={'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(activity.mapQuery)} target="_blank" rel="noreferrer">{fr?"RECHERCHE SUR LA CARTE":"MAP SEARCH"} <MapPin size={12}/></a>
            </div></div>
          </article>
        })}</div>
      </aside>
    </div>
    <p className="archipelago-map-footnote">{fr?"Le cercle de visite est un repère approximatif utilisé par le prototype GPS local ; il ne constitue ni une limite officielle ni une preuve de présence. Les coordonnées doivent être confirmées avec les partenaires locaux avant toute mise en production. Les autres lieux ne sont épinglés que lorsque leur position a été vérifiée.":"The highlighted check-in circle is an approximate visitor-hub reference used by the local GPS prototype, not an official boundary or proof of presence. Hub coordinates must be confirmed with local destination partners before production use. Other attraction pins are shown only where a named location has a checked map reference."}</p>
  </section>;
}
