import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Users, 
  Warehouse, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Building2 
} from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

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
        लोड हो रहा है... (Loading Admin Analytics...)
      </div>
    );
  }

  const storageOccupied = Number(analytics?.totalStorageOccupiedQuintals || 0);
  const storageCap = Number(analytics?.totalStorageCapacityQuintals || 1);
  const storagePct = Math.round((storageOccupied / (storageCap > 0 ? storageCap : 1)) * 100);

  return (
    <div className="portal-container" style={{ padding: '30px 0 60px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: '6px', fontWeight: 700 }}>
            प्रशासक नियंत्रण कक्ष (District Administrative Console)
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#064e3b', marginTop: '4px' }}>
            📊 राष्ट्रीय कृषि खरीद एवं भंडारण विश्लेषण
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.92rem' }}>
            जिले के सभी खरीद केंद्रों, धर्मकांटों, भंडारण गोदामों एवं किसानों की वास्तविक समय स्थिति
          </p>
        </div>

        <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', color: '#047857', padding: '6px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
          लाइव एनालिटिक्स सक्रिय (Live)
        </div>
      </div>

      {/* 8 Metric KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '30px' }}>
        <div className="kisan-card" style={{ borderLeft: '5px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '0.82rem', fontWeight: 600 }}>कुल पंजीकृत किसान</span>
            <Users size={22} color="#059669" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#111827' }}>
            {analytics?.totalFarmers || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>सत्यापित आधार एवं बैंक खाते</span>
        </div>

        <div className="kisan-card" style={{ borderLeft: '5px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '0.82rem', fontWeight: 600 }}>सक्रिय खरीद केंद्र</span>
            <Building2 size={22} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#111827' }}>
            {analytics?.activeCentres || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600 }}>APMC एवं FCI केंद्र</span>
        </div>

        <div className="kisan-card" style={{ borderLeft: '5px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '0.82rem', fontWeight: 600 }}>आज की कुल खरीद</span>
            <TrendingUp size={22} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#111827' }}>
            {analytics?.todayProcurementQuintals || 0} Q
          </div>
          <span style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 600 }}>कम्प्यूटरीकृत तौल सत्यापित</span>
        </div>

        <div className="kisan-card" style={{ borderLeft: '5px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '0.82rem', fontWeight: 600 }}>कुल जारी DBT भुगतान</span>
            <CreditCard size={22} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#047857' }}>
            ₹{Number(analytics?.totalPaymentsDisbursed || 0).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}>सीधे बैंक खातों में प्रेषित</span>
        </div>

        <div className="kisan-card" style={{ borderLeft: '5px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '0.82rem', fontWeight: 600 }}>कुल बुकिंग संख्या</span>
            <Calendar size={22} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#111827' }}>
            {analytics?.todayBookings || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600 }}>डायनामिक स्लॉट बुक</span>
        </div>

        <div className="kisan-card" style={{ borderLeft: '5px solid #06b6d4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '0.82rem', fontWeight: 600 }}>लाइव कतार में प्रतीक्षारत</span>
            <Activity size={22} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#111827' }}>
            {analytics?.waitingInQueue || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#0891b2', fontWeight: 600 }}>गेट सत्यापित किसान</span>
        </div>

        <div className="kisan-card" style={{ borderLeft: '5px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '0.82rem', fontWeight: 600 }}>No-Show स्लॉट रिलीज</span>
            <AlertTriangle size={22} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#dc2626' }}>
            {analytics?.totalNoShows || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>स्वचालित गैप-फिलिंग द्वारा पुनः आवंटित</span>
        </div>

        <div className="kisan-card" style={{ borderLeft: '5px solid #14b8a6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '0.82rem', fontWeight: 600 }}>संपन्न खरीद (Completed)</span>
            <CheckCircle size={22} color="#14b8a6" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0d9488' }}>
            {analytics?.completedProcurements || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: 600 }}>जे-फॉर्म जारी एवं सुरक्षित</span>
        </div>
      </div>

      {/* Storage Utilization Card */}
      <div className="kisan-card" style={{ marginBottom: '30px', background: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Warehouse size={22} color="#059669" /> जिला भंडारण गोदाम उपयोगिता (Storage Godown Utilization)
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>
              कुल क्षमता: {Number(analytics?.totalStorageCapacityQuintals).toLocaleString('en-IN')} क्विंटल • 
              वर्तमान भंडारित: {Number(analytics?.totalStorageOccupiedQuintals).toLocaleString('en-IN')} क्विंटल
            </p>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669' }}>
            {storagePct}% भरा हुआ
          </div>
        </div>

        <div style={{ width: '100%', height: '14px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(100, Math.max(2, storagePct))}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '10px' }}></div>
        </div>
      </div>

      {/* Centre Performance Table */}
      <div className="kisan-card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
          🏢 केंद्रवार खरीद एवं काउंटर निष्पादन (Centre-wise Performance)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', color: '#334155' }}>
                <th style={{ padding: '12px 16px' }}>केंद्र का नाम</th>
                <th style={{ padding: '12px 16px' }}>जिला</th>
                <th style={{ padding: '12px 16px' }}>दैनिक क्षमता</th>
                <th style={{ padding: '12px 16px' }}>आज की खरीद</th>
                <th style={{ padding: '12px 16px' }}>सक्रिय काउंटर</th>
                <th style={{ padding: '12px 16px' }}>बुकिंग्स</th>
                <th style={{ padding: '12px 16px' }}>उपयोगिता</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.centrePerformances?.map((cp) => {
                const cap = Number(cp.capacityPerDay || 1);
                const cur = Number(cp.currentDailyQuantity || 0);
                const util = Math.round((cur / cap) * 100);
                return (
                  <tr key={cp.centerId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#064e3b' }}>{cp.centerName}</td>
                    <td style={{ padding: '12px 16px' }}>{cp.district}</td>
                    <td style={{ padding: '12px 16px' }}>{cp.capacityPerDay} Q</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>{cp.currentDailyQuantity} Q</td>
                    <td style={{ padding: '12px 16px' }}>{cp.activeCounters} कांटा</td>
                    <td style={{ padding: '12px 16px' }}>{cp.bookingsCount}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
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
