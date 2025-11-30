import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';

interface MapComponentProps {
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  driverLat?: number;
  driverLng?: number;
  driverHeading?: number;
  height?: string;
  showRoute?: boolean;
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export function MapComponent({
  originLat,
  originLng,
  destinationLat,
  destinationLng,
  driverLat,
  driverLng,
  driverHeading,
  height = '400px',
  showRoute = true,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const originMarkerRef = useRef<L.Marker | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    const originIcon = L.divIcon({
      html: `
        <div style="background: #10b981; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      `,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const destinationIcon = L.divIcon({
      html: `
        <div style="background: #ef4444; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      `,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    originMarkerRef.current = L.marker([originLat, originLng], { icon: originIcon })
      .addTo(map)
      .bindPopup('<b>مبدا</b>');

    destinationMarkerRef.current = L.marker([destinationLat, destinationLng], { icon: destinationIcon })
      .addTo(map)
      .bindPopup('<b>مقصد</b>');

    if (showRoute) {
      routeLayerRef.current = L.polyline(
        [
          [originLat, originLng],
          [destinationLat, destinationLng],
        ],
        {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.7,
          dashArray: '10, 10',
        }
      ).addTo(map);
    }

    const bounds = L.latLngBounds([
      [originLat, originLng],
      [destinationLat, destinationLng],
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    if (driverLat && driverLng) {
      const driverIcon = L.divIcon({
        html: `
          <div style="transform: rotate(${driverHeading || 0}deg); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
            <div style="background: #3b82f6; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
        `,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      if (driverMarkerRef.current) {
        driverMarkerRef.current.setLatLng([driverLat, driverLng]);
        driverMarkerRef.current.setIcon(driverIcon);
      } else {
        driverMarkerRef.current = L.marker([driverLat, driverLng], { icon: driverIcon })
          .addTo(mapRef.current)
          .bindPopup('<b>راننده</b>');
      }

      if (showRoute && routeLayerRef.current) {
        routeLayerRef.current.setLatLngs([
          [driverLat, driverLng],
          [destinationLat, destinationLng],
        ]);
      }

      const bounds = L.latLngBounds([
        [originLat, originLng],
        [destinationLat, destinationLng],
        [driverLat, driverLng],
      ]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [driverLat, driverLng, driverHeading, showRoute, originLat, originLng, destinationLat, destinationLng]);

  return <div ref={mapContainerRef} style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }} />;
}
