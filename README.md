# Subscription Tracker MVP

Un outil SaaS pour suivre et gérer vos abonnements en ligne. Scannez automatiquement vos emails Gmail pour découvrir tous vos abonnements et calculer combien vous dépensez chaque mois.

## 🎯 Fonctionnalités

- ✅ **Authentification JWT** - Inscription et connexion sécurisées
- ✅ **Connexion Gmail OAuth** - Accès sécurisé à votre boîte mail
- ✅ **Scan automatique** - Détection des emails de facturation et abonnements
- ✅ **Dashboard intuitif** - Visualisez tous vos abonnements en un coup d'œil
- ✅ **Statistiques financières** - Coût mensuel et annuel total
- ✅ **Gestion des abonnements** - Marquez comme actif, annulé ou à vérifier
- ✅ **Catégorisation** - SaaS, Streaming, Design, Marketing, etc.

## 🚀 Technologies

### Backend
- Django 4.2 + Django REST Framework
- PostgreSQL / SQLite
- JWT Authentication
- Google OAuth2
- Gmail API

### Frontend
- React 18
- React Router v6
- Axios
- Tailwind CSS
- Context API

## 📋 Prérequis

- Python 3.9+
- Node.js 16+
- npm ou yarn
- Compte Google Cloud (pour OAuth Gmail)

## 🛠️ Installation

### 1. Cloner le repository
```bash
git clone <votre-repo>
cd subscription-tracker-mvp
```

### 2. Configuration Backend

```bash
cd backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Copier le fichier .env
cp .env.example .env

# Éditer .env et ajouter vos credentials Google OAuth
# GOOGLE_OAUTH_CLIENT_ID=votre-client-id
# GOOGLE_OAUTH_CLIENT_SECRET=votre-client-secret

# Créer la base de données
python manage.py makemigrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Lancer le serveur
python manage.py runserver
```

Le backend sera accessible sur `http://localhost:8000`

### 3. Configuration Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Copier le fichier .env
cp .env.example .env

# Lancer le serveur de développement
npm start
```

Le frontend sera accessible sur `http://localhost:3000`

## 🔑 Configuration Google OAuth

Pour activer la connexion Gmail, vous devez créer un projet Google Cloud et obtenir des credentials OAuth2 :

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet
3. Activer l'API Gmail
4. Créer des credentials OAuth 2.0
5. Ajouter les URI de redirection autorisées :
   - `http://localhost:8000/api/auth/google/callback/`
6. Copier le Client ID et Client Secret dans votre `.env`

### Scopes requis
- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/userinfo.email`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register/` - Inscription
- `POST /api/auth/login/` - Connexion
- `POST /api/auth/token/refresh/` - Rafraîchir le token
- `GET /api/auth/profile/` - Profil utilisateur
- `GET /api/auth/google/authorize/` - URL OAuth Google
- `POST /api/auth/google/callback/` - Callback OAuth
- `GET /api/auth/google/status/` - Statut connexion Gmail

### Subscriptions
- `GET /api/subscriptions/` - Liste des abonnements
- `POST /api/subscriptions/` - Créer un abonnement
- `GET /api/subscriptions/{id}/` - Détails d'un abonnement
- `PATCH /api/subscriptions/{id}/` - Modifier un abonnement
- `DELETE /api/subscriptions/{id}/` - Supprimer un abonnement
- `GET /api/subscriptions/stats/` - Statistiques
- `POST /api/subscriptions/scan/` - Lancer un scan
- `GET /api/subscriptions/scan/history/` - Historique des scans
- `POST /api/subscriptions/{id}/mark_active/` - Marquer comme actif
- `POST /api/subscriptions/{id}/mark_cancelled/` - Marquer comme annulé

## 🎨 Interface Utilisateur

### Pages principales
- `/login` - Connexion
- `/register` - Inscription
- `/dashboard` - Dashboard principal

### Fonctionnalités du Dashboard
- **Connexion Gmail** - Bouton pour connecter votre compte Gmail
- **Scan manuel** - Lancer un scan à tout moment
- **Cartes statistiques** - Vue d'ensemble de vos abonnements
- **Tableau des abonnements** - Liste détaillée avec actions

## 🔒 Sécurité

- Authentification JWT avec refresh tokens
- OAuth2 pour Gmail (pas de stockage de mots de passe Gmail)
- Tokens Google chiffrés en base de données
- CORS configuré pour le frontend
- Validation des données côté backend

## 📦 Structure du projet

```
subscription-tracker-mvp/
├── backend/
│   ├── config/              # Configuration Django
│   ├── apps/
│   │   ├── users/          # Authentification et profils
│   │   └── subscriptions/  # Gestion des abonnements
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Composants React réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── services/       # API calls
│   │   ├── context/        # Context API (Auth)
│   │   └── utils/          # Fonctions utilitaires
│   └── package.json
└── README.md
```

## 🚀 Déploiement

### Backend (exemple avec Heroku)
```bash
# Ajouter Heroku remote
heroku create votre-app-backend

# Configurer les variables d'environnement
heroku config:set DJANGO_SECRET_KEY=votre-secret-key
heroku config:set GOOGLE_OAUTH_CLIENT_ID=votre-client-id
# ... autres variables

# Déployer
git push heroku main
heroku run python manage.py migrate
```

### Frontend (exemple avec Vercel)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
cd frontend
vercel --prod

# Configurer les variables d'environnement dans le dashboard Vercel
```

## 🔧 Améliorations futures

- [ ] Notifications avant renouvellement d'abonnement
- [ ] Export CSV/PDF des abonnements
- [ ] Recommandations d'alternatives moins chères
- [ ] Détection des doublons (outils similaires)
- [ ] Dashboard avec graphiques (Chart.js)
- [ ] Intégration bancaire (Open Banking)
- [ ] Application mobile (React Native)
- [ ] Partage de famille (comptes multiples)

## 🐛 Dépannage

### Le scan ne trouve pas d'abonnements
- Vérifiez que Gmail est bien connecté
- Assurez-vous d'avoir des emails de facturation dans les 12 derniers mois
- Les emails de facturation doivent contenir des mots-clés comme "invoice", "payment", "facture"

### Erreur OAuth Google
- Vérifiez vos credentials dans `.env`
- Assurez-vous que l'URI de redirection est correcte
- Vérifiez que l'API Gmail est activée dans Google Cloud Console

### Erreur CORS
- Vérifiez que `CORS_ALLOWED_ORIGINS` dans `settings.py` inclut votre frontend URL

## 📝 License

MIT License - Utilisez librement pour vos projets !

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📧 Contact

Pour toute question, contactez [votre-email@example.com]
