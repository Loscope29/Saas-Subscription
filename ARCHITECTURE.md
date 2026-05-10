# 📐 Architecture Technique - Subscription Tracker MVP

## Vue d'ensemble

Ce document décrit l'architecture technique complète du MVP Subscription Tracker, un SaaS permettant de suivre et gérer les abonnements en ligne.

## 🏗️ Architecture Générale

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
│                    React 18 + Tailwind CSS                  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS
                         │ REST API (JSON)
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   BACKEND API (Django)                       │
│              Django REST Framework + JWT                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────┐   ┌──────────────┐  │
│  │    Users     │    │Subscriptions │   │    Scanner   │  │
│  │     App      │    │     App      │   │    Service   │  │
│  └──────────────┘    └──────────────┘   └──────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │   PostgreSQL/    │
              │     SQLite       │
              └──────────────────┘
                         
                         │
                         ▼
              ┌──────────────────┐
              │   Gmail API      │
              │  (Google OAuth)  │
              └──────────────────┘
```

## 🔧 Stack Technique Détaillée

### Backend

**Framework & Core**
- Django 4.2.9 - Framework web Python
- Django REST Framework 3.14.0 - API REST
- djangorestframework-simplejwt 5.3.1 - Authentification JWT
- django-cors-headers 4.3.1 - Gestion CORS

**Intégrations**
- google-auth 2.27.0 - Authentification Google
- google-auth-oauthlib 1.2.0 - OAuth2 flow
- google-api-python-client 2.116.0 - Gmail API client

**Base de données**
- PostgreSQL (production) via psycopg2-binary 2.9.9
- SQLite3 (développement)

**Déploiement**
- gunicorn 21.2.0 - WSGI server
- whitenoise 6.6.0 - Serving static files

### Frontend

**Core**
- React 18.2.0 - Library UI
- React Router DOM 6.20.1 - Routing
- Axios 1.6.2 - HTTP client

**UI & Styling**
- Tailwind CSS 3.3.6 - Utility-first CSS
- PostCSS 8.4.32 - CSS processing
- Autoprefixer 10.4.16 - Vendor prefixes

**Icons**
- Heroicons 2.0.18 - SVG icons
- Headless UI 1.7.17 - Unstyled components

## 📦 Structure des Modules

### Backend Apps

#### 1. Users App (`apps/users/`)

**Responsabilités :**
- Gestion des utilisateurs personnalisés
- Authentification JWT
- OAuth Google pour Gmail
- Profils utilisateurs

**Modèles :**
```python
User (AbstractUser)
  - email (unique)
  - gmail_access_token
  - gmail_refresh_token
  - gmail_token_expiry
  - is_gmail_connected
  - last_scan_date
  - total_monthly_cost
```

**Endpoints API :**
- `POST /api/auth/register/` - Inscription
- `POST /api/auth/login/` - Connexion (retourne JWT)
- `POST /api/auth/token/refresh/` - Refresh token
- `GET /api/auth/profile/` - Profil utilisateur
- `GET /api/auth/google/authorize/` - URL OAuth Google
- `POST /api/auth/google/callback/` - Callback OAuth
- `POST /api/auth/google/disconnect/` - Déconnexion Gmail
- `GET /api/auth/google/status/` - Statut connexion

#### 2. Subscriptions App (`apps/subscriptions/`)

**Responsabilités :**
- CRUD des abonnements
- Statistiques financières
- Scan des emails
- Catégorisation automatique

**Modèles :**
```python
Subscription
  - user (FK)
  - service_name
  - email_sender
  - monthly_cost
  - currency
  - billing_frequency
  - category (SaaS, Streaming, etc.)
  - status (active, cancelled, to_review)
  - first_detected_date
  - last_billing_date
  - next_billing_date
  - notes
  - cancellation_url

EmailScanLog
  - user (FK)
  - scan_start
  - scan_end
  - emails_scanned
  - subscriptions_found
  - status (in_progress, completed, failed)
  - error_message
