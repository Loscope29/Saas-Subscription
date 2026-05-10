# 📡 Exemples d'utilisation de l'API

Ce document contient des exemples pratiques d'utilisation de l'API Subscription Tracker.

## 🔑 Authentification

### 1. Inscription

**Request:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "john",
    "password": "SecurePass123!",
    "password2": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "username": "john",
    "first_name": "John",
    "last_name": "Doe",
    "is_gmail_connected": false,
    "last_scan_date": null,
    "total_monthly_cost": "0.00",
    "created_at": "2024-02-17T10:30:00Z"
  },
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 2. Connexion

**Request:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Response:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 3. Rafraîchir le token

**Request:**
```bash
curl -X POST http://localhost:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }'
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 4. Profil utilisateur

**Request:**
```bash
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

**Response:**
```json
{
  "id": 1,
  "email": "john@example.com",
  "username": "john",
  "first_name": "John",
  "last_name": "Doe",
  "is_gmail_connected": true,
  "last_scan_date": "2024-02-17T10:45:00Z",
  "total_monthly_cost": "127.50",
  "created_at": "2024-02-17T10:30:00Z"
}
```

## 📧 Google OAuth (Gmail)

### 5. Obtenir l'URL d'autorisation Google

**Request:**
```bash
curl -X GET http://localhost:8000/api/auth/google/authorize/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

**Response:**
```json
{
  "authorization_url": "https://accounts.google.com/o/oauth2/auth?client_id=...",
  "state": "random-state-string"
}
```

### 6. Callback OAuth (après autorisation Google)

**Request:**
```bash
curl -X POST http://localhost:8000/api/auth/google/callback/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "code": "4/0AX4XfWh..."
  }'
```

**Response:**
```json
{
  "message": "Gmail connecté avec succès",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "is_gmail_connected": true,
    "last_scan_date": null,
    "total_monthly_cost": "0.00"
  }
}
```

### 7. Statut de la connexion Gmail

**Request:**
```bash
curl -X GET http://localhost:8000/api/auth/google/status/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

**Response:**
```json
{
  "is_connected": true,
  "email": "john@example.com",
  "last_scan_date": "2024-02-17T10:45:00Z"
}
```

### 8. Déconnecter Gmail

**Request:**
```bash
curl -X POST http://localhost:8000/api/auth/google/disconnect/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

**Response:**
```json
{
  "message": "Gmail déconnecté avec succès",
  "user": {
    "id": 1,
    "is_gmail_connected": false
  }
}
```

## 📊 Abonnements

### 9. Lancer un scan

**Request:**
```bash
curl -X POST http://localhost:8000/api/subscriptions/scan/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

**Response:**
```json
{
  "message": "Scan terminé avec succès",
  "emails_scanned": 523,
  "subscriptions_found": 8
}
```

### 10. Liste des abonnements

**Request:**
```bash
curl -X GET http://localhost:8000/api/subscriptions/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

**Response:**
```json
{
  "count": 8,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "service_name": "Netflix",
      "monthly_cost": "15.99",
      "currency": "EUR",
      "category": "streaming",
      "status": "active",
      "billing_frequency": "monthly",
      "last_billing_date": "2024-02-01",
      "next_billing_date": "2024-03-01"
    },
    {
      "id": 2,
      "service_name": "Notion",
      "monthly_cost": "10.00",
      "currency": "USD",
      "category": "productivity",
      "status": "active",
      "billing_frequency": "monthly",
      "last_billing_date": "2024-02-15",
      "next_billing_date": "2024-03-15"
    }
  ]
}
```

### 11. Détails d'un abonnement

**Request:**
```bash
curl -X GET http://localhost:8000/api/subscriptions/1/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

**Response:**
```json
{
  "id": 1,
  "user": 1,
  "service_name": "Netflix",
  "email_sender": "info@netflix.com",
  "monthly_cost": "15.99",
  "currency": "EUR",
  "billing_frequency": "monthly",
  "category": "streaming",
  "status": "active",
  "first_detected_date": "2024-01-01",
  "last_billing_date": "2024-02-01",
  "next_billing_date": "2024-03-01",
  "notes": "",
  "cancellation_url": null,
  "created_at": "2024-02-17T10:45:00Z",
  "updated_at": "2024-02-17T10:45:00Z"
}
```

### 12. Créer un abonnement manuellement

**Request:**
```bash
curl -X POST http://localhost:8000/api/subscriptions/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "service_name": "Spotify",
    "email_sender": "noreply@spotify.com",
    "monthly_cost": "9.99",
    "currency": "EUR",
    "category": "streaming",
    "status": "active",
    "first_detected_date": "2024-02-01",
    "billing_frequency": "monthly"
  }'
```

**Response:**
```json
{
  "id": 9,
  "service_name": "Spotify",
  "monthly_cost": "9.99",
  "currency": "EUR",
  "category": "streaming",
  "status": "active",
  "created_at": "2024-02-17T11:00:00Z"
}
```

