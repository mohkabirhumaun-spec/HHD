import React, { useState } from 'react';
import { NCD_TOPIC_CARDS, RESEARCH_PAPERS, VERIFIED_FACILITIES } from '../data/healthData';
import { ResearchPaper } from '../types';

/* 1. Global Epidemiology & Directory Search Modal (Cmd+K) */
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateFacility: (division: string) => void;
  onNavigateNcd: () => void;
  onOpenPedigree: () => void;
  onOpenPaper: (paper: ResearchPaper) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateFacility,
  onNavigateNcd,
  onOpenPedigree,
  onOpenPaper,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedFacilities = VERIFIED_FACILITIES.filter(
    (f) =>
      !q ||
      f.name.toLowerCase().includes(q) ||
      f.division.toLowerCase().includes(q) ||
      f.address.toLowerCase().includes(q) ||
      f.capabilityTags.some((t) => t.toLowerCase().includes(q))
  ).slice(0, 4);

  const matchedTopics = NCD_TOPIC_CARDS.filter(
    (t) =>
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.contextBody.toLowerCase().includes(q) ||
      t.categoryLabel.toLowerCase().includes(q)
  ).slice(0, 3);

  const matchedPapers = RESEARCH_PAPERS.filter(
    (p) => !q || p.title.toLowerCase().includes(q) || p.authors.toLowerCase().includes(q)
  ).slice(0, 2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-primary/45 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search HHD Intelligence"
    >
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden border border-outline-variant/30">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-surface-container">
          <span className="material-symbols-outlined text-secondary text-[22px]">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search HPLC labs, districts (Dhaka, Sylhet), NCD protocols, or research..."
            className="flex-1 bg-transparent text-on-surface font-body-md text-body-md focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-high"
          >
            ESC
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-4 flex flex-col gap-4">
          {/* Quick Action Shortcut */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPedigree();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md hover:opacity-90"
            >
              <span className="material-symbols-outlined text-[16px]">account_tree</span>
              <span>Launch 3-Gen Pedigree &amp; Risk Calculator</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateFacility('all');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary-container text-on-secondary-fixed font-label-md text-label-md hover:opacity-90"
            >
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              <span>64-District HPLC Directory</span>
            </button>
          </div>

          {/* Accredited Facilities */}
          {matchedFacilities.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                Verified Screening &amp; Clinical Facilities
              </span>
              {matchedFacilities.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateFacility(f.division);
                  }}
                  className="text-left p-2.5 rounded-lg hover:bg-surface-container-low flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="material-symbols-outlined text-secondary text-[20px]">
                      {f.icon}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-title-md text-primary truncate">
                        {f.name}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                        {f.division} Division · {f.costDisplay}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[18px]">
                    arrow_forward
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* NCD Protocols */}
          {matchedTopics.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                Preventive Clinical Guidelines
              </span>
              {matchedTopics.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateNcd();
                  }}
                  className="text-left p-2.5 rounded-lg hover:bg-surface-container-low flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      {t.icon}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-title-md text-primary truncate">
                        {t.title}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                        {t.categoryLabel} · {t.badge}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[18px]">
                    chevron_right
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Research Papers */}
          {matchedPapers.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                Peer-Reviewed Research
              </span>
              {matchedPapers.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPaper(p);
                  }}
                  className="text-left p-2.5 rounded-lg hover:bg-surface-container-low flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="material-symbols-outlined text-tertiary text-[20px]">
                      menu_book
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-title-md text-primary truncate">
                        {p.title}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                        {p.authors} · {p.date}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[18px]">
                    article
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* 2. Carrier Screening Readiness Assessment Modal ("Should I Get Screened?") */
interface ReadinessQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFindHplc: () => void;
  onOpenPedigree: () => void;
}