```

**Endpoints API :**
- `GET /api/subscriptions/` - Liste abonnements
- `POST /api/subscriptions/` - Créer abonnement
- `GET /api/subscriptions/{id}/` - Détail
- `PATCH /api/subscriptions/{id}/` - Modifier
- `DELETE /api/subscriptions/{id}/` - Supprimer
- `GET /api/subscriptions/stats/` - Statistiques
- `POST /api/subscriptions/scan/` - Lancer scan
- `GET /api/subscriptions/scan/history/` - Historique scans
- `POST /api/subscriptions/{id}/mark_active/` - Marquer actif
- `POST /api/subscriptions/{id}/mark_cancelled/` - Marquer annulé
- `POST /api/subscriptions/export/` - Exporter (JSON/CSV)

#### 3. Scanner Service (`apps/subscriptions/scanner.py`)

**Classe principale : `GmailScanner`**

**Fonctionnalités :**
1. **Authentification Gmail**
   - Utilise les tokens OAuth stockés
   - Refresh automatique si expiré

2. **Recherche d'emails**
   - Query : keywords de facturation
   - Période : 12 derniers mois
   - Limite : 1000 emails

3. **Parsing d'emails**
   - Extraction expéditeur, sujet, date
   - Détection prix (€, $, EUR, USD)
   - Identification service

4. **Catégorisation**
   - Streaming (Netflix, Spotify, etc.)
   - SaaS/Productivity (Notion, Slack, etc.)
   - Design (Figma, Adobe, etc.)
   - Marketing (Mailchimp, etc.)
   - Hosting (AWS, Heroku, etc.)

**Algorithme de détection :**
```
Pour chaque email :
  1. Vérifier mots-clés facturation
  2. Extraire prix avec regex
  3. Si prix > 0 :
     - Identifier service (domaine connu ou nom)
     - Catégoriser
     - Créer Subscription si nouveau
```

### Frontend Architecture

#### Structure des dossiers
```
src/
├── components/          # Composants réutilisables
│   └── PrivateRoute.js # Protection routes authentifiées
├── pages/              # Pages de l'app
│   ├── Login.js       # Connexion
│   ├── Register.js    # Inscription
│   └── Dashboard.js   # Dashboard principal
├── services/          # Services API
│   └── api.js        # Configuration Axios + endpoints
├── context/          # Context API React
│   └── AuthContext.js # État global authentification
├── utils/            # Utilitaires
├── App.js            # Composant racine + routing
├── index.js          # Point d'entrée React
└── index.css         # Styles Tailwind
```

#### Gestion de l'état

**AuthContext :**
- État utilisateur global
- Fonctions : login, register, logout, refreshUser
- Stockage tokens dans localStorage
- Auto-refresh JWT via interceptor

**État local (useState) :**
- Formulaires
- Chargement/erreurs
- Listes d'abonnements
- Statistiques

#### Routing

```javascript
/                    → Redirect /dashboard
/login              → Page connexion (public)
/register           → Page inscription (public)
/dashboard          → Dashboard (privé)
```

## 🔐 Sécurité

### Authentification

**Flow JWT :**
1. Login → Reçoit access_token + refresh_token
2. Stockage dans localStorage
3. Interceptor Axios ajoute `Authorization: Bearer {token}`
4. Si 401 → Auto-refresh avec refresh_token
5. Si refresh fail → Redirect /login

**OAuth Google :**
1. Frontend demande URL OAuth
2. Backend génère URL avec scopes Gmail
3. Redirection vers Google
4. User accepte
5. Google redirect avec `code`
6. Frontend envoie code au backend
7. Backend échange code contre tokens
8. Tokens stockés (chiffrés) en DB

### CORS

Configuration permissive en dev :
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
]
```

En production : uniquement le domaine frontend

### Tokens Gmail

- Stockés dans champs `TextField` (pas plaintext)
- Jamais exposés via API
- Utilisés uniquement côté backend
- Refresh automatique si expirés

## 🔄 Flux de données principaux

### 1. Inscription / Connexion

```
User → Frontend (Login form)
     → POST /api/auth/login/ {email, password}
     → Backend vérifie credentials
     → Génère JWT tokens
     → Frontend stocke tokens
     → Redirect dashboard
```

### 2. Connexion Gmail