### 13. Modifier un abonnement

**Request:**
```bash
curl -X PATCH http://localhost:8000/api/subscriptions/1/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "cancelled",
    "notes": "Abonnement annulé car trop cher"
  }'
```

**Response:**
```json
{
  "status": "cancelled",
  "category": "streaming",
  "notes": "Abonnement annulé car trop cher",
  "cancellation_url": null
}
```

### 14. Marquer comme actif

**Request:**
```bash
curl -X POST http://localhost:8000/api/subscriptions/1/mark_active/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

**Response:**
```json
{
  "status": "Abonnement marqué comme actif"
}
```

### 15. Marquer comme annulé

**Request:**
```bash
curl -X POST http://localhost:8000/api/subscriptions/1/mark_cancelled/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

**Response:**
```json
{
  "status": "Abonnement marqué comme annulé"
}
```

### 16. Statistiques

**Request:**
```bash
curl -X GET http://localhost:8000/api/subscriptions/stats/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

**Response:**
```json
{
  "total_subscriptions": 8,
  "active_subscriptions": 6,
  "total_monthly_cost": "127.50",
  "total_yearly_cost": "1530.00",
  "subscriptions_by_category": {
    "Streaming": 2,
    "SaaS / Logiciel": 3,
    "Productivité": 1,
    "Design": 1,
    "Marketing": 1
  },
  "subscriptions_to_review": 2
}
```

### 17. Historique des scans

**Request:**
```bash
curl -X GET http://localhost:8000/api/subscriptions/scan/history/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

**Response:**
```json
[
  {
    "id": 1,
    "user": 1,
    "scan_start": "2024-02-17T10:45:00Z",
    "scan_end": "2024-02-17T10:46:32Z",
    "emails_scanned": 523,
    "subscriptions_found": 8,
    "status": "completed",
    "error_message": ""
  },
  {
    "id": 2,
    "user": 1,
    "scan_start": "2024-02-10T14:20:00Z",
    "scan_end": "2024-02-10T14:21:15Z",
    "emails_scanned": 487,
    "subscriptions_found": 6,
    "status": "completed",
    "error_message": ""
  }
]
```

### 18. Exporter les abonnements

**Request:**
```bash
curl -X POST http://localhost:8000/api/subscriptions/export/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "format": "json"
  }'
```

**Response:**
```json
[
  {
    "id": 1,
    "service_name": "Netflix",
    "monthly_cost": "15.99",
    "currency": "EUR",
    "status": "active",
    "category": "streaming"
  },
  ...
]
```

### 19. Supprimer un abonnement

**Request:**
```bash
curl -X DELETE http://localhost:8000/api/subscriptions/1/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

**Response:**
```
204 No Content
```

## 🔍 Exemples avec filtres et pagination

### 20. Filtrer par statut

**Request:**
```bash
curl -X GET "http://localhost:8000/api/subscriptions/?status=active" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

### 21. Pagination

**Request:**
```bash
curl -X GET "http://localhost:8000/api/subscriptions/?page=2" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

## ⚠️ Gestion des erreurs

### Erreur 401 - Non authentifié

**Response:**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### Erreur 400 - Données invalides

**Response:**
```json
{
  "email": ["This field is required."],
  "password": ["This password is too short."]
}
```

### Erreur 404 - Ressource non trouvée

**Response:**
```json
{
  "detail": "Not found."
}
```

### Erreur 500 - Erreur serveur

**Response:**
```json
{
  "error": "Une erreur interne est survenue."
}
```

## 💡 Conseils d'utilisation

1. **Toujours inclure le token JWT** dans le header `Authorization: Bearer {token}`
2. **Gérer le refresh token** : quand vous recevez 401, utilisez le refresh token
3. **Pagination** : utilisez `?page=X` pour naviguer dans de grandes listes
4. **Rate limiting** : ne pas abuser des scans (maximum 1 par minute recommandé)
5. **Timeouts** : le scan peut prendre 30-60 secondes selon le nombre d'emails

## 🧪 Tester l'API

### Avec Postman
1. Importer la collection (créer un fichier JSON avec tous ces endpoints)
2. Configurer une variable d'environnement `{{baseUrl}}` = `http://localhost:8000/api`
3. Ajouter le token dans l'onglet Authorization

### Avec HTTPie
```bash
# Installation
pip install httpie

# Exemple
http POST localhost:8000/api/auth/login/ email=john@example.com password=pass123
```

### Avec Python requests
```python
import requests

# Login
response = requests.post(
    'http://localhost:8000/api/auth/login/',
    json={'email': 'john@example.com', 'password': 'pass123'}
)
token = response.json()['access']

# Get subscriptions
headers = {'Authorization': f'Bearer {token}'}
response = requests.get(
    'http://localhost:8000/api/subscriptions/',
    headers=headers
)
subscriptions = response.json()['results']
```

---

**Documentation générée le :** Février 2026  
**Version API :** 1.0.0
