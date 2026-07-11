import {
  Zap,
  DollarSign,
  Clock,
  Cpu,
  MemoryStick,
  Gauge,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Info,
  Target,
  Layers,
  GitBranch,
  Scale,
  Shield,
  Sparkles,
  ListChecks,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Wrench,
  Database,
  Server,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import type { CheatIconName } from "@/lib/cheatsheet-schema";

/**
 * The single lookup for icons that content authors select dynamically via a CheatIconName
 * string (the icon/*.json fields validated by CHEAT_ICON_NAMES). Fixed, non-authorable icons
 * used by a specific widget (e.g. StarRating's star, ChecklistBox's check, TakeawayList's
 * sparkle) import directly from lucide-react instead, since routing them through this map
 * would add indirection without giving authors any actual choice.
 */
export const cheatIcons: Record<CheatIconName, LucideIcon> = {
  zap: Zap,
  "dollar-sign": DollarSign,
  clock: Clock,
  cpu: Cpu,
  "memory-stick": MemoryStick,
  gauge: Gauge,
  lightbulb: Lightbulb,
  "check-circle-2": CheckCircle2,
  "alert-triangle": AlertTriangle,
  info: Info,
  target: Target,
  layers: Layers,
  "git-branch": GitBranch,
  scale: Scale,
  shield: Shield,
  sparkles: Sparkles,
  "list-checks": ListChecks,
  "help-circle": HelpCircle,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  wrench: Wrench,
  database: Database,
  server: Server,
  rocket: Rocket,
};
