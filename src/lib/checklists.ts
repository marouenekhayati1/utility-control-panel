export type ChecklistField =
  | { kind: "number"; id: string; label: string; unit?: string; min?: number; max?: number; step?: number; info?: string }
  | { kind: "text"; id: string; label: string; placeholder?: string; info?: string }
  | { kind: "textarea"; id: string; label: string; placeholder?: string; info?: string }
  | { kind: "select"; id: string; label: string; options: string[]; info?: string }
  | { kind: "boolean"; id: string; label: string; info?: string };

export interface ChecklistDef {
  id: string;
  title: string;
  subtitle: string;
  fields: ChecklistField[];
}

export const CHECKLISTS: Record<string, ChecklistDef> = {
  water: {
    id: "water",
    title: "Traitement d'eau",
    subtitle: "Adoucisseur, filtration, chlore et conductivité",
    fields: [
      { kind: "number", id: "durete_entree", label: "Dureté entrée", unit: "°f", min: 0, max: 100, step: 0.1 },
      { kind: "number", id: "durete_sortie", label: "Dureté sortie", unit: "°f", min: 0, max: 10, step: 0.1, info: "Cible < 1 °f" },
      { kind: "number", id: "chlore_libre", label: "Chlore libre", unit: "mg/L", min: 0, max: 5, step: 0.05, info: "Plage 0.2 – 0.8 mg/L" },
      { kind: "number", id: "conductivite", label: "Conductivité", unit: "µS/cm", min: 0, max: 3000, step: 1 },
      { kind: "number", id: "ph_eau", label: "pH réseau", min: 0, max: 14, step: 0.1, info: "Plage 6.5 – 8.5" },
      { kind: "number", id: "pression_reseau", label: "Pression réseau", unit: "bar", min: 0, max: 12, step: 0.1 },
      { kind: "select", id: "sel_resine", label: "Niveau sel résine", options: ["Haut", "Moyen", "Bas", "Vide"] },
      { kind: "select", id: "etat_filtres", label: "État filtres", options: ["Propre", "Encrassé", "À changer"] },
      { kind: "select", id: "fuites", label: "Fuites constatées", options: ["Aucune", "Légère", "Importante"] },
      { kind: "textarea", id: "remarques", label: "Remarques", placeholder: "Observations éventuelles…" },
    ],
  },
  surchauffee: {
    id: "surchauffee",
    title: "Eau surchauffée",
    subtitle: "Réseau haute température, pressions et températures",
    fields: [
      { kind: "number", id: "temp_depart", label: "Température départ", unit: "°C", min: 0, max: 200, step: 0.1, info: "Plage 110 – 130 °C" },
      { kind: "number", id: "temp_retour", label: "Température retour", unit: "°C", min: 0, max: 120, step: 0.1, info: "Plage 70 – 90 °C" },
      { kind: "number", id: "pression_reseau", label: "Pression réseau", unit: "bar", min: 0, max: 20, step: 0.1, info: "Plage 3 – 6 bar" },
      { kind: "number", id: "pression_vasque", label: "Pression vasque d'expansion", unit: "bar", min: 0, max: 15, step: 0.1 },
      { kind: "number", id: "temp_locale", label: "Température local technique", unit: "°C", min: 0, max: 60, step: 0.1 },
      { kind: "select", id: "etat_pompes", label: "État pompes", options: ["Normal", "Bruit anormal", "Vibration", "Arrêt"] },
      { kind: "select", id: "fuites_reseau", label: "Fuites réseau", options: ["Aucune", "Légère", "Importante"] },
      { kind: "textarea", id: "remarques", label: "Remarques", placeholder: "Observations éventuelles…" },
    ],
  },
  vapeur: {
    id: "vapeur",
    title: "Chaudière vapeur",
    subtitle: "Production de vapeur, niveaux et purges",
    fields: [
      { kind: "number", id: "pression_vapeur", label: "Pression vapeur", unit: "bar", min: 0, max: 15, step: 0.1, info: "Plage 6 – 9 bar" },
      { kind: "number", id: "temp_vapeur", label: "Température vapeur", unit: "°C", min: 0, max: 250, step: 1 },
      { kind: "number", id: "niveau_eau", label: "Niveau d'eau chaudière", unit: "%", min: 0, max: 100, step: 1, info: "Plage 40 – 70 %" },
      { kind: "number", id: "conductivite_chaudiere", label: "Conductivité chaudière", unit: "µS/cm", min: 0, max: 10000, step: 10 },
      { kind: "select", id: "bruleur", label: "État brûleur", options: ["Normal", "Allumage difficile", "Flamme instable", "Arrêt"] },
      { kind: "select", id: "purge", label: "Purge effectuée", options: ["Oui", "Non"] },
      { kind: "select", id: "detendeur", label: "Détendeur / sécurité", options: ["OK", "À vérifier", "HS"] },
      { kind: "textarea", id: "remarques", label: "Remarques", placeholder: "Observations éventuelles…" },
    ],
  },
  vide: {
    id: "vide",
    title: "Pompe à vide",
    subtitle: "Dépression, huile et refroidissement",
    fields: [
      { kind: "number", id: "depression", label: "Dépression atteinte", unit: "mbar", min: 0, max: 1000, step: 1, info: "Cible < 50 mbar" },
      { kind: "number", id: "temp_carter", label: "Température carter", unit: "°C", min: 0, max: 120, step: 0.1, info: "Plage 40 – 80 °C" },
      { kind: "number", id: "pression_eau", label: "Pression eau refroidissement", unit: "bar", min: 0, max: 10, step: 0.1 },
      { kind: "select", id: "niveau_huile", label: "Niveau d'huile", options: ["Haut", "Correct", "Bas"] },
      { kind: "select", id: "couleur_huile", label: "Couleur d'huile", options: ["Claire", "Ambrée", "Sombre", "Noire"] },
      { kind: "select", id: "bruit", label: "Bruit / vibration", options: ["Normal", "Anormal"] },
      { kind: "textarea", id: "remarques", label: "Remarques", placeholder: "Observations éventuelles…" },
    ],
  },
  compresseurs: {
    id: "compresseurs",
    title: "Compresseurs",
    subtitle: "Air comprimé, sécheur et condensats",
    fields: [
      { kind: "number", id: "pression_bac", label: "Pression bac", unit: "bar", min: 0, max: 15, step: 0.1, info: "Plage 6.5 – 8 bar" },
      { kind: "number", id: "temp_soufflante", label: "Température soufflante", unit: "°C", min: 0, max: 120, step: 0.1 },
      { kind: "number", id: "temp_point_rosee", label: "Point de rosée", unit: "°C", min: -40, max: 30, step: 0.1, info: "Cible < 3 °C" },
      { kind: "number", id: "heures_marche", label: "Heures de marche", unit: "h", min: 0, max: 100000, step: 1 },
      { kind: "select", id: "etat_secheur", label: "État sécheur", options: ["Normal", "Alarme", "Arrêt"] },
      { kind: "select", id: "condensats", label: "Purge condensats", options: ["OK", "À vérifier", "Bouché"] },
      { kind: "select", id: "filtre_air", label: "Filtre à air", options: ["Propre", "Encrassé", "À changer"] },
      { kind: "textarea", id: "remarques", label: "Remarques", placeholder: "Observations éventuelles…" },
    ],
  },
  glacee: {
    id: "glacee",
    title: "Eau glacée",
    subtitle: "Groupes froids, départs/retours et pressions",
    fields: [
      { kind: "number", id: "temp_depart_eg", label: "Température départ EG", unit: "°C", min: 0, max: 20, step: 0.1, info: "Plage 6 – 8 °C" },
      { kind: "number", id: "temp_retour_eg", label: "Température retour EG", unit: "°C", min: 0, max: 30, step: 0.1, info: "Plage 11 – 13 °C" },
      { kind: "number", id: "delta_t", label: "ΔT groupe froid", unit: "K", min: 0, max: 15, step: 0.1, info: "Plage 4 – 6 K" },
      { kind: "number", id: "pression_hp", label: "Pression HP", unit: "bar", min: 0, max: 40, step: 0.1 },
      { kind: "number", id: "pression_bp", label: "Pression BP", unit: "bar", min: 0, max: 15, step: 0.1 },
      { kind: "select", id: "etat_groupes", label: "État groupes", options: ["Normal", "Alarme", "Arrêt"] },
      { kind: "select", id: "fuites_circuit", label: "Fuites circuit frigorifique", options: ["Aucune", "Suspectée", "Confirmée"] },
      { kind: "textarea", id: "remarques", label: "Remarques", placeholder: "Observations éventuelles…" },
    ],
  },
  thermo: {
    id: "thermo",
    title: "Thermoventilation",
    subtitle: "CTA, filtres, températures et régulation",
    fields: [
      { kind: "number", id: "temp_soufflage", label: "Température soufflage", unit: "°C", min: 0, max: 60, step: 0.1, info: "Plage 17 – 22 °C" },
      { kind: "number", id: "temp_reprise", label: "Température reprise", unit: "°C", min: 0, max: 40, step: 0.1 },
      { kind: "number", id: "hygro", label: "Hygrométrie", unit: "%", min: 0, max: 100, step: 1, info: "Plage 40 – 60 %" },
      { kind: "select", id: "etat_filtres", label: "État filtres CTA", options: ["Propre", "Encrassé", "À changer"] },
      { kind: "select", id: "regulation", label: "Régulation", options: ["Auto", "Manuel", "Dégradé"] },
      { kind: "select", id: "bruit_cta", label: "Bruit / vibration CTA", options: ["Normal", "Anormal"] },
      { kind: "textarea", id: "remarques", label: "Remarques", placeholder: "Observations éventuelles…" },
    ],
  },
  groupes: {
    id: "groupes",
    title: "Groupes électrogènes",
    subtitle: "GE, niveau gasoil, batteries et mode veille",
    fields: [
      { kind: "number", id: "niveau_gasoil", label: "Niveau gasoil", unit: "%", min: 0, max: 100, step: 1, info: "Cible > 80 %" },
      { kind: "number", id: "tension_batteries", label: "Tension batteries", unit: "V", min: 0, max: 30, step: 0.1, info: "Plage 24 – 28 V" },
      { kind: "number", id: "heures_ge", label: "Compteur horaire GE", unit: "h", min: 0, max: 100000, step: 1 },
      { kind: "select", id: "mode_veille", label: "Mode veille", options: ["Auto", "Manuel", "HS"] },
      { kind: "select", id: "niveau_huile", label: "Niveau d'huile", options: ["Correct", "Bas"] },
      { kind: "select", id: "essai_mensuel", label: "Essai mensuel", options: ["Fait", "À faire"] },
      { kind: "textarea", id: "remarques", label: "Remarques", placeholder: "Observations éventuelles…" },
    ],
  },
  osmose: {
    id: "osmose",
    title: "Station d'osmose",
    subtitle: "Osmose inverse, perméat et concentrat",
    fields: [
      { kind: "number", id: "pression_pompe", label: "Pression pompe", unit: "bar", min: 0, max: 20, step: 0.1, info: "Plage 10 – 14 bar" },
      { kind: "number", id: "debit_permeat", label: "Débit perméat", unit: "L/min", min: 0, max: 100, step: 0.1 },
      { kind: "number", id: "debit_concentrat", label: "Débit concentrat", unit: "L/min", min: 0, max: 100, step: 0.1 },
      { kind: "number", id: "conductivite_permeat", label: "Conductivité perméat", unit: "µS/cm", min: 0, max: 100, step: 0.1, info: "Cible < 10 µS/cm" },
      { kind: "number", id: "conductivite_concentrat", label: "Conductivité concentrat", unit: "µS/cm", min: 0, max: 5000, step: 1 },
      { kind: "select", id: "etat_membranes", label: "État membranes", options: ["Bon", "À nettoyer", "À remplacer"] },
      { kind: "select", id: "fuites", label: "Fuites", options: ["Aucune", "Légère", "Importante"] },
      { kind: "textarea", id: "remarques", label: "Remarques", placeholder: "Observations éventuelles…" },
    ],
  },
};

export const CHECKLIST_ORDER = [
  "water",
  "surchauffee",
  "vapeur",
  "vide",
  "compresseurs",
  "glacee",
  "thermo",
  "groupes",
  "osmose",
] as const;

export function checklistLabel(id: string | null | undefined): string {
  if (!id) return "Générale";
  return CHECKLISTS[id]?.title ?? id;
}