export const ReadinessQuizModal: React.FC<ReadinessQuizModalProps> = ({
  isOpen,
  onClose,
  onFindHplc,
  onOpenPedigree,
}) => {
  const [q1, setQ1] = useState<boolean | null>(null);
  const [q2, setQ2] = useState<boolean | null>(null);
  const [q3, setQ3] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const answeredCount = [q1, q2, q3].filter((v) => v !== null).length;
  const highPriority = q1 === true || q2 === true || q3 === true;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-primary text-on-primary px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-fixed text-[22px]">
              help_center
            </span>
            <h3 className="font-headline-sm text-headline-sm font-bold">
              Should I Get Screened? (3-Min Guide)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-on-primary/10 hover:bg-on-primary/20 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Voluntary, private self-check aligned with Bangladesh National Thalassemia Prevention
            guidelines. Zero data leaves your device.
          </p>

          {[
            {
              label:
                '1. Are you unmarried or planning marriage/pregnancy without a prior Hemoglobin Electrophoresis (HPLC) test?',
              val: q1,
              set: setQ1,
            },
            {
              label:
                '2. Have you ever been told you have mild low hemoglobin (Hb < 11 g/dL) or low MCV (< 80 fL) that did not resolve with iron tablets?',
              val: q2,
              set: setQ2,
            },
            {
              label:
                '3. Does anyone in your extended family carry Thalassemia / HbE trait or receive periodic blood transfusions?',
              val: q3,
              set: setQ3,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-2"
            >
              <span className="font-body-sm text-body-sm text-primary font-medium">
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => item.set(true)}
                  className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${
                    item.val === true
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => item.set(false)}
                  className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${
                    item.val === false
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          ))}

          {answeredCount > 0 && (
            <div className="p-3.5 rounded-xl bg-surface-container flex flex-col gap-1.5">
              <span className="font-title-md text-title-md text-primary font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  verified
                </span>
                {highPriority
                  ? 'Recommended: One-Time HPLC Variant Test'
                  : 'Baseline Awareness: Optional One-Time HPLC Check'}
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {highPriority
                  ? 'Request "Hb Variant Analysis by Automated HPLC" at BSMMU, Bangladesh Thalassemia Samity, or your Divisional Medical College (~৳650–৳1,200). Remember: being a carrier is 100% healthy!'
                  : 'Even without family symptoms, 1 in 9 citizens in Bangladesh silently carries HbE or β-Thalassemia trait. A single lifetime HPLC test provides lifelong clarity.'}
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPedigree();
              }}
              className="px-3.5 py-2 rounded-lg bg-surface-container-high text-primary font-label-md text-label-md hover:bg-surface-container-highest"
            >
              Model Couple Genetics
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onFindHplc();
              }}
              className="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md hover:opacity-95 flex items-center gap-1"
            >
              <span>Locate Accredited HPLC Lab</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 3. BP & Sugar Companion Modal ("Explore Norms") */
interface VitalsCompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VitalsCompanionModal: React.FC<VitalsCompanionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [sys, setSys] = useState('126');
  const [dia, setDia] = useState('82');
  const [hba1c, setHba1c] = useState('5.9');

  if (!isOpen) return null;

  const s = parseInt(sys, 10) || 120;
  const d = parseInt(dia, 10) || 80;
  const a1c = parseFloat(hba1c) || 5.4;

  const bpStatus =
    s >= 140 || d >= 90
      ? { label: 'Stage 2 Hypertension — Consult Physician', tone: 'text-error' }
      : s >= 130 || d >= 80
      ? { label: 'Stage 1 Elevated — Eliminate Raw Salt & Log Daily', tone: 'text-error' }
      : s >= 120 && d < 80
      ? { label: 'Elevated Borderline — 6-Month Lifestyle Audit', tone: 'text-primary' }
      : { label: 'Optimal Blood Pressure (<120/80 mmHg)', tone: 'text-secondary' };

  const sugarStatus =
    a1c >= 6.5
      ? { label: 'Diabetic Range (≥6.5%) — Clinical Evaluation Advised', tone: 'text-error' }
      : a1c >= 5.7
      ? {
          label: 'Pre-Diabetes Window (5.7–6.4%) — 98% Reversible via Rice Swap & Walk',
          tone: 'text-primary',
        }
      : { label: 'Optimal Glycemic Control (<5.7%)', tone: 'text-secondary' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-secondary text-on-secondary px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px]">monitor_heart</span>
            <h3 className="font-headline-sm text-headline-sm font-bold">
              BP &amp; Sugar Threshold Companion
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-on-secondary/15 hover:bg-on-secondary/25 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Systolic (mmHg)
              </label>
              <input
                type="number"
                value={sys}
                onChange={(e) => setSys(e.target.value)}
                className="p-2 rounded-lg bg-surface-container-low font-mono tabular-nums text-primary font-semibold focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Diastolic (mmHg)
              </label>
              <input
                type="number"
                value={dia}
                onChange={(e) => setDia(e.target.value)}
                className="p-2 rounded-lg bg-surface-container-low font-mono tabular-nums text-primary font-semibold focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                HbA1c (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={hba1c}
                onChange={(e) => setHba1c(e.target.value)}
                className="p-2 rounded-lg bg-surface-container-low font-mono tabular-nums text-primary font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-2">
            <div>
              <span className="font-label-sm text-label-sm text-outline uppercase">
                Blood Pressure Interpretation
              </span>
              <p className={`font-title-md text-title-md font-bold ${bpStatus.tone}`}>
                {bpStatus.label}
              </p>
            </div>
            <div className="h-px bg-outline-variant/30" />
            <div>
              <span className="font-label-sm text-label-sm text-outline uppercase">
                Glycemic / HbA1c Interpretation (BIRDEM / DGHS)
              </span>
              <p className={`font-title-md text-title-md font-bold ${sugarStatus.tone}`}>
                {sugarStatus.label}
              </p>
            </div>
          </div>

          <p className="font-label-sm text-label-sm text-on-surface-variant">
            Educational reference only. Free blood pressure and capillary glucose checks are
            available at all Upazila Health Complex NCD Corners.
          </p>
        </div>
      </div>
    </div>
  );
};

