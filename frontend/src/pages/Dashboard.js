import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscriptionsAPI, authAPI } from '../services/api';
import SubscriptionModal from '../components/SubscriptionModal';
import ScanHistory from '../components/ScanHistory';
import ExpenseChart from '../components/ExpenseChart';
import CategoryPieChart from '../components/CategoryPieChart';

const Dashboard = () => {
  const { user, logout, refreshUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [gmailStatus, setGmailStatus] = useState({ is_connected: false });
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, subsRes, gmailRes] = await Promise.all([
        subscriptionsAPI.getStats(),
        subscriptionsAPI.getAll(),
        authAPI.getGmailStatus(),
      ]);

      setStats(statsRes.data);
      setSubscriptions(subsRes.data.results || subsRes.data);
      setGmailStatus(gmailRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleConnectGmail = async () => {
    try {
      const response = await authAPI.getGoogleAuthUrl();
      window.location.href = response.data.authorization_url;
    } catch (error) {
      alert('Erreur lors de la connexion Gmail');
    }
  };

  const handleScan = async () => {
    setScanning(true);
    try {
      await subscriptionsAPI.scanEmails();
      await loadData();
      await refreshUser();
      alert('Scan terminé avec succès !');
    } catch (error) {
      alert('Erreur lors du scan : ' + (error.response?.data?.error || 'Une erreur est survenue'));
    }
    setScanning(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet abonnement ?')) {
      try {
        await subscriptionsAPI.delete(id);
        await loadData();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await subscriptionsAPI.export('json');
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response.data, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "subscriptions_export.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      alert('Erreur lors de l\'export');
    }
  };

  const handleSubSubmit = async (formData, id) => {
    if (id) {
      await subscriptionsAPI.update(id, formData);
    } else {
      await subscriptionsAPI.create(formData);
    }
    await loadData();
  };

  const openEditModal = (sub) => {
    setSelectedSub(sub);
    setIsSubModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedSub(null);
    setIsSubModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-xl font-bold text-primary">Chargement de votre univers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Sidebar (Desktop) */}
      <aside className="fixed left-0 top-0 h-screen w-64 hidden md:flex flex-col p-4 bg-surface border-r border-outline-variant z-50">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary">subscriptions</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">SubTrack</h1>
            <p className="text-xs text-on-surface-variant">Pro Plan</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <NavItem icon="dashboard" label="Dashboard" active />
          <NavItem icon="subscriptions" label="Subscriptions" />
          <NavItem icon="analytics" label="Analytics" />
          <NavItem icon="credit_card" label="Cards" />
          <NavItem icon="category" label="Categories" />
          <NavItem icon="assessment" label="Reports" />
        </nav>
        <div className="mt-auto pt-4 space-y-1 border-t border-outline-variant">
          <NavItem icon="settings" label="Settings" />
          <NavItem icon="help" label="Help" />
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error/5 rounded-xl transition-colors mt-4">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full h-16 sticky top-0 z-40 bg-surface/80 backdrop-blur-md flex justify-between items-center px-6 border-b border-outline-variant">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-secondary text-sm" placeholder="Rechercher un abonnement..." type="text"/>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-surface-variant/50 rounded-full transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-outline-variant mx-2"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs uppercase">
                {user?.first_name?.charAt(0) || user?.username?.charAt(0)}
              </div>
              <span className="text-sm font-semibold hidden lg:block">{user?.first_name || user?.username}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 pb-24 md:pb-8 animate-fade-in-up">
          {/* Welcome Section */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-primary">Bonjour, {user?.first_name || user?.username} !</h2>
              <p className="text-lg text-on-surface-variant">Gérez tous vos abonnements en un seul endroit.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleExport} className="px-6 py-2 border border-secondary text-secondary rounded-xl font-bold hover:bg-secondary/5 transition-all">
                Exporter
              </button>
              <button onClick={openCreateModal} className="px-6 py-2 bg-primary text-on-primary rounded-xl font-bold flex items-center gap-2 hover:bg-primary-container transition-all shadow-lg">
                <span className="material-symbols-outlined text-sm">add</span>
                Abonnement
              </button>
            </div>
          </section>

          {/* Scan Banner */}
          {gmailStatus.is_connected ? (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined">check</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">Gmail Connecté</h3>
                    <span className="px-2.5 py-0.5 bg-green-200 text-green-800 text-[10px] font-bold rounded-full uppercase">Actif</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Dernier scan : {user?.last_scan_date ? new Date(user.last_scan_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : 'Aucun scan'}
                  </p>
                </div>
              </div>
              <button onClick={handleScan} disabled={scanning} className="px-5 py-2.5 bg-white border border-green-200 text-green-700 rounded-xl font-bold flex items-center gap-2 hover:bg-green-50 transition-colors shadow-sm disabled:opacity-50">
                <span className="material-symbols-outlined text-sm animate-spin-slow">sync</span>
                {scanning ? 'Scan en cours...' : 'Lancer un scan'}
              </button>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-900">Synchronisez votre Gmail</h3>
                  <p className="text-sm text-amber-800">Détectez automatiquement vos abonnements en analysant vos factures.</p>
                </div>
              </div>
              <button onClick={handleConnectGmail} className="px-6 py-2.5 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-md">
                Connecter Gmail
              </button>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon="pie_chart" label="Total Abonnements" value={stats?.total_subscriptions || 0} color="secondary" />
            <StatCard icon="check_circle" label="Abonnements Actifs" value={stats?.active_subscriptions || 0} color="green" />
            <StatCard icon="calendar_month" label="Dépenses Mensuelles" value={`${stats?.total_monthly_cost || 0}€`} color="primary" trend="+2.5%" />
            <StatCard icon="savings" label="Économies Annuelles" value={`${stats?.total_yearly_cost ? (parseFloat(stats.total_yearly_cost) * 0.1).toFixed(2) : 0}€`} color="orange" trend="+8.1%" />
          </div>

          {/* Main Grid: Chart & Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Chart Component */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-brand-low hover:shadow-brand-high transition-all h-[400px] flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-xl font-bold text-primary">Aperçu des dépenses</h4>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-secondary"></span>
                    <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Mensuel</span>
                  </div>
                </div>
                <div className="flex-1 w-full relative">
                  <ExpenseChart currentMonthlyCost={stats?.total_monthly_cost} />
                </div>
              </div>

              {/* Transactions / Subscriptions Table */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-brand-low overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-primary">Abonnements récents</h4>
                  <button onClick={() => setIsHistoryModalOpen(true)} className="text-secondary font-bold text-xs uppercase hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">history</span> Historique
                  </button>
                </div>
                <div className="space-y-4">
                  {subscriptions.slice(0, 5).map((sub) => (
                    <div key={sub.id} className="group flex items-center justify-between p-4 hover:bg-surface-container-low rounded-xl transition-all border border-transparent hover:border-outline-variant/20">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-lg ${getCategoryStyle(sub.category)}`}>
                          {sub.service_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-primary">{sub.service_name}</p>
                          <p className="text-xs text-on-surface-variant uppercase font-bold tracking-tighter">
                            {new Date(sub.first_detected_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} • {sub.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="font-bold text-on-surface">-{sub.monthly_cost}€</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(sub)} className="p-2 text-on-surface-variant hover:text-secondary"><span className="material-symbols-outlined text-xl">edit</span></button>
                          <button onClick={() => handleDelete(sub.id)} className="p-2 text-on-surface-variant hover:text-error"><span className="material-symbols-outlined text-xl">delete</span></button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {subscriptions.length === 0 && (
                    <p className="text-center py-10 text-on-surface-variant italic">Aucun abonnement détecté.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Widgets */}
            <div className="space-y-8">
              {/* Virtual Card Widget */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-brand-low">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-primary uppercase text-xs tracking-widest">Ma Carte SubTrack</h4>
                  <button className="p-2 bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-secondary">add</span>
                  </button>
                </div>
                <div className="relative w-full aspect-[1.6/1] rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-secondary to-primary-container p-6 text-on-primary shadow-xl ring-1 ring-white/20">
                  <div className="flex justify-between items-start mb-8">
                    <span className="material-symbols-outlined text-3xl">contactless</span>
                    <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest italic">Premium Card</span>
                  </div>
                  <p className="text-xl font-bold tracking-[0.2em] mb-4">•••• •••• •••• {user?.id ? (1000 + user.id) : '9678'}</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[8px] uppercase opacity-60 font-black">Titulaire</p>
                      <p className="text-sm font-bold uppercase">{user?.first_name || user?.username}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase opacity-60 font-black">Expire</p>
                      <p className="text-sm font-bold">12/27</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span className="text-on-surface-variant">Utilisation Mensuelle</span>
                    <span className="text-primary">{stats?.total_monthly_cost || 0}€ / 1000€</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full transition-all duration-1000" style={{ width: `${Math.min(((stats?.total_monthly_cost || 0) / 1000) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Categories Chart */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-brand-low flex flex-col h-[350px]">
                <h4 className="font-bold text-primary mb-6 uppercase text-xs tracking-widest">Répartition</h4>
                <div className="flex-1 w-full">
                  <CategoryPieChart data={stats?.subscriptions_by_category} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-surface-container-lowest shadow-[0_-4px_20px_rgba(30,27,75,0.06)] border-t border-outline-variant/10">
        <MobileNavItem icon="home" label="Accueil" active />
        <MobileNavItem icon="account_balance_wallet" label="Subs" />
        <MobileNavItem icon="pie_chart" label="Stats" />
        <MobileNavItem icon="settings" label="Réglages" />
      </nav>

      {/* Floating Action Button (Mobile) */}
      <button onClick={openCreateModal} className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-secondary text-on-secondary rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40">
        <span className="material-symbols-outlined">add</span>
      </button>

      {/* Modals */}
      <SubscriptionModal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} onSubmit={handleSubSubmit} subscription={selectedSub} />
      <ScanHistory isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} />
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <a href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${active ? 'bg-secondary-container text-on-secondary-container shadow-md shadow-secondary/10' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'}`}>
    <span className="material-symbols-outlined">{icon}</span>
    <span className="text-sm">{label}</span>
  </a>
);

const MobileNavItem = ({ icon, label, active = false }) => (
  <a href="/dashboard" className={`flex flex-col items-center justify-center p-2 px-4 transition-transform active:scale-95 ${active ? 'bg-primary-container text-on-primary-container rounded-2xl shadow-sm' : 'text-on-surface-variant'}`}>
    <span className="material-symbols-outlined">{icon}</span>
    <span className="text-[10px] font-bold uppercase mt-1">{label}</span>
  </a>
);

const StatCard = ({ icon, label, value, color, trend }) => {
  const colors = {
    secondary: 'bg-secondary-container/20 text-secondary',
    green: 'bg-green-100 text-green-600',
    primary: 'bg-primary-fixed-dim text-primary',
    orange: 'bg-orange-100 text-orange-600',
  };
  return (
    <div className="p-6 bg-surface-container-lowest rounded-2xl shadow-brand-low border border-outline-variant/30 hover:shadow-brand-high transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {trend && (
          <span className="text-[10px] font-black text-on-surface-variant flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-full">
            <span className="material-symbols-outlined text-xs text-green-500">trending_up</span> {trend}
          </span>
        )}
      </div>
      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{label}</p>
      <h3 className="text-3xl font-black text-primary mt-1 tracking-tight">{value}</h3>
    </div>
  );
};

const getCategoryStyle = (cat) => {
  const c = cat.toLowerCase();
  if (c.includes('streaming')) return 'bg-red-100 text-red-600';
  if (c.includes('music')) return 'bg-green-100 text-green-600';
  if (c.includes('design')) return 'bg-purple-100 text-purple-600';
  if (c.includes('saas') || c.includes('software')) return 'bg-blue-100 text-blue-600';
  return 'bg-surface-container text-primary';
};

export default Dashboard;
