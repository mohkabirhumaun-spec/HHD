/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  DesktopAccessView,
  DesktopGeneticsView,
} from './components/DesktopAccessAndGeneticsView';
import { DesktopDashboardView } from './components/DesktopDashboardView';
import { DesktopPreventiveView } from './components/DesktopPreventiveView';
import {
  ActionFormModal,
  PaperModal,
  ReadinessQuizModal,
  SearchModal,
  VitalsCompanionModal,
} from './components/InteractiveModals';
import { MobileShell } from './components/MobileViews';
import { PedigreeModal } from './components/PedigreeModal';
import { ResilientImage } from './components/ResilientImage';
import { DIVISION_STATS, HOTLINKED_ASSETS } from './data/healthData';
import {
  DesktopRoute,
  FactsheetItem,
  Language,
  MobileTab,
  ResearchPaper,
  ShellMode,
} from './types';

interface ToastState {
  title: string;
  message: string;
}

export default function App() {
  /* Viewport Media Query for Automatic Adaptive Shell */
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  const [shellMode, setShellMode] = useState<ShellMode>('auto');
  const [language, setLanguage] = useState<Language>('en');

  /* Active Routes for Both Shells */
  const [mobileTab, setMobileTab] = useState<MobileTab>('home');
  const [desktopRoute, setDesktopRoute] = useState<DesktopRoute>('intelligence-dashboard');
  const [accessSpecialtySeed, setAccessSpecialtySeed] = useState<string>('all');

  /* Interactive Modal States */
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isPedigreeOpen, setIsPedigreeOpen] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [isVitalsOpen, setIsVitalsOpen] = useState<boolean>(false);
  const [activePaper, setActivePaper] = useState<ResearchPaper | null>(null);
  const [actionFormMode, setActionFormMode] = useState<'counseling' | 'suggest-facility' | null>(
    null
  );
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((title: string, message: string) => {
    setToast({ title, message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onResize = () => setIsMobileViewport(window.innerWidth < 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* Global Cmd+K / Ctrl+K Search Shortcut */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  /* Client-Side Download Generator (No window.open / window.alert) */
  const triggerTextDownload = (filename: string, content: string, mime = 'text/plain') => {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const header =
      'Division,Outreach_Share_Pct,Citizens_Reached,HPLC_Screens,Carrier_Yield,DALYs_Averted\n';
    const rows = DIVISION_STATS.map(
      (d) =>
        `${d.name},${d.share},${d.reach},${d.screens},${d.traitYield},${d.dalys}`
    ).join('\n');
    triggerTextDownload(
      'HHD_Bangladesh_Epidemiology_CC_BY_4.csv',
      header + rows,
      'text/csv'
    );
    showToast(
      'CSV Dataset Exported',
      'Downloaded k-anonymized 8-division surveillance dataset (CC-BY 4.0).'
    );
  };

  const handleExportPolicyBrief = () => {
    const brief = [
      'HHD INTELLIGENCE — NATIONAL EXECUTIVE POLICY BRIEF (2025)',
      'Governance: Aligned with DGHS NCDC, BSMMU Hematology, and NIPSOM',
      '---------------------------------------------------------------',
      '1. Citizens Reached: 1,420,890 across all 64 districts (+14.2% YoY)',
      '2. Automated HPLC Screens Logged: 18,540 (Mean Silent Carrier Yield: 11.4%)',
      '3. Variant Distribution: HbE Trait 62% | Beta-Thalassemia Trait 31% | Other 7%',
      '4. Health Economics: ~BDT 2,500 one-time couple HPLC vs BDT 250,000-450,000/yr major care (18x ROI; 91.4% catastrophic cost averted)',
      '5. National Helpline: 16263 (Shastho Batayon)',
    ].join('\n');
    triggerTextDownload('HHD_National_Policy_Brief_2025.txt', brief);
    showToast('Executive Brief Downloaded', 'Saved 2025 National Prevention ROI summary.');
  };

  const handleDownloadFactsheet = (sheet: FactsheetItem) => {
    const content = [
      `HHD INTELLIGENCE BILINGUAL CLINIC HANDOUT (${sheet.language})`,
      `Title: ${sheet.title}`,
      `Category: ${sheet.tag} | Format: ${sheet.formatLabel}`,
      '---------------------------------------------------------------',
      sheet.description,
      '',
      'Approved for free reproduction in Upazila Health Complexes & NGO clinics (CC-BY 4.0).',
      '24/7 DGHS Tele-Health: Dial 16263 (Shastho Batayon).',
    ].join('\n');
    triggerTextDownload(`${sheet.id}_bilingual_guide.txt`, content);
    showToast('Patient Handout Saved', `${sheet.title} downloaded for offline use.`);
  };

  const handleDownloadPaper = (paper: ResearchPaper) => {
    const content = [
      paper.title,
      `${paper.authors} (${paper.affiliation}) — ${paper.date}`,
      `Reference: ${paper.doi}`,
      '---------------------------------------------------------------',
      `Abstract:\n${paper.abstract}`,
      '',
      'Validated National Findings:',
      ...paper.keyFindings.map((f, i) => `${i + 1}. ${f}`),
    ].join('\n');
    triggerTextDownload(`${paper.id}_evidence_brief.txt`, content);
    showToast('Evidence Brief Downloaded', `Saved ${paper.doi} summary.`);
  };

  const renderMobile =
    shellMode === 'mobile' || (shellMode === 'auto' && isMobileViewport);

  const navigateToFacilities = (specialty = 'all') => {
    setAccessSpecialtySeed(specialty);
    if (renderMobile) {
      setMobileTab('bd-access');
    } else {
      setDesktopRoute('bangladesh-access');
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased">
      {/* =====================================================================
          ADAPTIVE SHELL A: MOBILE TAB SHELL (<1024px or Desktop Mobile Preview)
         ===================================================================== */}
      {renderMobile ? (
        <div className={!isMobileViewport ? 'min-h-screen bg-surface-container py-4 px-2' : ''}>
          {/* Quick Screen Switcher Bar when previewing Mobile Shell on Desktop */}
          {!isMobileViewport && (
            <div className="max-w-[430px] mx-auto mb-2.5 p-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between gap-1 text-[11px]">
              <span className="font-bold text-primary pl-1">Screens 1–5:</span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'home', label: '1. Home' },
                  { id: 'thalassemia', label: '2. Genetics' },
                  { id: 'ncd-hub', label: '3. NCD' },
                  { id: 'dashboard', label: '4. Impact' },
                  { id: 'bd-access', label: '5. Access' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setMobileTab(s.id as MobileTab)}
                    className={`px-2 py-1 rounded font-bold ${
                      mobileTab === s.id
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <MobileShell
            activeTab={mobileTab}
            onSelectTab={setMobileTab}
            language={language}
            onToggleLanguage={() => setLanguage((l) => (l === 'en' ? 'bn' : 'en'))}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenPedigree={() => setIsPedigreeOpen(true)}
            onOpenQuiz={() => setIsQuizOpen(true)}
            onOpenVitals={() => setIsVitalsOpen(true)}
            onOpenPaper={(p) => setActivePaper(p)}
            onOpenCounseling={() => setActionFormMode('counseling')}
            onOpenSuggestFacility={() => setActionFormMode('suggest-facility')}
            onDownloadFactsheet={handleDownloadFactsheet}
            onExportCsv={handleExportCsv}
            onToast={showToast}
            isDesktopPreview={!isMobileViewport}
            onSwitchToDesktop={() => setShellMode('desktop')}
          />
        </div>
      ) : (
        /* =====================================================================
           ADAPTIVE SHELL B: DESKTOP WEB DASHBOARD SHELL (Screens 6–9, >=1024px)
           ===================================================================== */
        <div className="min-h-screen flex flex-col">
          {/* Fixed h-20 Top Institutional Header */}
          <header className="sticky top-0 z-40 h-20 bg-surface-container-lowest/95 backdrop-blur-xl border-b border-surface-container px-6 flex items-center justify-between gap-4">
            {/* Brand + Live DGHS Feed */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setDesktopRoute('intelligence-dashboard')}
                className="flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center overflow-hidden shadow-xs shrink-0">
                  <ResilientImage
                    src={HOTLINKED_ASSETS.logo}
                    alt="HHD Intelligence Logo"
                    className="w-full h-full object-cover"
                    fallbackIcon="health_and_safety"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-lg text-primary font-extrabold leading-tight tracking-tight whitespace-nowrap">
                    {language === 'bn' ? 'এইচএইচডি ইন্টেলিজেন্স' : 'HHD Intelligence'}
                  </span>
                  <span className="font-mono text-[10px] text-secondary font-bold uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    DGHS Live Data Feed
                  </span>
                </div>
              </button>
            </div>

            {/* Single-Line Top Navigation Links */}
            <nav
              aria-label="Primary Desktop Navigation"
              className="flex items-center gap-1 overflow-x-auto py-1"
            >
              {[
                { id: 'intelligence-dashboard', label: 'Intelligence Dashboard' },
                { id: 'preventive-hub', label: 'Preventive Hub' },
                { id: 'genetics-and-thalassemia', label: 'Genetics & Thalassemia' },
                { id: 'research-and-evidence', label: 'Research & Evidence' },
                { id: 'field-operations', label: 'Field Operations' },
                { id: 'bangladesh-access', label: 'Bangladesh Access' },
              ].map((item) => {
                const isActive = desktopRoute === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDesktopRoute(item.id as DesktopRoute)}
                    className={`px-3 py-2 rounded-lg font-label-md text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Utility Controls: Cmd+K Search, Mobile Preview, Language, 16263 */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-sm text-xs flex items-center gap-2 border border-outline-variant/30 whitespace-nowrap"
                title="Search facilities, protocols, or studies (⌘K)"
              >
                <span className="material-symbols-outlined text-[16px]">search</span>
                <span className="hidden 2xl:inline">Search</span>
                <kbd className="px-1.5 py-0.5 rounded bg-surface-container-lowest font-mono text-[10px] text-primary font-bold">
                  ⌘K
                </kbd>
              </button>

              <button
                type="button"
                onClick={() => setShellMode('mobile')}
                className="px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-sm text-xs font-bold border border-outline-variant/30 flex items-center gap-1 whitespace-nowrap"
                title="Preview Mobile App Shell (Screens 1–5)"
              >
                <span className="material-symbols-outlined text-[16px]">smartphone</span>
                <span className="hidden xl:inline">Mobile App</span>
              </button>

              <button
                type="button"
                onClick={() => setLanguage((l) => (l === 'en' ? 'bn' : 'en'))}
                className="px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-sm text-xs font-bold border border-outline-variant/30 whitespace-nowrap"
              >
                {language === 'en' ? 'EN | বাংলা' : 'বাংলা | EN'}
              </button>

              <a
                href="tel:16263"
                className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-label-md text-xs font-bold flex items-center gap-1.5 shadow-xs hover:opacity-95 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                <span>16263</span>
              </a>
            </div>
          </header>

          {/* Body Layout: Fixed w-64 Operational Modules Sidebar + Main Canvas */}
          <div className="flex-1 flex">
            <aside className="w-64 shrink-0 bg-surface-container-lowest border-r border-surface-container p-4 flex flex-col justify-between sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
              <div className="flex flex-col gap-5">
                <div>
                  <span className="px-3 font-label-sm text-[10px] text-outline uppercase font-bold tracking-wider">
                    Operational Modules
                  </span>
                  <div className="mt-2 flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => setDesktopRoute('intelligence-dashboard')}
                      className={`w-full px-3 py-2.5 rounded-xl font-label-md text-xs font-bold flex items-center gap-2.5 text-left transition-colors ${
                        desktopRoute === 'intelligence-dashboard'
                          ? 'bg-secondary-container/70 text-primary'
                          : 'text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px]">space_dashboard</span>
                      <span>National Dashboard</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPedigreeOpen(true)}
                      className="w-full px-3 py-2.5 rounded-xl font-label-md text-xs font-bold flex items-center justify-between text-left text-tertiary bg-tertiary-fixed/45 hover:bg-tertiary-fixed/70 transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[19px]">account_tree</span>
                        <span>Genetic Registry (3-Gen)</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-tertiary text-on-tertiary text-[9px] font-mono">
                        LIVE
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDesktopRoute('preventive-hub')}
                      className={`w-full px-3 py-2.5 rounded-xl font-label-md text-xs font-bold flex items-center gap-2.5 text-left transition-colors ${
                        desktopRoute === 'preventive-hub'
                          ? 'bg-secondary-container/70 text-primary'
                          : 'text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px]">monitor_heart</span>
                      <span>Preventive NCD Hub</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDesktopRoute('bangladesh-access')}
                      className={`w-full px-3 py-2.5 rounded-xl font-label-md text-xs font-bold flex items-center gap-2.5 text-left transition-colors ${
                        desktopRoute === 'bangladesh-access'
                          ? 'bg-secondary-container/70 text-primary'
                          : 'text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px]">pin_drop</span>
                      <span>64-District Access</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDesktopRoute('field-operations')}
                      className={`w-full px-3 py-2.5 rounded-xl font-label-md text-xs font-bold flex items-center gap-2.5 text-left transition-colors ${
                        desktopRoute === 'field-operations'
                          ? 'bg-secondary-container/70 text-primary'
                          : 'text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px]">radar</span>
                      <span>Division Telemetry</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDesktopRoute('outbreak-alerts')}
                      className={`w-full px-3 py-2.5 rounded-xl font-label-md text-xs font-bold flex items-center gap-2.5 text-left transition-colors ${
                        desktopRoute === 'outbreak-alerts'
                          ? 'bg-secondary-container/70 text-primary'
                          : 'text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px]">notifications_active</span>
                      <span>Outbreak &amp; Blood Alerts</span>
                    </button>
                  </div>
                </div>

                {/* Companion Quick Tools */}
                <div className="pt-4 border-t border-surface-container flex flex-col gap-1.5">
                  <span className="px-3 font-label-sm text-[10px] text-outline uppercase font-bold tracking-wider">
                    Clinical Self-Checks
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsQuizOpen(true)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-primary hover:bg-surface-container-low flex items-center gap-2 text-left"
                  >
                    <span className="material-symbols-outlined text-secondary text-[17px]">
                      quiz
                    </span>
                    <span>Should I Get Screened?</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsVitalsOpen(true)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-primary hover:bg-surface-container-low flex items-center gap-2 text-left"
                  >
                    <span className="material-symbols-outlined text-secondary text-[17px]">
                      blood_pressure
                    </span>
                    <span>BP &amp; HbA1c Interpreter</span>
                  </button>
                </div>
              </div>

              {/* Institutional Verification Card */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/25 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="font-mono text-[11px] font-bold text-primary">
                    BSMMU &amp; IEDCR Linked
                  </span>
                </div>
                <p className="font-label-sm text-[11px] text-on-surface-variant leading-snug">
                  De-identified surveillance &amp; public tariff directory across 8 divisions.
                </p>
              </div>
            </aside>

            {/* Main Desktop Workspace */}
            <main className="flex-1 p-6 xl:p-8 max-w-[1600px]">
              {(desktopRoute === 'intelligence-dashboard' ||
                desktopRoute === 'research-and-evidence' ||
                desktopRoute === 'field-operations' ||
                desktopRoute === 'outbreak-alerts') && (
                <DesktopDashboardView
                  route={desktopRoute}
                  onNavigate={setDesktopRoute}
                  onOpenPaper={(p) => setActivePaper(p)}
                  onOpenPedigree={() => setIsPedigreeOpen(true)}
                  onExportCsv={handleExportCsv}
                  onExportBrief={handleExportPolicyBrief}
                  onToast={showToast}
                />
              )}

              {desktopRoute === 'preventive-hub' && (
                <DesktopPreventiveView
                  onNavigateAccess={(spec) => navigateToFacilities(spec || 'all')}
                  onOpenVitalsModal={() => setIsVitalsOpen(true)}
                  onDownloadFactsheet={handleDownloadFactsheet}
                  onToast={showToast}
                />
              )}

              {desktopRoute === 'bangladesh-access' && (
                <DesktopAccessView
                  key={accessSpecialtySeed}
                  initialSpecialty={accessSpecialtySeed}
                  onOpenSuggestFacility={() => setActionFormMode('suggest-facility')}
                  onOpenCounseling={() => setActionFormMode('counseling')}
                  onToast={showToast}
                />
              )}

              {desktopRoute === 'genetics-and-thalassemia' && (
                <DesktopGeneticsView
                  onOpenPedigree={() => setIsPedigreeOpen(true)}
                  onNavigateAccess={(spec) => navigateToFacilities(spec || 'hplc')}
                  onOpenCounseling={() => setActionFormMode('counseling')}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* =====================================================================
          SHARED INTERACTIVE CLINICAL MODALS (Including Screen 9 PedigreeModal)
         ===================================================================== */}
      <PedigreeModal
        isOpen={isPedigreeOpen}
        onClose={() => setIsPedigreeOpen(false)}
        onFindHplcCenter={() => {
          setIsPedigreeOpen(false);
          navigateToFacilities('hplc');
        }}
        onBookCounseling={() => {
          setIsPedigreeOpen(false);
          setActionFormMode('counseling');
        }}
        onToast={showToast}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateFacility={() => navigateToFacilities('all')}
        onNavigateNcd={() => {
          if (renderMobile) setMobileTab('ncd-hub');
          else setDesktopRoute('preventive-hub');
        }}
        onOpenPedigree={() => setIsPedigreeOpen(true)}
        onOpenPaper={(paper) => setActivePaper(paper)}
      />

      <ReadinessQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onFindHplc={() => navigateToFacilities('hplc')}
        onOpenPedigree={() => setIsPedigreeOpen(true)}
      />

      <VitalsCompanionModal
        isOpen={isVitalsOpen}
        onClose={() => setIsVitalsOpen(false)}
      />

      <PaperModal
        paper={activePaper}
        onClose={() => setActivePaper(null)}
        onDownload={handleDownloadPaper}
      />

      <ActionFormModal
        mode={actionFormMode}
        onClose={() => setActionFormMode(null)}
        onSubmitSuccess={showToast}
      />

      {/* Non-Blocking Clinical Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 max-w-sm bg-primary text-on-primary px-4 py-3 rounded-xl shadow-2xl border border-secondary-fixed/30 flex items-start gap-3"
        >
          <span className="material-symbols-outlined text-secondary-fixed text-[20px] mt-0.5 shrink-0">
            check_circle
          </span>
          <div className="flex-1">
            <div className="font-title-sm text-xs font-bold">{toast.title}</div>
            <div className="font-body-sm text-xs text-on-primary/85 mt-0.5">{toast.message}</div>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-on-primary/70 hover:text-on-primary"
            aria-label="Dismiss notification"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
