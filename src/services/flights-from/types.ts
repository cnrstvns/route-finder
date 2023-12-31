export interface Route {
  id: number;
  route_id: string;
  carrier: string;
  carrier_name: string;
  lcc: string;
  iata_from: string;
  iata_to: string;
  day1: string;
  day2: string;
  day3: string;
  day4: string;
  day5: string;
  day6: string;
  day7: string;
  aircraft_codes: string;
  first_flight?: null;
  last_flight: string;
  class_first: string;
  class_business: string;
  class_economy: string;
  common_duration: string;
  min_duration: string;
  max_duration: string;
  is_new: string;
  is_active: string;
  is_layover: string;
  passengers_per_day: string;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
  last_found: string;
  flights_per_week: string;
  flights_per_day: string;
  airline: Airline;
  departure: DepartureOrDestination;
  destination: DepartureOrDestination;
}

export interface Airline {
  id: number;
  callsign: string;
  ICAO: string;
  IATA: string;
  name: string;
  fs_id: string;
  shortname: string;
  fullname?: null;
  country: string;
  flights_last_24_hours: string;
  airbourne: string;
  location: string;
  phone: string;
  url: string;
  wiki_url: string;
  is_scheduled_passenger: string;
  is_nonscheduled_passenger: string;
  is_cargo: string;
  is_railway?: null;
  is_lowcost: string;
  active: string;
  is_oneworld: string;
  is_staralliance: string;
  is_skyteam: string;
  is_allianceaffiliate: string;
  rating_iosapp?: null;
  rating_androidapp?: null;
  rating_skytrax_reviews?: null;
  rating_skytrax_stars?: null;
  rating_tripadvisor?: null;
  rating_trustpilot?: null;
  rating_flightradar24?: null;
  created_at: string;
  updated_at: string;
}

export interface DepartureOrDestination {
  IATA: string;
  latitude: string;
  longitude: string;
  country: string;
  country_code: string;
  city_name: string;
  city_name_en: string;
  name: string;
  no_routes: string;
  state_code: string;
}
