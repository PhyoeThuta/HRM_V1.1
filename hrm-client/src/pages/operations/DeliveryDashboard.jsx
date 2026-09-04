import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import Layout from '../../components/layout/Layout';
import toast from 'react-hot-toast';
import { getCrmSocket } from '../../lib/crmSocket';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

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

export default function DeliveryDashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });
  // Rider Live Locations
  const [riderLocations, setRiderLocations] = useState({});
  const socket = getCrmSocket();
  const mapRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
    
    const handleLocation = (data) => {
      setRiderLocations(prev => ({
        ...prev,
        [data.rider_id]: { lat: data.lat, lng: data.lng, updated: new Date() }
      }));
    };

    socket.on('rider:location', handleLocation);
    return () => socket.off('rider:location', handleLocation);
  }, [socket]);

  // Auto-pan map to show all riders
  useEffect(() => {
    if (mapRef.current && Object.keys(riderLocations).length > 0 && typeof window.google !== 'undefined') {
      const bounds = new window.google.maps.LatLngBounds();
      Object.values(riderLocations).forEach(loc => {
        bounds.extend({ lat: loc.lat, lng: loc.lng });
      });
      mapRef.current.fitBounds(bounds);
      
      // If only 1 rider, zoom isn't too close
      if (Object.keys(riderLocations).length === 1) {
        mapRef.current.setZoom(15);
      }
    }
  }, [riderLocations]);

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
    },
    onError: (err) => {
      toast.error('Failed to update status');
      console.error(err);
    }
  });

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

  const pending = groupedOrders.filter(g => g.status === 'PENDING');
  const onTheWay = groupedOrders.filter(g => g.status === 'ON_THE_WAY');
  const delivered = groupedOrders.filter(g => g.status === 'DELIVERED');

  const handleUpdateStatus = (orderIds, status) => {
    updateBatchStatusMutation.mutate({ orderIds, status });
  };

  const GroupCard = ({ group, actions }) => (
    <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-black text-white text-lg">{group.customer?.full_name}</h4>
          <p className="text-slate-400 font-bold text-sm">{group.customer?.phone}</p>
        </div>
        <div className="flex flex-col gap-1 items-end">
          {group.orders.map(o => (
            <span key={o.id} className={`px-2 py-1 rounded-lg text-[10px] font-black ${o.daily_menus?.meal_type === 'LUNCH' ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
              {o.daily_menus?.meal_type} x{o.count}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-slate-300 text-sm">
          <span className="text-brand-primary">📍</span> {group.customer?.delivery_address || 'No Address Provided'}
        </p>
        {group.customer?.delivery_notes && (
          <p className="text-emerald-400 text-xs mt-2 font-bold bg-emerald-500/10 p-2 rounded-lg inline-block">
            Note: {group.customer.delivery_notes}
          </p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-2 mt-4 pt-4 border-t border-white/5">
        <a 
          href={`/track/${group.customer_id}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 py-2 px-4 rounded-xl font-bold text-sm text-center bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-all border border-brand-primary/30"
        >
          🗺️ View Map
        </a>
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => handleUpdateStatus(group.orders.map(o => o.id), action.status)}
            disabled={updateBatchStatusMutation.isPending}
            className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-all ${action.className} disabled:opacity-50`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Layout title="Delivery Dashboard" subtitle="Live tracking and status updates for deliveries">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-800 p-6 rounded-3xl border border-white/5 shadow-xl">
          <div className="flex items-center gap-4">
            <span className="text-2xl">📅</span>
            <input 
              type="date" 
              value={targetDate} 
              onChange={(e) => setTargetDate(e.target.value)}
              className="bg-surface-900 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-brand-primary font-bold"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto">
            <div className="bg-slate-500/10 border border-slate-500/20 px-6 py-2 rounded-xl text-center min-w-[100px]">
              <p className="text-slate-400 text-xs font-bold">TOTAL DESTINATIONS</p>
              <p className="text-white text-2xl font-black">{groupedOrders.length}</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 px-6 py-2 rounded-xl text-center min-w-[100px]">
              <p className="text-amber-400 text-xs font-bold">PENDING</p>
              <p className="text-white text-2xl font-black">{pending.length}</p>
            </div>
            <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 px-6 py-2 rounded-xl text-center min-w-[100px]">
              <p className="text-fuchsia-400 text-xs font-bold">ON THE WAY</p>
              <p className="text-white text-2xl font-black">{onTheWay.length}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-2 rounded-xl text-center min-w-[100px]">
              <p className="text-emerald-400 text-xs font-bold">DELIVERED</p>
              <p className="text-white text-2xl font-black">{delivered.length}</p>
            </div>
          </div>
        </div>

        {/* Live Map View */}
        <div className="bg-surface-800 rounded-3xl border border-white/5 shadow-xl overflow-hidden h-[400px] relative z-0">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={13}
              options={{
                styles: darkMapStyle,
                disableDefaultUI: true,
                zoomControl: true
              }}
              onLoad={map => mapRef.current = map}
            >
              {Object.entries(riderLocations).map(([id, loc]) => (
                <Marker 
                  key={id} 
                  position={{ lat: loc.lat, lng: loc.lng }} 
                  icon={{
                    url: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23d946ef' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M12 8v4l3 3'%3E%3C/path%3E%3C/svg%3E",
                    scaledSize: typeof window.google !== 'undefined' ? new window.google.maps.Size(32, 32) : null
                  }}
                  title={`Rider ${id}`}
                />
              ))}
            </GoogleMap>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">Loading Map...</div>
          )}
          
          {Object.keys(riderLocations).length === 0 && (
            <div className="absolute inset-0 z-[400] flex items-center justify-center pointer-events-none">
              <div className="bg-surface-900/80 backdrop-blur-sm p-4 rounded-2xl border border-white/10 text-center">
                <span className="text-2xl mb-2 block">📡</span>
                <p className="text-white font-bold text-sm">No active riders broadcasting location</p>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center p-12 text-slate-500 font-bold">Loading deliveries...</div>
        ) : groupedOrders.length === 0 ? (
          <div className="text-center p-12 bg-surface-800 rounded-3xl border border-white/5">
            <span className="text-4xl mb-4 block">📭</span>
            <p className="text-slate-400 font-bold">No orders found for this date.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* PENDING COLUMN */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <h3 className="font-black text-white text-lg">PENDING</h3>
                <span className="bg-white/10 text-slate-300 px-2 py-0.5 rounded-full text-xs font-bold ml-auto">{pending.length}</span>
              </div>
              <div className="space-y-4">
                {pending.map(group => (
                  <GroupCard 
                    key={group.customer_id} 
                    group={group} 
                    actions={[
                      { label: '🚀 Start Delivery', status: 'ON_THE_WAY', className: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white' }
                    ]}
                  />
                ))}
              </div>
            </div>

            {/* ON THE WAY COLUMN */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-fuchsia-500 animate-pulse"></span>
                <h3 className="font-black text-white text-lg">ON THE WAY</h3>
                <span className="bg-white/10 text-slate-300 px-2 py-0.5 rounded-full text-xs font-bold ml-auto">{onTheWay.length}</span>
              </div>
              <div className="space-y-4">
                {onTheWay.map(group => (
                  <GroupCard 
                    key={group.customer_id} 
                    group={group} 
                    actions={[
                      { label: '↩️ Back', status: 'PENDING', className: 'bg-slate-700 hover:bg-slate-600 text-white' },
                      { label: '✅ Delivered', status: 'DELIVERED', className: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' }
                    ]}
                  />
                ))}
              </div>
            </div>

            {/* DELIVERED COLUMN */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <h3 className="font-black text-white text-lg">DELIVERED</h3>
                <span className="bg-white/10 text-slate-300 px-2 py-0.5 rounded-full text-xs font-bold ml-auto">{delivered.length}</span>
              </div>
              <div className="space-y-4">
                {delivered.map(group => (
                  <GroupCard 
                    key={group.customer_id} 
                    group={group} 
                    actions={[
                      { label: '↩️ Undo', status: 'ON_THE_WAY', className: 'bg-slate-700 hover:bg-slate-600 text-white' }
                    ]}
                  />
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}
