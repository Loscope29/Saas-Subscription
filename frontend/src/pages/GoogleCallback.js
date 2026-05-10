import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const GoogleCallback = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');

      if (!code) {
        setError('Code d\'autorisation manquant. Veuillez réessayer.');
        setTimeout(() => navigate('/dashboard'), 3000);
        return;
      }

      try {
        await authAPI.googleCallback(code);
        await refreshUser();
        navigate('/dashboard');
      } catch (err) {
        console.error('Erreur de callback Google:', err);
        setError('Échec de la connexion à Gmail. ' + (err.response?.data?.error || ''));
        setTimeout(() => navigate('/dashboard'), 3000);
      }
    };

    processCallback();
  }, [location, navigate, refreshUser]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Erreur d'authentification</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <p className="text-sm text-slate-400">Redirection vers le tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin mb-6" />
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Connexion à Gmail en cours...</h2>
      <p className="text-slate-500">Veuillez patienter pendant que nous sécurisons l'accès.</p>
    </div>
  );
};

export default GoogleCallback;
