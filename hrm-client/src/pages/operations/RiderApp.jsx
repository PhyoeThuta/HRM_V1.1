import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { getCrmSocket } from '../../lib/crmSocket';
import { useJsApiLoader } from '@react-google-maps/api';
import toast from 'react-hot-toast';

// Default Bangkok coords for fallback
const BANGKOK = { lat: 13.765, lng: 100.640 };

export default function RiderApp() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [simulatorMode, setSimulatorMode] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const targetDate = new Date().toISOString().split('T')[0];

  const watchId = useRef(null);
  const simInterval = useRef(null);
  const simPos = useRef({ lat: BANGKOK.lat, lng: BANGKOK.lng });
  const simPath = useRef([]);
  const simPathIndex = useRef(0);
  const socket = getCrmSocket();

  // Fetch orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/operations/orders').then(res => res.data)
  });

  const updateBatchStatusMutation = useMutation({
    mutationFn: ({ orderIds, status }) => api.put(`/operations/orders/batch-status`, { order_ids: orderIds, delivery_status: status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      toast.success('Status updated successfully');
    }
  });

  // When simulator is turned on, try to start from real GPS location
  useEffect(() => {
    if (simulatorMode) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          simPos.current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          toast.success("Simulator starting from your real location! 📍");
        },
        () => {
          simPos.current = { lat: BANGKOK.lat, lng: BANGKOK.lng };
          toast.success("Simulator starting from Bangkok default location");
        }
      );
    }
  }, [simulatorMode]);

  // Start tracking when status is ON_THE_WAY
  useEffect(() => {
    if (!isTracking) {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
      if (simInterval.current) clearInterval(simInterval.current);
      return;
    }

    if (simulatorMode) {
      let lastTick = Date.now();
      
      // Simulate moving smartly along the actual route path
      simInterval.current = setInterval(() => {
        const now = Date.now();
        let deltaSec = (now - lastTick) / 1000;
        lastTick = now;

        // Catch up on missed time if tab went to sleep! (Max 5 minutes jump)
        deltaSec = Math.min(deltaSec, 300);
        let chunks = Math.ceil(deltaSec);
        if (chunks < 1) chunks = 1;

        for (let i = 0; i < chunks; i++) {
          if (simPath.current.length > 0) {
            const target = simPath.current[simPathIndex.current];
            if (target) {
              const dx = target.lng - simPos.current.lng;
              const dy = target.lat - simPos.current.lat;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              if (dist < 0.0002) {
                // Reached this road node, move to next (clone to avoid mutation)
                simPos.current = { lat: target.lat, lng: target.lng };
                simPathIndex.current++;
              } else {
                // Move towards the node (smooth animation)
                const speed = 0.0008; // Fast delivery speed
                simPos.current.lat += (dy / dist) * Math.min(speed, dist);
                simPos.current.lng += (dx / dist) * Math.min(speed, dist);
              }
            }
          }
        }

        socket?.emit('rider:location_update', {
          lat: simPos.current.lat,
          lng: simPos.current.lng,
          speed: 40
        });
      }, 1000); // Send updates every 1 second for ultra-smooth movement!
    } else {
      watchId.current = navigator.geolocation.watchPosition(
        (pos) => {
          socket?.emit('rider:location_update', {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            speed: pos.coords.speed,
            heading: pos.coords.heading
          });
        },
        (err) => {
          toast.error("GPS Error. Please allow location access.");
          setIsTracking(false);
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }

    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
      if (simInterval.current) clearInterval(simInterval.current);
    };
  }, [isTracking, simulatorMode, socket]);

  const todaysOrders = orders?.filter(o => o.date === targetDate) || [];

  const groupedOrders = React.useMemo(() => {
    const groups = {};
    todaysOrders.forEach(o => {
      const cid = o.customer_id;
      if (!groups[cid]) {
        groups[cid] = {
          customer_id: cid,
          customer: o.customer,
          orders: [],
          status: 'PENDING'
        };
      }
      groups[cid].orders.push(o);
    });
    return Object.values(groups).map(g => {
      if (g.orders.every(o => o.delivery_status === 'DELIVERED')) g.status = 'DELIVERED';
      else if (g.orders.some(o => o.delivery_status === 'ON_THE_WAY')) g.status = 'ON_THE_WAY';
      else if (g.orders.some(o => o.delivery_status === 'DELIVERED')) g.status = 'ON_THE_WAY'; 
      else g.status = 'PENDING';
      return g;
    });
  }, [todaysOrders]);

  const activeDeliveries = groupedOrders.filter(g => g.status === 'ON_THE_WAY' || g.status === 'PENDING');

  // Stop tracking automatically if no active ON_THE_WAY deliveries
  useEffect(() => {
    const hasOnTheWay = activeDeliveries.some(g => g.status === 'ON_THE_WAY');
    if (hasOnTheWay && !isTracking) setIsTracking(true);
    if (!hasOnTheWay && isTracking) setIsTracking(false);
  }, [activeDeliveries, isTracking]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  // Fetch true route path for simulator to follow strictly along the roads!
  useEffect(() => {
    if (!simulatorMode || !isTracking || !isLoaded) return;
    const activeDest = activeDeliveries.find(g => g.status === 'ON_THE_WAY')?.customer?.delivery_address;
    if (!activeDest) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route({
      origin: simPos.current,
      destination: `${activeDest}, Thailand`,
      travelMode: window.google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        const path = [];
        result.routes[0].overview_path.forEach(p => {
          path.push({ lat: p.lat(), lng: p.lng() });
        });
        simPath.current = path;
        simPathIndex.current = 0;
      }
    });
  }, [simulatorMode, isTracking, isLoaded, activeDeliveries]);

  const handleUpdateStatus = (group, status) => {
    updateBatchStatusMutation.mutate({ orderIds: group.orders.map(o => o.id), status });
  };

  if (isLoading) return <div className="p-8 text-center text-white font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-surface-950 pb-20">
      {/* Header */}
      <div className="bg-surface-900 border-b border-white/10 p-4 sticky top-0 z-10 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-black text-fuchsia-500">BBD Rider</h1>
        <button onClick={() => navigate('/operations/dashboard')} className="text-slate-400 font-bold text-sm bg-white/5 px-3 py-1 rounded-lg">Exit</button>
      </div>

      {/* Simulator Toggle */}
      <div className="p-4 flex items-center justify-between bg-surface-800 m-4 rounded-2xl border border-dashed border-white/20">
        <div>
          <h3 className="font-bold text-white text-sm">GPS Simulator</h3>
          <p className="text-xs text-slate-400">Mock Chiang Mai location</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={simulatorMode} onChange={(e) => setSimulatorMode(e.target.checked)} className="sr-only peer" />
          <div className="w-11 h-6 bg-surface-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-500"></div>
        </label>
      </div>

      {/* Tracking Status Indicator */}
      {isTracking && (
        <div className="mx-4 mb-4 bg-emerald-500/20 border border-emerald-500/50 p-3 rounded-xl flex items-center justify-center gap-2 animate-pulse">
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>
          <span className="text-emerald-400 font-black text-sm uppercase">GPS Tracking Active</span>
        </div>
      )}

      {/* Deliveries */}
      <div className="p-4 space-y-4">
        <h2 className="text-white font-black mb-4">My Deliveries ({activeDeliveries.length})</h2>
        {activeDeliveries.length === 0 ? (
          <div className="text-center py-10 bg-surface-900 rounded-2xl border border-white/5">
            <span className="text-4xl mb-2 block">🎉</span>
            <p className="text-slate-400 font-bold">No active deliveries!</p>
          </div>
        ) : (
          activeDeliveries.map(group => (
            <div key={group.customer_id} className={`bg-surface-900 border ${group.status === 'ON_THE_WAY' ? 'border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.2)]' : 'border-white/5'} rounded-2xl p-4`}>
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-black text-white text-lg">{group.customer?.full_name}</h4>
                <div className="flex flex-col gap-1 items-end">
                  {group.orders.map(o => (
                    <span key={o.id} className={`px-2 py-0.5 rounded-md text-[10px] font-black ${o.daily_menus?.meal_type === 'LUNCH' ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                      {o.daily_menus?.meal_type} x{o.count}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-slate-300 text-sm flex items-start gap-1">
                  <span className="text-brand-primary mt-0.5">📍</span> {group.customer?.delivery_address}
                </p>
                <p className="text-slate-400 font-bold text-sm mt-2 flex items-center gap-1">
                  <span>📞</span> {group.customer?.phone}
                </p>
              </div>

              {group.status === 'PENDING' ? (
                <button
                  onClick={() => handleUpdateStatus(group, 'ON_THE_WAY')}
                  className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black py-3 rounded-xl transition-all"
                >
                  🚀 START DELIVERY
                </button>
              ) : (
                <button
                  onClick={() => handleUpdateStatus(group, 'DELIVERED')}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  ✅ MARK AS DELIVERED
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
