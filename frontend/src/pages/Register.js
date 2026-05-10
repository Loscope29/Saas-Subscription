import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EnvelopeIcon, LockClosedIcon, UserIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { ChartPieIcon } from '@heroicons/react/24/solid';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '', username: '', password: '', password2: '', first_name: '', last_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.password2) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    const result = await register(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      const errorMsg = typeof result.error === 'object'
        ? Object.values(result.error).flat().join(' ')
        : result.error;
      setError(errorMsg);
    }
    setLoading(false);
  };

  const inputClass = "block w-full pl-11 pr-4 py-3 bg-brand-surface border border-brand-outline-variant rounded-brand-sm text-brand-on-surface placeholder-brand-outline focus:outline-none focus:ring-2 focus:ring-brand-violet focus:border-brand-violet transition-all";

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
          <Link to="/login" className="text-sm font-semibold text-brand-on-surface-variant hover:text-brand-violet transition-colors">
            Se connecter →
          </Link>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 relative overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-brand-violet/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-brand-violet-container/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-lg relative z-10 animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-violet/10 flex items-center justify-center mb-5">
              <UserIcon className="w-7 h-7 text-brand-violet" />
            </div>
            <h1 className="text-3xl font-bold text-brand-indigo tracking-tight">Créer votre compte</h1>
            <p className="mt-2 text-brand-on-surface-variant">Rejoignez-nous et simplifiez vos finances</p>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-brand-on-surface mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><EnvelopeIcon className="h-5 w-5 text-brand-outline" /></div>
                  <input name="email" type="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="vous@exemple.com" />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-brand-on-surface mb-1.5">Nom d'utilisateur</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><UserIcon className="h-5 w-5 text-brand-outline" /></div>
                  <input name="username" type="text" required value={formData.username} onChange={handleChange} className={inputClass} placeholder="johndoe" />
                </div>
              </div>

              {/* First / Last name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-brand-on-surface mb-1.5">Prénom</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><IdentificationIcon className="h-5 w-5 text-brand-outline" /></div>
                    <input name="first_name" type="text" value={formData.first_name} onChange={handleChange} className={inputClass} placeholder="John" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-on-surface mb-1.5">Nom</label>
                  <input name="last_name" type="text" value={formData.last_name} onChange={handleChange} className="block w-full px-4 py-3 bg-brand-surface border border-brand-outline-variant rounded-brand-sm text-brand-on-surface placeholder-brand-outline focus:outline-none focus:ring-2 focus:ring-brand-violet focus:border-brand-violet transition-all" placeholder="Doe" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-brand-on-surface mb-1.5">Mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><LockClosedIcon className="h-5 w-5 text-brand-outline" /></div>
                  <input name="password" type="password" required value={formData.password} onChange={handleChange} className={inputClass} placeholder="••••••••" />
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-semibold text-brand-on-surface mb-1.5">Confirmer le mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><LockClosedIcon className="h-5 w-5 text-brand-outline" /></div>
                  <input name="password2" type="password" required value={formData.password2} onChange={handleChange} className={inputClass} placeholder="••••••••" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full mt-2 py-3.5 rounded-full bg-brand-violet text-white font-semibold shadow-lg shadow-brand-violet/25 hover:bg-brand-violet-container hover:shadow-xl hover:shadow-brand-violet/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    Inscription en cours...
                  </>
                ) : "S'inscrire"}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-brand-on-surface-variant">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-bold text-brand-violet hover:text-brand-violet-container transition-colors">Se connecter</Link>
          </p>
          <p className="mt-4 text-center">
            <Link to="/" className="text-xs text-brand-outline hover:text-brand-on-surface-variant transition-colors">← Retour à l'accueil</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
