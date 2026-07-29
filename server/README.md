# Binta Ice Cream — Backend (API)

Ce dossier est le **serveur** du site : une petite API (Node.js + Express)
qui parle à une base de données **MongoDB** et qui envoie les photos vers
**Cloudinary**. Le site (dans le dossier parent) l'appelle pour lire et
modifier les produits.

Sans ce serveur lancé, le site public (`index.html`) peut quand même
s'afficher, mais restera vide, et `admin.html` ne pourra ni se connecter
ni enregistrer quoi que ce soit.

---

## 1. Créer votre base MongoDB Atlas (gratuite)

1. Allez sur https://www.mongodb.com/cloud/atlas/register et créez un compte gratuit.
2. Créez un nouveau projet, puis un cluster **M0 (Free)**.
3. Dans **Database Access**, créez un utilisateur (nom + mot de passe) — notez-les.
4. Dans **Network Access**, ajoutez `0.0.0.0/0` ("Allow access from anywhere") pour commencer simplement. Vous pourrez restreindre plus tard.
5. Cliquez sur **Connect** > **Drivers**, copiez la chaîne de connexion. Elle ressemble à :
   ```
   mongodb+srv://UTILISATEUR:<db_password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Remplacez `<db_password>` par le vrai mot de passe, et ajoutez `/binta-ice-cream` juste avant le `?`, par exemple :
   ```
   mongodb+srv://UTILISATEUR:motdepasse@cluster0.xxxxx.mongodb.net/binta-ice-cream?retryWrites=true&w=majority
   ```

## 2. Créer votre compte Cloudinary (gratuit)

1. Allez sur https://cloudinary.com/users/register/free et créez un compte gratuit.
2. Sur le tableau de bord (Dashboard), notez : **Cloud name**, **API Key**, **API Secret**.

## 3. Configurer le serveur

```bash
cd server
cp .env.example .env
```

Ouvrez `.env` et remplissez :
- `MONGODB_URI` → la chaîne de connexion de l'étape 1
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` → les identifiants que vous utiliserez pour vous connecter sur `admin.html`
- `JWT_SECRET` → une longue chaîne aléatoire (n'importe quoi, ex : `azERTY123!xyz...`)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` → de l'étape 2

**Ne partagez jamais ce fichier `.env`** (il contient vos mots de passe).

## 4. Installer et lancer le serveur

```bash
cd server
npm install
npm run dev
```

Si tout est bien configuré, vous verrez :
```
✅ Connecté à MongoDB
✅ Serveur API lancé sur http://localhost:4000
```

Le catalogue de départ (12 produits) sera automatiquement ajouté à la
base au premier lancement.

## 5. Lancer le site

Dans un **autre** terminal, à la racine du projet (pas dans `server/`) :

```bash
python3 -m http.server 5500
# ou l'extension "Live Server" de VS Code
```

Puis ouvrez `http://localhost:5500/index.html` — **jamais** en double-cliquant le fichier (voir plus bas).

Le fichier `js/api-config.js` doit pointer vers `http://localhost:4000/api`
(c'est déjà le cas par défaut).

---

## ⚠️ Piège fréquent : ne jamais ouvrir les fichiers en double-cliquant

Si vous ouvrez `index.html` ou `admin.html` en double-cliquant dessus,
l'adresse commencera par `file:///...` et **les scripts ne se chargeront
pas du tout** (les navigateurs bloquent ça par sécurité). Utilisez
toujours un petit serveur local (`python3 -m http.server`, "Live Server",
etc.) pendant les tests, et un vrai hébergement une fois en ligne.

---

## 6. Déployer plus tard (quand vous serez prêt)

Le site (HTML/CSS/JS) et le serveur (API) sont **deux choses séparées**
qui peuvent être hébergées à deux endroits différents :

- **Le site statique** (`index.html`, `admin.html`, `css/`, `js/`, `img/`) peut aller sur Hostinger.
- **Le serveur** (dossier `server/`) a besoin d'un hébergement qui exécute du **Node.js**. Attention : les formules Hostinger les plus simples (Premium/Single) sont en général du PHP/MySQL uniquement et ne font pas tourner Node.js — il faut soit une formule Hostinger "Cloud"/VPS avec Node.js activé, soit un service dédié comme **Render** ou **Railway** (offres gratuites disponibles), plus simples pour démarrer.

Une fois le serveur en ligne, il suffira de changer une seule ligne dans
`js/api-config.js` (`API_BASE_URL`) pour pointer vers sa nouvelle adresse.

## 7. (Optionnel) Reconstituer le catalogue de départ

Si vous videz la base par erreur :
```bash
cd server
npm run seed
```
