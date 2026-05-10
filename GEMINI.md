# Project: Subscription Tracker MVP

Un assistant intelligent pour suivre, gérer et optimiser vos abonnements en ligne en analysant automatiquement vos e-mails Gmail.

## 🛠 Tech Stack
- **Backend**: Django 4.2+, Django REST Framework
- **Frontend**: React 18, Tailwind CSS, Heroicons
- **Auth**: JWT (SimpleJWT) + Google OAuth 2.0 (Gmail API)
- **Database**: SQLite (Development) / PostgreSQL Ready

## 🚀 Installation & Lancement

### Backend
1. `cd backend`
2. `python -m venv venv`
3. `.\venv\Scripts\activate` (Windows)
4. `pip install -r requirements.txt`
5. `python manage.py migrate`
6. `python manage.py runserver`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start` (Lancement sur http://localhost:3000)

## 🔑 Configuration (.env)
Le fichier `backend/.env` doit contenir :
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/google/callback`

## ✨ Fonctionnalités Clés
- **Tableau de Bord Premium** : Design moderne avec cartes de statistiques et graphiques d'abonnements.
- **Scan Gmail** : Connexion OAuth sécurisée pour détecter automatiquement les factures d'abonnements.
- **Gestion des États** : Marquer les abonnements comme actifs ou annulés.
- **Interface Glassmorphism** : UI/UX optimisée avec des effets de transparence et des micro-animations.

## 📝 Notes pour Antigravity
- L'authentification Google est configurée pour rediriger vers le Frontend (`/google/callback`) pour gérer proprement les tokens JWT.
- Le modèle utilisateur est personnalisé (`apps.users.User`) et utilise l'email comme identifiant principal.
- Les icônes utilisées sont principalement de `@heroicons/react`.

---
*Dernière mise à jour : Mai 2026*
