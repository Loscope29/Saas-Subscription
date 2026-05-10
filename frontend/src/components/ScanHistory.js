import React, { useState, useEffect } from 'react';
import { subscriptionsAPI } from '../services/api';
import { ClockIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const ScanHistory = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      subscriptionsAPI.getScanHistory()
        .then(res => setHistory(res.data))
        .catch(() => setHistory([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const statusIcon = (s) => {
    if (s === 'completed') return <CheckCircleIcon className="w-5 h-5 text-emerald-500" />;
    if (s === 'failed') return <XCircleIcon className="w-5 h-5 text-red-500" />;
    return <ArrowPathIcon className="w-5 h-5 text-amber-500 animate-spin" />;
  };

  const statusLabel = (s) => {
    if (s === 'completed') return 'Terminé';
    if (s === 'failed') return 'Échoué';
    return 'En cours';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-indigo/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-brand shadow-brand-high w-full max-w-xl max-h-[80vh] overflow-y-auto animate-fade-in-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-outline-variant/20">
          <h2 className="text-lg font-bold text-brand-indigo flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-brand-violet" /> Historique des scans
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-brand-surface transition-colors text-brand-outline text-sm font-semibold">Fermer</button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <ArrowPathIcon className="w-8 h-8 text-brand-violet animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-center text-brand-on-surface-variant py-10">Aucun scan effectué pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {history.map((scan) => (
                <div key={scan.id} className="flex items-center gap-4 p-4 rounded-brand-sm bg-brand-surface border border-brand-outline-variant/20">
                  {statusIcon(scan.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-on-surface">
                      {new Date(scan.scan_start).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-brand-on-surface-variant mt-0.5">
                      {scan.emails_scanned} emails scannés • {scan.subscriptions_found} abonnements trouvés
                    </p>
                    {scan.error_message && <p className="text-xs text-red-500 mt-1 truncate">{scan.error_message}</p>}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${scan.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : scan.status === 'failed' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                    {statusLabel(scan.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanHistory;
