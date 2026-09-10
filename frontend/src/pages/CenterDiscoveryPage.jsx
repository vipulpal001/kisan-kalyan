import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Sparkles
} from 'lucide-react';

import chunarImg from '../assets/center_chunar.png';
import varanasiImg from '../assets/center_varanasi.png';
import khannaImg from '../assets/center_khanna.png';
import ahrauraImg from '../assets/center_ahraura.png';
import tractorFieldImg from '../assets/tractor_field.png';

export default function CenterDiscoveryPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [sortBy, setSortBy] = useState('nearest');

  const centers = [
    {
      id: 'CEN-001',
      name: 'चुनार कृषि उपज मंडी समिति',
      address: 'रेलवे स्टेशन रोड के पास, चुनार, मिर्ज़ापुर, उ.प्र.',
      distance: '3.2 km दूर',
      crowd: 'भीड़ कम',
      crowdColor: '#166534',
      crowdBg: '#dcfce7',
      distanceBg: '#fee2e2',
      distanceColor: '#dc2626',
      availableSlots: 18,
      queueFarmers: 7,
      waitTime: '~35 min',
      tip: 'केंद्र पर 3 घंटे से कम भी इंतजार है। आज बुक करें!',
      image: chunarImg,
      district: 'Mirzapur'
    },
    {
      id: 'CEN-002',
      name: 'वाराणसी नवीन गल्ला मंडी केंद्र',
      address: 'शिवपुर मंडी रोड, शिवपुर, वाराणसी, उ.प्र.',
      distance: '14.5 km दूर',
      crowd: 'भीड़ अधिक',
      crowdColor: '#b45309',
      crowdBg: '#fef3c7',
      distanceBg: '#fee2e2',
      distanceColor: '#dc2626',
      availableSlots: 4,
      queueFarmers: 28,
      waitTime: '~65 min',
      tip: 'कम उपलब्धता होने के कारण आज अधिक आवक है!',
      image: varanasiImg,
      district: 'Varanasi'
    },
    {
      id: 'CEN-003',
      name: 'खन्ना एशिया अनाज मंडी',
      address: 'जी.टी. रोड, खन्ना, जिला लुधियाना, पंजाब',
      distance: '5.8 km दूर',
      crowd: 'भीड़ कम',
      crowdColor: '#166534',
      crowdBg: '#dcfce7',
      distanceBg: '#fee2e2',
      distanceColor: '#dc2626',
      availableSlots: 45,
      queueFarmers: 1,
      waitTime: '~20 min',
      tip: 'नियमित रूप से समय पर खरीद हो रही है!',
      image: khannaImg,
      district: 'Ludhiana'
    },
    {
      id: 'CEN-004',
      name: 'अहरौरा क्रय केंद्र',
      address: 'ब्लॉक रोड, अहरौरा, मिर्ज़ापुर, उ.प्र.',
      distance: '7.6 km दूर',
      crowd: 'भीड़ कम',
      crowdColor: '#166534',
      crowdBg: '#dcfce7',
      distanceBg: '#fee2e2',
      distanceColor: '#dc2626',
      availableSlots: 24,
      queueFarmers: 5,
      waitTime: '~15 min',
      tip: 'यह केंद्र आज सुचारू रूप से संचालित है!',
      image: ahrauraImg,
      district: 'Mirzapur'
    }
  ];

  const filteredCenters = centers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = selectedDistrict === 'All' || c.district === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: '90vh', padding: '24px 0 40px 0' }}>
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
                नजदीकी खरीद केंद्र खोजें
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                दूरी, वर्तमान भीड़ और उपलब्ध स्लॉट सभी जानकारी देखें
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
              <span>सभी केंद्र</span>
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
                placeholder="केंद्र का नाम, गांव, मंडी या जिला खोजें..."
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
                <option value="All">सभी जिले (All Districts)</option>
                <option value="Mirzapur">मिर्ज़ापुर (Mirzapur)</option>
                <option value="Varanasi">वाराणसी (Varanasi)</option>
                <option value="Ludhiana">लुधियाना (Ludhiana)</option>
              </select>
              <ChevronDown size={15} color="#64748b" style={{ position: 'absolute', right: '10px', top: '12px', pointerEvents: 'none' }} />
            </div>

            {/* My Location Button */}
            <button 
              onClick={() => alert("जीपीएस (GPS) से आपका स्थान खोजा जा रहा है...")}
              style={{ 
                background: '#ffffff', 
                border: '1px solid #cbd5e1', 
                borderRadius: '8px', 
                padding: '8px 14px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '0.86rem', 
                fontWeight: 600, 
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <Navigation size={15} color="#059669" />
              <span>मेरा स्थान</span>
            </button>

            {/* Map View Button */}
            <button 
              onClick={() => alert("मानचित्र दृश्य (GIS Mandi Map) लोड हो रहा है...")}
              style={{ 
                background: '#ecfdf5', 
                border: '1px solid #a7f3d0', 
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
              <span>मानचित्र दृश्य</span>
            </button>
          </div>

          {/* Results Summary Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b' }}>
              कुल 24 खरीद केंद्र मिले
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
                <option value="nearest">निकटतम पहले ⌵</option>
                <option value="slots">सर्वाधिक स्लॉट ⌵</option>
                <option value="wait">न्यूनतम प्रतीक्षा ⌵</option>
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
                    <span style={{ 
                      background: center.distanceBg, 
                      color: center.distanceColor, 
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

                    <span style={{ 
                      background: center.crowdBg, 
                      color: center.crowdColor, 
                      fontSize: '0.74rem', 
                      fontWeight: 700, 
                      padding: '2px 8px', 
                      borderRadius: '12px'
                    }}>
                      {center.crowd}
                    </span>

                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                      ID: {center.id}
                    </span>
                  </div>

                  {/* Center Name */}
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    {center.name}
                  </h3>

                  {/* Address */}
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                    {center.address}
                  </p>

                  {/* Yellow Light Alert Strip */}
                  <div style={{ 
                    background: '#fefce8', 
                    border: '1px solid #fef08a', 
                    borderRadius: '6px', 
                    padding: '5px 10px', 
                    fontSize: '0.78rem', 
                    color: '#854d0e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '2px'
                  }}>
                    <span>💡</span>
                    <span>{center.tip}</span>
                  </div>
                </div>

                {/* Right Metrics Box & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingLeft: '16px', borderLeft: '1px solid #f1f5f9' }}>
                  
                  {/* 3 Metrics */}
                  <div style={{ display: 'flex', gap: '20px', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                        <span>👤</span> उपलब्ध स्लॉट
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#017953' }}>
                        {center.availableSlots}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                        <span>👥</span> किसान कतार
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                        {center.queueFarmers}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                        <span>⏱️</span> प्रतीक्षा समय
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ea580c' }}>
                        {center.waitTime}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '130px' }}>
                    <button 
                      onClick={() => navigate('/farmer/book-slot', { state: { prefilledCenter: center.name } })}
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
                      onClick={() => alert(`${center.name} की विस्तृत जानकारी:\n- दैनिक क्षमता: 2,500 क्विंटल\n- धर्मकांटा संख्या: 3\n- ऑपरेटर टीम: सक्रिय\n- सम्पर्क: 1800-180-1551`)}
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
    </div>
  );
}
