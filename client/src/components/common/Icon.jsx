import {
  Wifi, Car, Waves, PawPrint, Tv, Snowflake, Droplets, Wind, Bath, Package,
  Shirt, Laptop, Sun, BellRing, Flame, KeyRound, Sparkles, CookingPot,
  WashingMachine, Star, Heart, Share, Globe, Menu, Search, LayoutGrid,
  Minus, Plus, MapPin, ChevronDown, ChevronLeft, ChevronRight, X, Bed,
  UserRound, Circle,
  Award, Tag, Flag, CalendarX, Shield, SprayCan, CircleCheck, MessageSquare, Camera, Dumbbell, Keyboard, House,
  Map, Cake, GraduationCap, BadgeCheck, Fan, Tent, DoorOpen, Languages,
} from 'lucide-react';

/**
 * Single icon surface for the whole app.
 *
 * The reference inlines 59 SVGs with zero sprite reuse — 48.9 KB of duplicated
 * markup (ASSET_INVENTORY.md §5). We use a tree-shaken library instead
 * (TECHNICAL_ARCHITECTURE.md §9.7) and drive colour from currentColor so the
 * single `--color-ink` token controls every glyph.
 *
 * Measured sizes: 24px for amenity rows, 16px for inline controls,
 * 12px for lightbox chevrons.
 */
const ICONS = {
  // amenities
  kitchen: CookingPot,
  wifi: Wifi,
  car: Car,
  pool: Waves,
  pet: PawPrint,
  tv: Tv,
  washer: WashingMachine,
  snowflake: Snowflake,
  droplet: Droplets,
  hairdryer: Wind,
  bottle: Bath,
  essentials: Package,
  hanger: Shirt,
  iron: Shirt,
  desk: Laptop,
  balcony: Sun,
  alarm: BellRing,
  heat: Flame,
  // highlights
  key: KeyRound,
  sparkle: Sparkles,
  // ui
  star: Star,
  heart: Heart,
  share: Share,
  globe: Globe,
  menu: Menu,
  search: Search,
  grid: LayoutGrid,
  minus: Minus,
  plus: Plus,
  pin: MapPin,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  close: X,
  bed: Bed,
  user: UserRound,
  // reviews / host / policies / promo
  laurel: Award,
  tag: Tag,
  flag: Flag,
  calendarX: CalendarX,
  shield: Shield,
  spray: SprayCan,
  'check-circle': CircleCheck,
  message: MessageSquare,
  map: Map,
  cake: Cake,
  school: GraduationCap,
  verified: BadgeCheck,
  fan: Fan,
  outdoor: Tent,
  door: DoorOpen,
  translate: Languages,
  camera: Camera,
  bath: Bath,
  gym: Dumbbell,
  keyboard: Keyboard,
  house: House,
};

export default function Icon({ name, size = 24, className, strokeWidth = 1.5, filled = false }) {
  const Glyph = ICONS[name] ?? Circle;
  return (
    <Glyph
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      className={className}
      {...(filled ? { fill: 'currentColor' } : {})}
    />
  );
}
