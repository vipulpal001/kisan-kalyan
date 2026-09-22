import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useWebSocketSubscription, useWebSocketStatus } from '../hooks/useWebSocket';
import { useLanguage } from '../context/LanguageContext';
import { 
  Users, 
  Warehouse, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Building2,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const { lang, t } = useLanguage();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const wsStatus = useWebSocketStatus();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Listen to WebSocket broadcasts for real-time analytics updates
  useWebSocketSubscription('/topic/admin/analytics', (newAnalytics) => {
    if (newAnalytics) {
      setAnalytics(newAnalytics);
    }
  });

  useWebSocketSubscription('/topic/queue', () => {
    fetchAnalytics();
  });

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="portal-container" style={{ padding: '60px 0', textAlign: 'center' }}>
        {lang === 'hi' ? 'लोड हो रहा है... (प्रशासक विश्लेषण)' : 'Loading Admin Analytics...'}
      </div>
    );
  }

  const storageOccupied = Number(analytics?.totalStorageOccupiedQuintals || 0);
  const storageCap = Number(analytics?.totalStorageCapacityQuintals || 1);
  const storagePct = Math.round((storageOccupied / (storageCap > 0 ? storageCap : 1)) * 100);

  return (
    <div className="portal-container" style={{ padding: '24px 0 60px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: '6px', fontWeight: 700 }}>
            {lang === 'hi' ? 'प्रशासक नियंत्रण कक्ष (District Administrative Console)' : 'District Administrative Console'}
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#064e3b', marginTop: '4px' }}>
            📊 {lang === 'hi' ? 'राष्ट्रीय कृषि खरीद एवं भंडारण विश्लेषण' : 'National Agricultural Procurement & Storage Analytics'}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            {lang === 'hi' 
              ? 'जिले के सभी उपार्जन केंद्रों, धर्मकांटों, भंडारण गोदामों एवं किसानों की वास्तविक समय स्थिति'
              : 'Real-time status of all procurement centres, weighbridges, storage godowns and farmers in the district'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            background: wsStatus === 'CONNECTED' ? '#ecfdf5' : '#fefce8', 
            border: `1.5px solid ${wsStatus === 'CONNECTED' ? '#a7f3d0' : '#fef08a'}`, 
            color: wsStatus === 'CONNECTED' ? '#047857' : '#854d0e', 
            padding: '6px 14px', 
            borderRadius: '20px', 
            fontWeight: 700, 
            fontSize: '0.82rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              background: wsStatus === 'CONNECTED' ? '#10b981' : '#f59e0b', 
              borderRadius: '50%', 
              display: 'inline-block' 
            }}></span>
            {wsStatus === 'CONNECTED' 
              ? (lang === 'hi' ? 'लाइव सक्रिय (Live)' : 'Live Connected') 
              : (lang === 'hi' ? 'पुनः कनेक्ट हो रहा है...' : 'Reconnecting...')}
          </div>

          <button 
            onClick={fetchAnalytics}
            aria-label={lang === 'hi' ? 'डेटा रीफ्रेश करें' : 'Refresh analytics'}
            style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '7px 12px', fontSize: '0.82rem', fontWeight: 700, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* 8 Metric KPI Cards Grid - Responsive auto-fit */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="kisan-card" style={{ borderLeft: '5px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '0.82rem', fontWeight: 600 }}>
              {lang === 'hi' ? 'कुल पंजीकृत किसान' : 'Registered Farmers'}
            </span>
            <Users size={22} color="#059669" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#111827' }}>
            {analytics?.totalFarmers || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
            {lang === 'hi' ? 'सत्यापित आधार एवं बैंक खाते' : 'Verified Aadhaar & Bank Accounts'}
          </span>
        </div>

        <div className="kisan-card" style={{ borderLeft: '5px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '0.82rem', fontWeight: 600 }}>
              {lang === 'hi' ? 'सक्रिय उपार्जन केंद्र' : 'Active Procurement Centres'}
            </span>
            <Building2 size={22} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#111827' }}>
            {analytics?.activeCentres || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600 }}>
            {lang === 'hi' ? 'APMC एवं FCI केंद्र' : 'APMC & FCI Centres'}
          </span>
        </div>

        <div className="kisan-card" style={{ borderLeft: '5px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '0.82rem', fontWeight: 600 }}>
              {lang === 'hi' ? 'आज की कुल खरीद' : 'Total Procured Today'}
            </span>
            <TrendingUp size={22} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#111827' }}>
            {analytics?.todayProcurementQuintals || 0} Q
          </div>
          <span style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 600 }}>
            {lang === 'hi' ? 'कम्प्यूटरीकृत तौल सत्यापित' : 'Weighbridge Verified'}
          </span>
        </div>

        <div className="kisan-card" style={{ borderLeft: '5px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '0.82rem', fontWeight: 600 }}>
              {lang === 'hi' ? 'कुल जारी DBT भुगतान' : 'Total DBT Payments'}
            </span>
            <CreditCard size={22} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#047857' }}>
            ₹{Number(analytics?.totalPaymentsDisbursed || 0).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}>
            {lang === 'hi' ? 'सीधे बैंक खातों में प्रेषित' : 'Direct to Bank Accounts'}
          </span>
        </div>

        <div className="kisan-card" style={{ borderLeft: '5px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '0.82rem', fontWeight: 600 }}>
              {lang === 'hi' ? 'कुल स्लॉट आरक्षण' : 'Total Slot Bookings'}
            </span>
            <Calendar size={22} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#111827' }}>
            {analytics?.todayBookings || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600 }}>
            {lang === 'hi' ? 'डायनामिक स्लॉट बुक' : 'Dynamic Slots Booked'}
          </span>
        </div>

        <div className="kisan-card" style={{ borderLeft: '5px solid #06b6d4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '0.82rem', fontWeight: 600 }}>
              {lang === 'hi' ? 'लाइव कतार में प्रतीक्षारत' : 'Waiting in Live Queue'}
            </span>
            <Activity size={22} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#111827' }}>
            {analytics?.waitingInQueue || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#0891b2', fontWeight: 600 }}>
            {lang === 'hi' ? 'गेट सत्यापित किसान' : 'Gate-Verified Farmers'}
          </span>
        </div>

        <div className="kisan-card" style={{ borderLeft: '5px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '0.82rem', fontWeight: 600 }}>
              {lang === 'hi' ? 'No-Show स्लॉट रिलीज' : 'No-Show Slots Released'}
            </span>
            <AlertTriangle size={22} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#dc2626' }}>
            {analytics?.totalNoShows || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>
            {lang === 'hi' ? 'स्वचालित गैप-फिलिंग द्वारा पुनः आवंटित' : 'Re-allocated via auto gap-filling'}
          </span>
        </div>

        <div className="kisan-card" style={{ borderLeft: '5px solid #14b8a6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '0.82rem', fontWeight: 600 }}>
              {lang === 'hi' ? 'संपन्न खरीद (Completed)' : 'Completed Procurements'}
            </span>
            <CheckCircle size={22} color="#14b8a6" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0d9488' }}>
            {analytics?.completedProcurements || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: 600 }}>
            {lang === 'hi' ? 'जे-फॉर्म जारी एवं सुरक्षित' : 'J-Forms Issued & Secured'}
          </span>
        </div>
      </div>

      {/* Storage Utilization Card */}
      <div className="kisan-card" style={{ marginBottom: '24px', background: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Warehouse size={20} color="#059669" /> 
              {lang === 'hi' ? 'जिला भंडारण गोदाम उपयोगिता' : 'District Storage Godown Utilization'}
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '2px' }}>
              {lang === 'hi' ? 'कुल क्षमता' : 'Total Capacity'}: {Number(analytics?.totalStorageCapacityQuintals).toLocaleString('en-IN')} Q • 
              {' '}{lang === 'hi' ? 'वर्तमान भंडारित' : 'Currently Stored'}: {Number(analytics?.totalStorageOccupiedQuintals).toLocaleString('en-IN')} Q
            </p>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#059669' }}>
            {storagePct}% {lang === 'hi' ? 'उपयोगित' : 'Occupied'}
          </div>
        </div>

        <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(100, Math.max(2, storagePct))}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '10px' }}></div>
        </div>
      </div>

      {/* Centre Performance Table */}
      <div className="kisan-card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
          🏢 {lang === 'hi' ? 'उपार्जन केंद्रवार खरीद एवं काउंटर निष्पादन' : 'Centre-wise Procurement & Counter Performance'}
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', color: '#334155' }}>
                <th style={{ padding: '10px 14px' }}>{lang === 'hi' ? 'उपार्जन केंद्र का नाम' : 'Centre Name'}</th>
                <th style={{ padding: '10px 14px' }}>{lang === 'hi' ? 'जिला' : 'District'}</th>
                <th style={{ padding: '10px 14px' }}>{lang === 'hi' ? 'दैनिक क्षमता' : 'Daily Capacity'}</th>
                <th style={{ padding: '10px 14px' }}>{lang === 'hi' ? 'आज की खरीद' : 'Procured Today'}</th>
                <th style={{ padding: '10px 14px' }}>{lang === 'hi' ? 'सक्रिय काउंटर' : 'Active Counters'}</th>
                <th style={{ padding: '10px 14px' }}>{lang === 'hi' ? 'आरक्षित स्लॉट' : 'Bookings'}</th>
                <th style={{ padding: '10px 14px' }}>{lang === 'hi' ? 'उपयोगिता' : 'Utilization'}</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.centrePerformances?.map((cp) => {
                const cap = Number(cp.capacityPerDay || 1);
                const cur = Number(cp.currentDailyQuantity || 0);
                const util = Math.round((cur / cap) * 100);
                return (
                  <tr key={cp.centerId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#064e3b' }}>{cp.centerName}</td>
                    <td style={{ padding: '10px 14px' }}>{cp.district}</td>
                    <td style={{ padding: '10px 14px' }}>{cp.capacityPerDay} Q</td>
                    <td style={{ padding: '10px 14px', fontWeight: 700 }}>{cp.currentDailyQuantity} Q</td>
                    <td style={{ padding: '10px 14px' }}>{cp.activeCounters} {lang === 'hi' ? 'कांटा' : 'Counters'}</td>
                    <td style={{ padding: '10px 14px' }}>{cp.bookingsCount}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ 
                        padding: '3px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.78rem', 
                        fontWeight: 700,
                        background: util > 80 ? '#fee2e2' : '#ecfdf5',
                        color: util > 80 ? '#b91c1c' : '#047857'
                      }}>
                        {util}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
