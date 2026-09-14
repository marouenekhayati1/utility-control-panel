import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  Activity,
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  Droplets,
  Factory,
  Gauge,
  ShieldAlert,
  Snowflake,
  Timer,
  Wind,
  Zap,
} from "lucide-react";
import { Link } from "react-router";

const UTILITIES = [
  { icon: Droplets, label: "Traitement d'eau" },
  { icon: Factory, label: "Eau surchauffée" },
  { icon: Gauge, label: "Chaudière vapeur" },
  { icon: ClipboardCheck, label: "Pompe à vide" },
  { icon: Wind, label: "Compresseurs" },
  { icon: Snowflake, label: "Eau glacée" },
  { icon: Timer, label: "Thermoventilation" },
  { icon: Zap, label: "Groupes électrogènes" },
  { icon: Activity, label: "Station d'osmose" },
];

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: "Check-lists guidées",
    text: "9 check-lists d'utilités avec plages cibles : chaque valeur hors plage est détectée en temps réel pendant la saisie.",
  },
  {
    icon: Timer,
    title: "Poste automatique",
    text: "Nuit, matin ou après-midi : le poste est détecté automatiquement et horodaté sur chaque relevé.",
  },
  {
    icon: BarChart3,
    title: "Historique complet",
    text: "Tout l'historique des mesures est conservé, filtrable par installation et consultable mesure par mesure.",
  },
  {
    icon: ShieldAlert,
    title: "Anomalies suivies",
    text: "Déclarez, qualifiez et suivez les anomalies jusqu'à résolution, avec priorités et responsibles clairs.",
  },
];

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Gauge className="size-5" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Utilities<span className="text-primary"> Control</span>
            </span>
          </div>
          <nav className="flex items-center gap-2">
            {isLoading ? null : isAuthenticated ? (
              <Button asChild>
                <Link to="/dashboard">
                  Tableau de bord <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/auth">Se connecter</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-grid-pattern absolute inset-0" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
          <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
            <Factory className="size-3.5 text-primary" />
            Suivi des utilités industrielles
          </Badge>
          <h1 className="text-balance mt-6 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Vos utilités sous contrôle,{" "}
            <span className="text-primary">tour après tour</span>
          </h1>
          <p className="text-balance mt-5 max-w-2xl text-lg text-muted-foreground">
            Check-lists guidées, relevés horodatés, détection des valeurs hors
            plage et suivi des anomalies — la tour de contrôle de vos fluides et
            de vos énergies.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-7 text-base">
              <Link to="/auth">
                Commencer maintenant <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base">
              <Link to="/dashboard">Voir le tableau de bord</Link>
            </Button>
          </div>

          {/* Utility chips */}
          <div className="mt-14 flex max-w-4xl flex-wrap justify-center gap-2.5">
            {UTILITIES.map((u) => (
              <span
                key={u.label}
                className="card-soft inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <u.icon className="size-4 text-primary" />
                {u.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-balance mx-auto max-w-2xl text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Pensé pour le terrain, pas pour la paperasse
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            Un outil simple et rapide, utilisable entre deux rondes, sur
            ordinateur comme sur mobile.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <Card key={f.title} className="card-soft gap-3">
                <CardContent className="flex flex-col gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="font-display text-base font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="card-soft relative overflow-hidden rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(1_0_0/0.14),transparent_60%)]" />
          <h2 className="relative font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Prêt à digitaliser vos rondes ?
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-primary-foreground/85">
            Créez votre accès en quelques secondes — votre technicien n'a plus
            qu'à saisir ses relevés.
          </p>
          <Button asChild size="lg" variant="secondary" className="relative mt-8 h-12 px-8 text-base">
            <Link to="/auth">
              Créer mon accès <ArrowRight className="size-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <span className="inline-flex items-center gap-2">
            <Gauge className="size-4 text-primary" />
            Utilities Control — suivi des utilités
          </span>
          <span>Relevés · Anomalies · Historique</span>
        </div>
      </footer>
    </div>
  );
}
