export interface MapCoordinate {
  lat: number;
  lng: number;
}

export interface MapMarker {
  position: MapCoordinate;
  label: string;
  sentiment?: "positive" | "negative" | "neutral";
}
