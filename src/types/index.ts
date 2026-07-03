export interface Destination {
  id: string; name: string; country: string; city: string | null;
  description: string; image_url: string; gallery_urls: string[];
  type: DestinationType; budget_level: BudgetLevel; average_cost: number | null;
  currency: string; rating: number; review_count: number;
  best_time_to_visit: string | null; weather_info: WeatherInfo;
  entry_requirements: string | null; latitude: number | null;
  longitude: number | null; highlights: string[];
  created_at: string; updated_at: string;
}
export type DestinationType = 'beach' | 'mountain' | 'heritage' | 'adventure' | 'city' | 'countryside'
export type BudgetLevel = 'budget' | 'mid-range' | 'luxury'
export interface WeatherInfo { average_temp?: string; climate?: string; rainy_season?: string }
export interface Review {
  id: string; user_id: string; destination_id: string; rating: number;
  title: string | null; content: string; images: string[];
  visit_date: string | null; created_at: string; updated_at: string;
  profiles?: Profile;
}
export interface Profile {
  id: string; email: string; full_name: string | null;
  avatar_url: string | null; bio: string | null;
  home_country: string | null; created_at: string; updated_at: string;
}
export interface Itinerary {
  id: string; user_id: string; name: string; description: string | null;
  start_date: string | null; end_date: string | null;
  cover_image_url: string | null; is_public: boolean;
  status: ItineraryStatus; created_at: string; updated_at: string;
  days?: ItineraryDay[];
}
export type ItineraryStatus = 'planning' | 'booked' | 'completed' | 'cancelled'
export interface ItineraryDay {
  id: string; itinerary_id: string; day_number: number;
  date: string | null; notes: string | null;
  entries?: ItineraryEntry[];
}
export interface ItineraryEntry {
  id: string; itinerary_day_id: string; destination_id: string;
  entry_order: number; notes: string | null;
  visit_time: string | null; estimated_cost: number | null;
  destination?: Destination;
}
export interface WishlistItem {
  id: string; user_id: string; destination_id: string;
  notes: string | null; created_at: string;
  destination?: Destination;
}
