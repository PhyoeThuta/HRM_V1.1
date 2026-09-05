import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { getCrmSocket } from '../../lib/crmSocket';
import { useJsApiLoader } from '@react-google-maps/api';
import toast from 'react-hot-toast';

const BANGKOK = { lat: 13.765, lng: 100.640 };

// ────────────────────────────────────────────────────────────
// Delivery Card Component
// ────────────────────────────────────────────────────────────
function DeliveryCard({ group, onUpdateStatus, isPending }) {
  const statusConfig = {
    ASSIGNED: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/5',
      glow: {},
      dot: 'bg-amber-400',
      label: 'Preparing',
      labelColor: 'text-amber-400',
    },
    ACCEPTED: { // Legacy support
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/5',
      glow: {},
      dot: 'bg-amber-400',
      label: 'Assigned',
      labelColor: 'text-amber-400',
    },
    PICKING_UP: {
      border: 'border-orange-500/50',
      bg: 'bg-orange-500/5',
      glow: { boxShadow: '0 0 20px rgba(251,146,60,0.15)' },
      dot: 'bg-orange-400 animate-pulse',
      label: 'ပစ္စည်းယူနေပါပြီ',
      labelColor: 'text-orange-400',
    },
    ON_THE_WAY: {
      border: 'border-fuchsia-500/50',
      bg: 'bg-fuchsia-500/5',
      glow: { boxShadow: '0 0 30px rgba(217,70,239,0.2)' },
      dot: 'bg-fuchsia-400 animate-pulse',
      label: 'On The Way 🚀',
      labelColor: 'text-fuchsia-400',
    },
  };

  const cfg = statusConfig[group.status] || statusConfig.ASSIGNED;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((group.customer?.delivery_address || '') + ', Thailand')}`;

  return (
    <div
      className={`rounded-3xl border ${cfg.border} ${cfg.bg} p-5 transition-all duration-300`}
      style={cfg.glow}
    >
      {/* Status Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
          <span className={`text-xs font-black uppercase tracking-widest ${cfg.labelColor}`}>
            {cfg.label}
          </span>
        </div>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {group.orders.map(o => (
            <span
              key={o.id}
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                o.daily_menus?.meal_type === 'LUNCH'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-indigo-500/20 text-indigo-400'
              }`}
            >
              {o.daily_menus?.meal_type} ×{o.count}
            </span>
          ))}
        </div>
      </div>

      {/* Customer */}
      <h3 className="text-white text-xl font-black mb-3 leading-tight">
        {group.customer?.full_name}
      </h3>

      <div className="space-y-2 mb-5">
        <div className="flex items-start gap-2">
          <span className="text-fuchsia-400 text-base mt-0.5 shrink-0">📍</span>
          <p className="text-slate-300 text-sm leading-relaxed">{group.customer?.delivery_address || '—'}</p>
        </div>
        <a
          href={`tel:${group.customer?.phone}`}
          className="flex items-center gap-2 w-fit bg-sky-500/10 border border-sky-500/30 rounded-xl px-3 py-2 hover:bg-sky-500/20 active:scale-95 transition-all"
        >
          <span className="text-base">📞</span>
          <span className="text-sky-400 text-sm font-black">{group.customer?.phone}</span>
          <span className="text-sky-600 text-xs">Tap to call</span>
        </a>
        {group.customer?.delivery_notes && (
          <p className="text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
            📝 {group.customer.delivery_notes}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {(group.status === 'ASSIGNED' || group.status === 'ACCEPTED') && (
          <button
            onClick={() => onUpdateStatus(group, 'PICKING_UP')}
            disabled={isPending}
            className="w-full py-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 active:scale-95 border border-amber-500/40 text-amber-200 font-black text-base transition-all disabled:opacity-50"
          >
            📦 ပစ္စည်းယူရန်ရောက်ပါပြီ
          </button>
        )}

        {group.status === 'PICKING_UP' && (
          <button
            onClick={() => onUpdateStatus(group, 'ON_THE_WAY')}
            disabled={isPending}
            className="w-full py-4 rounded-2xl font-black text-lg text-white transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-fuchsia-500/30"
            style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)' }}
          >
            🚀 ထွက်ပါပြီ — Start Delivery
          </button>
        )}

        {group.status === 'ON_THE_WAY' && (
          <>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 active:scale-95 border border-sky-500/40 text-sky-300 font-black text-center transition-all"
            >
              🗺️ Open in Google Maps
            </a>
            <button
              onClick={() => onUpdateStatus(group, 'DELIVERED')}
              disabled={isPending}
              className="w-full py-4 rounded-2xl font-black text-lg text-white transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-500/30"
              style={{ background: 'linear-gradient(135deg, #059669, #0d9488)' }}
            >
              ✅ Delivered
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Main RiderApp
// ────────────────────────────────────────────────────────────
export default function RiderApp() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [simulatorMode, setSimulatorMode] = useState(() => localStorage.getItem('simMode') === 'true');

  useEffect(() => {
    localStorage.setItem('simMode', simulatorMode);
  }, [simulatorMode]);
  const [isTracking, setIsTracking] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [simDest, setSimDest] = useState(null); // Destination for simulator route
  const [alert, setAlert] = useState(null);     // Food-ready notification banner

  const watchId = useRef(null);
  const simInterval = useRef(null);
  const simPos = useRef({ lat: BANGKOK.lat, lng: BANGKOK.lng });
  const simPath = useRef([]);
  const simPathIndex = useRef(0);
  const socket = getCrmSocket();

  // Fetch orders filtered by this rider (backend handles filtering)
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['rider-orders', user?.id],
    queryFn: () => api.get('/operations/orders').then(res => res.data),
    refetchInterval: 15000, // Auto-refresh every 15s for new assignments
  });

  // Request browser notification permission + join personal socket room
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!socket || !user?.id) return;

    // Join personal notification room
    socket.emit('rider:join');

    // Listen for admin food-ready notification
    const handleNotification = (data) => {
      // Show in-app alert banner
      setAlert(data);

      // Also fire browser notification (works when tab is in background)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🍱 BBD Delivery Alert', {
          body: data.customer_name ? `${data.customer_name} — ${data.message}` : data.message,
          icon: '/favicon.ico',
        });
      }

      // Auto-refresh orders so the card shows up
      refetch();
    };

    socket.on('rider:notification', handleNotification);
    return () => socket.off('rider:notification', handleNotification);
  }, [socket, user?.id, refetch]);

  // Group by customer, compute group-level rider_status
  const groupedOrders = React.useMemo(() => {
    if (!orders) return [];
    const groups = {};
    orders.forEach(o => {
      const cid = o.customer_id;
      if (!groups[cid]) {
        groups[cid] = { customer_id: cid, customer: o.customer, orders: [] };
      }
      groups[cid].orders.push(o);
    });

    return Object.values(groups).map(g => {
      let status = 'ASSIGNED';
      if (g.orders.some(o => o.rider_status === 'ON_THE_WAY')) status = 'ON_THE_WAY';
      else if (g.orders.some(o => o.rider_status === 'PICKING_UP')) status = 'PICKING_UP';
      else if (g.orders.every(o => o.rider_status === 'DELIVERED')) status = 'DELIVERED';
      else if (g.orders.every(o => ['ACCEPTED', 'ASSIGNED'].includes(o.rider_status || 'ASSIGNED'))) status = 'ASSIGNED';
      return { ...g, status };
    });
  }, [orders]);

  const activeDeliveries = groupedOrders.filter(g => g.status !== 'DELIVERED');
  const completedDeliveries = groupedOrders.filter(g => g.status === 'DELIVERED');

  // Auto-start GPS on page load if already ON_THE_WAY (e.g. after refresh)
  useEffect(() => {
    const onTheWayGroup = activeDeliveries.find(g => g.status === 'ON_THE_WAY');
    if (onTheWayGroup && !isTracking) {
      setIsTracking(true);
      if (!simDest) setSimDest(onTheWayGroup.customer?.delivery_address);
    }
    if (!onTheWayGroup && isTracking) {
      setIsTracking(false);
      setSimDest(null);
    }
  }, [activeDeliveries]);

  // Simulator: try to start from real GPS location
  useEffect(() => {
    if (simulatorMode) {
      navigator.geolocation.getCurrentPosition(
        pos => { simPos.current = { lat: pos.coords.latitude, lng: pos.coords.longitude }; },
        () => { simPos.current = { lat: BANGKOK.lat, lng: BANGKOK.lng }; }
      );
    }
  }, [simulatorMode]);

  // GPS tracking effect — only runs when isTracking = true
  useEffect(() => {
    if (!isTracking) {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
      if (simInterval.current) clearInterval(simInterval.current);
      return;
    }

    if (simulatorMode) {
      let lastTick = Date.now();
      simInterval.current = setInterval(() => {
        const now = Date.now();
        const deltaSec = Math.min((now - lastTick) / 1000, 300);
        lastTick = now;
        const chunks = Math.max(Math.ceil(deltaSec), 1);

        let distanceToMove = 0.003; // Base speed per tick (~300 meters per second for fast testing)

        while (distanceToMove > 0 && simPath.current.length > 0 && simPathIndex.current < simPath.current.length) {
          const target = simPath.current[simPathIndex.current];
          if (!target) break;

          const dx = target.lng - simPos.current.lng;
          const dy = target.lat - simPos.current.lat;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // If the waypoint is very close or we have enough speed to pass it
          if (dist <= distanceToMove || dist < 0.0001) {
            simPos.current = { lat: target.lat, lng: target.lng };
            distanceToMove -= dist; // Consume distance
            simPathIndex.current++;
          } else {
            // Move partially towards the waypoint
            simPos.current = {
              lat: simPos.current.lat + (dy / dist) * distanceToMove,
              lng: simPos.current.lng + (dx / dist) * distanceToMove,
            };
            distanceToMove = 0; // Used up all movement for this tick
          }
        }

        socket?.emit('rider:location_update', {
          lat: simPos.current.lat,
          lng: simPos.current.lng,
          speed: 40,
          rider_id: user?.id,
        });
      }, 1000);
    } else {
      watchId.current = navigator.geolocation.watchPosition(
        pos => {
          socket?.emit('rider:location_update', {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            speed: pos.coords.speed,
            heading: pos.coords.heading,
            rider_id: user?.id,
          });
        },
        () => { toast.error('GPS Error. Please allow location access.'); setIsTracking(false); },
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }

    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
      if (simInterval.current) clearInterval(simInterval.current);
    };
  }, [isTracking, simulatorMode, socket, user?.id]);

  // Google Maps for simulator route
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  // Fetch simulator route when destination is set
  useEffect(() => {
    if (!simulatorMode || !isTracking || !isLoaded || !simDest) return;

    // Reset path before fetching new one
    simPath.current = [];
    simPathIndex.current = 0;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route({
      origin: simPos.current,
      destination: `${simDest}, Thailand`,
      travelMode: window.google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        simPath.current = result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }));
        simPathIndex.current = 0;
        console.log('[SIM] Route loaded:', simPath.current.length, 'waypoints to', simDest);
      } else {
        console.error('[SIM] Directions failed:', status);
        toast.error('Route fetch failed. Check Maps API key.');
      }
    });
  }, [simulatorMode, isTracking, isLoaded, simDest]);

  // Status update handler
  const handleUpdateStatus = async (group, newStatus) => {
    setIsPending(true);
    try {
      await Promise.all(
        group.orders.map(o =>
          api.put(`/operations/orders/${o.id}/rider-status`, { status: newStatus })
        )
      );
      queryClient.invalidateQueries(['rider-orders', user?.id]);

      // ── Start / stop GPS tracking immediately, don't wait for query refetch ──
      if (newStatus === 'ON_THE_WAY') {
        const dest = group.customer?.delivery_address;
        setSimDest(dest);     // Set destination for simulator route
        setIsTracking(true);  // Start GPS NOW
      } else if (newStatus === 'DELIVERED') {
        setIsTracking(false);
        setSimDest(null);
      }

      const msgs = {
        PICKING_UP: 'ပစ္စည်းယူရောက်ပြီ ✅',
        ON_THE_WAY: 'GPS Tracking Started! 🚀',
        DELIVERED: 'Delivered! Great job 🎉',
      };
      toast.success(msgs[newStatus] || 'Updated!');
    } catch (e) {
      toast.error('Failed to update status. Try again.');
      console.error(e);
    } finally {
      setIsPending(false);
    }
  };

  // ── Loading screen ──
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#060610,#0d0a1a)' }}>
        <div className="text-center">
          <div className="w-14 h-14 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-bold tracking-wide">Loading your deliveries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(160deg, #06060f 0%, #0d0814 60%, #060b12 100%)' }}>

      {/* ── Header ── */}
      <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/8 px-4 py-3" style={{ background: 'rgba(6,6,15,0.85)' }}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.15em]">BBD Delivery</p>
            <h1 className="text-white font-black text-lg leading-tight">
              မင်္ဂလာပါ, <span className="text-fuchsia-400">{user?.full_name?.split(' ')[0] || 'Rider'}</span> 👋
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isTracking && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)' }}>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-[11px] font-black tracking-wider">GPS LIVE</span>
              </div>
            )}
            {/* Dev settings button */}
            <button
              onClick={() => setShowDevPanel(v => !v)}
              title="Developer GPS Simulator"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-600 hover:text-slate-400 transition-all text-sm"
            >⚙️</button>
          </div>
        </div>

        {/* Developer GPS Panel */}
        {showDevPanel && (
          <div className="mt-3 bg-white/5 border border-dashed border-white/15 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <p className="text-white text-xs font-black">GPS Simulator</p>
              <p className="text-slate-500 text-[10px]">Dev mode — Mock location</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={simulatorMode}
                onChange={e => setSimulatorMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-950 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-500" />
            </label>
          </div>
        )}
      </div>

      {/* ── Food Ready Alert Banner ── */}
      {alert && (
        <div
          className="mx-4 mt-3 rounded-2xl p-4 border border-amber-500/60 animate-pulse"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(234,88,12,0.15))' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🍱</span>
              <div>
                <p className="text-amber-300 font-black text-base leading-tight">
                  {alert.customer_name && <span className="text-white">{alert.customer_name} — </span>}
                  ပစ္စည်း Ready ဖြစ်ပြီ!
                </p>
                <p className="text-amber-400/70 text-xs mt-0.5">လာယူနိုင်ပါပြီ 🚀</p>
              </div>
            </div>
            <button
              onClick={() => setAlert(null)}
              className="text-amber-500 hover:text-white text-xl leading-none shrink-0"
            >✕</button>
          </div>
        </div>
      )}

      {/* ── Stats Bar ── */}
      <div className="px-4 pt-4 pb-2 grid grid-cols-3 gap-3">
        <div className="rounded-2xl p-3 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-wider">Total</p>
          <p className="text-white text-2xl font-black">{groupedOrders.length}</p>
        </div>
        <div className="rounded-2xl p-3 border" style={{ background: 'rgba(217,70,239,0.08)', borderColor: 'rgba(217,70,239,0.2)' }}>
          <p className="text-fuchsia-500 text-[10px] font-black uppercase tracking-wider">Active</p>
          <p className="text-white text-2xl font-black">{activeDeliveries.length}</p>
        </div>
        <div className="rounded-2xl p-3 border" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}>
          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-wider">Done</p>
          <p className="text-white text-2xl font-black">{completedDeliveries.length}</p>
        </div>
      </div>

      {/* ── Active Deliveries ── */}
      <div className="px-4 pt-2 space-y-4">
        {activeDeliveries.length === 0 ? (
          <div className="mt-4 text-center py-16 rounded-3xl border border-dashed border-white/10">
            <span className="text-5xl block mb-4">📭</span>
            <h3 className="text-white font-black text-lg mb-2">No Active Deliveries</h3>
            <p className="text-slate-600 text-sm px-6">
              Orders will appear here when admin assigns them to you.
              <br />Page auto-refreshes every 30 seconds.
            </p>
          </div>
        ) : (
          activeDeliveries.map(group => (
            <DeliveryCard
              key={group.customer_id}
              group={group}
              onUpdateStatus={handleUpdateStatus}
              isPending={isPending}
            />
          ))
        )}
      </div>

      {/* ── Completed Section ── */}
      {completedDeliveries.length > 0 && (
        <div className="px-4 pt-8 pb-4">
          <p className="text-slate-600 text-[11px] font-black uppercase tracking-[0.15em] mb-3">
            ✅ Completed Today
          </p>
          <div className="space-y-2">
            {completedDeliveries.map(group => (
              <div
                key={group.customer_id}
                className="flex justify-between items-center p-4 rounded-2xl border border-white/5 opacity-50"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div>
                  <p className="text-slate-400 font-bold text-sm">{group.customer?.full_name}</p>
                  <p className="text-slate-600 text-xs mt-0.5">
                    {(group.customer?.delivery_address || '').substring(0, 45)}
                    {(group.customer?.delivery_address || '').length > 45 ? '...' : ''}
                  </p>
                </div>
                <span className="text-emerald-500 text-xl ml-3">✅</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
