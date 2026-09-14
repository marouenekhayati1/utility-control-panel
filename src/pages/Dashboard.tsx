import { AppShell, useCurrentView } from "@/components/AppShell";
import { ChecklistGlyph } from "@/components/ChecklistGlyph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import {
  CHECKLISTS,
  CHECKLIST_ORDER,
  checklistLabel,
  type ChecklistField,
} from "@/lib/checklists";
import { POSTE_META, currentPoste, useNow } from "@/lib/poste";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  MoonStar,
  Save,
  ShieldAlert,
  Sun,
  Sunrise,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

/* ============================== Home view ============================== */

function HomeView({ user }: { user: ReturnType<typeof useAuth>["user"] }) {
  const now = useNow(30_000);
  const poste = currentPoste(now);
  const meta = POSTE_META[poste];
  const PosteIcon = poste === "nuit" ? MoonStar : poste === "matin" ? Sunrise : Sun;

  const openAnomalies = useQuery(api.anomalies.openCount, {});

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ClipboardCheck className="size-4" />
          Système de suivi des utilités et check-lists
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Tableau de bord
        </h1>
      </div>

      {/* Session controls */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="card-soft gap-3 py-4">
          <CardHeader className="pb-0">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              Technicien
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {(user?.name ?? "T").slice(0, 1).toUpperCase()}
            </span>
            <span className="truncate font-medium">{user?.name ?? "Technicien"}</span>
          </CardContent>
        </Card>

        <Card className="card-soft gap-3 py-4">
          <CardHeader className="pb-0">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              Poste (automatique)
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-primary/10">
              <PosteIcon className="size-5 text-primary" />
            </span>
            <span className="font-medium">{meta.label}</span>
          </CardContent>
        </Card>

        <Card className="card-soft gap-3 py-4">
          <CardHeader className="pb-0">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              Date et heure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <span className="font-medium tabular-nums">
              {now.toLocaleDateString("fr-FR")}{" "}
              {now.toLocaleTimeString("fr-FR")}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Checklist cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CHECKLIST_ORDER.map((id) => {
          const c = CHECKLISTS[id];
          return (
            <Link
              key={id}
              to={`/dashboard/checklist/${id}`}
              className="card-soft group relative flex flex-col gap-3 p-5 transition-colors hover:border-primary/40"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <ChecklistGlyph id={c.id} className="size-5" />
              </span>
              <h3 className="font-display text-base font-semibold">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.subtitle}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-primary">
                Ouvrir la check-list
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>

      {/* Open anomalies banner */}
      {typeof openAnomalies === "number" && openAnomalies > 0 && (
        <Link
          to="/dashboard/anomalies"
          className="card-soft flex items-center gap-4 border-warning/40 bg-warning/5 p-4 transition-colors hover:bg-warning/10"
        >
          <ShieldAlert className="size-6 shrink-0 text-warning" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              {openAnomalies} anomalie{openAnomalies > 1 ? "s" : ""} non résolue
              {openAnomalies > 1 ? "s" : ""}
            </p>
            <p className="text-sm text-muted-foreground">
              Consulter et traiter les anomalies déclarées.
            </p>
          </div>
          <ArrowRight className="size-5 shrink-0 text-muted-foreground" />
        </Link>
      )}
    </div>
  );
}

/* ============================ Checklist view ============================ */

type Values = Record<string, string>;

function isFieldOutOfRange(field: ChecklistField, value: string): boolean {
  if (!value) return false;
  if (field.kind === "number" && field.min !== undefined && field.max !== undefined) {
    const n = parseFloat(value);
    return Number.isFinite(n) && (n < field.min || n > field.max);
  }
  return false;
}

function ChecklistForm({ id }: { id: string }) {
  const def = CHECKLISTS[id];
  const { user } = useAuth();
  const now = useNow(30_000);
  const saveEntry = useMutation(api.checklists.saveEntry);
  const [values, setValues] = useState<Values>({});
  const [saving, setSaving] = useState(false);

  if (!def) {
    return (
      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Check-list introuvable</CardTitle>
          <CardDescription>
            Cette check-list n&apos;existe pas. <Link to="/dashboard" className="text-primary underline">Retour au tableau de bord</Link>.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const numericFields = def.fields.filter(
    (f): f is Extract<ChecklistField, { kind: "number" }> =>
      f.kind === "number" && f.min !== undefined && f.max !== undefined,
  );
  const outOfRange = numericFields.filter((f) => isFieldOutOfRange(f, values[f.id] ?? ""));

  const setValue = (fid: string, v: string) =>
    setValues((prev) => ({ ...prev, [fid]: v }));

  const missingRequired = numericFields.some((f) => !values[f.id]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await saveEntry({
        checklistId: id,
        values,
        anomaliesCount: outOfRange.length,
        totalFields: def.fields.length,
        technicien: user?.name ?? "Technicien",
        poste: currentPoste(now),
      });
      toast.success("Relevé enregistré", {
        description:
          outOfRange.length > 0
            ? `${outOfRange.length} valeur(s) hors plage signalée(s).`
            : "Toutes les valeurs sont dans les plages cibles.",
      });
      setValues({});
    } catch {
      toast.error("Erreur lors de l'enregistrement du relevé.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Tableau de bord
        </Link>
        <h1 className="mt-1 flex items-center gap-3 font-display text-3xl font-bold tracking-tight">
          <ChecklistGlyph id={id} className="size-7 text-primary" /> {def.title}
        </h1>
        <p className="mt-1 text-muted-foreground">{def.subtitle}</p>
      </div>

      <Card className="card-soft gap-0 overflow-hidden py-0">
        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {def.fields.map((field) => {
            const value = values[field.id] ?? "";
            const bad = isFieldOutOfRange(field, value);

            return (
              <div key={field.id} className="flex flex-col gap-2">
                <Label htmlFor={field.id} className="text-[13px]">
                  {field.label}
                  {field.kind === "number" && field.unit ? (
                    <span className="ml-1 text-muted-foreground">({field.unit})</span>
                  ) : null}
                </Label>

                {field.kind === "number" && (
                  <Input
                    id={field.id}
                    type="number"
                    inputMode="decimal"
                    step={field.step ?? 1}
                    value={value}
                    onChange={(e) => setValue(field.id, e.target.value)}
                    className={bad ? "border-destructive focus-visible:ring-destructive/30" : ""}
                    placeholder="—"
                  />
                )}

                {field.kind === "text" && (
                  <Input
                    id={field.id}
                    value={value}
                    onChange={(e) => setValue(field.id, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}

                {field.kind === "textarea" && (
                  <Textarea
                    id={field.id}
                    rows={3}
                    value={value}
                    onChange={(e) => setValue(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="sm:col-span-2 lg:col-span-3"
                  />
                )}

                {field.kind === "select" && (
                  <Select value={value} onValueChange={(v) => setValue(field.id, v)}>
                    <SelectTrigger id={field.id} className="w-full">
                      <SelectValue placeholder="Sélectionner…" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {field.kind === "boolean" && (
                  <label className="flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm">
                    <Checkbox
                      checked={value === "Oui"}
                      onCheckedChange={(c) => setValue(field.id, c ? "Oui" : "")}
                    />
                    Conforme
                  </label>
                )}

                {field.info && (
                  <p className="text-xs text-muted-foreground">{field.info}</p>
                )}
                {bad && (
                  <p className="flex items-center gap-1 text-xs font-semibold text-destructive">
                    <TriangleAlert className="size-3.5" /> Valeur hors plage
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Submission bar */}
        <div className="flex flex-col gap-3 border-t bg-muted/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {outOfRange.length > 0 ? (
              <span className="flex items-center gap-1.5 font-medium text-warning">
                <TriangleAlert className="size-4" />
                {outOfRange.length} valeur(s) hors plage — pensez à déclarer une anomalie.
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-success">
                <CheckCircle2 className="size-4" />
                {missingRequired ? "Complétez les mesures pour valider." : "Toutes les valeurs sont dans les plages cibles."}
              </span>
            )}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setValues({})} disabled={saving}>
              Réinitialiser
            </Button>
            <Button onClick={handleSubmit} disabled={saving || missingRequired}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Enregistrer le relevé
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ============================= History view ============================= */

type EntryDoc = {
  _id: string;
  checklistId: string;
  values: Record<string, string>;
  anomaliesCount: number;
  totalFields: number;
  technicien: string;
  poste: string;
  createdAt: number;
};

function HistoryView() {
  const [filter, setFilter] = useState<string>("all");
  const [limit, setLimit] = useState<string>("50");
  const all = useQuery(api.checklists.listEntries, {});
  const filtered = useMemo(() => {
    if (!all) return undefined;
    const rows = filter === "all" ? all : all.filter((e) => e.checklistId === filter);
    return rows.slice(0, Number(limit));
  }, [all, filter, limit]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Historique des relevés
        </h1>
        <p className="mt-1 text-muted-foreground">
          {filtered === undefined
            ? "Chargement…"
            : `${filtered.length} relevé(s) affiché(s)`}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-col gap-1.5 sm:w-64">
          <Label className="text-xs text-muted-foreground">Filtrer par check-list</Label>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les check-lists</SelectItem>
              {CHECKLIST_ORDER.map((id) => (
                <SelectItem key={id} value={id}>
                  {CHECKLISTS[id].title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5 sm:w-44">
          <Label className="text-xs text-muted-foreground">Nombre de lignes</Label>
          <Select value={limit} onValueChange={setLimit}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">50 derniers</SelectItem>
              <SelectItem value="100">100 derniers</SelectItem>
              <SelectItem value="500">500 derniers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="card-soft gap-0 overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Date</TableHead>
              <TableHead>Check-list</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Technicien</TableHead>
              <TableHead className="text-right">Mesures</TableHead>
              <TableHead>Anomalies</TableHead>
              <TableHead>Détails</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered === undefined ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  <Loader2 className="mx-auto size-5 animate-spin" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Aucun relevé pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((e: EntryDoc) => (
                <TableRow key={e._id}>
                  <TableCell className="whitespace-nowrap tabular-nums">
                    {new Date(e.createdAt).toLocaleString("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium">
                    <span className="inline-flex items-center gap-2">
                      <ChecklistGlyph id={e.checklistId} className="size-4 text-muted-foreground" />
                      {checklistLabel(e.checklistId)}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap capitalize">
                    {e.poste}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{e.technicien}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {Object.keys(e.values ?? {}).length} / {e.totalFields}
                  </TableCell>
                  <TableCell>
                    {e.anomaliesCount > 0 ? (
                      <Badge className="gap-1 bg-destructive/15 text-destructive">
                        <TriangleAlert className="size-3" /> {e.anomaliesCount}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1 text-success">
                        <CheckCircle2 className="size-3" /> 0
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DetailsDialog entry={e} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function DetailsDialog({ entry }: { entry: EntryDoc }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Voir
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChecklistGlyph id={entry.checklistId} className="size-4 text-primary" />
            {checklistLabel(entry.checklistId)}
          </DialogTitle>
          <DialogDescription>
            {new Date(entry.createdAt).toLocaleString("fr-FR")} — Poste{" "}
            {entry.poste} — {entry.technicien}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          {Object.entries(entry.values ?? {}).map(([k, v]) => {
            const def = CHECKLISTS[entry.checklistId];
            const f = def?.fields.find((x) => x.id === k);
            const label = f?.label ?? k;
            const unit = f?.kind === "number" && f.unit ? ` (${f.unit})` : "";
            return (
              <div
                key={k}
                className="flex items-start justify-between gap-4 rounded-lg border bg-muted/30 px-3 py-2 text-sm"
              >
                <span className="text-muted-foreground">{label}{unit}</span>
                <span className="text-right font-medium">{String(v)}</span>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ============================ Anomalies view ============================ */

type AnomalieDoc = {
  _id: string;
  title: string;
  description?: string;
  checklistId?: string;
  priority: string;
  status: string;
  declaredBy: string;
  createdAt: number;
  resolvedAt?: number;
};

const STATUS_META: Record<string, { label: string; cls: string }> = {
  ouverte: { label: "Ouverte", cls: "bg-destructive/15 text-destructive" },
  "en cours": { label: "En cours", cls: "bg-warning/15 text-warning" },
  resolue: { label: "Résolue", cls: "bg-success/15 text-success" },
};

/** Quiet colored dot for a status/priority value. */
function StatusDot({ tone }: { tone: "error" | "warning" | "success" | "muted" }) {
  const cls =
    tone === "error"
      ? "bg-destructive"
      : tone === "warning"
        ? "bg-warning"
        : tone === "success"
          ? "bg-success"
          : "bg-muted-foreground/40";
  return <span className={`inline-block size-2 shrink-0 rounded-full ${cls}`} />;
}

const PRIORITY_CLS: Record<string, string> = {
  Critique: "text-destructive font-semibold",
  Urgente: "text-warning font-semibold",
  Normale: "text-muted-foreground",
};

function AnomaliesView() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const anomalies = useQuery(api.anomalies.list, { status: statusFilter === "all" ? undefined : statusFilter });
  const declareAno = useMutation(api.anomalies.declare);
  const setStatus = useMutation(api.anomalies.setStatus);

  const [title, setTitle] = useState("");
  const [checklistId, setChecklistId] = useState<string>("none");
  const [priority, setPriority] = useState("Normale");
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const rows = useMemo(() => {
    if (!anomalies) return undefined;
    return statusFilter === "all" ? anomalies : anomalies.filter((a) => a.status === statusFilter);
  }, [anomalies, statusFilter]);

  const openCount = rows?.filter((a) => a.status !== "resolue").length ?? 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Veuillez saisir un titre.");
      return;
    }
    setSubmitting(true);
    try {
      await declareAno({
        title: title.trim(),
        description: desc.trim() || undefined,
        checklistId: checklistId === "none" ? undefined : checklistId,
        priority,
      });
      toast.success("Anomalie déclarée");
      setTitle("");
      setDesc("");
      setChecklistId("none");
      setPriority("Normale");
    } catch {
      toast.error("Erreur lors de la déclaration.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Anomalies</h1>
        <p className="mt-1 text-muted-foreground">
          {rows === undefined
            ? "Chargement…"
            : `${rows.length} anomalie(s) — dont ${openCount} non résolue(s)`}
        </p>
      </div>

      {/* Declare form */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldAlert className="size-5 text-destructive" />
            Déclarer une anomalie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2 sm:col-span-1">
              <Label htmlFor="ano-title">Titre de l&apos;anomalie *</Label>
              <Input
                id="ano-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Fuite d'air compresseur 3"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Check-list concernée</Label>
              <Select value={checklistId} onValueChange={setChecklistId}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Générale</SelectItem>
                  {CHECKLIST_ORDER.map((id) => (
                    <SelectItem key={id} value={id}>
                      {CHECKLISTS[id].title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Priorité</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normale">Normale</SelectItem>
                  <SelectItem value="Urgente">Urgente</SelectItem>
                  <SelectItem value="Critique">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 sm:col-span-3">
              <Label htmlFor="ano-desc">Description détaillée</Label>
              <Textarea
                id="ano-desc"
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Décrivez l'anomalie constatée…"
              />
            </div>
            <div className="flex justify-end sm:col-span-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <AlertTriangle className="size-4" />}
                Déclarer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Filter + table */}
      <div className="flex flex-col gap-3 sm:w-64">
        <Label className="text-xs text-muted-foreground">Filtrer par statut</Label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="ouverte">Ouvertes</SelectItem>
            <SelectItem value="en cours">En cours</SelectItem>
            <SelectItem value="resolue">Résolues</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="card-soft gap-0 overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Date</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Check-list</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Déclarée par</TableHead>
              <TableHead>Résolue le</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows === undefined ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  <Loader2 className="mx-auto size-5 animate-spin" />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  Aucune anomalie pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((a: AnomalieDoc) => {
                const st = STATUS_META[a.status] ?? STATUS_META.ouverte;
                return (
                  <TableRow key={a._id}>
                    <TableCell className="whitespace-nowrap tabular-nums">
                      {new Date(a.createdAt).toLocaleString("fr-FR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell className="max-w-64">
                      <span className="font-medium">{a.title}</span>
                      {a.description ? (
                        <span className="block truncate text-xs text-muted-foreground">
                          {a.description}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {a.checklistId ? checklistLabel(a.checklistId) : "Générale"}
                    </TableCell>
                    <TableCell className={PRIORITY_CLS[a.priority] ?? ""}>
                      {a.priority}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1.5 border-transparent font-medium">
                        <StatusDot tone={a.status === "ouverte" ? "error" : a.status === "en cours" ? "warning" : "success"} />
                        {st.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{a.declaredBy}</TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">
                      {a.resolvedAt
                        ? new Date(a.resolvedAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {a.status === "ouverte" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setStatus({ id: a._id as Id<"anomalies">, status: "en cours" })}
                        >
                          Prendre en charge
                        </Button>
                      ) : a.status === "en cours" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-success"
                          onClick={() => setStatus({ id: a._id as Id<"anomalies">, status: "resolue" })}
                        >
                          Marquer résolue
                        </Button>
                      ) : (
                        <CheckCircle2 className="size-4 text-success" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

/* ================================ Page ================================= */

export default function Dashboard() {
  const { user } = useAuth();
  const view = useCurrentView();

  let content: React.ReactNode;
  if (view.kind === "checklist") content = <ChecklistForm id={view.id} />;
  else if (view.kind === "history") content = <HistoryView />;
  else if (view.kind === "anomalies") content = <AnomaliesView />;
  else content = <HomeView user={user} />;

  return (
    <AppShell view={view}>
      {content}
    </AppShell>
  );
}