/* 4. Research Paper Reader Modal */
interface PaperModalProps {
  paper: ResearchPaper | null;
  onClose: () => void;
  onDownload: (paper: ResearchPaper) => void;
}

export const PaperModal: React.FC<PaperModalProps> = ({ paper, onClose, onDownload }) => {
  if (!paper) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-primary-container text-on-primary px-5 py-4 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-wider">
              {paper.category} · {paper.date}
            </span>
            <h3 className="font-headline-sm text-headline-sm font-bold leading-snug">
              {paper.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-on-primary/10 hover:bg-on-primary/20 flex items-center justify-center shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          <div className="flex flex-col">
            <span className="font-title-md text-title-md text-primary font-bold">
              {paper.authors}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {paper.affiliation} · Reference: <span className="font-mono">{paper.doi}</span>
            </span>
          </div>

          <blockquote className="p-3.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-primary italic">
            {paper.quote}
          </blockquote>

          <div className="flex flex-col gap-1">
            <span className="font-label-md text-label-md text-primary font-bold uppercase">
              Structured Abstract
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {paper.abstract}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-label-md text-label-md text-primary font-bold uppercase">
              Validated National Findings
            </span>
            {paper.keyFindings.map((finding, idx) => (
              <div key={idx} className="flex items-start gap-2 font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5 shrink-0">
                  check_circle
                </span>
                <span className="text-on-surface">{finding}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-surface-container">
            <span className="font-label-sm text-label-sm text-outline">
              CC-BY 4.0 Open Public Health Evidence
            </span>
            <button
              type="button"
              onClick={() => onDownload(paper)}
              className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download Brief ({paper.size})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 5. Counseling / Suggest Facility Modal */
interface ActionFormModalProps {
  mode: 'counseling' | 'suggest-facility' | null;
  onClose: () => void;
  onSubmitSuccess: (title: string, msg: string) => void;
}

export const ActionFormModal: React.FC<ActionFormModalProps> = ({
  mode,
  onClose,
  onSubmitSuccess,
}) => {
  const [division, setDivision] = useState('Dhaka');
  const [note, setNote] = useState('');

  if (!mode) return null;

  const isCounseling = mode === 'counseling';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCounseling) {
      onSubmitSuccess(
        'Voluntary Counseling Slot Requested',
        `Anonymous referral token generated for ${division} Division accredited genetics desk.`
      );
    } else {
      onSubmitSuccess(
        'Facility Verification Queued',
        `Submitted to DGHS / HHD clinical audit registry for ${division} Division.`
      );
    }
    setNote('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="bg-primary text-on-primary px-5 py-4 flex items-center justify-between">
          <span className="font-headline-sm text-headline-sm font-bold">
            {isCounseling
              ? 'Book Voluntary Genetic Counseling'
              : 'Suggest Accredited Public Facility'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-on-primary/10 hover:bg-on-primary/20 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <div className="p-5 flex flex-col gap-3.5">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {isCounseling
              ? 'Request a confidential, zero-stigma pre-marital or carrier counseling slot at an accredited public center (or call 16263 directly).'
              : 'Nominate a government or non-profit laboratory offering subsidized HPLC or NCD screening for DGHS verification.'}
          </p>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-primary font-semibold">
              Preferred Division
            </label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none"
            >
              <option value="Dhaka">Dhaka Division (BSMMU / Samity)</option>
              <option value="Chattogram">Chattogram Division (CMCH)</option>
              <option value="Sylhet">Sylhet Division (MAG Osmani)</option>
              <option value="Rajshahi">Rajshahi Division (RMCH)</option>
              <option value="Rangpur">Rangpur Division (RpMCH)</option>
              <option value="Khulna">Khulna Division (KMCH)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-primary font-semibold">
              {isCounseling
                ? 'Preferred Language & Context (No personal ID required)'
                : 'Facility Name & Public Tariff Details'}
            </label>
            <textarea
              rows={3}
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                isCounseling
                  ? 'e.g., Bangla session, pre-marital HPLC interpretation for couple...'
                  : 'e.g., District Sadar Hospital Hematology Wing, subsidized HPLC...'
              }
              className="p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md font-semibold hover:opacity-95"
            >
              {isCounseling ? 'Generate Referral Token' : 'Submit for Audit'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