```
User clique "Connecter Gmail"
     → GET /api/auth/google/authorize/
     → Backend retourne URL OAuth
     → Redirect vers Google
     → User accepte
     → Google redirect avec code
     → POST /api/auth/google/callback/ {code}
     → Backend échange code → tokens
     → Stocke en DB
     → User.is_gmail_connected = True
```

### 3. Scan Email

```
User clique "Lancer scan"
     → POST /api/subscriptions/scan/
     → GmailScanner.scan_emails()
     → Build Gmail query
     → Fetch messages (max 1000)
     → Parse chaque email :
        - Extract sender, subject, date
        - Regex prix
        - Identify service
        - Categorize
     → Create Subscription si nouveau
     → Update scan log
     → Return stats
     → Frontend rafraîchit dashboard
```

### 4. Dashboard Display

```
Dashboard mount
     → Parallel requests :
        - GET /api/subscriptions/stats/
        - GET /api/subscriptions/
        - GET /api/auth/google/status/
     → Display :
        - Cards (total, actifs, coût mensuel/annuel)
        - Table subscriptions
        - Gmail status banner
```

## 📊 Modèle de données relationnel

```sql
users
  ├── id (PK)
  ├── email (unique)
  ├── username
  ├── password (hashed)
  ├── gmail_access_token
  ├── gmail_refresh_token
  ├── is_gmail_connected
  ├── last_scan_date
  └── total_monthly_cost

subscriptions
  ├── id (PK)
  ├── user_id (FK → users)
  ├── service_name
  ├── email_sender
  ├── monthly_cost
  ├── currency
  ├── category
  ├── status
  ├── first_detected_date
  ├── last_billing_date
  └── created_at

email_scan_logs
  ├── id (PK)
  ├── user_id (FK → users)
  ├── scan_start
  ├── scan_end
  ├── emails_scanned
  ├── subscriptions_found
  └── status
```

## 🚀 Performances & Optimizations

### Backend
- Pagination REST (20 items/page)
- Indexation DB sur FK et champs fréquents
- Limite scan Gmail : 1000 emails max
- Requêtes optimisées (select_related, prefetch_related)

### Frontend
- Lazy loading des routes
- Debounce sur recherches
- Cache des stats (évite requêtes multiples)
- Optimistic UI updates

### Future
- Redis pour cache
- Celery pour scans async
- WebSocket pour scan progress
- CDN pour assets statiques

## 🧪 Tests

### Backend (à implémenter)
```python
# tests/test_scanner.py
- Test détection prix
- Test catégorisation
- Test création subscriptions

# tests/test_api.py
- Test endpoints CRUD
- Test authentication
- Test OAuth flow
```

### Frontend (à implémenter)
```javascript
// __tests__/Dashboard.test.js
- Test render stats
- Test actions (mark active/cancelled)
- Test Gmail connection flow
```

## 📈 Évolution & Scalabilité

### Phase 1 - MVP ✅
- Authentification JWT
- Connexion Gmail
- Scan basique
- Dashboard simple

### Phase 2 - Optimisations
- Scans asynchrones (Celery)
- Notifications email
- Export CSV/PDF
- Graphiques (Chart.js)

### Phase 3 - Fonctionnalités avancées
- Recommandations alternatives
- Détection doublons
- Intégration bancaire
- Multi-utilisateurs (famille)

### Phase 4 - Scale
- Microservices
- Message queue (RabbitMQ)
- Cache distribué (Redis)
- Load balancing

## 🛠️ Configuration Environnements

### Développement
- SQLite
- DEBUG=True
- CORS permissif
- Tokens courts

### Production
- PostgreSQL
- DEBUG=False
- HTTPS uniquement
- CORS strict
- Tokens longs
- Monitoring (Sentry)

## 📝 Conventions de code

### Backend
- PEP 8 Python style
- Docstrings pour classes/fonctions
- Type hints où possible
- Tests unitaires requis

### Frontend
- ESLint + Prettier
- Functional components + Hooks
- PropTypes pour validation
- Comments pour logique complexe

---

**Date de dernière mise à jour :** Février 2026  
**Version MVP :** 1.0.0
