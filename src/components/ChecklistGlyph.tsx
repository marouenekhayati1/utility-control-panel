import {
  ClipboardList,
  Cloudy,
  Droplets,
  Filter,
  Flame,
  Snowflake,
  Thermometer,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";

const GLYPHS = {
  water: Droplets,
  surchauffee: Flame,
  vapeur: Cloudy,
  vide: Wrench,
  compresseurs: Wind,
  glacee: Snowflake,
  thermo: Thermometer,
  groupes: Zap,
  osmose: Filter,
} as const;

/** Small line icon for a check-list id — keeps the UI consistent and quiet. */
export function ChecklistGlyph({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const Icon = GLYPHS[id as keyof typeof GLYPHS] ?? ClipboardList;
  return <Icon className={className ?? "size-4"} />;
}
