import {useEffect,useMemo,useState} from 'react';
import {CircleMarker,MapContainer,Popup,TileLayer,useMap} from 'react-leaflet';
import type {LatLngExpression} from 'leaflet';
import {ArrowRight,MapPin} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './InteractiveArchipelagoMap.css';

type Island = {name:string;kind:string;description:string};
type Activity = {title:string;category:string;location:string;description:string;mapQuery:string;officialUrl:string};
type Props = {islands:Island[];activities:Record<string,Activity[]>};

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

function FocusIsland({position}:{position:LatLngExpression}) {
  const map = useMap();
  useEffect(()=>{map.flyTo(position,7,{duration:1.1})},[map,position]);
  return null;
}

export default function InteractiveArchipelagoMap({islands,activities}:Props) {
  const [selected,setSelected] = useState('Tahiti');
  const [filter,setFilter] = useState('All');
  const activeIsland = islands.find(island=>island.name===selected) ?? islands[0];
  const position = (islandCoordinates[selected] ?? islandCoordinates.Tahiti) as LatLngExpression;
  const selectedActivities = useMemo(()=>activities[selected] ?? [],[activities,selected]);
  const categories = ['All',...Array.from(new Set(selectedActivities.map(item=>item.category.split(' · ')[0])))];
  const visibleActivities = selectedActivities.filter(item=>filter==='All'||item.category.startsWith(filter));
  return <section id="explore-map" className="archipelago-map-section">
    <div className="archipelago-map-heading">
      <div><span className="section-kicker">03 / EXPLORE THE ARCHIPELAGO</span><h2>Find your place<br/><em>on the map.</em></h2></div>
      <p>Choose an island to explore its featured places. Island markers show island locations; individual attraction pins will be added after each place coordinate is verified.</p>
    </div>
    <div className="archipelago-map-controls">
      <label htmlFor="archipelago-island-select">SELECT AN ISLAND</label>
      <select id="archipelago-island-select" value={selected} onChange={event=>{setSelected(event.target.value);setFilter('All')}}>
        {islands.filter(island=>islandCoordinates[island.name]).map(island=><option key={island.name} value={island.name}>{island.name}</option>)}
      </select>
      <span><MapPin size={14}/> 8 ISLAND LOCATIONS</span>
    </div>
    <div className="archipelago-map-layout">
      <div className="archipelago-map-frame">
        <MapContainer center={[-16.5,-149.5]} zoom={4.6} minZoom={3} maxZoom={11} scrollWheelZoom={false} className="archipelago-leaflet-map">
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          <FocusIsland position={position}/>
          {Object.entries(islandCoordinates).map(([name,coords])=><CircleMarker key={name} center={coords} radius={selected===name?10:7} pathOptions={{color:'#f5f0e5',weight:2,fillColor:selected===name?'#bd7656':'#1c5550',fillOpacity:1}} eventHandlers={{click:()=>{setSelected(name);setFilter('All')}}}>
            <Popup><strong>{name}</strong><br/>Island location</Popup>
          </CircleMarker>)}
        </MapContainer>
        <div className="map-attribution-note">MAP DATA © OPENSTREETMAP CONTRIBUTORS</div>
      </div>
      <aside className="archipelago-map-sidebar">
        <span className="detail-label">ISLAND GUIDE</span>
        <h3>{activeIsland?.name ?? selected}</h3>
        <p>{activeIsland?.description ?? 'Explore this island in French Polynesia.'}</p>
        <div className="map-activity-count">{selectedActivities.length} FEATURED PLACES</div>
        <div className="map-category-filters">{categories.map(category=><button key={category} className={filter===category?'active':''} onClick={()=>setFilter(category)}>{category}</button>)}</div>
        <div className="map-activity-list">{visibleActivities.map((activity,index)=><article key={activity.title}>
          <span>0{index+1}</span><div><h4>{activity.title}</h4><small>{activity.location} · {activity.category}</small><p>{activity.description}</p><div className="map-activity-links"><a href={activity.officialUrl} target="_blank" rel="noreferrer">OFFICIAL GUIDE <ArrowRight size={12}/></a><a href={'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(activity.mapQuery)} target="_blank" rel="noreferrer">DIRECTIONS <MapPin size={12}/></a></div></div>
        </article>)}</div>
      </aside>
    </div>
    <p className="archipelago-map-footnote">Island coordinates are based on published island reference coordinates. Attraction cards link to map searches until exact attraction coordinates have been checked against authoritative local sources.</p>
  </section>;
}
