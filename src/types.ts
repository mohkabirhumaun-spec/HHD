export type Language = 'en' | 'bn';

export type ShellMode = 'auto' | 'desktop' | 'mobile';

export type MobileTab = 'home' | 'ncd-hub' | 'thalassemia' | 'dashboard' | 'bd-access';

export type DesktopRoute =
  | 'intelligence-dashboard'
  | 'preventive-hub'
  | 'genetics-and-thalassemia'
  | 'research-and-evidence'
  | 'field-operations'
  | 'bangladesh-access'
  | 'outbreak-alerts';

export type GenotypeOption = 'normal' | 'beta-thal' | 'hbe' | 'unknown';

export type ConsanguinityOption = 'unrelated' | 'first-cousin' | 'second-cousin';

export interface FacilityItem {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  division: string;
  district: string;
  geoZone: string;
  address: string;
  governanceTier: 'apex' | 'sadar' | 'uhc' | 'ngo';
  governanceBadge: string;
  secondaryBadges: string[];
  verifiedLabel: string;
  tariffBracket: 'free' | 'subsidized' | 'zakat' | 'counseling';
  costDisplay: string;
  costNote: string;
  hours: string;
  appointmentInfo: string;
  phone: string;
  phoneDisplay: string;
  image: string;
  imageAlt: string;
  icon: string;
  accentColor: 'tertiary' | 'secondary' | 'primary';
  specialties: ('hplc' | 'via' | 'ncd' | 'counseling' | 'blood' | 'cbc' | 'prenatal')[];
  capabilityTags: string[];
  detailedCapabilities: string[];
}

export interface NcdTopicCard {
  id: string;
  categoryLabel: string;
  title: string;
  badge: string;
  tags: ('cardio' | 'diabetes' | 'cancer' | 'metabolic' | 'mental' | 'tobacco')[];
  icon: string;
  accent: 'secondary' | 'tertiary' | 'primary';
  image?: string;
  imageAlt?: string;
  imageOverlayLabel?: string;
  imageOverlayIcon?: string;
  contextHeading: string;
  contextBody: string;
  expandedProtocol: string[];
  footerMeta: string;
  ctaLabel: string;
}

export interface FactsheetItem {
  id: string;
  tag: string;
  formatLabel: string;
  title: string;
  subtitle: string;
  description: string;
  size: string;
  language: string;
}

export interface ResearchPaper {
  id: string;
  category: string;
  date: string;
  title: string;
  authors: string;
  affiliation: string;
  doi: string;
  size: string;
  quote: string;
  abstract: string;
  keyFindings: string[];
}

export interface TelemetryDispatch {
  id: string;
  division: string;
  regionHeader: string;
  timestamp: string;
  title: string;
  summary: string;
  nodeLabel: string;
  nodeIcon: string;
  metricA: string;
  metricB: string;
  accent: 'secondary' | 'tertiary' | 'primary';
}
