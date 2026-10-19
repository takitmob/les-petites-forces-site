'use strict';
/* Test de fumée du site — sans navigateur, sans dépendance.
 *
 *   node tests/smoke.js
 *
 * Un site statique n'a pas de logique à tester, mais il a des promesses qui
 * cassent en silence : un lien mort, une page sans titre, une page légale
 * orpheline, une ressource en clair. Ce fichier les vérifie toutes.
 */
const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..');
const PAGES = fs.readdirSync(RACINE).filter((f) => f.endsWith('.html')).sort();
const LEGALES = ['cgv.html', 'confidentialite.html', 'mentions-legales.html', 'remboursement.html'];

let n = 0, echecs = 0;
const ok = (nom, cond, detail) => {
  n++;
  if (cond) return;
  echecs++;
  console.log('  ÉCHEC ' + nom + (detail ? ' -> ' + detail : ''));
};

ok('des pages existent', PAGES.length >= 8, PAGES.length + ' page(s)');

const lire = (f) => fs.readFileSync(path.join(RACINE, f), 'utf8');

// 1. chaque page est complète
for (const f of PAGES) {
  const t = lire(f);
  ok(f + ' : titre', /<title>[^<]{3,}<\/title>/i.test(t));
  ok(f + ' : viewport', /name=["']viewport["']/i.test(t));
  ok(f + ' : langue déclarée', /<html[^>]+lang=/i.test(t));
  ok(f + ' : description', /name=["']description["']/i.test(t));
}

// 2. aucun lien interne mort (ni fichier, ni ancre de page inexistante)
let liens = 0;
for (const f of PAGES) {
  const t = lire(f);
  const refs = [...t.matchAll(/(?:href|src)=["']([^"'#][^"']*)["']/g)].map((m) => m[1]);
  for (const r of refs) {
    if (/^(?:https?:|mailto:|tel:|data:|#)/.test(r)) continue;
    liens++;
    const cible = path.join(RACINE, r.split('?')[0]);
    ok(f + ' -> ' + r, fs.existsSync(cible), 'fichier absent');
  }
}
ok('des liens internes ont été vérifiés', liens > 20, liens);

// 3. les pages légales sont atteignables depuis l'accueil
const accueil = lire('index.html');
for (const l of LEGALES) {
  ok('accueil -> ' + l, accueil.includes(l), 'lien absent du pied de page');
}
ok('les pages légales existent', LEGALES.every((l) => PAGES.includes(l)));

// 4. rien en HTTP clair
for (const f of PAGES) {
  ok(f + ' : aucun http:// clair', !/(?:href|src)=["']http:\/\//i.test(lire(f)));
}

// 5. la page de contact ne promet pas ce qu'elle ne fait pas
const nl = lire('newsletter.html');
ok('newsletter : le formulaire est présent', /mailerlite/i.test(nl));
ok('newsletter : la politique est liée', /confidentialite\.html/.test(nl));

console.log(n + ' vérifications, ' + echecs + ' échec(s)');
process.exit(echecs ? 1 : 0);
