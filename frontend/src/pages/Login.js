import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { ChartPieIcon } from '@heroicons/react/24/solid';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-surface font-sans flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-6 lg:px-8 py-4">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-violet to-brand-indigo flex items-center justify-center">
              <ChartPieIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-brand-indigo">Sub<span className="text-brand-violet">Track</span></span>
          </Link>
          <Link to="/register" className="text-sm font-semibold text-brand-on-surface-variant hover:text-brand-violet transition-colors">
            Créer un compte →
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 relative overflow-hidden">
        {/* Subtle background orbs */}
        <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-brand-violet/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-brand-violet-container/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-violet/10 flex items-center justify-center mb-5">
              <LockClosedIcon className="w-7 h-7 text-brand-violet" />
            </div>
            <h1 className="text-3xl font-bold text-brand-indigo tracking-tight">Bon retour parmi nous</h1>
            <p className="mt-2 text-brand-on-surface-variant">Connectez-vous pour gérer vos abonnements</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-brand p-8 shadow-brand-low border border-brand-outline-variant/20">
            {error && (
              <div className="mb-6 flex items-start gap-3 p-4 rounded-brand-sm bg-red-50 border border-red-200">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-600 text-xs font-bold">!</span>
                </div>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-brand-on-surface mb-1.5">Adresse email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-brand-outline" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-brand-surface border border-brand-outline-variant rounded-brand-sm text-brand-on-surface placeholder-brand-outline focus:outline-none focus:ring-2 focus:ring-brand-violet focus:border-brand-violet transition-all"
                    placeholder="vous@exemple.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-brand-on-surface mb-1.5">Mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-brand-outline" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-brand-surface border border-brand-outline-variant rounded-brand-sm text-brand-on-surface placeholder-brand-outline focus:outline-none focus:ring-2 focus:ring-brand-violet focus:border-brand-violet transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-brand-violet text-white font-semibold shadow-lg shadow-brand-violet/25 hover:bg-brand-violet-container hover:shadow-xl hover:shadow-brand-violet/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>
          </div>

          {/* Footer link */}
          <p className="mt-8 text-center text-sm text-brand-on-surface-variant">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-bold text-brand-violet hover:text-brand-violet-container transition-colors">
              Créer un compte gratuitement
            </Link>
          </p>

          <p className="mt-4 text-center">
            <Link to="/" className="text-xs text-brand-outline hover:text-brand-on-surface-variant transition-colors">
              ← Retour à l'accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
