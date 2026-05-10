# 🚀 Guide de Démarrage Rapide

Ce guide vous permet de lancer le projet en 10 minutes !

## Étape 1 : Prérequis (2 min)

Vérifiez que vous avez :
```bash
python --version  # Python 3.9+
node --version    # Node 16+
```

## Étape 2 : Installation Backend (3 min)

```bash
cd backend

# Créer environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer dépendances
pip install -r requirements.txt

# Configurer .env
cp .env.example .env
# Vous pouvez laisser les valeurs par défaut pour tester

# Base de données
python manage.py migrate

# Créer un utilisateur admin
python manage.py createsuperuser
# Email: admin@example.com
# Password: admin123

# Lancer
python manage.py runserver
```

✅ Backend prêt sur http://localhost:8000

## Étape 3 : Installation Frontend (3 min)

Ouvrez un nouveau terminal :

```bash
cd frontend

# Installer
npm install

# Configurer
cp .env.example .env

# Lancer
npm start
```

✅ Frontend prêt sur http://localhost:3000

## Étape 4 : Tester l'application (2 min)

1. Ouvrez http://localhost:3000
2. Cliquez sur "Créer un compte"
3. Inscrivez-vous avec un email
4. Vous êtes sur le dashboard !

### ⚠️ Pour tester le scan Gmail

Pour l'instant, le scan Gmail nécessite une configuration Google OAuth.

**Option 1 - Test rapide sans Gmail :**
- Utilisez l'interface admin Django : http://localhost:8000/admin
- Connectez-vous avec votre superuser
- Créez manuellement des abonnements test

**Option 2 - Configuration Google OAuth complète (10 min) :**
1. Allez sur https://console.cloud.google.com/
2. Créez un projet
3. Activez Gmail API
4. Créez des credentials OAuth 2.0
5. Ajoutez dans backend/.env :
   ```
   GOOGLE_OAUTH_CLIENT_ID=votre-id
   GOOGLE_OAUTH_CLIENT_SECRET=votre-secret
   ```
6. Redémarrez le serveur backend

## 🎯 Prochaines étapes

- Explorez l'interface
- Testez les différentes fonctionnalités
- Consultez le README.md pour plus de détails
- Personnalisez le design avec Tailwind

## 🐛 Problèmes courants

**Erreur "Module not found"** → Réinstallez les dépendances
**Port 3000 déjà utilisé** → Changez le port : `PORT=3001 npm start`
**Erreur CORS** → Vérifiez que le backend tourne sur le port 8000

Bon développement ! 🚀
