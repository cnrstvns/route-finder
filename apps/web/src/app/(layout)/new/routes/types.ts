export type RouteResult = {
  id: number;
  origin_iata: string;
  destination_iata: string;
  origin_name: string;
  destination_name: string;
  average_duration: number;
  aircraft_short_names: string;
  user_route_id: number;
  user_route_user_id: number;
  user_route_created_at: Date;
};
