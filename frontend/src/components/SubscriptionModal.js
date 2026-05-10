import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CATEGORY_OPTIONS = [
  { value: 'saas', label: 'SaaS / Logiciel' },
  { value: 'streaming', label: 'Streaming' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'hosting', label: 'Hébergement' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'design', label: 'Design' },
  { value: 'productivity', label: 'Productivité' },
  { value: 'other', label: 'Autre' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Actif' },
  { value: 'cancelled', label: 'Annulé' },
  { value: 'to_review', label: 'À vérifier' },
];

const SubscriptionModal = ({ isOpen, onClose, onSubmit, subscription = null }) => {
  const isEdit = !!subscription;
  const [formData, setFormData] = useState({
    service_name: '', email_sender: '', monthly_cost: '', currency: 'EUR',
    billing_frequency: 'monthly', category: 'other', status: 'active',
    first_detected_date: new Date().toISOString().split('T')[0],
    notes: '', cancellation_url: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subscription) {
      setFormData({
        service_name: subscription.service_name || '',
        email_sender: subscription.email_sender || '',
        monthly_cost: subscription.monthly_cost || '',
        currency: subscription.currency || 'EUR',
        billing_frequency: subscription.billing_frequency || 'monthly',
        category: subscription.category || 'other',
        status: subscription.status || 'active',
        first_detected_date: subscription.first_detected_date || new Date().toISOString().split('T')[0],
        notes: subscription.notes || '',
        cancellation_url: subscription.cancellation_url || '',
      });
    } else {
      setFormData({
        service_name: '', email_sender: '', monthly_cost: '', currency: 'EUR',
        billing_frequency: 'monthly', category: 'other', status: 'active',
        first_detected_date: new Date().toISOString().split('T')[0],
        notes: '', cancellation_url: '',
      });
    }
  }, [subscription, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData, subscription?.id);
      onClose();
    } catch (err) {
      alert('Erreur: ' + (err.response?.data?.detail || err.message));
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-4 py-2.5 bg-brand-surface border border-brand-outline-variant rounded-brand-sm text-brand-on-surface placeholder-brand-outline focus:outline-none focus:ring-2 focus:ring-brand-violet focus:border-brand-violet transition-all text-sm";
  const labelClass = "block text-sm font-semibold text-brand-on-surface mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-indigo/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-brand shadow-brand-high w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-outline-variant/20">
          <h2 className="text-lg font-bold text-brand-indigo">{isEdit ? 'Modifier l\'abonnement' : 'Nouvel abonnement'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-brand-surface transition-colors"><XMarkIcon className="w-5 h-5 text-brand-outline" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Nom du service *</label>
              <input name="service_name" required value={formData.service_name} onChange={handleChange} className={inputClass} placeholder="Netflix, Spotify..." />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Email expéditeur</label>
              <input name="email_sender" type="email" value={formData.email_sender} onChange={handleChange} className={inputClass} placeholder="billing@service.com" />
            </div>
            <div>
              <label className={labelClass}>Coût mensuel *</label>
              <input name="monthly_cost" type="number" step="0.01" required value={formData.monthly_cost} onChange={handleChange} className={inputClass} placeholder="9.99" />
            </div>
            <div>
              <label className={labelClass}>Devise</label>
              <select name="currency" value={formData.currency} onChange={handleChange} className={inputClass}>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Catégorie</label>
              <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Statut</label>
              <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Fréquence</label>
              <select name="billing_frequency" value={formData.billing_frequency} onChange={handleChange} className={inputClass}>
                <option value="monthly">Mensuel</option>
                <option value="yearly">Annuel</option>
                <option value="weekly">Hebdomadaire</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Détecté le</label>
              <input name="first_detected_date" type="date" value={formData.first_detected_date} onChange={handleChange} className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Notes</label>
              <textarea name="notes" rows={2} value={formData.notes} onChange={handleChange} className={inputClass} placeholder="Notes personnelles..." />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>URL de résiliation</label>
              <input name="cancellation_url" type="url" value={formData.cancellation_url} onChange={handleChange} className={inputClass} placeholder="https://..." />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-full border-2 border-brand-outline-variant text-brand-on-surface-variant font-semibold text-sm hover:bg-brand-surface transition-colors">Annuler</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-full bg-brand-violet text-white font-semibold text-sm shadow-lg shadow-brand-violet/25 hover:bg-brand-violet-container transition-all disabled:opacity-50">
              {loading ? 'En cours...' : isEdit ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionModal;
