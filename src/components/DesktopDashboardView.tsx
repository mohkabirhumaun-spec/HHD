import React, { useState } from 'react';
import {
  DIVISION_STATS,
  HOTLINKED_ASSETS,
  RESEARCH_PAPERS,
  TELEMETRY_DISPATCHES,
} from '../data/healthData';
import { DesktopRoute, ResearchPaper } from '../types';
import { ResilientImage } from './ResilientImage';

interface DesktopDashboardViewProps {
  route: DesktopRoute;
  onNavigate: (route: DesktopRoute) => void;
  onOpenPaper: (paper: ResearchPaper) => void;
  onOpenPedigree: () => void;
  onExportCsv: () => void;
  onExportBrief: () => void;
  onToast: (title: string, msg: string) => void;
}

export const DesktopDashboardView: React.FC<DesktopDashboardViewProps> = ({
  route,
  onNavigate,
  onOpenPaper,
  onOpenPedigree,
  onExportCsv,
  onExportBrief,
  onToast,
}) => {
  /* Screen 6 (Intelligence Dashboard) Interactive State */
  const [viewMode, setViewMode] = useState<'public' | 'epidemiological' | 'telemetry'>(
    'epidemiological'
  );
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [timeWindow, setTimeWindow] = useState<'fy2025' | 'q4' | 'rolling12'>('fy2025');
  const [cohortFilter, setCohortFilter] = useState<'all' | 'premarital' | 'antenatal'>('all');

  const divObj =
    selectedDivision === 'all'
      ? null
      : DIVISION_STATS.find((d) => d.id === selectedDivision) || null;

  const timeMultiplier = timeWindow === 'fy2025' ? 1 : timeWindow === 'q4' ? 0.31 : 0.88;
  const cohortMultiplier =
    cohortFilter === 'all' ? 1 : cohortFilter === 'premarital' ? 0.68 : 0.32;
  const factor = timeMultiplier * cohortMultiplier;

  const baseReach = divObj ? divObj.reach : 1420890;
  const baseScreens = divObj ? divObj.screens : 18540;
  const baseDalys = divObj ? divObj.dalys : 3840;

  const scaledReach = Math.round(baseReach * factor).toLocaleString();
  const scaledScreens = Math.round(baseScreens * factor).toLocaleString();
  const scaledDalys = Math.round(baseDalys * factor).toLocaleString();
  const unitCost =
    cohortFilter === 'antenatal' ? '৳ 46.80' : timeWindow === 'q4' ? '৳ 41.20' : '৳ 42.50';

  /* =========================================================
     SECONDARY ROUTE: RESEARCH & EVIDENCE
     ========================================================= */
  if (route === 'research-and-evidence') {
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary p-7 flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <span className="font-label-sm text-xs text-secondary-fixed font-bold uppercase tracking-wider">
              Peer-Reviewed National Evidence • BSMMU / icddr,b / NIPSOM
            </span>
            <h1 className="font-display-md text-[32px] font-extrabold mt-1">
              Research &amp; Epidemiological Evidence Repository
            </h1>
            <p className="font-body-md text-sm text-on-primary/85 mt-1.5">
              Open-access hemoglobinopathy prevalence surveys, WHO-CHOICE cost-effectiveness
              tables, and South Asian cardiometabolic prevention trials across Bangladesh.
            </p>
          </div>
          <button
            type="button"
            onClick={onExportCsv}
            className="px-4 py-2.5 rounded-xl bg-secondary text-on-secondary font-label-md text-xs font-bold flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download Aggregate Dataset (CSV)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {RESEARCH_PAPERS.map((paper) => (
            <article
              key={paper.id}
              className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded bg-secondary-container text-on-secondary-fixed font-bold">
                    {paper.category}
                  </span>
                  <span className="font-mono text-outline">{paper.date}</span>
                </div>
                <h2 className="font-title-lg text-lg text-primary font-bold leading-snug">
                  {paper.title}
                </h2>
                <p className="font-label-sm text-xs text-secondary font-semibold">
                  {paper.authors} • {paper.affiliation}
                </p>
                <p className="font-body-sm text-xs text-on-surface-variant line-clamp-4">
                  {paper.abstract}
                </p>
              </div>
              <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                <span className="font-mono text-[11px] text-outline">{paper.doi}</span>
                <button
                  type="button"
                  onClick={() => onOpenPaper(paper)}
                  className="px-3.5 py-2 rounded-lg bg-primary text-on-primary font-label-md text-xs font-bold flex items-center gap-1"
                >
                  <span>Read Full Brief</span>
                  <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  /* =========================================================
     SECONDARY ROUTE: FIELD OPERATIONS / DIVISION TELEMETRY
     ========================================================= */
  if (route === 'field-operations') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-label-sm text-xs text-secondary font-bold uppercase tracking-wider">
              64-District Field Operations &amp; Division Telemetry
            </span>
            <h1 className="font-headline-lg text-[28px] text-primary font-extrabold">
              Upazila Outreach &amp; University HPLC Screening Drives
            </h1>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('bangladesh-access')}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">pin_drop</span>
            <span>Open 64-District Lab Directory</span>
          </button>
        </div>

        {/* Division Telemetry Table */}
        <div className="rounded-2xl bg-surface-container-lowest border border-surface-container overflow-hidden shadow-xs">
          <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
            <span className="font-title-md text-sm text-primary font-bold">
              Division-Level Screening Yield &amp; DALY Impact Matrix
            </span>
            <span className="font-mono text-xs text-secondary font-bold">
              Synced: DGHS DHIS2 Telemetry
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-container text-[11px] uppercase text-outline font-bold">
                  <th className="py-3.5 px-6">Division</th>
                  <th className="py-3.5 px-4">National Share</th>
                  <th className="py-3.5 px-4">Citizens Reached</th>
                  <th className="py-3.5 px-4">HPLC Screens</th>
                  <th className="py-3.5 px-4">Carrier Yield</th>
                  <th className="py-3.5 px-6">DALYs Averted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-sm">
                {DIVISION_STATS.map((d) => (
                  <tr key={d.id} className="hover:bg-surface-container-low/60">
                    <td className="py-3.5 px-6 font-bold text-primary">{d.name} Division</td>
                    <td className="py-3.5 px-4 font-mono tabular-nums">{d.share}%</td>
                    <td className="py-3.5 px-4 font-mono tabular-nums">
                      {d.reach.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums">
                      {d.screens.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-mono text-xs font-bold">
                        {d.traitYield}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-mono tabular-nums font-bold text-secondary">
                      {d.dalys.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Field Dispatches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TELEMETRY_DISPATCHES.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-surface-container-lowest border border-surface-container flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-xs text-secondary font-bold uppercase">
                  {item.regionHeader}
                </span>
                <span className="font-mono text-xs text-outline">{item.timestamp}</span>
              </div>
              <h3 className="font-title-md text-base text-primary font-bold">{item.title}</h3>
              <p className="font-body-sm text-xs text-on-surface-variant">{item.summary}</p>
              <div className="flex items-center gap-3 pt-2 text-xs font-mono text-primary font-semibold">
                <span className="px-2 py-1 rounded bg-surface-container-low">{item.metricA}</span>
                <span className="px-2 py-1 rounded bg-surface-container-low">{item.metricB}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================================================
     SECONDARY ROUTE: OUTBREAK & SEASONAL SURVEILLANCE ALERTS
     ========================================================= */
  if (route === 'outbreak-alerts') {
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl bg-primary text-on-primary p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-label-sm text-xs text-secondary-fixed font-bold uppercase tracking-wider">
              IEDCR &amp; Hematology Safe-Blood Advisories
            </span>
            <h1 className="font-headline-lg text-[28px] font-extrabold mt-1">
              Seasonal Advisories &amp; Safe Blood Supply Bulletins
            </h1>
          </div>
          <a
            href="tel:16263"
            className="px-4 py-2.5 rounded-xl bg-secondary text-on-secondary font-label-md text-xs font-bold flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>IEDCR / Batayon 16263</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              level: 'Active Advisory • Monsoon Vector',
              title: 'Dengue Platelet & Thalassemia Packed-RBC Reserve Coordination',
              region: 'Dhaka South, Dhaka North & Chattogram City Corporations',
              body: 'During peak Aedes transmission, voluntary blood banks prioritize leukodepleted packed RBC units for registered Thalassemia Major children while separating apheresis platelet pools.',
              tone: 'bg-error-container text-on-error-container',
            },
            {
              level: 'Environmental Watch • Winter PM2.5',
              title: 'Trans-Boundary & Brick-Kiln Particulate Surge (AQI > 210)',
              region: 'Dhaka, Gazipur, Narayanganj & Rajshahi',
              body: 'COPD, asthma, and hypertensive patients advised to wear KN95 masks during morning commutes and maintain indoor kitchen cross-ventilation.',
              tone: 'bg-secondary-container text-on-secondary-fixed',
            },
            {
              level: 'Reagent Supply • Normal',
              title: 'Bio-Rad D-10 HPLC Buffer & Column Stock Verified (98.4%)',
              region: 'All 28 Public & NGO Reference Hematology Nodes',
              body: 'Q1–Q2 cation-exchange hemoglobinopathy reagent kits pre-positioned across BSMMU, CMCH, RMCH, RpMCH, and MAG Osmani Medical College.',
              tone: 'bg-tertiary-fixed text-on-tertiary-fixed',
            },
          ].map((alert, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container flex flex-col justify-between gap-3"
            >
              <div className="flex flex-col gap-2">
                <span className={`self-start px-2.5 py-0.5 rounded font-label-sm text-[11px] font-bold ${alert.tone}`}>
                  {alert.level}
                </span>
                <h2 className="font-title-md text-base text-primary font-bold">{alert.title}</h2>
                <span className="font-mono text-xs text-secondary font-semibold">
                  {alert.region}
                </span>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  {alert.body}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('bangladesh-access')}
                className="self-start font-label-md text-xs text-primary font-bold hover:text-secondary flex items-center gap-1"
              >
                <span>View Regional Reference Hospitals</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================================================
     PRIMARY ROUTE: INTELLIGENCE DASHBOARD (Screen 6: Image_11 / Image_12)
     ========================================================= */
  return (
    <div className="flex flex-col gap-6">
      {/* Top Breadcrumb + View Mode Switcher + Export Controls */}
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 font-label-sm text-xs text-outline">
            <span>National Surveillance</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-secondary font-bold">Epidemiology &amp; Health Economics</span>
          </div>
          <h1 className="font-display-md text-[30px] xl:text-[34px] text-primary font-extrabold tracking-tight leading-tight">
            National Health Intelligence &amp; Prevention ROI
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* 3-Mode View Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-surface-container border border-outline-variant/25">
            {[
              { id: 'public', label: 'Public View' },
              { id: 'epidemiological', label: 'Epidemiological & Economics' },
              { id: 'telemetry', label: 'Telemetry Stream' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setViewMode(m.id as typeof viewMode)}
                className={`px-3 py-1.5 rounded-lg font-label-sm text-xs font-bold transition-colors whitespace-nowrap ${
                  viewMode === m.id
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onExportBrief}
            className="px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-primary font-label-md text-xs font-bold hover:bg-surface-container-low flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">description</span>
            <span>Policy Brief</span>
          </button>

          <button
            type="button"
            onClick={onExportCsv}
            className="px-3.5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-container flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export CSV</span>
          </button>
        </div>
      </section>

      {/* Interactive Epidemiological Filter Bar */}
      <section className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[18px]">tune</span>
            <span className="font-label-md text-xs text-primary font-bold uppercase">
              Cohort Filters:
            </span>
          </div>

          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            aria-label="Filter by Division"
            className="px-3 py-1.5 rounded-lg bg-surface-container-low text-primary font-label-md text-xs font-bold border border-outline-variant/30 focus:outline-none"
          >
            <option value="all">All 8 Divisions (64 Districts)</option>
            {DIVISION_STATS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} Division ({d.share}% Share)
              </option>
            ))}
          </select>

          <select
            value={timeWindow}
            onChange={(e) => setTimeWindow(e.target.value as typeof timeWindow)}
            aria-label="Filter by Surveillance Window"
            className="px-3 py-1.5 rounded-lg bg-surface-container-low text-primary font-label-md text-xs font-bold border border-outline-variant/30 focus:outline-none"
          >
            <option value="fy2025">Cumulative 2024–2025 Cycle</option>
            <option value="rolling12">Rolling 12-Month Window</option>
            <option value="q4">Latest Quarter (Q4 Surge)</option>
          </select>

          <select
            value={cohortFilter}
            onChange={(e) => setCohortFilter(e.target.value as typeof cohortFilter)}
            aria-label="Filter by Target Population Cohort"
            className="px-3 py-1.5 rounded-lg bg-surface-container-low text-primary font-label-md text-xs font-bold border border-outline-variant/30 focus:outline-none"
          >
            <option value="all">All Screening Cohorts</option>
            <option value="premarital">Pre-Marital Youth &amp; University (18–29)</option>
            <option value="antenatal">First-Trimester Antenatal Couples</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {selectedDivision !== 'all' || timeWindow !== 'fy2025' || cohortFilter !== 'all' ? (
            <button
              type="button"
              onClick={() => {
                setSelectedDivision('all');
                setTimeWindow('fy2025');
                setCohortFilter('all');
              }}
              className="px-2.5 py-1 rounded bg-surface-container text-xs text-primary font-bold hover:bg-surface-container-high"
            >
              Reset Baseline
            </button>
          ) : (
            <span className="font-mono text-[11px] text-secondary font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              DHIS2 &amp; BSMMU Registry Synced
            </span>
          )}
        </div>
      </section>

      {/* 4 Primary KPI Cards (Responsive sizing prevents clipping of 1,420,890) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs text-outline uppercase font-bold tracking-wider">
              Citizens Reached
            </span>
            <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-fixed font-mono text-[11px] font-bold">
              +14.2% YoY
            </span>
          </div>
          <div className="text-[28px] xl:text-[34px] font-extrabold text-primary tabular-nums leading-tight tracking-tight">
            {scaledReach}
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-surface-container text-xs text-on-surface-variant">
            <span>Community &amp; Campus Drives</span>
            <svg width="64" height="18" viewBox="0 0 64 18">
              <polyline
                fill="none"
                stroke="#006a61"
                strokeWidth="2.2"
                strokeLinecap="round"
                points="0,16 16,13 32,10 48,6 64,2"
              />
            </svg>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs text-outline uppercase font-bold tracking-wider">
              HPLC Screens Logged
            </span>
            <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-mono text-[11px] font-bold">
              {divObj ? `${divObj.traitYield} Yield` : '11.4% Trait'}
            </span>
          </div>
          <div className="text-[28px] xl:text-[34px] font-extrabold text-primary tabular-nums leading-tight tracking-tight">
            {scaledScreens}
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-surface-container text-xs text-on-surface-variant">
            <span>Automated Bio-Rad D-10</span>
            <svg width="64" height="18" viewBox="0 0 64 18">
              <polyline
                fill="none"
                stroke="#1c0047"
                strokeWidth="2.2"
                strokeLinecap="round"
                points="0,15 16,14 32,9 48,7 64,3"
              />
            </svg>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs text-outline uppercase font-bold tracking-wider">
              Unit Outreach Cost
            </span>
            <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-fixed font-mono text-[11px] font-bold">
              -8.4% Opt
            </span>
          </div>
          <div className="text-[28px] xl:text-[34px] font-extrabold text-secondary tabular-nums leading-tight tracking-tight">
            {unitCost}
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-surface-container text-xs text-on-surface-variant">
            <span>Per Citizen Educated (BDT)</span>
            <span className="font-mono text-[11px] text-secondary font-bold">Audit Verified</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs text-outline uppercase font-bold tracking-wider">
              DALYs Averted
            </span>
            <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-mono text-[11px] font-bold">
              WHO-CHOICE
            </span>
          </div>
          <div className="text-[28px] xl:text-[34px] font-extrabold text-primary tabular-nums leading-tight tracking-tight">
            {scaledDalys}
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-surface-container text-xs text-on-surface-variant">
            <span>Healthy Life-Years Preserved</span>
            <button
              type="button"
              onClick={onOpenPedigree}
              className="text-tertiary font-bold hover:underline"
            >
              Model Risk →
            </button>
          </div>
        </div>
      </section>

      {/* Main 12-Col Analytical Grid (8-Col Surveillance & ROI + 4-Col Telemetry & Briefs) */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 8 Columns */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Carrier Density Histogram + Spatial GIS Card */}
          <div className="rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs p-6 flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="font-label-sm text-xs text-secondary font-bold uppercase tracking-wider">
                  Regional Hemoglobinopathy Surveillance
                </span>
                <h2 className="font-headline-sm text-xl text-primary font-extrabold">
                  Division Carrier Density &amp; Spatial GIS Distribution
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-surface-container-low font-mono text-xs text-primary font-semibold">
                n = 18,540 HPLC Assays
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Division Bar Histogram (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-3">
                {DIVISION_STATS.map((d) => {
                  const pctNum = parseFloat(d.traitYield);
                  const barWidth = Math.min(100, Math.round((pctNum / 15) * 100));
                  const isSelected = selectedDivision === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() =>
                        setSelectedDivision(selectedDivision === d.id ? 'all' : d.id)
                      }
                      className={`p-2 rounded-lg text-left transition-colors ${
                        isSelected
                          ? 'bg-secondary-container/45 ring-1 ring-secondary'
                          : 'hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-primary">
                          {d.name}{' '}
                          <span className="text-on-surface-variant font-normal">
                            ({d.screens.toLocaleString()} screens)
                          </span>
                        </span>
                        <span className="font-mono font-bold text-tertiary tabular-nums">
                          {d.traitYield} Carrier
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            pctNum >= 12 ? 'bg-tertiary' : 'bg-secondary'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Spatial GIS Preview + Variant Fractions (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                <div className="rounded-xl overflow-hidden border border-surface-container relative h-44">
                  <ResilientImage
                    src={HOTLINKED_ASSETS.desktopDhakaGisMap}
                    alt="Bangladesh regional carrier prevalence GIS heatmap"
                    className="w-full h-full object-cover"
                    fallbackIcon="map"
                  />
                  <div className="absolute bottom-2 inset-x-2 p-2 rounded-lg bg-primary/85 text-on-primary text-[11px] flex items-center justify-between">
                    <span>Rajshahi &amp; Rangpur HbE Belt</span>
                    <span className="font-mono text-secondary-fixed font-bold">12.4–13.1%</span>
                  </div>
                </div>

                {/* Hemoglobinopathy Fractions Breakdown */}
                <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-2">
                  <span className="font-label-sm text-[11px] text-primary font-bold uppercase">
                    Detected Carrier Fractions (BD)
                  </span>
                  <div className="h-2.5 rounded-full overflow-hidden flex">
                    <div className="bg-secondary h-full" style={{ width: '62%' }} />
                    <div className="bg-tertiary h-full" style={{ width: '31%' }} />
                    <div className="bg-outline h-full" style={{ width: '7%' }} />
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[11px] font-mono pt-0.5">
                    <div>
                      <span className="inline-block w-2 h-2 rounded-full bg-secondary mr-1" />
                      <strong>HbE 62%</strong>
                    </div>
                    <div>
                      <span className="inline-block w-2 h-2 rounded-full bg-tertiary mr-1" />
                      <strong>β-Thal 31%</strong>
                    </div>
                    <div>
                      <span className="inline-block w-2 h-2 rounded-full bg-outline mr-1" />
                      <span>Other 7%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 18x Lifetime Economic Return & Catastrophic Expenditure Shield */}
          <div className="rounded-2xl bg-gradient-to-br from-primary via-primary-container to-[#093456] text-on-primary p-6 flex flex-col gap-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-label-sm text-xs text-secondary-fixed font-bold uppercase tracking-wider">
                  Household Health Economics • Out-of-Pocket Protection
                </span>
                <h2 className="font-headline-sm text-2xl font-extrabold mt-0.5">
                  18x Lifetime Economic Return on Pre-Marital HPLC Screening
                </h2>
              </div>
              <span className="px-3 py-1 rounded-lg bg-secondary text-on-secondary font-mono text-xs font-bold">
                91.4% Averted Poverty Rate
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-on-primary/10 border border-on-primary/15 flex flex-col gap-1">
                <span className="font-label-sm text-[11px] text-secondary-fixed uppercase font-bold">
                  Preventive Couple Screening
                </span>
                <span className="font-headline-md text-2xl font-extrabold tabular-nums">
                  ~ ৳ 2,500
                </span>
                <span className="text-xs text-on-primary/80">
                  One-time lifetime HPLC for both partners + genetic counseling
                </span>
              </div>

              <div className="p-4 rounded-xl bg-error-container/25 border border-error-container/40 flex flex-col gap-1">
                <span className="font-label-sm text-[11px] text-error-container uppercase font-bold">
                  Unmanaged Major Care
                </span>
                <span className="font-headline-md text-2xl font-extrabold tabular-nums">
                  ৳ 2.5L–4.5L / yr
                </span>
                <span className="text-xs text-on-primary/80">
                  Monthly leukodepleted RBC transfusions + iron chelation therapy
                </span>
              </div>

              <div className="p-4 rounded-xl bg-on-primary/10 border border-on-primary/15 flex flex-col gap-1 justify-between">
                <span className="font-label-sm text-[11px] text-secondary-fixed uppercase font-bold">
                  Clinical Decision Modeling
                </span>
                <p className="text-xs text-on-primary/85">
                  Simulate couple carrier genotypes and 3-generation pedigree risk interactively.
                </p>
                <button
                  type="button"
                  onClick={onOpenPedigree}
                  className="mt-1 px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-label-sm text-xs font-bold self-start flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">account_tree</span>
                  <span>Launch Pedigree Tool</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Live District Telemetry + Policy & Research Briefs */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Live District Telemetry Stream */}
          <div className="rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs p-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                <h3 className="font-title-md text-base text-primary font-bold">
                  Live District Telemetry
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('field-operations')}
                className="font-label-sm text-xs text-secondary font-bold hover:underline"
              >
                All 64 Dist →
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {TELEMETRY_DISPATCHES.map((d) => (
                <div
                  key={d.id}
                  className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-[10px] text-secondary font-bold uppercase">
                      {d.regionHeader}
                    </span>
                    <span className="font-mono text-[10px] text-outline">{d.timestamp}</span>
                  </div>
                  <h4 className="font-title-sm text-xs text-primary font-bold leading-snug">
                    {d.title}
                  </h4>
                  <div className="flex items-center gap-2 pt-0.5 font-mono text-[10px] text-on-surface-variant">
                    <span>{d.metricA}</span>
                    <span>•</span>
                    <span>{d.metricB}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Policy & Research Briefs */}
          <div className="rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs p-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-title-md text-base text-primary font-bold">
                Policy &amp; Evidence Briefs
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('research-and-evidence')}
                className="font-label-sm text-xs text-secondary font-bold hover:underline"
              >
                Library →
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {RESEARCH_PAPERS.map((paper) => (
                <button
                  key={paper.id}
                  type="button"
                  onClick={() => onOpenPaper(paper)}
                  className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-left transition-colors flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-secondary uppercase">
                    <span>{paper.category}</span>
                    <span className="font-mono text-outline">{paper.size}</span>
                  </div>
                  <span className="font-title-sm text-xs text-primary font-bold line-clamp-2">
                    {paper.title}
                  </span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant">
                    {paper.authors}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Data & Public Governance Footer Banner (Uses Open Data Schema button, zero API key UI) */}
      <section className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3 max-w-3xl">
          <span className="material-symbols-outlined text-primary text-[24px] mt-0.5 shrink-0">
            policy
          </span>
          <div className="flex flex-col gap-0.5">
            <h3 className="font-title-sm text-sm text-primary font-bold">
              CC-BY 4.0 Open Epidemiological Governance &amp; Privacy Standard
            </h3>
            <p className="font-body-sm text-xs text-on-surface-variant">
              All district-level hemoglobinopathy and NCD surveillance aggregates are k-anonymized
              in compliance with DGHS Health Information System (HIS) &amp; BMRC ethical guidelines.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() =>
              onToast(
                'Open Data Schema (v2.4)',
                'HL7 FHIR & DHIS2 k-anonymized epidemiological schema specification downloaded.'
              )
            }
            className="px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-primary font-label-md text-xs font-bold hover:bg-surface-container"
          >
            Open Data Schema
          </button>
          <button
            type="button"
            onClick={onExportCsv}
            className="px-3.5 py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-xs font-bold hover:opacity-95"
          >
            Download Public CSV
          </button>
        </div>
      </section>
    </div>
  );
};
