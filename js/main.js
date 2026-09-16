/* ============================================================
   LES PETITES FORCES — Clairbois
   Catalogue piloté par données (albums.json) — §33 du kit
   ============================================================ */

(() => {
  "use strict";

  const CATALOGUE_URL = "data/albums.json";

  /** Charge le catalogue JSON. */
  async function chargerCatalogue() {
    const reponse = await fetch(CATALOGUE_URL);
    if (!reponse.ok) {
      throw new Error("Impossible de charger le catalogue (" + reponse.status + ")");
    }
    return reponse.json();
  }

  /** Formatte un prix. */
  function formaterPrix(montant) {
    return montant.toLocaleString("fr-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 2,
    });
  }

  /** Slug → URL de couverture web. */
  function urlCouverture(slug) {
    return "assets/covers/" + slug + ".jpg";
  }

  /** Crée la carte HTML d'un album. */
  function carteAlbum(album) {
    return `
      <li class="carte-album">
        <a href="album.html?slug=${encodeURIComponent(album.slug)}" aria-label="${album.titre}">
          <img class="couverture" src="${urlCouverture(album.slug)}" alt="Couverture de ${album.titre}" loading="lazy">
        </a>
        <div class="contenu">
          <h3><a href="album.html?slug=${encodeURIComponent(album.slug)}">${album.titre}</a></h3>
          <div class="theme">${album.personnage} · ${album.theme}</div>
          <div class="bas">
            <span class="prix">${formaterPrix(album.prix_usd)}</span>
            <a class="lien" href="album.html?slug=${encodeURIComponent(album.slug)}">Découvrir</a>
          </div>
        </div>
      </li>`;
  }

  /** Rendu de la grille d'albums (page Histoires + accueil). */
  async function rendreGrille(selecteur, filtreId) {
    const conteneur = document.querySelector(selecteur);
    if (!conteneur) return;

    try {
      const donnees = await chargerCatalogue();
      let albums = donnees.albums;
      if (filtreId) {
        albums = albums.filter((a) => String(a.id) === String(filtreId));
      }
      conteneur.innerHTML = albums.map(carteAlbum).join("");
    } catch (erreur) {
      conteneur.innerHTML = `<li class="carte-album"><div class="contenu"><p>${erreur.message}</p></div></li>`;
    }
  }

  /** Rendu de la fiche album (page album.html?slug=...). */
  async function rendreFicheAlbum() {
    const conteneur = document.querySelector("[data-fiche-album]");
    if (!conteneur) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    try {
      const donnees = await chargerCatalogue();
      const album = donnees.albums.find((a) => a.slug === slug);

      if (!album) {
        conteneur.innerHTML = `<p>Cet album est introuvable. <a href="histoires.html">Voir toutes les histoires</a>.</p>`;
        return;
      }

      document.title = `${album.titre} — Les Petites Forces (Clairbois)`;

      conteneur.innerHTML = `
        <div class="fiche-album">
          <img class="couverture" src="${urlCouverture(album.slug)}" alt="Couverture de ${album.titre}">
          <div class="fiche-infos">
            <span class="theme-badge">${album.theme}</span>
            <h1>${album.titre}</h1>
            <p>${album.description}</p>
            <div class="competences">
              ${album.competences.map((c) => `<span class="competence">${c}</span>`).join("")}
            </div>
            <p><strong>Personnage :</strong> ${album.personnage} · <strong>Âge :</strong> ${album.age} · <strong>${album.pages} pages</strong></p>
            <p class="prix">${formaterPrix(album.prix_usd)}</p>
            <p>
              <a class="btn btn-principal" href="${album.lien_achat}" target="_blank" rel="noopener">Obtenir cet album</a>
            </p>
            <p class="section-petite" style="margin-top:var(--sp-md)">
              <em>Une histoire tendre de l'univers Clairbois — « ${donnees._meta.signature} »</em>
            </p>
          </div>
        </div>`;
    } catch (erreur) {
      conteneur.innerHTML = `<p>${erreur.message}</p>`;
    }
  }

  /** Rendu du lien de boutique dynamique (offres). */
  async function rendreBoutique() {
    const conteneur = document.querySelector("[data-boutique]");
    if (!conteneur) return;
    try {
      const donnees = await chargerCatalogue();
      conteneur.innerHTML = donnees.offres.map((o) => `
        <li class="carte-album">
          <div class="contenu">
            <h3>${o.nom}</h3>
            <div class="theme">${o.contenu}</div>
            <div class="bas">
              <span class="prix">${formaterPrix(o.prix_usd)}</span>
              <a class="lien" href="${donnees._meta.boutique_payhip}" target="_blank" rel="noopener">Voir</a>
            </div>
          </div>
        </li>`).join("");
    } catch (erreur) {
      conteneur.innerHTML = `<li><p>${erreur.message}</p></li>`;
    }
  }

  /** Rendu des personnages (données statiques du kit §05). */
  const PERSONNAGES = [
    {
      nom: "Milo",
      description: "Petit renard roux, curieux et enthousiaste, souvent impatient. Ses histoires parlent de persévérance, d'essais et de recommencement.",
      details: ["curieux", "enthousiaste", "énergique", "parfois impatient"],
      tenue: "Salopette bleue",
    },
    {
      nom: "Aïa",
      description: "Petite mésange bleue, vive et observatrice. Elle ne donne pas toutes les réponses : elle pose les bonnes questions.",
      details: ["vive", "observatrice", "curieuse", "réfléchie"],
      tenue: "—",
    },
    {
      nom: "Nora",
      description: "Jeune lapine grise, sensible et imaginative. Ses histoires abordent les émotions, la confiance et le courage intérieur.",
      details: ["sensible", "imaginative", "expressive", "parfois hésitante"],
      tenue: "Robe jaune, sac à dos vert",
    },
    {
      nom: "Basile",
      description: "Jeune castor brun, patient et généreux. Ses histoires parlent de coopération, de création et de droit à l'imperfection.",
      details: ["patient", "généreux", "inventif", "parfois perfectionniste"],
      tenue: "Gilet rouge",
    },
    {
      nom: "Mamie Lune",
      description: "Vieille tortue qui tient la bibliothèque-jardin de Clairbois. Calme et bienveillante, elle accompagne sans imposer et aime les phrases simples.",
      details: ["calme", "chaleureuse", "bienveillante", "observatrice"],
      tenue: "—",
    },
  ];

  /** Rendu de la page Personnages. */
  function rendrePersonnages() {
    const conteneur = document.querySelector("[data-personnages]");
    if (!conteneur) return;
    conteneur.innerHTML = PERSONNAGES.map((p) => `
      <article class="carte-personnage">
        <h3>${p.nom}</h3>
        <p>${p.description}</p>
        <ul>${p.details.map((d) => `<li>${d}</li>`).join("")}</ul>
        ${p.tenue !== "—" ? `<p style="margin-top:var(--sp-xs);font-size:0.9rem"><strong>Tenue :</strong> ${p.tenue}</p>` : ""}
      </article>`).join("");
  }

  /** Initialisation au chargement. */
  document.addEventListener("DOMContentLoaded", () => {
    rendreGrille("[data-grille-albums]");
    rendreGrille("[data-grille-albums-accueil]", null);
    rendreFicheAlbum();
    rendrePersonnages();
    rendreBoutique();
  });
})();