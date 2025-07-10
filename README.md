# AuthService Copy - API de Statistiques

Ce service fournit des statistiques détaillées sur les utilisateurs, analyses médicales et abonnements.

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` basé sur `.env_exemple` :

```bash
cp .env_exemple .env
```

Configurez les variables d'environnement dans `.env` :

```env
PORT=3001
MONGODB_USER=votre_utilisateur
MONGODB_PASSWORD=votre_mot_de_passe
MONGODB_CLUSTER=votre_cluster.mongodb.net
JWT_SECRET=votre_secret_jwt
```

## Démarrage

```bash
# Développement
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

### Statistiques Générales

**GET** `/api/stats/`

Retourne toutes les statistiques en une seule requête.

**Réponse :**

```json
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "premium": 45,
      "free": 105
    },
    "analyses": {
      "total": 1250,
      "last24h": 25,
      "last7Days": [
        { "_id": "2024-01-15", "count": 12 },
        { "_id": "2024-01-16", "count": 18 }
      ]
    },
    "subscriptions": {
      "active": 45,
      "byStatus": [
        { "_id": "active", "count": 40 },
        { "_id": "trialing", "count": 5 }
      ]
    },
    "timestamp": "2024-01-16T10:30:00.000Z"
  }
}
```

### Statistiques Utilisateurs

**GET** `/api/stats/users`

Retourne uniquement les statistiques des utilisateurs.

**Réponse :**

```json
{
  "success": true,
  "data": {
    "total": 150,
    "premium": 45,
    "free": 105,
    "newLast24h": 5,
    "newLast7Days": 25
  }
}
```

### Statistiques Analyses

**GET** `/api/stats/analyses`

Retourne uniquement les statistiques des analyses médicales.

**Réponse :**

```json
{
  "success": true,
  "data": {
    "total": 1250,
    "last24h": 25,
    "last7Days": 180,
    "byDay": [
      { "_id": "2024-01-15", "count": 12 },
      { "_id": "2024-01-16", "count": 18 }
    ]
  }
}
```

### Statistiques Abonnements

**GET** `/api/stats/subscriptions`

Retourne uniquement les statistiques des abonnements.

**Réponse :**

```json
{
  "success": true,
  "data": {
    "active": 45,
    "total": 60,
    "byStatus": [
      { "_id": "active", "count": 40 },
      { "_id": "trialing", "count": 5 },
      { "_id": "canceled", "count": 15 }
    ],
    "newLast24h": 3
  }
}
```

### Health Check

**GET** `/api/health`

Vérifie que l'API fonctionne correctement.

**Réponse :**

```json
{
  "success": true,
  "message": "AuthService copy API is running",
  "timestamp": "2024-01-16T10:30:00.000Z"
}
```

## Sécurité

Par défaut, les routes de statistiques sont publiques. Pour les sécuriser :

1. Décommentez les lignes dans `src/routes/stats.route.ts` :

```typescript
router.use(authenticateToken);
router.use(requireAdmin);
```

2. Assurez-vous que `JWT_SECRET` est configuré dans votre `.env`

## Modèles de Données

Le service utilise les modèles suivants :

- `User` : Utilisateurs de l'application
- `MedicalAnalysis` : Analyses médicales effectuées
- `Subscription` : Abonnements Stripe

## Statuts d'Abonnement

Les abonnements peuvent avoir les statuts suivants :

- `active` : Abonnement actif
- `trialing` : En période d'essai
- `past_due` : En retard de paiement
- `canceled` : Annulé
- `incomplete` : Incomplet
- `incomplete_expired` : Incomplet expiré
- `unpaid` : Non payé
- `paused` : En pause
