# Les Petites Forces — Site web

Site statique de l'univers **Clairbois** : 12 albums jeunesse (4-7 ans), personnages, activités et offres. Catalogue **piloté par données** (`data/albums.json`), sans base de données ni backend. Déployé sur GitHub Pages.

## Architecture

```
├── index.html            Accueil (10 sections)
├── histoires.html        Catalogue des 12 albums
├── album.html            Fiche album (rendue via ?slug=…)
├── personnages.html      Les 5 personnages
├── activites.html        Activités
├── parents.html          Espace parents / éducateurs
├── apropos.html          À propos
├── boutique.html         Offres (pilotées par data/albums.json)
├── newsletter.html       Inscription + aventure gratuite
├── mentions-legales.html Pages légales (à compléter avant mise en production)
├── confidentialite.html
├── cgv.html
├── remboursement.html
├── css/style.css         Design system
├── js/main.js            Chargement du catalogue + rendus
├── data/albums.json      Source de vérité du catalogue
└── assets/
    ├── covers/           Couvertures web optimisées
    ├── logo-couleur.png
    └── logo-crayon.png
```

## Modèle de données (albums.json)

Chaque album : `id`, `titre`, `slug`, `personnage`, `theme`, `description`, `competences`, `couverture`, `fichier`, `pages`, `prix_usd`, `categorie`, `age`, `lien_achat`. Les offres (pack 3, collection 6, etc.) sont dans `offres`. Le hors-série est isolé dans `hors_serie`.

**Ajouter un album** : 1) créer le PDF + couverture optimisée, 2) ajouter l'entrée dans `albums.json`, 3) recréer la vignette web si besoin. Le site se met à jour automatiquement — aucun code à modifier.

## Installation / test local

```bash
python3 -m http.server 8000
# ouvrir http://localhost:8000
```

> Le site doit être servi via HTTP (fetch du JSON), pas en `file://`.

## Déploiement (GitHub Pages)

1. Créer un dépôt GitHub public (le compte gratuit exige un dépôt public pour Pages).
2. Activer GitHub Pages sur la branche principale (dossier racine).
3. Le site est en ligne sur `https://<utilisateur>.github.io/<depot>/`.

Variables à vérifier à chaque mise en ligne :
- `data/albums.json` : liens Payhip, prix, produits
- Script MailerLite : numéro de compte et formulaire
- Pages légales : compléter les `[À COMPLÉTER]` avant la mise en production

## Intégrations

| Service | Rôle | État |
| --- | --- | --- |
| MailerLite | Formulaire newsletter + automation 4 e-mails | Formulaire intégré ; automation à configurer |
| Payhip (`https://payhip.com/clairbois`) | Boutique, paiements, livraison PDF | Boutique à alimenter |
| Analytics | Mesure visites/inscriptions/ventes | À installer |

## Sécurité & conformité

- Aucune clé API dans le frontend (le numéro de compte MailerLite est public par nature, pas un secret).
- Site statique : pas d'exécution serveur, surface d'attaque minimale.
- Données personnelles : prénom + e-mail uniquement, via MailerLite (voir `confidentialite.html`).
- Les fichiers sources (PDF haute résolution, illustrations d'origine) ne sont **pas** dans ce dépôt : livraison via la boutique Payhip uniquement.
- Pages légales à compléter AVANT mise en production.

## Licence

Tous droits réservés — aucun droit accordé au-delà de la loi ; toute utilisation demande une autorisation écrite.

Voir `LICENSE`. © 2026 Josué Konan.
