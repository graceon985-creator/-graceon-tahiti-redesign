import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const hubs: Record<string, { lat: number; lng: number; radius: number }> = {
  "Tahiti": { lat: -17.5347, lng: -149.5684, radius: 800 },
  "Moorea": { lat: -17.5186, lng: -149.8219, radius: 800 },
  "Bora Bora": { lat: -16.5074, lng: -151.7491, radius: 800 },
  "Huahine": { lat: -16.7123, lng: -151.0349, radius: 800 },
  "Raiatea": { lat: -16.7302, lng: -151.4426, radius: 800 },
  "Taha’a": { lat: -16.6762, lng: -151.4574, radius: 800 },
  "Rangiroa": { lat: -14.9417, lng: -147.7020, radius: 800 },
  "Fakarava": { lat: -16.05586, lng: -145.61987, radius: 800 },
};

function distanceMetres(lat1: number, lng1: number, lat2: number, lng2: number) {
  const radians = (value: number) => value * Math.PI / 180;
  const earthRadius = 6_371_000;
  const dLat = radians(lat2 - lat1);
  const dLng = radians(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(a));
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const respond = (body: Record<string, unknown>, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  if (request.method !== "POST") return respond({ error: "Method not allowed." }, 405);

  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return respond({ error: "Sign-in is required." }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return respond({ error: "Server configuration is incomplete." }, 500);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: { user }, error: authError } = await userClient.auth.getUser();
  if (authError || !user) return respond({ error: "Your session is invalid. Please sign in again." }, 401);

  let payload: { islandName?: unknown; latitude?: unknown; longitude?: unknown; accuracy?: unknown };
  try {
    payload = await request.json();
  } catch {
    return respond({ error: "A valid JSON request is required." }, 400);
  }

  const islandName = typeof payload.islandName === "string" ? payload.islandName : "";
  const hub = hubs[islandName];
  const latitude = payload.latitude;
  const longitude = payload.longitude;
  const accuracy = payload.accuracy;

  if (!hub || typeof latitude !== "number" || typeof longitude !== "number"
      || typeof accuracy !== "number" || !Number.isFinite(latitude)
      || !Number.isFinite(longitude) || !Number.isFinite(accuracy)
      || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return respond({ error: "The island or location details are invalid." }, 400);
  }
  if (accuracy <= 0 || accuracy > 100) {
    return respond({ error: "Location accuracy must be 100 metres or better. Please try again outdoors." }, 422);
  }

  const distance = distanceMetres(latitude, longitude, hub.lat, hub.lng);
  // Be conservative: the reported accuracy circle must fit inside the hub radius.
  if (distance + accuracy > hub.radius) {
    return respond({ error: "You are outside this island hub's check-in area." }, 403);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await admin.from("verified_island_visits").insert({
    user_id: user.id,
    island_name: islandName,
    accuracy_m: Math.round(accuracy),
    distance_to_hub_m: Math.round(distance),
  }).select("island_name, verified_at, accuracy_m").single();

  if (error?.code === "23505") {
    return respond({ error: "You already collected this island stamp on this account." }, 409);
  }
  if (error || !data) return respond({ error: "The visit could not be recorded. Please try again." }, 500);

  // Exact coordinates are deliberately never written to the database.
  return respond({ visit: data });
});
