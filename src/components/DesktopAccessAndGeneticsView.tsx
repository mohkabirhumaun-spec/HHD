import React, { useState } from 'react';
import {
  HOTLINKED_ASSETS,
  VERIFIED_FACILITIES,
  calculateMendelianOutcome,
} from '../data/healthData';
import { GenotypeOption } from '../types';
import { ResilientImage } from './ResilientImage';

interface DesktopAccessViewProps {
  initialSpecialty?: string;
  onOpenSuggestFacility: () => void;
  onOpenCounseling: () => void;
  onToast: (title: string, msg: string) => void;
}

export const DesktopAccessView: React.FC<DesktopAccessViewProps> = ({
  initialSpecialty = 'all',
  onOpenSuggestFacility,
  onOpenCounseling,
  onToast,
}) => {
  const [division, setDivision] = useState<string>('All');
  const [tier, setTier] = useState<string>('all');
  const [tariff, setTariff] = useState<string>('all');
  const [specialty, setSpecialty] = useState<string>(initialSpecialty);
  const [searchText, setSearchText] = useState<string>('');
  const [activeLayer, setActiveLayer] = useState<'hplc' | 'via' | 'blood'>('hplc');

  const filtered = VERIFIED_FACILITIES.filter((f) => {
    const matchDiv = division === 'All' || f.division === division;
    const matchTier = tier === 'all' || f.governanceTier === tier;
    const matchTariff = tariff === 'all' || f.tariffBracket === tariff;
    const matchSpec = specialty === 'all' || f.specialties.includes(specialty as never);
    const q = searchText.trim().toLowerCase();
    const matchQ =
      !q ||
      f.name.toLowerCase().includes(q) ||
      f.address.toLowerCase().includes(q) ||
      f.division.toLowerCase().includes(q) ||
      f.capabilityTags.some((t) => t.toLowerCase().includes(q));
    return matchDiv && matchTier && matchTariff && matchSpec && matchQ;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner (Screen 8: Image_15 / Image_16) */}
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-label-sm text-xs text-secondary font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span>National Clinical Access Registry • 64 Districts</span>
          </div>
          <h1 className="font-display-md text-[30px] xl:text-[34px] text-primary font-extrabold tracking-tight mt-0.5">
            Bangladesh Verified Screening &amp; Public Tariff Directory
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenCounseling}
            className="px-4 py-2 rounded-xl bg-tertiary text-on-tertiary font-label-md text-xs font-bold flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">diversity_1</span>
            <span>Book Genetic Counseling</span>
          </button>
          <button
            type="button"
            onClick={onOpenSuggestFacility}
            className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-primary font-label-md text-xs font-bold hover:bg-surface-container-low flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add_location_alt</span>
            <span>Nominate Public Lab</span>
          </button>
        </div>
      </section>

      {/* Multi-Criteria 4-Dropdown Filter Bar + Specialty Chips */}
      <section className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2 relative">
            <span className="material-symbols-outlined text-outline text-[18px] absolute left-3 top-1/2 -translate-y-1/2">
              search
            </span>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search BSMMU, Samity, CMCH, Shahbagh, Dhanmondi..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface-container-low text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-secondary"
            />
          </div>

          <select
            value={division}
            onChange={(e) => setDivision(e.target.value)}
            className="p-2.5 rounded-xl bg-surface-container-low text-primary font-label-md text-xs font-bold border border-outline-variant/30 focus:outline-none"
          >
            <option value="All">All 8 Divisions</option>
            <option value="Dhaka">Dhaka Division</option>
            <option value="Chattogram">Chattogram Division</option>
            <option value="Sylhet">Sylhet Division</option>
            <option value="Rajshahi">Rajshahi Division</option>
            <option value="Rangpur">Rangpur Division</option>
            <option value="Khulna">Khulna Division</option>
            <option value="Barishal">Barishal Division</option>
          </select>

          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="p-2.5 rounded-xl bg-surface-container-low text-primary font-label-md text-xs font-bold border border-outline-variant/30 focus:outline-none"
          >
            <option value="all">All Governance Tiers</option>
            <option value="apex">Apex Medical Univ / College</option>
            <option value="ngo">Specialist Non-Profit / Zakat</option>
            <option value="sadar">District Sadar Hospital</option>
            <option value="uhc">Upazila Health Complex</option>
          </select>

          <select
            value={tariff}
            onChange={(e) => setTariff(e.target.value)}
            className="p-2.5 rounded-xl bg-surface-container-low text-primary font-label-md text-xs font-bold border border-outline-variant/30 focus:outline-none"
          >
            <option value="all">All Public Tariffs</option>
            <option value="free">Free (৳ 0–10 Govt Ticket)</option>
            <option value="subsidized">Subsidized Public (৳ 600–950)</option>
            <option value="zakat">Zakat-Supported Sliding Scale</option>
          </select>
        </div>

        {/* Interactive Specialty Module Chips + Dynamic Counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-surface-container">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Capabilities' },
              { id: 'hplc', label: 'Automated HPLC Lab' },
              { id: 'prenatal', label: 'Prenatal Molecular (CVS)' },
              { id: 'via', label: 'Free VIA Cervical' },
              { id: 'ncd', label: 'UHC NCD Corner' },
              { id: 'blood', label: 'Safe Transfusion Bank' },
              { id: 'counseling', label: 'Pre-Marital Counseling' },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSpecialty(chip.id)}
                className={`px-3 py-1.5 rounded-lg font-label-sm text-xs font-bold transition-colors ${
                  specialty === chip.id
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-primary font-bold">
              Found {filtered.length} Accredited Centers
            </span>
            {(division !== 'All' ||
              tier !== 'all' ||
              tariff !== 'all' ||
              specialty !== 'all' ||
              searchText) && (
              <button
                type="button"
                onClick={() => {
                  setDivision('All');
                  setTier('all');
                  setTariff('all');
                  setSpecialty('all');
                  setSearchText('');
                }}
                className="text-xs text-secondary font-bold underline"
              >
                Reset All
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main 12-Col Split: 7-Col Facility Cards + 5-Col Sticky GIS Telemetry Map */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Facility Cards */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          {filtered.map((f) => (
            <article
              key={f.id}
              className="rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs overflow-hidden flex flex-col sm:flex-row"
            >
              <div className="sm:w-52 h-44 sm:h-auto relative shrink-0">
                <ResilientImage
                  src={f.image}
                  alt={f.imageAlt}
                  className="w-full h-full object-cover"
                  fallbackIcon={f.icon}
                />
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                  <span className="px-2 py-0.5 rounded bg-primary/90 text-on-primary font-label-sm text-[10px] font-bold">
                    {f.governanceBadge}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-secondary text-on-secondary font-label-sm text-[10px] font-bold self-start">
                    {f.division}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-title-md text-base text-primary font-bold leading-snug">
                        {f.name}
                      </h2>
                      <p className="font-label-sm text-xs text-secondary font-semibold">
                        {f.subtitle}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-2.5 py-1 rounded-lg bg-surface-container-low font-mono text-xs text-primary font-extrabold block">
                        {f.costDisplay}
                      </span>
                      <span className="font-label-sm text-[10px] text-outline block mt-0.5">
                        Public Tariff
                      </span>
                    </div>
                  </div>

                  <p className="font-body-sm text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-secondary">
                      location_on
                    </span>
                    <span>{f.address}</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                    {f.detailedCapabilities.slice(0, 4).map((cap, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-1.5 text-[11px] text-on-surface"
                      >
                        <span className="material-symbols-outlined text-secondary text-[14px] mt-0.5 shrink-0">
                          check_circle
                        </span>
                        <span className="line-clamp-1">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-surface-container flex flex-wrap items-center justify-between gap-2">
                  <span className="font-label-sm text-[11px] text-outline">{f.hours}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onToast(
                          f.shortName,
                          `${f.appointmentInfo} • ${f.costNote}`
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-surface-container-low text-primary font-label-sm text-xs font-bold hover:bg-surface-container"
                    >
                      OPD Details
                    </button>
                    <a
                      href={`tel:${f.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-label-sm text-xs font-bold flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">call</span>
                      <span>{f.phoneDisplay}</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Right 5 Columns: Sticky National Spatial GIS Telemetry Panel */}
        <div className="xl:col-span-5 xl:sticky xl:top-24 flex flex-col gap-4">
          <div className="rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs overflow-hidden">
            <div className="p-4 bg-primary text-on-primary flex items-center justify-between">
              <div>
                <span className="font-label-sm text-[10px] text-secondary-fixed font-bold uppercase tracking-wider">
                  National Spatial GIS Telemetry
                </span>
                <h3 className="font-title-md text-sm font-bold">
                  Accredited Diagnostic &amp; Transfusion Grid
                </h3>
              </div>
              <div className="flex gap-1">
                {[
                  { id: 'hplc', label: 'HPLC' },
                  { id: 'via', label: 'VIA' },
                  { id: 'blood', label: 'Blood' },
                ].map((layer) => (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => setActiveLayer(layer.id as typeof activeLayer)}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      activeLayer === layer.id
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-on-primary/15 text-on-primary'
                    }`}
                  >
                    {layer.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Aerial Map with Clickable Division Cluster Pins */}
            <div className="h-72 relative">
              <ResilientImage
                src={HOTLINKED_ASSETS.desktopBangladeshAerialMap}
                alt="Bangladesh spatial GIS map showing accredited HPLC and NCD centers"
                className="w-full h-full object-cover"
                fallbackIcon="map"
              />
              <div className="absolute inset-0 bg-primary/20" />

              {/* Interactive Cluster Pins */}
              {[
                { div: 'Dhaka', count: 14, top: '48%', left: '48%' },
                { div: 'Chattogram', count: 8, top: '68%', left: '72%' },
                { div: 'Sylhet', count: 6, top: '30%', left: '74%' },
                { div: 'Rangpur', count: 5, top: '18%', left: '34%' },
                { div: 'Rajshahi', count: 6, top: '42%', left: '26%' },
              ].map((pin) => (
                <button
                  key={pin.div}
                  type="button"
                  style={{ top: pin.top, left: pin.left }}
                  onClick={() => setDivision(division === pin.div ? 'All' : pin.div)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full font-mono text-[11px] font-extrabold shadow-lg border transition-transform hover:scale-105 ${
                    division === pin.div
                      ? 'bg-secondary text-on-secondary border-white scale-110'
                      : 'bg-primary/95 text-on-primary border-secondary-fixed/60'
                  }`}
                >
                  {pin.div} ({pin.count})
                </button>
              ))}
            </div>

            {/* Lab Capacity Telemetry Counters */}
            <div className="p-4 grid grid-cols-3 gap-2 bg-surface-container-low border-t border-surface-container text-center">
              <div className="p-2 rounded-lg bg-surface-container-lowest">
                <div className="font-headline-sm text-lg font-extrabold text-primary tabular-nums">
                  28
                </div>
                <div className="font-label-sm text-[10px] text-on-surface-variant">
                  HPLC Reference
                </div>
              </div>
              <div className="p-2 rounded-lg bg-surface-container-lowest">
                <div className="font-headline-sm text-lg font-extrabold text-secondary tabular-nums">
                  492
                </div>
                <div className="font-label-sm text-[10px] text-on-surface-variant">
                  UHC NCD/VIA
                </div>
              </div>
              <div className="p-2 rounded-lg bg-surface-container-lowest">
                <div className="font-headline-sm text-lg font-extrabold text-tertiary tabular-nums">
                  89
                </div>
                <div className="font-label-sm text-[10px] text-on-surface-variant">
                  Safe Blood Nodes
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Access Hotlines Card */}
          <div className="p-5 rounded-2xl bg-primary text-on-primary flex flex-col gap-3">
            <h3 className="font-title-md text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed text-[18px]">
                emergency
              </span>
              <span>National Emergency &amp; Referral Hotlines</span>
            </h3>
            <div className="flex flex-col gap-2 text-xs">
              <a
                href="tel:16263"
                className="p-2.5 rounded-xl bg-on-primary/10 hover:bg-on-primary/15 flex items-center justify-between"
              >
                <span>Shastho Batayon (24/7 DGHS Doctor)</span>
                <span className="font-mono font-extrabold text-secondary-fixed">16263</span>
              </a>
              <a
                href="tel:+88029664412"
                className="p-2.5 rounded-xl bg-on-primary/10 hover:bg-on-primary/15 flex items-center justify-between"
              >
                <span>Thalassemia Samity Blood &amp; HPLC Desk</span>
                <span className="font-mono font-extrabold text-secondary-fixed">02-9664412</span>
              </a>
              <a
                href="tel:999"
                className="p-2.5 rounded-xl bg-on-primary/10 hover:bg-on-primary/15 flex items-center justify-between"
              >
                <span>National Ambulance &amp; Emergency</span>
                <span className="font-mono font-extrabold text-secondary-fixed">999</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ============================================================================
   DESKTOP GENETICS & THALASSEMIA WORKSPACE (Matches Screen 2 + Launches Screen 9)
   ============================================================================ */
interface DesktopGeneticsViewProps {
  onOpenPedigree: () => void;
  onNavigateAccess: (specialty?: string) => void;
  onOpenCounseling: () => void;
}

export const DesktopGeneticsView: React.FC<DesktopGeneticsViewProps> = ({
  onOpenPedigree,
  onNavigateAccess,
  onOpenCounseling,
}) => {
  const [p1, setP1] = useState<GenotypeOption>('beta-thal');
  const [p2, setP2] = useState<GenotypeOption>('hbe');
  const outcome = calculateMendelianOutcome(p1, p2);

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Banner with Prominent 3-Gen Pedigree Modal Trigger */}
      <section className="rounded-2xl bg-gradient-to-r from-tertiary via-tertiary-container to-primary text-on-primary p-8 flex flex-wrap items-center justify-between gap-6 shadow-sm">
        <div className="max-w-2xl flex flex-col gap-2.5">
          <span className="self-start px-3 py-1 rounded-md bg-on-primary/15 text-secondary-fixed font-label-sm text-xs font-bold uppercase tracking-wider">
            National Hemoglobinopathy Registry &amp; Counseling Hub
          </span>
          <h1 className="font-display-md text-[32px] xl:text-[36px] font-extrabold leading-tight">
            Genetics, HbE &amp; Beta-Thalassemia Prevention Workspace
          </h1>
          <p className="font-body-md text-sm text-on-primary/85 leading-relaxed">
            In Bangladesh, 10–12% of citizens silently carry HbE or β-Thalassemia trait while living
            completely healthy lives. Voluntary pre-marital HPLC screening empowers couples with
            non-stigmatizing reproductive clarity.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenPedigree}
            className="px-5 py-3.5 rounded-xl bg-secondary text-on-secondary font-label-lg text-sm font-extrabold shadow-lg hover:opacity-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">account_tree</span>
            <span>Launch 3-Gen Pedigree &amp; CBC Calculator</span>
          </button>
          <button
            type="button"
            onClick={onOpenCounseling}
            className="px-5 py-2.5 rounded-xl bg-on-primary/15 hover:bg-on-primary/25 text-on-primary font-label-md text-xs font-bold text-center"
          >
            Request Confidential Pre-Marital Counseling
          </button>
        </div>
      </section>

      {/* 4 Genetic Epidemiology KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'National Carrier Prevalence', val: '11.4%', sub: 'HbE (6.1%) + β-Thal Trait (4.1%)' },
          { label: 'Preventable Major Births / Yr', val: '~8,500', sub: 'Transfusion-dependent infants' },
          { label: 'Couple Profiles Modeled', val: '142,890', sub: 'Anonymous pre-marital sessions' },
          { label: 'Certified Counselors', val: '412', sub: 'BSMMU, Samity & Medical Colleges' },
        ].map((k, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs"
          >
            <span className="font-label-sm text-xs text-outline uppercase font-bold">{k.label}</span>
            <div className="font-headline-lg text-[30px] font-extrabold text-primary tabular-nums mt-1">
              {k.val}
            </div>
            <span className="font-body-sm text-xs text-on-surface-variant">{k.sub}</span>
          </div>
        ))}
      </section>

      {/* Interactive Mendelian Assortment & HPLC Clinical Differentiator */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-sm text-xs text-tertiary font-bold uppercase">
                Quick Couple Assortment Preview
              </span>
              <h2 className="font-headline-sm text-xl text-primary font-extrabold">
                Autosomal Recessive Per-Pregnancy Visualizer
              </h2>
            </div>
            <button
              type="button"
              onClick={onOpenPedigree}
              className="text-xs text-tertiary font-bold underline"
            >
              Open Full 3-Gen Pedigree →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-xs text-primary font-bold">
                Prospective Partner A
              </label>
              <select
                value={p1}
                onChange={(e) => setP1(e.target.value as GenotypeOption)}
                className="p-2.5 rounded-xl bg-surface-container-low text-primary font-bold text-sm border border-outline-variant/30"
              >
                <option value="normal">Normal (HbAA)</option>
                <option value="beta-thal">β-Thalassemia Carrier (HbA/β)</option>
                <option value="hbe">HbE Carrier (HbA/E)</option>
                <option value="unknown">Untested — Needs HPLC</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-xs text-primary font-bold">
                Prospective Partner B
              </label>
              <select
                value={p2}
                onChange={(e) => setP2(e.target.value as GenotypeOption)}
                className="p-2.5 rounded-xl bg-surface-container-low text-primary font-bold text-sm border border-outline-variant/30"
              >
                <option value="normal">Normal (HbAA)</option>
                <option value="beta-thal">β-Thalassemia Carrier (HbA/β)</option>
                <option value="hbe">HbE Carrier (HbA/E)</option>
                <option value="unknown">Untested — Needs HPLC</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-surface-container-low text-center">
              <div className="text-2xl font-extrabold text-secondary tabular-nums">
                {outcome.pNormal}%
              </div>
              <div className="text-xs text-on-surface-variant font-semibold mt-0.5">
                Unaffected (HbAA)
              </div>
            </div>
            <div className="p-4 rounded-xl bg-secondary-container/45 text-center">
              <div className="text-2xl font-extrabold text-primary tabular-nums">
                {outcome.pCarrier}%
              </div>
              <div className="text-xs text-primary font-semibold mt-0.5">
                Healthy Silent Carrier
              </div>
            </div>
            <div
              className={`p-4 rounded-xl text-center ${
                outcome.pMajor > 0
                  ? 'bg-error-container text-on-error-container'
                  : 'bg-surface-container-low text-on-surface-variant'
              }`}
            >
              <div className="text-2xl font-extrabold tabular-nums">{outcome.pMajor}%</div>
              <div className="text-xs font-bold mt-0.5">Major / HbE-β Disease</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low text-xs text-primary flex items-center justify-between gap-3">
            <span>
              <strong>Clinical Summary:</strong> {outcome.riskTitle}
            </span>
            <button
              type="button"
              onClick={() => onNavigateAccess('hplc')}
              className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold shrink-0"
            >
              Find ৳800 HPLC Lab
            </button>
          </div>
        </div>

        {/* Right 5 Cols: Gold-Standard HPLC vs Routine CBC */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-primary text-on-primary flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-label-sm text-xs text-secondary-fixed font-bold uppercase">
              Diagnostic Gold Standard
            </span>
            <h3 className="font-headline-sm text-xl font-extrabold">
              Why Automated HPLC Is Essential (vs. Routine CBC)
            </h3>
            <p className="font-body-sm text-xs text-on-primary/85 leading-relaxed">
              Standard CBC indices (MCV &lt; 80 fL, MCH &lt; 27 pg) flag microcytosis but cannot
              distinguish iron deficiency from HbE or β-Thalassemia trait—and empirical iron
              tablets in carriers cause harmful iron overload.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <div className="p-3 rounded-xl bg-on-primary/10 flex justify-between">
              <span>Normal Adult HbA2 Fraction</span>
              <span className="font-mono font-bold text-secondary-fixed">2.0% – 3.3%</span>
            </div>
            <div className="p-3 rounded-xl bg-on-primary/10 flex justify-between">
              <span>β-Thalassemia Carrier Cutoff</span>
              <span className="font-mono font-bold text-secondary-fixed">HbA2 &gt; 3.5%</span>
            </div>
            <div className="p-3 rounded-xl bg-on-primary/10 flex justify-between">
              <span>HbE Trait Quantification</span>
              <span className="font-mono font-bold text-secondary-fixed">HbE 22% – 35%</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPedigree}
            className="w-full py-2.5 rounded-xl bg-secondary text-on-secondary font-label-md text-xs font-bold"
          >
            Enter CBC MCV/HbA2 in Interactive Calculator
          </button>
        </div>
      </section>
    </div>
  );
};
