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
const activityFrench:Record<string,{title:string;location:string;description:string}>={
'Papeete Market & Waterfront':{title:'Marché et front de mer de Papeete',location:'Papeete',description:'Découvrez le marché central, les produits tropicaux, l’artisanat local, les fleurs et la vie quotidienne de l’île. Venez tôt pour profiter de l’ambiance.'},
'Faarumai Waterfalls':{title:'Cascades de Faarumai',location:'Tiarei, Tahiti Nui',description:'Une courte marche depuis le stationnement mène à un bel espace de cascades. Suivez les accès balisés et les consignes de sécurité locales.'},
'Papenoo Valley':{title:'Vallée de Papenoo',location:'Papenoo, Tahiti',description:'Découvrez une vallée spectaculaire entre rivières, montagnes et végétation tropicale. Une excursion guidée locale aide à comprendre le site et ses conditions d’accès.'},
'Point Venus':{title:'Pointe Vénus',location:'Mahina, Tahiti',description:'Une plage emblématique de sable noir et un phare historique, avec une vue sur l’océan en direction de Moorea.'},
'Belvedere Lookout':{title:'Belvédère d’Opunohu',location:'Vallée d’Opunohu',description:'Admirez les baies de Cook et d’Opunohu, séparées par le mont Rotui. Suivez les sentiers balisés et vérifiez les conditions d’accès.'},
'Moorea Lagoon & Motu':{title:'Lagon et motu de Moorea',location:'Lagon de Moorea',description:'Partez avec un opérateur local responsable à la découverte du lagon, des jardins de corail et des petits motu. Respectez les consignes concernant la faune et les récifs.'},
'Opunohu Valley':{title:'Vallée d’Opunohu',location:'Vallée d’Opunohu',description:'Explorez une vallée luxuriante entre champs d’ananas, montagnes et sites archéologiques. Un guide local peut apporter un éclairage culturel.'},
'Ta’ahiamanu Beach':{title:'Plage de Ta’ahiamanu',location:'Baie d’Opunohu',description:'Une plage publique pour se détendre ou pique-niquer lorsque les conditions de mer le permettent. Respectez la signalisation et emportez vos déchets.'},
'Matira Beach':{title:'Plage de Matira',location:'Sud de Bora Bora',description:'Profitez de la célèbre plage publique et de ses paysages de lagon. Vérifiez les conditions avant de vous baigner et respectez les zones signalées.'},
'Bora Bora Lagoon':{title:'Lagon de Bora Bora',location:'Lagon de Bora Bora',description:'Découvrez les jardins de corail et la vie marine avec un guide local. Gardez vos distances avec la faune et ne touchez ni les coraux ni les animaux.'},
'Vaitape Village':{title:'Village de Vaitape',location:'Vaitape',description:'Découvrez le principal village, ses commerces et la vie quotidienne de l’île au-delà des célèbres paysages du lagon.'},
'Bora Bora Heritage Sites':{title:'Sites patrimoniaux de Bora Bora',location:'Toute l’île',description:'Découvrez les marae et les traces de l’histoire de la Seconde Guerre mondiale en respectant les sites protégés et les propriétés privées.'},
'Maeva Archaeological Area':{title:'Site archéologique de Maeva',location:'Maeva, Huahine Nui',description:'Explorez des vestiges archéologiques importants et découvrez l’histoire de l’île. Un guide local peut expliquer la signification des sites.'},
'Faie Village & Sacred Eels':{title:'Village de Faie et anguilles sacrées',location:'Faie, Huahine Nui',description:'Découvrez un site d’eau douce connu pour ses anguilles aux yeux bleus. Observez en silence, suivez les conseils locaux et ne touchez pas la faune.'},
'Huahine Lagoon & Motu':{title:'Lagon et motu de Huahine',location:'Lagon de Huahine',description:'Explorez le lagon et les motu voisins lors d’une excursion locale, entre paysages marins et découverte de l’environnement de l’île.'},
'Fare Village':{title:'Village de Fare',location:'Fare, Huahine Nui',description:'Promenez-vous dans le principal village, profitez du front de mer et découvrez les petits commerces et la vie quotidienne.'},
'Marae Taputapuātea':{title:'Marae de Taputapuātea',location:'Ōpoa, Raiatea',description:'Visitez ce grand paysage ancestral et culturel inscrit au patrimoine mondial de l’UNESCO. Respectez le lieu et suivez les consignes.'},
'Faaroa River':{title:'Rivière Faaroa',location:'Faaroa, Raiatea',description:'Découvrez la seule rivière navigable de Polynésie française en kayak, canoë ou bateau avec un opérateur local. Vérifiez les conditions avant le départ.'},
'Uturoa Waterfront & Market':{title:'Front de mer et marché d’Uturoa',location:'Uturoa, Raiatea',description:'Découvrez la principale ville de l’île, ses produits et son artisanat, ainsi que les paysages du front de mer et de la marina.'},
'Mount Temehani Trails':{title:'Sentiers du mont Temehani',location:'Intérieur de Raiatea',description:'Découvrez les paysages d’altitude et l’habitat du rare tiare apetahi. Faites appel à un guide local expérimenté et restez sur les sentiers établis.'},
'Vanilla Plantations':{title:'Plantations de vanille',location:'Taha’a',description:'Rencontrez des producteurs locaux et découvrez la culture, la récolte et la préparation de la célèbre vanille de l’île.'},
'Coral Garden':{title:'Jardin de corail',location:'Lagon partagé de Taha’a',description:'Découvrez le jardin de corail lors d’une excursion locale responsable. Ne marchez pas sur les coraux et suivez les consignes du guide.'},
'Motu Picnic Excursion':{title:'Excursion pique-nique sur un motu',location:'Motu du lagon de Taha’a',description:'Partez en bateau vers un petit îlot pour profiter de la plage et d’un pique-nique local. Vérifiez les prestations et les accès avec l’opérateur.'},
'Island Producers & Distilleries':{title:'Producteurs et distilleries de l’île',location:'Taha’a',description:'Découvrez la production locale de vanille et les savoir-faire des entreprises de l’île. Vérifiez les horaires avant votre visite.'},
'Tiputa Pass':{title:'Passe de Tiputa',location:'Tiputa, Rangiroa',description:'Un site réputé pour la vie marine. Observez depuis les points de vue sûrs ou avec un guide qualifié ; les courants peuvent être puissants et changeants.'},
'Blue Lagoon':{title:'Lagon Bleu',location:'Lagon de Rangiroa',description:'Découvrez ce lagon intérieur lors d’une excursion en bateau à la journée. Confirmez la météo, les transferts et les prestations avec l’opérateur local.'},
'Reef Island':{title:'Île aux Récifs',location:'Lagon extérieur de Rangiroa',description:'Découvrez des paysages de corail fossile sculptés par les vagues lors d’une excursion organisée et suivez les consignes pour protéger cet environnement fragile.'},
'Avatoru & Tiputa Villages':{title:'Villages d’Avatoru et de Tiputa',location:'Atoll de Rangiroa',description:'Explorez les villages à votre rythme, découvrez les commerces locaux et profitez des paysages de l’atoll. Organisez les transports et la location de vélo sur place.'},
'Fakarava Biosphere Reserve':{title:'Réserve de biosphère de Fakarava',location:'Atoll de Fakarava',description:'Découvrez un environnement protégé réputé pour sa biodiversité marine. Choisissez des opérateurs qui respectent les règles de conservation.'},
'Garuae Pass':{title:'Passe de Garuae',location:'Nord de Fakarava',description:'Une passe célèbre et un habitat marin remarquable. Les courants peuvent être puissants : suivez uniquement les conseils de professionnels locaux qualifiés.'},
'Pink Sand Beaches & Motu':{title:'Plages de sable rose et motu',location:'Sud de Fakarava',description:'Découvrez des plages aux nuances rosées lors d’une excursion organisée en bateau. Vérifiez l’état de la mer, les accès et les modalités de retour.'},
'Rotoava Village & Local Crafts':{title:'Village de Rotoava et artisanat local',location:'Rotoava, Fakarava',description:'Découvrez la vie du village, l’artisanat et la culture perlière, et apprenez-en davantage sur l’atoll auprès de ses habitants.'}
};
const fr=language==='FR';
  const categoryLabel=(value:string)=>fr?value.split(' · ').map(part=>({'All':'Tout','Culture':'Culture','Food':'Gastronomie','Shopping':'Commerces','Nature':'Nature','Scenery':'Paysages','Guided discovery':'Découverte guidée','Coast':'Littoral','Heritage':'Patrimoine','Viewpoint':'Belvédère','Lagoon':'Lagon','Guided excursion':'Excursion guidée','Beach':'Plage','Relaxation':'Détente','Local life':'Vie locale','History':'Histoire','UNESCO heritage':'Patrimoine UNESCO','River excursion':'Excursion fluviale','Guided hike':'Randonnée guidée','Agriculture':'Agriculture','Marine life':'Vie marine','Local food':'Cuisine locale','Local craft':'Artisanat local','Observation':'Observation','Guided boat trip':'Sortie guidée en bateau','Geology':'Géologie','Cycling':'Vélo','Conservation':'Conservation','Guided discovery':'Découverte guidée'} as Record<string,string>)[part]||part).join(' · '):value;
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
            <span>0{index+1}</span><div><h4>{fr?(activityFrench[activity.title]?.title||activity.title):activity.title}</h4><small>{fr?(activityFrench[activity.title]?.location||activity.location):activity.location} · {categoryLabel(activity.category)}</small><p>{fr?(activityFrench[activity.title]?.description||activity.description):activity.description}</p><div className="map-activity-links">
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
