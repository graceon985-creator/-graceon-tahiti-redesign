export type CheckInZone = {name:string;lat:number;lng:number;radius:number;precision:string};

// Shared reference points keep the map display and local GPS check-in test aligned.
// Coordinates are approximate visitor-hub references, not surveyed property boundaries.
// Confirm each point with local destination partners before production use.
export const checkInZones:Record<string,CheckInZone>={
 Tahiti:{name:'Papeete waterfront',lat:-17.5347,lng:-149.5684,radius:800,precision:'Approximate waterfront reference'},
 Moorea:{name:'Paopao village',lat:-17.5186,lng:-149.8219,radius:800,precision:'Approximate village reference'},
 'Bora Bora':{name:'Vaitape village',lat:-16.5074,lng:-151.7491,radius:800,precision:'Approximate village reference'},
 Huahine:{name:'Fare village',lat:-16.7123,lng:-151.0349,radius:800,precision:'Approximate village reference'},
 Raiatea:{name:'Uturoa waterfront',lat:-16.7302,lng:-151.4426,radius:800,precision:'Approximate waterfront reference'},
 'Taha’a':{name:'Vaitoare village',lat:-16.6762,lng:-151.4574,radius:800,precision:'Approximate village reference'},
 Rangiroa:{name:'Avatoru village',lat:-14.9417,lng:-147.7020,radius:800,precision:'Approximate village reference'},
 Fakarava:{name:'Rotoava village',lat:-16.05586,lng:-145.61987,radius:800,precision:'Approximate village reference'}
};
