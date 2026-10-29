import React, { useState } from 'react';
import {
  DIVISION_STATS,
  HOTLINKED_ASSETS,
  NCD_TOPIC_CARDS,
  PATIENT_FACTSHEETS,
  RESEARCH_PAPERS,
  TELEMETRY_DISPATCHES,
  VERIFIED_FACILITIES,
  calculateMendelianOutcome,
} from '../data/healthData';
import {
  FactsheetItem,
  GenotypeOption,
  Language,
  MobileTab,
  ResearchPaper,
} from '../types';
import { ResilientImage } from './ResilientImage';

interface MobileShellProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  language: Language;
  onToggleLanguage: () => void;
  onOpenSearch: () => void;
  onOpenPedigree: () => void;
  onOpenQuiz: () => void;
  onOpenVitals: () => void;
  onOpenPaper: (paper: ResearchPaper) => void;
  onOpenCounseling: () => void;
  onOpenSuggestFacility: () => void;
  onDownloadFactsheet: (item: FactsheetItem) => void;
  onExportCsv: () => void;
  onToast: (title: string, msg: string) => void;
  isDesktopPreview?: boolean;
  onSwitchToDesktop?: () => void;
}

export const MobileShell: React.FC<MobileShellProps> = ({
  activeTab,
  onSelectTab,
  language,
  onToggleLanguage,
  onOpenSearch,
  onOpenPedigree,
  onOpenQuiz,
  onOpenVitals,
  onOpenPaper,
  onOpenCounseling,
  onOpenSuggestFacility,
  onDownloadFactsheet,
  onExportCsv,
  onToast,
  isDesktopPreview = false,
  onSwitchToDesktop,
}) => {
  /* Screen 2 (Genetics / Thalassemia) local state */
  const [genSubTab, setGenSubTab] = useState<'inheritance' | 'screening' | 'pathway' | 'directory'>('inheritance');
  const [maternalGeno, setMaternalGeno] = useState<GenotypeOption>('beta-thal');
  const [paternalGeno, setPaternalGeno] = useState<GenotypeOption>('beta-thal');
  const [genDivisionFilter, setGenDivisionFilter] = useState<string>('All');

  /* Screen 3 (NCD Hub) local state */
  const [ncdSearch, setNcdSearch] = useState<string>('');
  const [ncdCategory, setNcdCategory] = useState<string>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['hypertension']);
  const [expandedNcdId, setExpandedNcdId] = useState<string | null>(null);
  const [ncdQuizStep, setNcdQuizStep] = useState<number>(1);
  const [ncdSaltHabit, setNcdSaltHabit] = useState<'yes' | 'no'>('yes');
  const [ncdWalkHabit, setNcdWalkHabit] = useState<'low' | 'good'>('low');

  /* Screen 4 (Impact Dashboard) local state */
  const [impactMode, setImpactMode] = useState<'public' | 'expert'>('public');
  const [selectedDivChip, setSelectedDivChip] = useState<string>('all');

  /* Screen 5 (BD Access Directory) local state */
  const [dirDivision, setDirDivision] = useState<string>('All');
  const [dirDistrict, setDirDistrict] = useState<string>('All');
  const [dirCapability, setDirCapability] = useState<string>('all');
  const [dirViewMode, setDirViewMode] = useState<'list' | 'map'>('list');

  const mendelian = calculateMendelianOutcome(maternalGeno, paternalGeno);

  const toggleBookmark = (id: string, title: string) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      onToast(
        exists ? 'Removed from Saved Guides' : 'Saved to Offline Guidebook',
        `${title} ${exists ? 'removed' : 'pinned for clinic reference'}.`
      );
      return next;
    });
  };

  /* Filtered NCD cards for Screen 3 */
  const filteredNcdCards = NCD_TOPIC_CARDS.filter((c) => {
    const matchesCat = ncdCategory === 'all' || c.tags.includes(ncdCategory as never);
    const q = ncdSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.contextBody.toLowerCase().includes(q) ||
      c.categoryLabel.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  /* Filtered Facilities for Screen 2 */
  const genCenters = VERIFIED_FACILITIES.filter(
    (f) =>
      f.specialties.includes('hplc') &&
      (genDivisionFilter === 'All' || f.division === genDivisionFilter)
  );

  /* Filtered Facilities for Screen 5 */
  const accessCenters = VERIFIED_FACILITIES.filter((f) => {
    const matchDiv = dirDivision === 'All' || f.division === dirDivision;
    const matchDist = dirDistrict === 'All' || f.district === dirDistrict;
    const matchCap =
      dirCapability === 'all' || f.specialties.includes(dirCapability as never);
    return matchDiv && matchDist && matchCap;
  });

  const activeDivStat =
    selectedDivChip === 'all'
      ? null
      : DIVISION_STATS.find((d) => d.id === selectedDivChip) || null;

  return (
    <div
      className={`min-h-screen bg-surface text-on-surface flex flex-col ${
        isDesktopPreview
          ? 'max-w-[430px] mx-auto shadow-2xl border-x border-outline-variant/30 relative'
          : 'w-full'
      }`}
    >
      {/* Desktop Mobile-Preview Ribbon */}
      {isDesktopPreview && onSwitchToDesktop && (
        <div className="bg-primary-container text-on-primary px-3 py-2 flex items-center justify-between text-xs border-b border-on-primary/10">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary-fixed text-[16px]">
              smartphone
            </span>
            <span className="font-semibold">Mobile App Shell (Screens 1–5)</span>
          </div>
          <button
            type="button"
            onClick={onSwitchToDesktop}
            className="px-2.5 py-1 rounded bg-secondary text-on-secondary font-semibold hover:opacity-90 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
            <span>Web Dashboard</span>
          </button>
        </div>
      )}

      {/* Top App Header (Matches Screens 1–5) */}
      <header className="sticky top-0 z-40 h-16 bg-surface/90 backdrop-blur-xl border-b border-surface-container px-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center overflow-hidden shadow-sm shrink-0">
            <ResilientImage
              src={HOTLINKED_ASSETS.logo}
              alt="HHD Intelligence Emblem"
              className="w-full h-full object-cover"
              fallbackIcon="health_and_safety"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-title-md text-primary font-extrabold leading-tight tracking-tight">
              {language === 'bn' ? 'এইচএইচডি ইন্টেলিজেন্স' : 'HHD Intelligence'}
            </span>
            <span className="font-label-sm text-[10px] text-secondary font-semibold uppercase tracking-wider">
              {language === 'bn' ? 'জনস্বাস্থ্য ও জেনেটিক্স • বিডি' : 'Public Health & Genetics • BD'}
            </span>
          </div>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleLanguage}
            className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-sm text-label-sm font-bold border border-outline-variant/30 transition-colors"
            title="Switch Language (English / বাংলা)"
          >
            {language === 'en' ? 'EN | বাং' : 'বাং | EN'}
          </button>
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search health directory and protocols"
            className="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-primary"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-secondary/40 shrink-0">
            <ResilientImage
              src={HOTLINKED_ASSETS.profileAvatar}
              alt="Clinical Reviewer Avatar"
              className="w-full h-full object-cover"
              fallbackIcon="person"
            />
          </div>
        </div>
      </header>

      {/* Main Scrollable Screen Body */}
      <main className="flex-1 pb-24">
        {/* =========================================================
            SCREEN 1: HOME (Image_1 / Image_2)
           ========================================================= */}
        {activeTab === 'home' && (
          <div className="flex flex-col gap-5 p-4">
            {/* Urgent National Campaign 2025 Hero Card */}
            <section className="rounded-2xl bg-gradient-to-br from-primary via-primary-container to-[#083558] text-on-primary p-5 shadow-md relative overflow-hidden">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/25 border border-secondary-fixed/30 text-secondary-fixed font-label-sm text-[11px] font-bold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
                <span>
                  {language === 'bn'
                    ? 'জাতীয় প্রচারাভিযান ২০২৫ • থ্যালাসেমিয়া মুক্ত বাংলাদেশ'
                    : 'National Campaign 2025 • DGHS Verified'}
                </span>
              </div>

              <h1 className="font-display-md text-[28px] leading-[1.15] font-extrabold tracking-tight mb-2.5">
                {language === 'bn'
                  ? 'আজই প্রতিরোধ করুন। আগামী প্রজন্মকে সুরক্ষিত রাখুন।'
                  : 'Prevent Today. Protect Tomorrow.'}
              </h1>
              <p className="font-body-sm text-body-sm text-on-primary/85 leading-relaxed mb-4">
                {language === 'bn'
                  ? 'বাংলাদেশে প্রতি ৯ জনে ১ জন নীরব থ্যালাসেমিয়া বা HbE বাহক। বিয়ের আগে একটিমাত্র HPLC রক্ত পরীক্ষা ও জীবনযাত্রার সচেতনতা পরিবারকে আজীবন সুরক্ষা দেয়।'
                  : 'Empowering families across all 64 districts of Bangladesh with compassionate pre-marital genetic screening, NCD prevention, and verified public clinical access.'}
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onSelectTab('thalassemia')}
                  className="px-3.5 py-2.5 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 shadow-sm hover:opacity-95"
                >
                  <span className="material-symbols-outlined text-[18px]">genetics</span>
                  <span>Thalassemia Guide</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTab('bd-access')}
                  className="px-3.5 py-2.5 rounded-xl bg-on-primary/12 hover:bg-on-primary/20 text-on-primary border border-on-primary/20 font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  <span>Find HPLC Lab</span>
                </button>
              </div>
            </section>

            {/* 2x2 National Coverage KPI Grid */}
            <section className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <h2 className="font-title-md text-title-md text-primary font-bold">
                  National Surveillance Snapshot
                </h2>
                <span className="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  64 Districts Live
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col gap-1">
                  <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">
                    Citizens Reached
                  </span>
                  <span className="font-headline-md text-[22px] font-extrabold text-primary tabular-nums">
                    1.42M+
                  </span>
                  <span className="font-label-sm text-[11px] text-secondary font-semibold">
                    +14.2% YoY Outreach
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col gap-1">
                  <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">
                    Carrier Rate (BD)
                  </span>
                  <span className="font-headline-md text-[22px] font-extrabold text-tertiary tabular-nums">
                    10–12%
                  </span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant">
                    HbE &amp; β-Thal Silent Trait
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col gap-1">
                  <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">
                    Verified Centers
                  </span>
                  <span className="font-headline-md text-[22px] font-extrabold text-secondary tabular-nums">
                    64 Dist.
                  </span>
                  <span className="font-label-sm text-[11px] text-secondary font-semibold">
                    28 HPLC Reference Nodes
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col gap-1">
                  <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">
                    Prevention Dividend
                  </span>
                  <span className="font-headline-md text-[22px] font-extrabold text-primary tabular-nums">
                    18x ROI
                  </span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant">
                    91.4% Catastrophic Cost Saved
                  </span>
                </div>
              </div>
            </section>

            {/* Strategic Programs Cards */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="font-title-md text-title-md text-primary font-bold">
                  Strategic Clinical Programs
                </h2>
                <span className="font-label-sm text-label-sm text-outline">3 Pillars</span>
              </div>

              {/* Card 1: Genetics & Thalassemia */}
              <div className="rounded-xl bg-surface-container-lowest border border-surface-container overflow-hidden shadow-xs">
                <div className="h-36 relative">
                  <ResilientImage
                    src={HOTLINKED_ASSETS.geneticsHero}
                    alt="Genetic counseling and hemoglobin electrophoresis screening"
                    className="w-full h-full object-cover"
                    fallbackIcon="genetics"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex items-end p-3">
                    <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[10px] font-bold uppercase">
                      Genetic Prevention • Priority 1
                    </span>
                  </div>
                </div>
                <div className="p-3.5 flex flex-col gap-2">
                  <h3 className="font-title-md text-title-md text-primary font-bold">
                    Thalassemia &amp; HbE Carrier Screening
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Understand autosomal recessive inheritance, why normal CBC misses silent traits,
                    and where to access subsidized ৳800 HPLC screening.
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={onOpenPedigree}
                      className="font-label-md text-label-md text-tertiary font-bold flex items-center gap-1 hover:underline"
                    >
                      <span className="material-symbols-outlined text-[16px]">account_tree</span>
                      <span>3-Gen Pedigree Tool</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectTab('thalassemia')}
                      className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold flex items-center gap-1"
                    >
                      <span>Explore Genetics</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: NCD Prevention Hub */}
              <div className="rounded-xl bg-surface-container-lowest border border-surface-container overflow-hidden shadow-xs">
                <div className="h-36 relative">
                  <ResilientImage
                    src={HOTLINKED_ASSETS.ncdNurseBp}
                    alt="Community nurse checking blood pressure for hypertension prevention"
                    className="w-full h-full object-cover"
                    fallbackIcon="monitor_heart"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex items-end p-3">
                    <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10px] font-bold uppercase">
                      Chronic Disease • 67% Mortality Share
                    </span>
                  </div>
                </div>
                <div className="p-3.5 flex flex-col gap-2">
                  <h3 className="font-title-md text-title-md text-primary font-bold">
                    NCD &amp; Lifestyle Medicine Hub
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    South Asian metabolic protocols: eliminating table raw salt (কাঁচা লবণ),
                    parboiled rice glycemic swaps, and free VIA cervical screening.
                  </p>
                  <div className="flex items-center justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectTab('ncd-hub')}
                      className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold flex items-center gap-1"
                    >
                      <span>Open NCD Hub</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 3: Epidemiology & Impact */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/25 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">analytics</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-title-sm text-title-sm text-primary font-bold">
                      Epidemiology &amp; Economic Telemetry
                    </h3>
                    <p className="font-body-sm text-xs text-on-surface-variant">
                      Division-by-division DALY reduction, HPLC yield, and 18x ROI analytics.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectTab('dashboard')}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-label-sm text-label-sm font-bold border border-outline-variant/40 shrink-0"
                >
                  View Data
                </button>
              </div>
            </section>

            {/* Interactive Self-Care Companion Tools */}
            <section className="flex flex-col gap-2.5">
              <h2 className="font-title-md text-title-md text-primary font-bold">
                Interactive Self-Care Companion
              </h2>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={onOpenQuiz}
                  className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container hover:border-secondary/50 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">quiz</span>
                    </div>
                    <div>
                      <div className="font-title-sm text-title-sm text-primary font-bold">
                        Should I Get Screened?
                      </div>
                      <div className="font-label-sm text-xs text-on-surface-variant">
                        3-question private carrier readiness check
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    chevron_right
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onOpenVitals}
                  className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container hover:border-secondary/50 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-fixed flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">blood_pressure</span>
                    </div>
                    <div>
                      <div className="font-title-sm text-title-sm text-primary font-bold">
                        BP &amp; Sugar Threshold Companion
                      </div>
                      <div className="font-label-sm text-xs text-on-surface-variant">
                        Instant BIRDEM / DGHS norm interpreter
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    chevron_right
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('bd-access')}
                  className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container hover:border-secondary/50 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">pin_drop</span>
                    </div>
                    <div>
                      <div className="font-title-sm text-title-sm text-primary font-bold">
                        Verified Health Directory
                      </div>
                      <div className="font-label-sm text-xs text-on-surface-variant">
                        BSMMU, Samity, CMCH &amp; Sadar public tariffs
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    chevron_right
                  </span>
                </button>
              </div>
            </section>

            {/* Research Spotlight: Dr. Farhana Sultana */}
            <section className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/25 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-secondary shrink-0">
                  <ResilientImage
                    src={HOTLINKED_ASSETS.drFarhana}
                    alt="Dr. Farhana Sultana, Lead Hematologist"
                    className="w-full h-full object-cover"
                    fallbackIcon="person"
                  />
                </div>
                <div>
                  <span className="font-label-sm text-[10px] text-secondary font-bold uppercase tracking-wider">
                    Clinical Research Spotlight
                  </span>
                  <h3 className="font-title-sm text-title-sm text-primary font-bold">
                    Dr. Farhana Sultana, MBBS, FCPS
                  </h3>
                  <span className="font-label-sm text-xs text-on-surface-variant">
                    Molecular Hematology Consortium • BSMMU / HHD
                  </span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-primary italic bg-surface-container-lowest p-3 rounded-lg">
                “Carriers of HbE or Beta-Thalassemia trait are completely healthy citizens. Stigma
                arises from confusion—compassionate pre-marital HPLC awareness protects children
                without restricting family harmony.”
              </p>
              <button
                type="button"
                onClick={() => onOpenPaper(RESEARCH_PAPERS[0])}
                className="self-start font-label-md text-label-md text-primary font-bold flex items-center gap-1 hover:text-secondary"
              >
                <span>Read 2024 National Cohort Study</span>
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
              </button>
            </section>

            {/* Medical Governance Footer Note */}
            <footer className="p-3.5 rounded-xl bg-surface-container text-on-surface-variant font-label-sm text-xs flex items-start gap-2.5">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                verified_user
              </span>
              <div>
                <strong className="text-primary">Clinical Governance:</strong> Protocols aligned
                with DGHS Non-Communicable Disease Control (NCDC), NIPSOM, and Bangladesh
                Thalassemia Samity. National Helpline:{' '}
                <a href="tel:16263" className="text-secondary font-bold underline">
                  16263 (Shastho Batayon)
                </a>
                .
              </div>
            </footer>
          </div>
        )}

        {/* =========================================================
            SCREEN 2: GENETICS & THALASSEMIA (Image_3 / Image_4)
           ========================================================= */}
        {activeTab === 'thalassemia' && (
          <div className="flex flex-col gap-5 p-4">
            {/* Header Banner */}
            <section className="rounded-2xl bg-gradient-to-br from-tertiary via-tertiary-container to-primary text-on-primary p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded bg-on-primary/15 text-secondary-fixed font-label-sm text-[10px] font-bold uppercase tracking-wider">
                  Hemoglobinopathy Prevention
                </span>
                <button
                  type="button"
                  onClick={onOpenPedigree}
                  className="px-2.5 py-1 rounded-lg bg-secondary text-on-secondary font-label-sm text-[11px] font-bold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">account_tree</span>
                  <span>Full 3-Gen Pedigree</span>
                </button>
              </div>
              <h1 className="font-headline-md text-[22px] font-extrabold leading-tight mb-1.5">
                Genetics &amp; Thalassemia Intelligence
              </h1>
              <p className="font-body-sm text-xs text-on-primary/85 leading-relaxed">
                Non-stigmatizing autosomal recessive inheritance modeling, HPLC diagnostic clarity,
                and verified screening centers across Bangladesh.
              </p>
            </section>

            {/* Educational Section Sub-Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'inheritance', label: 'Visualizer' },
                { id: 'screening', label: 'Why HPLC?' },
                { id: 'pathway', label: 'Care Pathway' },
                { id: 'directory', label: 'HPLC Labs' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setGenSubTab(pill.id as typeof genSubTab)}
                  className={`px-3 py-1.5 rounded-lg font-label-md text-xs font-bold whitespace-nowrap transition-colors ${
                    genSubTab === pill.id
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Interactive Autosomal Recessive Visualizer */}
            <section className="rounded-xl bg-surface-container-lowest border border-surface-container p-4 shadow-xs flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-[10px] text-tertiary font-bold uppercase tracking-wider">
                    Interactive Mendelian Simulator
                  </span>
                  <h2 className="font-title-md text-title-md text-primary font-bold">
                    Autosomal Recessive Visualizer
                  </h2>
                </div>
                <span className="material-symbols-outlined text-tertiary text-[22px]">
                  genetics
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-[11px] text-on-surface-variant font-semibold">
                    Maternal Status
                  </label>
                  <select
                    value={maternalGeno}
                    onChange={(e) => setMaternalGeno(e.target.value as GenotypeOption)}
                    className="p-2 rounded-lg bg-surface-container-low text-primary font-label-md text-xs font-bold focus:outline-none border border-outline-variant/30"
                  >
                    <option value="normal">Normal (HbAA)</option>
                    <option value="beta-thal">β-Thal Carrier</option>
                    <option value="hbe">HbE Carrier</option>
                    <option value="unknown">Untested</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-[11px] text-on-surface-variant font-semibold">
                    Paternal Status
                  </label>
                  <select
                    value={paternalGeno}
                    onChange={(e) => setPaternalGeno(e.target.value as GenotypeOption)}
                    className="p-2 rounded-lg bg-surface-container-low text-primary font-label-md text-xs font-bold focus:outline-none border border-outline-variant/30"
                  >
                    <option value="normal">Normal (HbAA)</option>
                    <option value="beta-thal">β-Thal Carrier</option>
                    <option value="hbe">HbE Carrier</option>
                    <option value="unknown">Untested</option>
                  </select>
                </div>
              </div>

              {/* Per-Pregnancy Probability Distribution */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-surface-container-low text-center flex flex-col gap-0.5">
                  <span className="font-headline-sm text-[20px] font-extrabold text-secondary tabular-nums">
                    {mendelian.pNormal}%
                  </span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant font-semibold">
                    Unaffected (HbAA)
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-secondary-container/45 text-center flex flex-col gap-0.5">
                  <span className="font-headline-sm text-[20px] font-extrabold text-primary tabular-nums">
                    {mendelian.pCarrier}%
                  </span>
                  <span className="font-label-sm text-[10px] text-primary font-semibold">
                    Healthy Carrier
                  </span>
                </div>
                <div
                  className={`p-2.5 rounded-xl text-center flex flex-col gap-0.5 ${
                    mendelian.pMajor > 0 ? 'bg-error-container text-on-error-container' : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <span className="font-headline-sm text-[20px] font-extrabold tabular-nums">
                    {mendelian.pMajor}%
                  </span>
                  <span className="font-label-sm text-[10px] font-bold">
                    Major / HbE-β
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low flex items-start justify-between gap-2">
                <div className="font-body-sm text-xs text-primary">
                  <strong>Outcome:</strong> {mendelian.riskTitle}. Probabilities apply independently
                  to <em>each pregnancy</em>.
                </div>
                <button
                  type="button"
                  onClick={onOpenPedigree}
                  className="px-2.5 py-1.5 rounded-lg bg-tertiary text-on-tertiary font-label-sm text-[11px] font-bold shrink-0"
                >
                  Punnett &amp; CBC
                </button>
              </div>
            </section>

            {/* Epidemiological Profile in Bangladesh */}
            <section className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container">
                <span className="font-label-sm text-[10px] text-outline uppercase font-bold">
                  National Carrier Burden
                </span>
                <div className="font-headline-md text-[22px] font-extrabold text-primary tabular-nums mt-0.5">
                  10–12%
                </div>
                <p className="font-label-sm text-[11px] text-on-surface-variant mt-1">
                  ~18–20M silent carriers (6.1% HbE + 4.1% β-Thal trait)
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container">
                <span className="font-label-sm text-[10px] text-outline uppercase font-bold">
                  Annual Affected Births
                </span>
                <div className="font-headline-md text-[22px] font-extrabold text-error tabular-nums mt-0.5">
                  ~8,500
                </div>
                <p className="font-label-sm text-[11px] text-on-surface-variant mt-1">
                  100% preventable via voluntary couple awareness
                </p>
              </div>
            </section>

            {/* Gold-Standard HPLC Callout */}
            <section className="rounded-xl bg-primary text-on-primary p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-fixed text-[20px]">
                  biotech
                </span>
                <h3 className="font-title-sm text-title-sm font-bold">
                  Why Routine CBC Alone Is Not Enough
                </h3>
              </div>
              <p className="font-body-sm text-xs text-on-primary/85 leading-relaxed">
                A standard CBC often confuses Thalassemia trait with iron deficiency anemia. Always
                ask for <strong>Automated Hb Variant Analysis (HPLC)</strong>—quantifying{' '}
                <span className="font-mono text-secondary-fixed">HbA2 &gt; 3.5%</span> or{' '}
                <span className="font-mono text-secondary-fixed">HbE</span> fraction once in a
                lifetime.
              </p>
            </section>

            {/* 3-Step Empathetic Care Pathway */}
            <section className="flex flex-col gap-2.5">
              <h2 className="font-title-md text-title-md text-primary font-bold">
                3-Step Empathetic Care Pathway
              </h2>
              {[
                {
                  step: '01',
                  title: 'Individual Pre-Marital HPLC Test',
                  desc: 'One-time 2mL blood sample at any accredited lab (~৳800 public tariff).',
                },
                {
                  step: '02',
                  title: 'Partner Screening (Only If Carrier)',
                  desc: 'If one partner is HbAA Normal, children have 0% risk of Thalassemia Major.',
                },
                {
                  step: '03',
                  title: 'Confidential Genetic Counseling',
                  desc: 'Dual-carrier couples receive supportive reproductive & prenatal options (CVS at 10–12 wks).',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container flex items-start gap-3"
                >
                  <span className="w-7 h-7 rounded-lg bg-secondary-container text-on-secondary-fixed font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="font-title-sm text-title-sm text-primary font-bold">
                      {item.title}
                    </h4>
                    <p className="font-body-sm text-xs text-on-surface-variant">{item.desc}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* Division-Filtered Verified HPLC Centers */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="font-title-md text-title-md text-primary font-bold">
                  Accredited HPLC Labs
                </h2>
                <select
                  value={genDivisionFilter}
                  onChange={(e) => setGenDivisionFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-surface-container-low text-primary font-label-sm text-xs font-bold border border-outline-variant/30"
                >
                  <option value="All">All Divisions</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chattogram">Chattogram</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Rangpur">Rangpur</option>
                </select>
              </div>

              {genCenters.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-label-sm text-[10px] text-secondary font-bold uppercase">
                        {c.division} • {c.governanceBadge}
                      </span>
                      <h3 className="font-title-sm text-title-sm text-primary font-bold">
                        {c.shortName}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container-low font-mono text-xs text-primary font-bold shrink-0">
                      {c.costDisplay}
                    </span>
                  </div>
                  <p className="font-label-sm text-xs text-on-surface-variant">{c.address}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-label-sm text-[11px] text-outline">{c.hours}</span>
                    <a
                      href={`tel:${c.phone}`}
                      className="px-2.5 py-1 rounded-lg bg-secondary text-on-secondary font-label-sm text-xs font-semibold flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">call</span>
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={onOpenCounseling}
                className="w-full py-2.5 rounded-xl bg-tertiary text-on-tertiary font-label-md text-label-md font-bold flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">diversity_1</span>
                <span>Request Voluntary Genetic Counseling</span>
              </button>
            </section>
          </div>
        )}

        {/* =========================================================
            SCREEN 3: NCD HUB (Image_5 / Image_6)
           ========================================================= */}
        {activeTab === 'ncd-hub' && (
          <div className="flex flex-col gap-4 p-4">
            {/* Search & Header */}
            <section className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-[10px] text-secondary font-bold uppercase tracking-wider">
                    DGHS NCDC &amp; BIRDEM Aligned
                  </span>
                  <h1 className="font-headline-md text-[22px] text-primary font-extrabold">
                    NCD Prevention Hub
                  </h1>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-surface-container-low font-label-sm text-xs text-primary font-bold">
                  Saved ({bookmarkedIds.length})
                </span>
              </div>

              <div className="relative">
                <span className="material-symbols-outlined text-outline text-[19px] absolute left-3 top-1/2 -translate-y-1/2">
                  search
                </span>
                <input
                  type="text"
                  value={ncdSearch}
                  onChange={(e) => setNcdSearch(e.target.value)}
                  placeholder="Search BP, raw salt (কাঁচা লবণ), HbA1c, VIA..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-sm text-sm text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'All NCDs' },
                  { id: 'cardio', label: 'Cardiovascular' },
                  { id: 'diabetes', label: 'Diabetes' },
                  { id: 'cancer', label: 'Cancer Screening' },
                  { id: 'metabolic', label: 'Metabolic' },
                  { id: 'mental', label: 'Mental Health' },
                  { id: 'tobacco', label: 'Tobacco & Air' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setNcdCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg font-label-sm text-xs font-bold whitespace-nowrap transition-colors ${
                      ncdCategory === cat.id
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Interactive 3-Step Prevention Assessment Banner */}
            <section className="rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[10px] text-secondary-fixed font-bold uppercase tracking-wider">
                  Interactive Prevention Check • Step {ncdQuizStep} of 3
                </span>
                <button
                  type="button"
                  onClick={onOpenVitals}
                  className="text-xs text-secondary-fixed underline font-semibold"
                >
                  Open BP/HbA1c Tool
                </button>
              </div>

              {ncdQuizStep === 1 && (
                <div className="flex flex-col gap-2">
                  <p className="font-title-sm text-sm font-bold">
                    Do you add extra raw salt (কাঁচা লবণ) to your plate at meals?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNcdSaltHabit('yes');
                        setNcdQuizStep(2);
                      }}
                      className="flex-1 py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-xs font-bold"
                    >
                      Yes, Sometimes/Daily
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNcdSaltHabit('no');
                        setNcdQuizStep(2);
                      }}
                      className="flex-1 py-2 rounded-lg bg-on-primary/15 text-on-primary font-label-md text-xs font-bold"
                    >
                      No, Zero Raw Salt
                    </button>
                  </div>
                </div>
              )}

              {ncdQuizStep === 2 && (
                <div className="flex flex-col gap-2">
                  <p className="font-title-sm text-sm font-bold">
                    How much brisk walking do you achieve per week?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNcdWalkHabit('low');
                        setNcdQuizStep(3);
                      }}
                      className="flex-1 py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-xs font-bold"
                    >
                      Under 90 mins/wk
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNcdWalkHabit('good');
                        setNcdQuizStep(3);
                      }}
                      className="flex-1 py-2 rounded-lg bg-on-primary/15 text-on-primary font-label-md text-xs font-bold"
                    >
                      150+ mins/wk
                    </button>
                  </div>
                </div>
              )}

              {ncdQuizStep === 3 && (
                <div className="flex flex-col gap-2">
                  <p className="font-body-sm text-xs text-on-primary/90">
                    <strong className="text-secondary-fixed">Action Plan:</strong>{' '}
                    {ncdSaltHabit === 'yes'
                      ? 'Stopping extra pinch salt lowers systolic BP by 5–7 mmHg within 4 weeks. '
                      : 'Great job avoiding table salt! '}
                    {ncdWalkHabit === 'low'
                      ? 'Add a 20-minute post-dinner walk to blunt refined rice glucose spikes by 28%.'
                      : 'Maintain your 150-min weekly brisk activity and check fasting glucose yearly.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setNcdQuizStep(1)}
                    className="self-start px-3 py-1 rounded bg-on-primary/15 text-xs font-semibold"
                  >
                    Recalculate Check
                  </button>
                </div>
              )}
            </section>

            {/* NCD Topic Cards */}
            <section className="flex flex-col gap-3.5">
              {filteredNcdCards.map((card) => {
                const isSaved = bookmarkedIds.includes(card.id);
                const isExpanded = expandedNcdId === card.id;
                return (
                  <article
                    key={card.id}
                    className="rounded-xl bg-surface-container-lowest border border-surface-container overflow-hidden shadow-xs"
                  >
                    {card.image && (
                      <div className="h-36 relative">
                        <ResilientImage
                          src={card.image}
                          alt={card.imageAlt || card.title}
                          className="w-full h-full object-cover"
                          fallbackIcon={card.icon}
                        />
                        {card.imageOverlayLabel && (
                          <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-primary/85 text-on-primary font-label-sm text-[10px] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-secondary-fixed text-[13px]">
                              {card.imageOverlayIcon || 'verified'}
                            </span>
                            <span>{card.imageOverlayLabel}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-4 flex flex-col gap-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-label-sm text-[10px] text-secondary font-bold uppercase tracking-wider">
                            {card.categoryLabel} • {card.badge}
                          </span>
                          <h3 className="font-title-md text-title-md text-primary font-bold mt-0.5">
                            {card.title}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleBookmark(card.id, card.title)}
                          aria-label="Bookmark clinical protocol"
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isSaved
                              ? 'bg-secondary text-on-secondary'
                              : 'bg-surface-container-low text-outline'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {isSaved ? 'bookmark_added' : 'bookmark'}
                          </span>
                        </button>
                      </div>

                      <div className="p-2.5 rounded-lg bg-surface-container-low">
                        <div className="font-label-sm text-[11px] text-primary font-bold mb-0.5">
                          {card.contextHeading}
                        </div>
                        <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                          {card.contextBody}
                        </p>
                      </div>

                      {isExpanded && (
                        <div className="p-3 rounded-lg bg-secondary-container/25 flex flex-col gap-1.5">
                          <span className="font-label-sm text-[10px] text-primary font-bold uppercase">
                            Step-by-Step Clinical &amp; Household Protocol
                          </span>
                          {card.expandedProtocol.map((step, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-on-surface">
                              <span className="material-symbols-outlined text-secondary text-[15px] mt-0.5 shrink-0">
                                check_circle
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-surface-container">
                        <span className="font-label-sm text-[11px] text-outline">
                          {card.footerMeta}
                        </span>
                        <button
                          type="button"
                          onClick={() => setExpandedNcdId(isExpanded ? null : card.id)}
                          className="font-label-md text-xs text-secondary font-bold flex items-center gap-1"
                        >
                          <span>{isExpanded ? 'Hide Protocol' : card.ctaLabel}</span>
                          <span className="material-symbols-outlined text-[15px]">
                            {isExpanded ? 'expand_less' : 'expand_more'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            {/* Downloadable Bilingual Patient Factsheets */}
            <section className="flex flex-col gap-2.5 pt-1">
              <h2 className="font-title-md text-title-md text-primary font-bold">
                Bilingual Patient Factsheets (বাংলা / EN)
              </h2>
              {PATIENT_FACTSHEETS.map((sheet) => (
                <div
                  key={sheet.id}
                  className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container flex items-center justify-between gap-3"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-label-sm text-[10px] text-secondary font-bold uppercase">
                      {sheet.tag} • {sheet.language}
                    </span>
                    <h4 className="font-title-sm text-sm text-primary font-bold">{sheet.title}</h4>
                    <span className="font-label-sm text-xs text-on-surface-variant">
                      {sheet.subtitle} ({sheet.size})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDownloadFactsheet(sheet)}
                    className="px-3 py-2 rounded-lg bg-primary text-on-primary font-label-sm text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Save</span>
                  </button>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* =========================================================
            SCREEN 4: IMPACT DASHBOARD (Image_7 / Image_8)
           ========================================================= */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-4 p-4">
            {/* Header + Public vs Expert Mode Toggle */}
            <section className="flex items-center justify-between gap-2">
              <div>
                <span className="font-label-sm text-[10px] text-secondary font-bold uppercase tracking-wider">
                  DGHS / IEDCR Telemetry
                </span>
                <h1 className="font-headline-md text-[22px] text-primary font-extrabold">
                  National Impact &amp; ROI
                </h1>
              </div>
              <div className="flex rounded-lg bg-surface-container p-1">
                <button
                  type="button"
                  onClick={() => setImpactMode('public')}
                  className={`px-2.5 py-1 rounded-md font-label-sm text-xs font-bold ${
                    impactMode === 'public'
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant'
                  }`}
                >
                  Public View
                </button>
                <button
                  type="button"
                  onClick={() => setImpactMode('expert')}
                  className={`px-2.5 py-1 rounded-md font-label-sm text-xs font-bold ${
                    impactMode === 'expert'
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant'
                  }`}
                >
                  Expert &amp; Ops
                </button>
              </div>
            </section>

            {/* 2x2 KPI Cards with Sparklines */}
            <section className="grid grid-cols-2 gap-3">
              {[
                {
                  label: 'Citizens Reached',
                  value: activeDivStat ? activeDivStat.reach.toLocaleString() : '1,420,890',
                  delta: '+14.2% Q4',
                  pts: '0,22 18,18 36,15 54,10 72,4',
                },
                {
                  label: 'HPLC Screens Logged',
                  value: activeDivStat ? activeDivStat.screens.toLocaleString() : '18,540',
                  delta: activeDivStat ? `Yield ${activeDivStat.traitYield}` : '11.4% Trait Yield',
                  pts: '0,20 18,19 36,14 54,11 72,5',
                },
                {
                  label: 'Unit Outreach Cost',
                  value: '৳ 42.50',
                  delta: '-8.4% Efficiency',
                  pts: '0,6 18,10 36,13 54,17 72,21',
                },
                {
                  label: 'DALYs Averted',
                  value: activeDivStat ? activeDivStat.dalys.toLocaleString() : '3,840',
                  delta: 'WHO-CHOICE Validated',
                  pts: '0,23 18,19 36,14 54,9 72,3',
                },
              ].map((kpi, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container flex flex-col gap-1"
                >
                  <span className="font-label-sm text-[10px] text-outline uppercase font-bold">
                    {kpi.label}
                  </span>
                  <span className="font-headline-sm text-[20px] font-extrabold text-primary tabular-nums">
                    {kpi.value}
                  </span>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-label-sm text-[10px] text-secondary font-bold">
                      {kpi.delta}
                    </span>
                    <svg width="56" height="20" viewBox="0 0 72 24" className="overflow-visible">
                      <polyline
                        fill="none"
                        stroke="#006a61"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        points={kpi.pts}
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </section>

            {/* Bangladesh Surveillance Map + Division Stacked Bar */}
            <section className="rounded-xl bg-surface-container-lowest border border-surface-container overflow-hidden">
              <div className="h-44 relative">
                <ResilientImage
                  src={HOTLINKED_ASSETS.mobileSurveillanceMap}
                  alt="Bangladesh 8-division epidemiological surveillance density map"
                  className="w-full h-full object-cover"
                  fallbackIcon="map"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-primary/85 text-on-primary font-label-sm text-[10px] font-bold">
                  Spatial Carrier Density • Rajshahi/Rangpur Hotspot (12.4–13.1%)
                </div>
              </div>

              <div className="p-3.5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-title-sm text-xs text-primary font-bold">
                    Outreach Share by Division
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedDivChip('all')}
                    className="font-label-sm text-[11px] text-secondary font-semibold"
                  >
                    {selectedDivChip === 'all' ? 'All 8 Divisions' : 'Reset Filter'}
                  </button>
                </div>

                {/* Stacked Bar */}
                <div className="h-3 rounded-full overflow-hidden flex bg-surface-container">
                  {DIVISION_STATS.map((d, i) => {
                    const colors = [
                      'bg-primary',
                      'bg-secondary',
                      'bg-tertiary',
                      'bg-primary-container',
                      'bg-secondary/75',
                      'bg-tertiary/75',
                      'bg-outline',
                    ];
                    return (
                      <div
                        key={d.id}
                        style={{ width: `${d.share}%` }}
                        className={`${colors[i % colors.length]} h-full`}
                        title={`${d.name}: ${d.share}%`}
                      />
                    );
                  })}
                </div>

                {/* Clickable Division Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {DIVISION_STATS.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() =>
                        setSelectedDivChip(selectedDivChip === d.id ? 'all' : d.id)
                      }
                      className={`px-2 py-1 rounded-md font-label-sm text-[11px] font-semibold tabular-nums ${
                        selectedDivChip === d.id
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-low text-on-surface'
                      }`}
                    >
                      {d.name} {d.share}%
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* 18x Economic Dividend Card */}
            <section className="rounded-xl bg-primary text-on-primary p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[10px] text-secondary-fixed font-bold uppercase tracking-wider">
                  Health Economics • Household Protection
                </span>
                <span className="px-2 py-0.5 rounded bg-secondary text-on-secondary font-mono text-xs font-bold">
                  91.4% Saved
                </span>
              </div>
              <h3 className="font-title-md text-title-md font-bold">
                18x Economic Dividend from Pre-Marital Screening
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-lg bg-on-primary/10">
                  <div className="font-label-sm text-[10px] text-secondary-fixed uppercase">
                    One-Time Couple HPLC
                  </div>
                  <div className="font-headline-sm text-lg font-extrabold tabular-nums">
                    ~ ৳ 2,500
                  </div>
                  <div className="font-label-sm text-[10px] text-on-primary/75">
                    Includes counseling
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-error-container/30 border border-error-container/40">
                  <div className="font-label-sm text-[10px] text-error-container uppercase">
                    Annual Major Care
                  </div>
                  <div className="font-headline-sm text-lg font-extrabold tabular-nums">
                    ৳ 2.5L–4.5L/yr
                  </div>
                  <div className="font-label-sm text-[10px] text-on-primary/75">
                    Transfusion + chelation
                  </div>
                </div>
              </div>
            </section>

            {/* Expert Telemetry & Research Feed */}
            <section className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <h2 className="font-title-md text-title-md text-primary font-bold">
                  {impactMode === 'expert' ? 'Live District Telemetry Nodes' : 'Operations & Evidence Feed'}
                </h2>
                <button
                  type="button"
                  onClick={onExportCsv}
                  className="px-2.5 py-1 rounded-lg bg-surface-container-low text-primary font-label-sm text-xs font-bold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">download</span>
                  <span>CSV (CC-BY 4.0)</span>
                </button>
              </div>

              {TELEMETRY_DISPATCHES.slice(0, 3).map((d) => (
                <div
                  key={d.id}
                  className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-[10px] text-secondary font-bold uppercase">
                      {d.regionHeader}
                    </span>
                    <span className="font-mono text-[10px] text-outline">{d.timestamp}</span>
                  </div>
                  <h4 className="font-title-sm text-sm text-primary font-bold">{d.title}</h4>
                  <p className="font-body-sm text-xs text-on-surface-variant">{d.summary}</p>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* =========================================================
            SCREEN 5: BD ACCESS DIRECTORY (Image_9 / Image_10)
           ========================================================= */}
        {activeTab === 'bd-access' && (
          <div className="flex flex-col gap-4 p-4">
            {/* Live Geo-Registry Ticker */}
            <div className="px-3 py-2 rounded-xl bg-secondary-container/45 text-on-secondary-fixed font-label-sm text-xs font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                Live Geo-Registry • {accessCenters.length} Verified Public &amp; NGO Centers
              </span>
              <button
                type="button"
                onClick={onOpenSuggestFacility}
                className="text-primary underline font-bold"
              >
                + Suggest
              </button>
            </div>

            {/* Filter Dropdowns + Map/List Toggle */}
            <section className="rounded-xl bg-surface-container-lowest border border-surface-container p-3.5 flex flex-col gap-2.5">
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={dirDivision}
                  onChange={(e) => {
                    setDirDivision(e.target.value);
                    setDirDistrict('All');
                  }}
                  className="p-2 rounded-lg bg-surface-container-low text-primary font-label-sm text-xs font-bold focus:outline-none"
                >
                  <option value="All">All Divisions</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chattogram">Chattogram</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Rangpur">Rangpur</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barishal">Barishal</option>
                </select>

                <select
                  value={dirCapability}
                  onChange={(e) => setDirCapability(e.target.value)}
                  className="p-2 rounded-lg bg-surface-container-low text-primary font-label-sm text-xs font-bold focus:outline-none"
                >
                  <option value="all">All Capabilities</option>
                  <option value="hplc">HPLC Lab</option>
                  <option value="via">VIA Cervical</option>
                  <option value="ncd">NCD Corner</option>
                  <option value="blood">Safe Blood</option>
                  <option value="counseling">Counseling</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setDirDivision('All');
                    setDirDistrict('All');
                    setDirCapability('all');
                  }}
                  className="p-2 rounded-lg bg-surface-container text-on-surface-variant font-label-sm text-xs font-bold"
                >
                  Reset
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-label-sm text-xs text-on-surface-variant">
                  Showing subsidized government &amp; Zakat-backed tariffs
                </span>
                <div className="flex rounded-lg bg-surface-container p-0.5">
                  <button
                    type="button"
                    onClick={() => setDirViewMode('list')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      dirViewMode === 'list' ? 'bg-primary text-on-primary' : 'text-outline'
                    }`}
                  >
                    List
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirViewMode('map')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      dirViewMode === 'map' ? 'bg-primary text-on-primary' : 'text-outline'
                    }`}
                  >
                    Map
                  </button>
                </div>
              </div>
            </section>

            {/* Optional Map View */}
            {dirViewMode === 'map' && (
              <div className="rounded-xl overflow-hidden border border-surface-container relative h-56">
                <ResilientImage
                  src={HOTLINKED_ASSETS.mobileLabGridMap}
                  alt="Bangladesh geo-located diagnostic laboratory grid"
                  className="w-full h-full object-cover"
                  fallbackIcon="map"
                />
                <div className="absolute bottom-3 inset-x-3 p-3 rounded-lg bg-primary/90 text-on-primary text-xs flex items-center justify-between">
                  <span>28 HPLC Reference Labs • 492 UHC NCD Corners</span>
                  <button
                    type="button"
                    onClick={() => setDirViewMode('list')}
                    className="px-2 py-1 rounded bg-secondary text-on-secondary font-bold"
                  >
                    View Cards
                  </button>
                </div>
              </div>
            )}

            {/* Facility Cards */}
            <section className="flex flex-col gap-3">
              {accessCenters.map((f) => (
                <article
                  key={f.id}
                  className="rounded-xl bg-surface-container-lowest border border-surface-container overflow-hidden shadow-xs"
                >
                  <div className="h-32 relative">
                    <ResilientImage
                      src={f.image}
                      alt={f.imageAlt}
                      className="w-full h-full object-cover"
                      fallbackIcon={f.icon}
                    />
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-primary/90 text-on-primary font-label-sm text-[10px] font-bold">
                        {f.governanceBadge}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-secondary text-on-secondary font-label-sm text-[10px] font-bold">
                        {f.division}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-title-md text-sm text-primary font-bold leading-snug">
                        {f.name}
                      </h3>
                      <span className="px-2 py-1 rounded bg-surface-container-low font-mono text-xs text-primary font-bold shrink-0">
                        {f.costDisplay}
                      </span>
                    </div>

                    <p className="font-label-sm text-xs text-on-surface-variant">{f.address}</p>

                    <div className="flex flex-wrap gap-1">
                      {f.capabilityTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-surface-container text-primary font-label-sm text-[10px] font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-surface-container">
                      <span className="font-label-sm text-[11px] text-outline">{f.hours}</span>
                      <a
                        href={`tel:${f.phone}`}
                        className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-label-sm text-xs font-bold flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <span>{f.phoneDisplay}</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            {/* Know Your Carrier Status + Emergency Helpline Footer */}
            <section className="rounded-xl bg-primary text-on-primary p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-title-sm text-sm font-bold">
                  24/7 National Tele-Health &amp; Blood Support
                </h3>
                <span className="material-symbols-outlined text-secondary-fixed text-[20px]">
                  support_agent
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-primary/85">
                Dial toll-free <strong>16263 (Shastho Batayon)</strong> for nearest government OPD
                desk hours, or connect with voluntary safe blood networks.
              </p>
              <div className="flex gap-2">
                <a
                  href="tel:16263"
                  className="flex-1 py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-xs font-bold text-center"
                >
                  Call 16263 Batayon
                </a>
                <button
                  type="button"
                  onClick={onOpenPedigree}
                  className="flex-1 py-2 rounded-lg bg-on-primary/15 text-on-primary font-label-md text-xs font-bold"
                >
                  Check Carrier Risk
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Fixed 5-Tab Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Primary Navigation"
        className={`${
          isDesktopPreview ? 'sticky bottom-0' : 'fixed bottom-0 inset-x-0'
        } z-40 h-16 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-surface-container grid grid-cols-5 px-1`}
      >
        {[
          { id: 'home', icon: 'home', label: language === 'bn' ? 'হোম' : 'Home' },
          { id: 'ncd-hub', icon: 'monitor_heart', label: language === 'bn' ? 'এনসিডি' : 'NCD Hub' },
          { id: 'thalassemia', icon: 'genetics', label: language === 'bn' ? 'জেনেটিক্স' : 'Genetics' },
          { id: 'dashboard', icon: 'analytics', label: language === 'bn' ? 'ইমপ্যাক্ট' : 'Impact' },
          { id: 'bd-access', icon: 'location_on', label: language === 'bn' ? 'কেন্দ্র' : 'BD Access' },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id as MobileTab)}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                active ? 'text-secondary font-bold' : 'text-on-surface-variant'
              }`}
            >
              <span
                className={`px-3 py-0.5 rounded-lg flex items-center justify-center ${
                  active ? 'bg-secondary-container/70 text-primary' : ''
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
              </span>
              <span className="font-label-sm text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
