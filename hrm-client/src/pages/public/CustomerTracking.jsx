import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';

const mapContainerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: 18.7953, lng: 98.9620 };

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1e293b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#334155" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#475569" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f172a" }] },
];

export default function CustomerTracking() {
  const { orderId } = useParams();
  const [riderLocation, setRiderLocation] = useState(null);
  const [socketStatus, setSocketStatus] = useState('Connecting...');
  
  const [customer, setCustomer] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  
  const hasCalculatedRoute = useRef(false);
  const lastFetchTime = useRef(0);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  // Fetch Customer Address
  useEffect(() => {
    fetch(`/api/public/tracking/${orderId}`)
      .then(res => res.json())
      .then(data => {
         if (data.customer) setCustomer(data.customer);
      })
      .catch(err => console.error('[TRACKING API ERROR]', err));
  }, [orderId]);

  // Connect to Socket for Rider GPS
  useEffect(() => {
    const socket = io({
      path: '/socket.io',
      query: { public_track: 'true' },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => setSocketStatus('Live Tracking Connected 🟢'));
    socket.on('disconnect', () => setSocketStatus('Reconnecting... 🟡'));

    socket.on('rider:location', (data) => {
      setRiderLocation({ lat: data.lat, lng: data.lng, timestamp: data.timestamp });
    });

    return () => socket.disconnect();
  }, []);

  const [hasArrived, setHasArrived] = useState(false);
  
  // Calculate Route & ETA (Periodic update for live countdown)
  useEffect(() => {
    if (!isLoaded || !riderLocation || !customer?.delivery_address) return;
    
    const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
      const R = 6371000;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
      return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
    };

    const fetchDirections = () => {
      lastFetchTime.current = Date.now();
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: riderLocation,
          destination: `${customer.delivery_address}, Thailand`,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            const endLoc = result.routes[0].legs[0].end_location;
            const dist = getDistanceInMeters(riderLocation.lat, riderLocation.lng, endLoc.lat(), endLoc.lng());
            
            if (dist < 150) {
              setHasArrived(true);
              setDirectionsResponse(result); // Keep for the destination marker
              setDistance("Arrived");
              setDuration("Now");
            } else {
              setHasArrived(false);
              setDirectionsResponse(result);
              setDistance(result.routes[0].legs[0].distance.text);
              setDuration(result.routes[0].legs[0].duration.text);
            }
          }
        }
      );
    };

    const now = Date.now();
    // Only fetch if 10 seconds have passed since the last fetch, or if it's the very first time
    // This prevents burning Google Maps API quota while still providing real-time updates when the rider moves
    if (!hasCalculatedRoute.current || (now - lastFetchTime.current > 10000)) {
      fetchDirections();
      hasCalculatedRoute.current = true;
    }
  }, [isLoaded, riderLocation, customer]);

  // Smoothly pan map to new rider location if moving
  useEffect(() => {
    if (mapRef.current && riderLocation && !directionsResponse) {
      mapRef.current.panTo(riderLocation);
    }
  }, [riderLocation, directionsResponse]);

  return (
    <div className="h-screen w-full flex flex-col bg-surface-950 font-sans">
      <div className="bg-surface-900 p-4 shadow-xl z-20 flex justify-between items-center relative border-b border-white/10">
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <span className="text-brand-primary">BBD</span> Tracking
        </h1>
        <div className="text-xs font-bold text-slate-400 bg-surface-800 px-3 py-1.5 rounded-full border border-white/5">
          {socketStatus}
        </div>
      </div>

      <div className="flex-1 relative z-0">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={15}
            options={{ styles: darkMapStyle, disableDefaultUI: true }}
            onLoad={map => mapRef.current = map}
          >
            {/* Premium Route Line (Grab Style) */}
            {directionsResponse && !hasArrived && (
              <Polyline 
                path={directionsResponse.routes[0].overview_path}
                options={{
                  strokeColor: '#0ea5e9', // Premium Sky Blue
                  strokeOpacity: 0.8,
                  strokeWeight: 6,
                  geodesic: true
                }}
              />
            )}
            
            {/* Custom Destination Pin (Home) */}
            {directionsResponse && (
              <Marker 
                position={directionsResponse.routes[0].legs[0].end_location}
                icon={{
                  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'><path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' fill='#f43f5e' stroke='#ffffff' stroke-width='1.5'/><circle cx='12' cy='10' r='3' fill='#ffffff'/></svg>")}`,
                  scaledSize: typeof window.google !== 'undefined' ? new window.google.maps.Size(40, 40) : null,
                  anchor: typeof window.google !== 'undefined' ? new window.google.maps.Point(20, 40) : null
                }}
                zIndex={100}
              />
            )}
            
            {/* Live Rider Marker (Premium Scooter Icon) */}
            {riderLocation && (
              <Marker 
                position={riderLocation}
                icon={{
                  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><circle cx='20' cy='20' r='18' fill='#10b981' stroke='#ffffff' stroke-width='2'/><text x='20' y='26' font-size='20' text-anchor='middle'>🛵</text></svg>")}`,
                  scaledSize: typeof window.google !== 'undefined' ? new window.google.maps.Size(40, 40) : null,
                  anchor: typeof window.google !== 'undefined' ? new window.google.maps.Point(20, 20) : null
                }}
                zIndex={110}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-full text-white font-bold">Loading Google Maps...</div>
        )}

        {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
          <div className="absolute top-4 left-4 right-4 z-[400] bg-red-500/90 text-white p-3 rounded-xl font-bold text-sm text-center shadow-lg backdrop-blur-md">
            ⚠️ API Key Missing! Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.
          </div>
        )}

        {!riderLocation && isLoaded && (
          <div className="absolute inset-0 z-[400] flex items-center justify-center bg-surface-950/80 backdrop-blur-sm pointer-events-none">
            <div className="bg-surface-900 p-6 rounded-3xl border border-white/10 shadow-2xl text-center max-w-[300px]">
              <span className="text-4xl block mb-4 animate-bounce">📡</span>
              <h3 className="text-white font-black text-lg mb-2">Waiting for GPS...</h3>
              <p className="text-slate-400 text-sm font-bold">The rider hasn't started moving or is out of coverage.</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-surface-900 p-6 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/5">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/50 flex items-center justify-center text-xl">
              👨‍🍳
            </div>
            <div>
              <h4 className="text-white font-black text-lg">{customer ? customer.full_name : 'Busy Boss Diet'}</h4>
              <p className="text-slate-400 text-sm font-bold tracking-wide flex items-center gap-1">
                <span className="text-brand-primary">📍</span> {customer ? customer.delivery_address : 'Your food is arriving soon!'}
              </p>
            </div>
          </div>
          
          {duration && (
            <div className="text-right">
              <div className="text-3xl font-black text-emerald-400">{duration}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{distance}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
