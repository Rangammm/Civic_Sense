/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Filter, Layers, Navigation, Info, Search } from 'lucide-react';
import axios from 'axios';

const MapView = () => {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('all');
  const [mapType, setMapType] = useState('satellite');
  const [zoom, setZoom] = useState(12);
  const [center, setCenter] = useState('73.1812!3d22.3072'); 

  const layers = ['satellite', 'roadmap', 'terrain'];

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/issues');
        setIssues(res.data);
      } catch (err) {
        console.error('Error fetching map data:', err);
      }
    };
    fetchIssues();
  }, []);

  const handleLayerCycle = () => {
    const currentIndex = layers.indexOf(mapType);
    const nextIndex = (currentIndex + 1) % layers.length;
    setMapType(layers[nextIndex]);
  };

  const handleFocusVadodara = () => {
    // Precise zoom-in to Vadodara city center
    setCenter('73.1812!3d22.3072');
    setZoom(16);
  };

  const mapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d10000!2d${center}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1711570000000!5m2!1sen!2sin&maptype=${mapType}&zoom=${zoom}`;

  const dataPoints = [
    { id: 1, top: '25%', left: '35%', duration: 3.2, delay: 0 },
    { id: 2, top: '45%', left: '55%', duration: 4.1, delay: 0.5 },
    { id: 3, top: '30%', left: '70%', duration: 3.8, delay: 1.0 },
    { id: 4, top: '65%', left: '40%', duration: 4.5, delay: 1.5 },
    { id: 5, top: '55%', left: '65%', duration: 3.5, delay: 2.0 },
    { id: 6, top: '20%', left: '45%', duration: 4.2, delay: 2.5 },
    { id: 7, top: '75%', left: '50%', duration: 3.9, delay: 3.0 },
    { id: 8, top: '40%', left: '30%', duration: 4.8, delay: 3.5 }
  ];

  return (
    <div className="relative h-[calc(100vh-80px)] w-full bg-[#0F172A] overflow-hidden">
      {/* Sidebar Controls */}
      <div className="absolute top-6 left-6 z-20 w-80 space-y-4">
        <div className="glass p-6 rounded-[2rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-xl">
              🇮🇳
            </div>
            <div>
              <h3 className="font-bold text-white leading-tight">Civic Explorer</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-none mt-1">Real-time Pulse</p>
            </div>
          </div>

          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Search area or issue ID..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />
            <Search size={16} className="absolute left-3 top-3.5 text-slate-500" />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Issue Type</p>
            {['all', 'pothole', 'garbage', 'waterlogging', 'streetlight'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm capitalize transition-all flex items-center justify-between ${
                  filter === type 
                    ? 'bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20' 
                    : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                {type}
                {filter === type && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="glass p-5 rounded-3xl border border-white/5 shadow-xl flex gap-4 overflow-hidden">
          <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
            <div className="w-2 h-2 rounded-full bg-red-500"></div> Pending
          </div>
          <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div> In Progress
          </div>
          <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Resolved
          </div>
        </div>
      </div>

      {/* Main Map Visual (Google Earth Style) */}
      <div className="absolute inset-0 bg-[#020617]">
        {/* Interactive Satellite View Iframe */}
        <iframe 
          key={mapUrl}
          title="Google Earth View"
          src={mapUrl}
          className="w-full h-full border-none grayscale-[0.2] saturate-[1.2] opacity-80"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
        
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-[#0F172A]/20 to-[#0F172A]/40"></div>

        {/* Dynamic Data Points (Animated) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {dataPoints.map((point) => (
            <motion.div
              key={point.id}
              className="absolute w-4 h-4"
              style={{ 
                top: point.top, 
                left: point.left 
              }}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ 
                duration: point.duration, 
                repeat: Infinity,
                delay: point.delay 
              }}
            >
              <div className="w-full h-full rounded-full bg-indigo-500 blur-sm"></div>
              <div className="absolute inset-[33%] w-[33%] h-[33%] rounded-full bg-white"></div>
            </motion.div>
          ))}
        </div>

        {/* India Highlight Text with Flag */}
        <div className="absolute bottom-10 right-10 text-right z-10 flex flex-col items-end gap-3">
          <div className="flex items-center gap-3">
            <svg width="40" height="26" viewBox="0 0 900 600" className="rounded-sm shadow-2xl border border-white/20">
              <rect width="900" height="200" fill="#FF9933" />
              <rect y="200" width="900" height="200" fill="#FFFFFF" />
              <rect y="400" width="900" height="200" fill="#128807" />
              <circle cx="450" cy="300" r="40" fill="none" stroke="#000080" strokeWidth="2" />
            </svg>
            <h2 className="text-8xl font-black text-white/5 select-none leading-none tracking-tighter uppercase italic">
              INDIA
            </h2>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-xs mr-2">National Urban Sync</p>
        </div>
      </div>

      {/* Map Action Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
        <button 
          onClick={handleLayerCycle}
          className="glass px-6 py-3 rounded-2xl flex items-center gap-3 text-white text-sm font-bold border border-white/10 hover:bg-white/10 transition-all cursor-pointer capitalize shadow-xl"
        >
          <Layers size={18} className="text-indigo-400" /> View: {mapType}
        </button>
        <button 
          onClick={handleFocusVadodara}
          className="bg-indigo-600 px-6 py-3 rounded-2xl flex items-center gap-3 text-white text-sm font-bold shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:bg-indigo-500 hover:scale-105 transition-all cursor-pointer"
        >
          <MapPin size={18} /> Focus: Vadodara
        </button>
      </div>

      {/* Floating Info */}
      <div className="absolute top-6 right-6 z-20">
        <div className="glass p-4 rounded-2xl border border-white/10 flex items-center gap-3 text-xs font-bold text-slate-300">
          <Info size={16} className="text-indigo-400" />
          Click on any marker to view details
        </div>
      </div>
    </div>
  );
};

export default MapView;