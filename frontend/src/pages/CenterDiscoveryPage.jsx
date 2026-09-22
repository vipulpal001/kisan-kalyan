import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Map, 
  Calendar, 
  Clock, 
  Users, 
  ChevronDown, 
  Check, 
  Building2, 
  Compass, 
  Heart, 
  Lightbulb, 
  ArrowRight,
  Sparkles,
  Star,
  X
} from 'lucide-react';

import chunarImg from '../assets/center_chunar.png';
import varanasiImg from '../assets/center_varanasi.png';
import khannaImg from '../assets/center_khanna.png';
import ahrauraImg from '../assets/center_ahraura.png';
import tractorFieldImg from '../assets/tractor_field.png';
import { useLanguage } from '../context/LanguageContext';

export default function CenterDiscoveryPage() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [sortBy, setSortBy] = useState('nearest');
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedCenterDetail, setSelectedCenterDetail] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kisan_fav_centres') || '[]');
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    fetchCenters();
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  };

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const res = await api.get('/centers');
      if (Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((c) => {
          let img = chunarImg;
          const cName = c.centerName || c.centreName || '';
          const cCode = c.centerCode || c.centreCode || '';
          const dist = c.district || '';

          if (cName.includes('वाराणसी') || dist === 'Varanasi') img = varanasiImg;
          else if (cName.includes('अहरौरा') || cCode.includes('AHRAURA')) img = ahrauraImg;
          else if (cName.includes('खन्ना') || cCode.includes('KHANNA')) img = khannaImg;
          else if (cName.includes('लाल') || cCode.includes('LALGANJ')) img = tractorFieldImg;

          const lat = c.latitude != null ? Number(c.latitude) : null;
          const lng = c.longitude != null ? Number(c.longitude) : null;
          const distKm = userLocation && lat != null && lng != null ? calculateDistance(userLocation.lat, userLocation.lng, lat, lng) : null;

          return {
            id: c.centerId || c.id,
            centreCode: cCode || `PC-${c.centerId || c.id}`,
            name: cName,
            address: c.centerLocation || [c.village, c.district, c.state].filter(Boolean).join(', ') || '—',
            district: c.district || '—',
            state: c.state || '—',
            distanceKm: distKm,
            distance: distKm != null ? `${distKm} km दूर` : null,
            status: c.status || 'ACTIVE',
            latitude: lat,
            longitude: lng,
            capacityPerDay: c.capacityPerDay != null ? Number(c.capacityPerDay) : null,
            currentDailyQuantity: c.currentDailyQuantity != null ? Number(c.currentDailyQuantity) : null,
            tip: `${cName} में डिजिटल ई-उपार्जन प्रणाली सक्रिय है!`,
            image: img,
            contactNumber: c.contactNumber || null,
            operatingHours: 'प्रातः 08:00 से सायं 18:00'
          };
        });
        setCenters(mapped);
      } else {
        setCenters([]);
      }
    } catch (e) {
      console.error("Error loading centres:", e);
      setCenters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert(lang === 'en' ? 'Geolocation is not supported by your browser.' : 'आपके ब्राउज़र में जीपीएस सुविधा समर्थित नहीं है।');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(uLoc);
        // Recalculate distances
        setCenters(prev => prev.map(c => {
          const distKm = c.latitude != null && c.longitude != null ? calculateDistance(uLoc.lat, uLoc.lng, c.latitude, c.longitude) : null;
          return {
            ...c,
            distanceKm: distKm,
            distance: distKm != null ? `${distKm} km दूर` : null
          };
        }));
        setSortBy('nearest');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        alert(lang === 'en' ? 'Location permission was denied or unavailable.' : 'स्थान (GPS) अनुमति प्राप्त नहीं हुई या अनुपलब्ध है।');
      }
    );
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('kisan_fav_centres', JSON.stringify(next));
      return next;
    });
  };

  const districts = ['All', ...new Set(centers.map(c => c.district).filter(d => d && d !== '—'))];

  const filteredCenters = centers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.centreCode && c.centreCode.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDistrict = selectedDistrict === 'All' || c.district === selectedDistrict;
    const matchesActive =
      activeFilter === 'all' ||
      activeFilter === 'nearby' ||
      activeFilter === 'district' ||
      activeFilter === 'map' ||
      (activeFilter === 'favorites' && favorites.includes(c.id));
    return matchesSearch && matchesDistrict && matchesActive;
  }).sort((a, b) => {
    if (sortBy === 'nearest') {
      if (a.distanceKm != null && b.distanceKm != null) return a.distanceKm - b.distanceKm;
      if (a.distanceKm != null) return -1;
      if (b.distanceKm != null) return 1;
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'capacity') {
      return (b.capacityPerDay || 0) - (a.capacityPerDay || 0);
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div style={{ background: 'transparent', minHeight: '90vh', padding: '24px 0 40px 0' }}>
      <div className="portal-container" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* ================= LEFT SIDEBAR ================= */}
        <div style={{ width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Top Title Card */}
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '16px', 
            padding: '20px 18px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            gap: '14px',
            alignItems: 'flex-start'
          }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '12px', 
              background: '#017953', 
              color: '#ffffff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <MapPin size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginBottom: '6px' }}>
                {lang === 'en' ? 'Find Procurement Centres' : 'निकटतम उपार्जन केंद्र खोजें'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                {lang === 'en' ? 'Check distance, crowd status and available booking slots' : 'दूरी, कतार की स्थिति और उपलब्ध स्लॉट की जानकारी देखें'}
              </p>
            </div>
          </div>

          {/* Navigation Filter Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => setActiveFilter('all')}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '12px 16px', 
                borderRadius: '10px', 
                fontSize: '0.9rem', 
                fontWeight: 700, 
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                background: activeFilter === 'all' ? '#017953' : '#ffffff',
                color: activeFilter === 'all' ? '#ffffff' : '#334155',
                boxShadow: activeFilter === 'all' ? '0 3px 8px rgba(1, 121, 83, 0.25)' : '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <Building2 size={18} />
              <span>{lang === 'en' ? 'All Centres' : 'सभी उपार्जन केंद्र'}</span>
            </button>

            <button 
              onClick={() => setActiveFilter('nearby')}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '12px 16px', 
                borderRadius: '10px', 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                textAlign: 'left',
                background: activeFilter === 'nearby' ? '#017953' : '#ffffff',
                color: activeFilter === 'nearby' ? '#ffffff' : '#334155'
              }}
            >
              <Compass size={18} color="#059669" />
              <span>मेरे नजदीक</span>
            </button>

            <button 
              onClick={() => setActiveFilter('district')}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '12px 16px', 
                borderRadius: '10px', 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                textAlign: 'left',
                background: activeFilter === 'district' ? '#017953' : '#ffffff',
                color: activeFilter === 'district' ? '#ffffff' : '#334155'
              }}
            >
              <Building2 size={18} color="#0284c7" />
              <span>मेरे जिले में</span>
            </button>

            <button 
              onClick={() => setActiveFilter('map')}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '12px 16px', 
                borderRadius: '10px', 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                textAlign: 'left',
                background: activeFilter === 'map' ? '#017953' : '#ffffff',
                color: activeFilter === 'map' ? '#ffffff' : '#334155'
              }}
            >
              <Map size={18} color="#d97706" />
              <span>मानचित्र पर देखें</span>
            </button>

            <button 
              onClick={() => setActiveFilter('favorites')}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '12px 16px', 
                borderRadius: '10px', 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                textAlign: 'left',
                background: activeFilter === 'favorites' ? '#017953' : '#ffffff',
                color: activeFilter === 'favorites' ? '#ffffff' : '#334155'
              }}
            >
              <Heart size={18} color="#e11d48" />
              <span>पसंदीदा केंद्र</span>
            </button>
          </div>

          {/* Bottom Illustration Banner */}
          <div style={{ marginTop: '10px', textAlign: 'center', padding: '10px' }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 900, 
              color: '#064e3b', 
              fontFamily: "'Noto Sans Devanagari', sans-serif",
              lineHeight: 1.3,
              marginBottom: '12px'
            }}>
              “किसान की सुविधा<br />हमारी प्राथमिकता”
            </h3>
            <img 
              src={tractorFieldImg} 
              alt="Tractor in Green Field" 
              style={{ width: '100%', maxHeight: '180px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
            />
          </div>

        </div>

        {/* ================= RIGHT MAIN AREA ================= */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Top Search and Filter Bar */}
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '14px', 
            padding: '12px 16px', 
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            border: '1px solid #e2e8f0',
            display: 'flex', 
            gap: '12px', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Search Input */}
            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'en' ? "Search centre name, village or district..." : "उपार्जन केंद्र का नाम, गांव या जिला खोजें..."}
                style={{ 
                  width: '100%', 
                  padding: '9px 12px 9px 38px', 
                  borderRadius: '8px', 
                  border: '1px solid #cbd5e1', 
                  fontSize: '0.88rem',
                  outline: 'none',
                  background: '#f8fafc'
                }}
              />
            </div>

            {/* District Selector */}
            <div style={{ position: 'relative', minWidth: '180px' }}>
              <select 
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '9px 28px 9px 12px', 
                  borderRadius: '8px', 
                  border: '1px solid #cbd5e1', 
                  fontSize: '0.86rem', 
                  fontWeight: 600, 
                  color: '#334155', 
                  background: '#ffffff', 
                  appearance: 'none', 
                  cursor: 'pointer' 
                }}
              >
                {districts.map(d => (
                  <option key={d} value={d}>
                    {d === 'All' ? 'सभी जिले (All Districts)' : `${d} (${d})`}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} color="#64748b" style={{ position: 'absolute', right: '10px', top: '12px', pointerEvents: 'none' }} />
            </div>

            {/* My Location Button */}
            <button 
              onClick={handleGetLocation}
              title={lang === 'en' ? 'Use current GPS location' : 'वर्तमान जीपीएस स्थान का उपयोग करें'}
              style={{ 
                background: userLocation ? '#ecfdf5' : '#ffffff', 
                border: userLocation ? '1.5px solid #059669' : '1px solid #cbd5e1', 
                borderRadius: '8px', 
                padding: '8px 14px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '0.86rem', 
                fontWeight: 600, 
                color: userLocation ? '#059669' : '#334155', 
                cursor: 'pointer' 
              }}
            >
              <Navigation size={15} color="#059669" />
              <span>{userLocation ? (lang === 'en' ? 'GPS Active' : 'स्थान सक्रिय') : (lang === 'en' ? 'My Location' : 'मेरा स्थान')}</span>
            </button>

            {/* Map View Button */}
            <button 
              onClick={() => setShowMapModal(true)}
              style={{ 
                background: '#ecfdf5', 
                border: '1.5px solid #059669', 
                borderRadius: '8px', 
                padding: '8px 14px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '0.86rem', 
                fontWeight: 700, 
                color: '#059669', 
                cursor: 'pointer' 
              }}
            >
              <Map size={15} />
              <span>मानचित्र दृश्य (GIS Map)</span>
            </button>
          </div>

          {/* Results Summary Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b' }}>
              कुल {filteredCenters.length} खरीद केंद्र उपलब्ध
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ 
                  padding: '6px 12px', 
                  borderRadius: '8px', 
                  border: '1px solid #cbd5e1', 
                  fontSize: '0.82rem', 
                  fontWeight: 600, 
                  color: '#475569', 
                  background: '#ffffff', 
                  cursor: 'pointer' 
                }}
              >
                <option value="nearest">{lang === 'en' ? 'Nearest First ⌵' : 'निकटतम पहले ⌵'}</option>
                <option value="capacity">{lang === 'en' ? 'Highest Capacity ⌵' : 'अधिकतम क्षमता ⌵'}</option>
                <option value="name">{lang === 'en' ? 'By Name ⌵' : 'नाम अनुसार ⌵'}</option>
              </select>
            </div>
          </div>

          {/* Centers Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredCenters.map((center) => (
              <div 
                key={center.id}
                style={{ 
                  background: '#ffffff', 
                  borderRadius: '14px', 
                  padding: '16px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  gap: '18px',
                  alignItems: 'center',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                {/* Center Image */}
                <div style={{ width: '150px', height: '100px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <img 
                    src={center.image} 
                    alt={center.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>

                {/* Center Info Middle */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  
                  {/* Pills Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {center.distance ? (
                      <span style={{ 
                        background: '#ecfdf5', 
                        color: '#065f46', 
                        fontSize: '0.74rem', 
                        fontWeight: 700, 
                        padding: '2px 8px', 
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <MapPin size={11} />
                        {center.distance}
                      </span>
                    ) : (
                      <span style={{ 
                        background: '#f1f5f9', 
                        color: '#64748b', 
                        fontSize: '0.74rem', 
                        fontWeight: 600, 
                        padding: '2px 8px', 
                        borderRadius: '12px'
                      }}>
                        {center.district}
                      </span>
                    )}

                    <span style={{ 
                      background: center.status === 'ACTIVE' ? '#dcfce7' : '#fef3c7', 
                      color: center.status === 'ACTIVE' ? '#166534' : '#92400e', 
                      fontSize: '0.74rem', 
                      fontWeight: 700, 
                      padding: '2px 8px', 
                      borderRadius: '12px'
                    }}>
                      {center.status === 'ACTIVE' ? (lang === 'en' ? 'Operational' : 'संचालित') : center.status}
                    </span>

                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                      कोड: {center.centreCode}
                    </span>
                  </div>

                  {/* Center Name */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                      {center.name}
                    </h3>
                    <button
                      onClick={() => toggleFavorite(center.id)}
                      title={favorites.includes(center.id) ? "पसंदीदा से हटाएं" : "पसंदीदा में जोड़ें"}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: favorites.includes(center.id) ? '#f59e0b' : '#cbd5e1', padding: '2px' }}
                    >
                      <Star size={18} fill={favorites.includes(center.id) ? '#f59e0b' : 'none'} />
                    </button>
                  </div>

                  {/* Address */}
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                    {center.address}
                  </p>

                  {/* Operational Information */}
                  <div style={{ 
                    background: '#f8fafc', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '6px', 
                    padding: '5px 10px', 
                    fontSize: '0.78rem', 
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '2px'
                  }}>
                    <span>📍</span>
                    <span>{center.latitude != null && center.longitude != null ? `${center.latitude.toFixed(4)}°N, ${center.longitude.toFixed(4)}°E` : 'जीपीएस निर्देशांक उपलब्ध नहीं'}</span>
                    {center.contactNumber && <span>• 📞 {center.contactNumber}</span>}
                  </div>
                </div>

                {/* Right Metrics Box & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingLeft: '16px', borderLeft: '1px solid #f1f5f9' }}>
                  
                  {/* Real Metrics from Backend */}
                  <div style={{ display: 'flex', gap: '20px', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                        <span>⚖️</span> दैनिक क्षमता
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#017953' }}>
                        {center.capacityPerDay != null ? `${center.capacityPerDay} Q` : '—'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                        <span>📦</span> दैनिक आवक
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                        {center.currentDailyQuantity != null ? `${center.currentDailyQuantity} Q` : '0 Q'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                        <span>🟢</span> स्थिति
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: center.status === 'ACTIVE' ? '#059669' : '#ea580c', marginTop: '4px' }}>
                        {center.status === 'ACTIVE' ? 'सक्रिय' : center.status}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '130px' }}>
                    <button 
                      onClick={() => navigate('/farmer/book-slot', { state: { prefilledCenter: center.centreCode || center.name } })}
                      style={{ 
                        background: '#017953', 
                        color: '#ffffff', 
                        border: 'none', 
                        borderRadius: '8px', 
                        padding: '9px 14px', 
                        fontSize: '0.85rem', 
                        fontWeight: 700, 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(1, 121, 83, 0.25)'
                      }}
                    >
                      <Calendar size={14} />
                      <span>स्लॉट बुक करें</span>
                    </button>

                    <button 
                      onClick={() => setSelectedCenterDetail(center)}
                      style={{ 
                        background: '#f8fafc', 
                        color: '#334155', 
                        border: '1px solid #cbd5e1', 
                        borderRadius: '8px', 
                        padding: '7px 12px', 
                        fontSize: '0.82rem', 
                        fontWeight: 600, 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>विवरण देखें</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

          {/* Bottom Highlight Feature Bar */}
          <div style={{ 
            background: '#ecfdf5', 
            borderRadius: '12px', 
            padding: '14px 20px', 
            border: '1px solid #a7f3d0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '8px'
          }}>
            <div style={{ display: 'flex', gap: '28px', alignItems: 'center', fontSize: '0.84rem', fontWeight: 700, color: '#065f46' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={16} strokeWidth={3} color="#059669" />
                <span>सटीक और अद्यतन जानकारी</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="#059669" />
                <span>आपके पास का केंद्र</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="#059669" />
                <span>समय की बचत</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📄</span>
                <span>पारदर्शी प्रक्रिया</span>
              </div>
            </div>

            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🌿</span>
              <span>“समृद्ध किसान समृद्ध भारत”</span>
            </div>
          </div>

        </div>

      </div>

      {/* ================= GIS MAP MODAL ================= */}
      {showMapModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(15, 23, 42, 0.75)', 
          backdropFilter: 'blur(4px)', 
          zIndex: 1000, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '20px' 
        }}>
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '20px', 
            width: '100%', 
            maxWidth: '960px', 
            maxHeight: '90vh', 
            overflow: 'hidden', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', 
            display: 'flex', 
            flexDirection: 'column' 
          }}>
            {/* Modal Header */}
            <div style={{ 
              padding: '16px 24px', 
              background: '#044e3b', 
              color: '#ffffff', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Map size={20} color="#34d399" />
                  {lang === 'en' ? 'GIS Procurement Centres Map' : 'उपार्जन केंद्र जीआईएस मानचित्र'}
                </h3>
                <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: '#a7f3d0' }}>
                  {lang === 'en' ? 'Live GPS coordinates & operational status from backend' : 'वास्तविक जीपीएस निर्देशांक एवं लाइव परिचालन स्थिति'}
                </p>
              </div>
              <button 
                onClick={() => setShowMapModal(false)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#ffffff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Map Body */}
            <div style={{ padding: '20px', display: 'flex', gap: '20px', flex: 1, overflowY: 'auto' }}>
              {/* Left: Visual Map Canvas */}
              <div style={{ 
                flex: '1 1 60%', 
                minHeight: '380px', 
                background: '#e2e8f0', 
                borderRadius: '14px', 
                position: 'relative', 
                overflow: 'hidden', 
                border: '2px solid #cbd5e1', 
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.08)',
                backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}>
                {/* Geolocation indicator */}
                <div style={{ position: 'absolute', top: '12px', left: '14px', background: 'rgba(255,255,255,0.92)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 700, color: '#334155', border: '1px solid #cbd5e1', zIndex: 6 }}>
                  🗺️ {userLocation ? `GPS: ${userLocation.lat.toFixed(3)}°N, ${userLocation.lng.toFixed(3)}°E` : 'स्थान: वास्तविक उपार्जन केंद्र जीपीएस मानचित्र'}
                </div>

                {/* Legend Overlay at bottom of map */}
                <div style={{ position: 'absolute', bottom: '10px', left: '14px', right: '14px', background: 'rgba(255,255,255,0.92)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, color: '#334155', border: '1px solid #cbd5e1', display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                  <span>🟢 {lang === 'en' ? 'Operational' : 'सक्रिय'}</span>
                  <span>🟠 {lang === 'en' ? 'Maintenance / Inactive' : 'निष्क्रिय / रखरखाव'}</span>
                </div>

                {/* Real Center Pins from Backend Coordinates */}
                {(() => {
                  const mappable = centers.filter(c => c.latitude != null && c.longitude != null);
                  if (mappable.length === 0) {
                    return (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                        जीपीएस निर्देशांक डेटा उपलब्ध नहीं है
                      </div>
                    );
                  }
                  const lats = mappable.map(c => c.latitude);
                  const lngs = mappable.map(c => c.longitude);
                  const minLat = Math.min(...lats);
                  const maxLat = Math.max(...lats);
                  const minLng = Math.min(...lngs);
                  const maxLng = Math.max(...lngs);

                  return mappable.map((c) => {
                    const leftPct = maxLng === minLng ? 50 : 15 + ((c.longitude - minLng) / (maxLng - minLng)) * 70;
                    const topPct = maxLat === minLat ? 50 : 80 - ((c.latitude - minLat) / (maxLat - minLat)) * 60;
                    const isSelected = selectedCenterDetail?.id === c.id;

                    return (
                      <div 
                        key={c.id} 
                        onClick={() => setSelectedCenterDetail(c)}
                        style={{ 
                          position: 'absolute', 
                          left: `${leftPct}%`, 
                          top: `${topPct}%`, 
                          cursor: 'pointer', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          transform: 'translate(-50%, -100%)',
                          zIndex: isSelected ? 10 : 2,
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        {/* Pin Label */}
                        <div style={{ 
                          background: isSelected ? '#044e3b' : '#ffffff', 
                          color: isSelected ? '#ffffff' : '#0f172a', 
                          padding: '3px 8px', 
                          borderRadius: '6px', 
                          fontSize: '0.72rem', 
                          fontWeight: 800, 
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)', 
                          border: '1px solid #cbd5e1',
                          whiteSpace: 'nowrap',
                          marginBottom: '4px'
                        }}>
                          {c.name}
                        </div>
                        {/* Pin Icon */}
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          background: c.status === 'ACTIVE' ? '#059669' : '#dc2626', 
                          color: '#ffffff', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                          border: '2px solid #ffffff'
                        }}>
                          <MapPin size={18} />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Right: Center Details Panel */}
              <div style={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#1e293b' }}>
                  {lang === 'en' ? `Procurement Centres (${centers.length})` : `उपार्जन केंद्र सूची (${centers.length})`}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto' }}>
                  {centers.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => setSelectedCenterDetail(c)}
                      style={{ 
                        padding: '10px 14px', 
                        borderRadius: '10px', 
                        border: selectedCenterDetail?.id === c.id ? '2px solid #059669' : '1px solid #e2e8f0', 
                        background: selectedCenterDetail?.id === c.id ? '#ecfdf5' : '#f8fafc', 
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>{c.name}</strong>
                        <span style={{ fontSize: '0.68rem', background: c.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2', color: c.status === 'ACTIVE' ? '#166534' : '#991b1b', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                          {c.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                        {c.latitude != null && c.longitude != null ? `📍 ${c.latitude.toFixed(4)}°N, ${c.longitude.toFixed(4)}°E` : '📍 निर्देशांक उपलब्ध नहीं'} • {c.district}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Center Action Box */}
                {selectedCenterDetail ? (
                  <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                      {selectedCenterDetail.name} ({selectedCenterDetail.centreCode})
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#475569', margin: '4px 0 8px 0' }}>
                      दैनिक क्षमता: <strong>{selectedCenterDetail.capacityPerDay != null ? `${selectedCenterDetail.capacityPerDay} Qtl` : '—'}</strong> • स्थिति: <strong>{selectedCenterDetail.status}</strong>
                    </div>
                    <button 
                      onClick={() => {
                        setShowMapModal(false);
                        navigate('/farmer/book-slot', { state: { prefilledCenter: selectedCenterDetail.centreCode } });
                      }}
                      style={{ 
                        width: '100%', 
                        background: '#046a4e', 
                        color: '#ffffff', 
                        border: 'none', 
                        padding: '8px 12px', 
                        borderRadius: '8px', 
                        fontSize: '0.82rem', 
                        fontWeight: 700, 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Calendar size={14} />
                      इस केंद्र पर स्लॉट बुक करें
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: '#64748b', textAlign: 'center', padding: '10px' }}>
                    मानचित्र पर पिन या सूची में केंद्र चुनें
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= CENTER DETAILS MODAL ================= */}
      {selectedCenterDetail && !showMapModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(15, 23, 42, 0.7)', 
          backdropFilter: 'blur(3px)', 
          zIndex: 1000, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '20px' 
        }}>
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '16px', 
            width: '100%', 
            maxWidth: '520px', 
            overflow: 'hidden', 
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' 
          }}>
            <div style={{ padding: '16px 20px', background: '#044e3b', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '1.05rem', fontWeight: 800 }}>{selectedCenterDetail.name}</strong>
              <button 
                onClick={() => setSelectedCenterDetail(null)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                <strong>केंद्र कोड (Code):</strong> {selectedCenterDetail.centreCode}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                <strong>पता (Address):</strong> {selectedCenterDetail.address}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                <strong>कार्यकाल समय (Hours):</strong> {selectedCenterDetail.operatingHours}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                <strong>दैनिक खरीद क्षमता:</strong> {selectedCenterDetail.capacityPerDay != null ? `${selectedCenterDetail.capacityPerDay} क्विंटल` : '—'}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                <strong>दैनिक वर्तमान आवक:</strong> {selectedCenterDetail.currentDailyQuantity != null ? `${selectedCenterDetail.currentDailyQuantity} क्विंटल` : '0 क्विंटल'}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                <strong>हेल्पलाइन / संपर्क:</strong> {selectedCenterDetail.contactNumber || '—'}
              </div>

              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => {
                    const code = selectedCenterDetail.centreCode;
                    setSelectedCenterDetail(null);
                    navigate('/farmer/book-slot', { state: { prefilledCenter: code } });
                  }}
                  style={{ 
                    flex: 1, 
                    background: '#046a4e', 
                    color: '#ffffff', 
                    border: 'none', 
                    padding: '10px', 
                    borderRadius: '8px', 
                    fontSize: '0.88rem', 
                    fontWeight: 700, 
                    cursor: 'pointer' 
                  }}
                >
                  स्लॉट बुक करें
                </button>
                <button 
                  onClick={() => setSelectedCenterDetail(null)}
                  style={{ 
                    background: '#f1f5f9', 
                    color: '#475569', 
                    border: '1px solid #cbd5e1', 
                    padding: '10px 16px', 
                    borderRadius: '8px', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    cursor: 'pointer' 
                  }}
                >
                  बंद करें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
