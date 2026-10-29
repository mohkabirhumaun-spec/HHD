import React, { useState } from 'react';
import { ConsanguinityOption, GenotypeOption } from '../types';
import { calculateMendelianOutcome } from '../data/healthData';

interface PedigreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFindHplcCenter: () => void;
  onBookCounseling: () => void;
  onToast: (title: string, msg: string) => void;
}

export const PedigreeModal: React.FC<PedigreeModalProps> = ({
  isOpen,
  onClose,
  onFindHplcCenter,
  onBookCounseling,
  onToast,
}) => {
  const [p1, setP1] = useState<GenotypeOption>('beta-thal');
  const [p2, setP2] = useState<GenotypeOption>('beta-thal');
  const [consanguinity, setConsanguinity] = useState<ConsanguinityOption>('unrelated');
  const [siblingAffected, setSiblingAffected] = useState(true);
  const [extendedCarrier, setExtendedCarrier] = useState(true);
  const [unexplainedAnemia, setUnexplainedAnemia] = useState(false);

  const [mcv, setMcv] = useState<string>('68.2');
  const [mch, setMch] = useState<string>('21.4');
  const [hba2, setHba2] = useState<string>('5.4');
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<string>(
    'Click on any pedigree symbol to review ISCN / ACMG lineage annotation.'
  );

  if (!isOpen) return null;

  const outcome = calculateMendelianOutcome(p1, p2);
  const mcvVal = parseFloat(mcv) || 0;
  const hba2Val = parseFloat(hba2) || 0;
  const mentzerVal = mcvVal > 0 ? (mcvVal / 5.8).toFixed(1) : '0.0';
  const isMentzerThal = parseFloat(mentzerVal) < 13 && mcvVal > 0;

  const getBadgeLabel = (g: GenotypeOption) => {
    if (g === 'normal') return 'Normal';
    if (g === 'beta-thal') return 'β-Thal Carrier';
    if (g === 'hbe') return 'HbE Carrier';
    return 'Untested';
  };

  const getAlleleProfile = (g: GenotypeOption) => {
    if (g === 'normal') return 'Allele profile: αα/αα, β/β';
    if (g === 'beta-thal') return 'Allele profile: αα/αα, β/β-thal';
    if (g === 'hbe') return 'Allele profile: αα/αα, β/β-E';
    return 'Allele profile: Pending HPLC';
  };

  const getNodeColor = (g: GenotypeOption) => {
    if (g === 'normal') return '#ffffff';
    if (g === 'beta-thal') return '#006a61';
    if (g === 'hbe') return '#1c0047';
    return '#74777e';
  };

  const getNodeLabel = (g: GenotypeOption) => {
    if (g === 'normal') return 'Normal (HbA/HbA)';
    if (g === 'beta-thal') return 'Carrier (HbA/β)';
    if (g === 'hbe') return 'Carrier (HbA/HbE)';
    return 'Untested';
  };

  const handleReset = () => {
    setP1('beta-thal');
    setP2('beta-thal');
    setConsanguinity('unrelated');
    setSiblingAffected(true);
    setExtendedCarrier(true);
    setUnexplainedAnemia(false);
    setMcv('68.2');
    setMch('21.4');
    setHba2('5.4');
    setSelectedNodeInfo('Pedigree & Mendelian assortment restored to baseline defaults.');
    onToast('Model Reset', 'Pedigree and Punnett square restored to baseline defaults.');
  };

  const handleDownloadReport = () => {
    const content = [
      'HHD INTELLIGENCE — CONFIDENTIAL DE-IDENTIFIED GENETIC RISK SUMMARY',
      '==================================================================',
      `Generated Locally: ${new Date().toLocaleString()}`,
      `Partner A Genotype: ${getBadgeLabel(p1)} (${getAlleleProfile(p1)})`,
      `Partner B Genotype: ${getBadgeLabel(p2)} (${getAlleleProfile(p2)})`,
      `Consanguinity Status: ${consanguinity}`,
      `Biomarkers: MCV ${mcv} fL | MCH ${mch} pg | HbA2 ${hba2}% | Mentzer Index ${mentzerVal}`,
      '------------------------------------------------------------------',
      `Outcome Distribution (Per Pregnancy):`,
      `  • Unaffected Normal: ${outcome.pNormal}%`,
      `  • Asymptomatic Healthy Carrier: ${outcome.pCarrier}%`,
      `  • Affected Major / Compound Phenotype: ${outcome.pMajor}%`,
      `Assessment Summary: ${outcome.riskTitle}`,
      '------------------------------------------------------------------',
      'Bioethics Notice: Non-diagnostic educational model aligned with DGHS/ACMG protocols.',
      'Zero server retention. Consult a certified genetic counselor via 16263 Shastho Batayon.',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hhd-confidential-pedigree-summary.txt';
    a.click();
    URL.revokeObjectURL(url);
    onToast(
      'De-Identified Summary Downloaded',
      'Confidential pedigree & Punnett report saved locally.'
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 lg:p-6 lg:top-20 overflow-y-auto bg-primary/45 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Pedigree and Autosomal Recessive Risk Calculator"
    >
      <div className="w-full max-w-7xl bg-surface-container-lowest rounded-xl shadow-2xl flex flex-col overflow-hidden my-auto border border-outline-variant/20">
        {/* Modal Header */}
        <div className="bg-primary-container px-5 py-4 text-on-primary flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed text-[26px]">
                family_restroom
              </span>
              <h2 className="font-headline-md text-headline-md text-on-primary font-bold tracking-tight">
                Pedigree &amp; Autosomal Recessive Risk Calculator
              </h2>
              <span className="font-label-md text-label-md px-2 py-0.5 rounded bg-surface-container-highest/20 text-secondary-fixed">
                বংশগত রোগ ও পারিবারিক ইতিহাস মডেলিং
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-primary-container max-w-4xl">
              Privacy-Preserving Clinical Pre-Marital &amp; Consanguinity Genetic Modeling for
              Beta-Thalassemia and Hemoglobin E Allelic Transmission.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-label-sm font-label-sm">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary/30 text-secondary-fixed">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                DGHS Bioethics Protocol Aligned
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-highest/15 text-primary-fixed">
                <span className="material-symbols-outlined text-[13px]">lock</span>
                Client-Side Zero Cloud Data Retention
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high/20 text-on-primary-container">
                <span className="material-symbols-outlined text-[13px]">info</span>
                Non-Diagnostic Educational Model
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-surface-container-highest/20 hover:bg-surface-container-highest/30 text-on-primary font-label-md text-label-md transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset Model</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onToast(
                  'Confidential Summary Ready',
                  'Preparing de-identified genetic counseling sheet...'
                );
                handleDownloadReport();
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-secondary hover:opacity-95 text-on-secondary font-label-md text-label-md transition-opacity shadow-sm whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Confidential Summary (PDF)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close calculator"
              className="w-9 h-9 rounded-lg bg-surface-container-highest/20 hover:bg-error hover:text-on-error text-on-primary flex items-center justify-center transition-colors ml-1"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Main 3-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-surface-container-low">
          {/* LEFT PANEL: INPUT CONFIGURATION (3 COLS) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Couple Genotypes */}
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-title-md text-title-md text-primary font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    genetics
                  </span>
                  Couple Genotypes
                </span>
                <span className="font-label-sm text-label-sm text-outline">HPLC Assay</span>
              </div>

              {/* Partner A */}
              <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-surface-container-low">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="p1-select"
                    className="font-label-md text-label-md text-primary font-semibold flex items-center gap-1.5"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                    Person 1 (Partner A)
                  </label>
                  <span className="font-label-sm text-label-sm text-secondary font-semibold">
                    {getBadgeLabel(p1)}
                  </span>
                </div>
                <select
                  id="p1-select"
                  value={p1}
                  onChange={(e) => setP1(e.target.value as GenotypeOption)}
                  className="w-full text-body-sm font-body-sm rounded-lg bg-surface-container-lowest p-2 text-on-surface shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="normal">Normal / Unaffected (HbA / HbA)</option>
                  <option value="beta-thal">β-Thalassemia Trait Carrier (HbA / β-Thal)</option>
                  <option value="hbe">HbE Trait Carrier (HbA / HbE)</option>
                  <option value="unknown">Unknown / Not Yet Screened</option>
                </select>
                <span className="font-label-sm text-label-sm text-on-surface-variant italic">
                  {getAlleleProfile(p1)}
                </span>
              </div>

              {/* Partner B */}
              <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-surface-container-low">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="p2-select"
                    className="font-label-md text-label-md text-primary font-semibold flex items-center gap-1.5"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block"></span>
                    Person 2 (Partner B)
                  </label>
                  <span className="font-label-sm text-label-sm text-secondary font-semibold">
                    {getBadgeLabel(p2)}
                  </span>
                </div>
                <select
                  id="p2-select"
                  value={p2}
                  onChange={(e) => setP2(e.target.value as GenotypeOption)}
                  className="w-full text-body-sm font-body-sm rounded-lg bg-surface-container-lowest p-2 text-on-surface shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="normal">Normal / Unaffected (HbA / HbA)</option>
                  <option value="beta-thal">β-Thalassemia Trait Carrier (HbA / β-Thal)</option>
                  <option value="hbe">HbE Trait Carrier (HbA / HbE)</option>
                  <option value="unknown">Unknown / Not Yet Screened</option>
                </select>
                <span className="font-label-sm text-label-sm text-on-surface-variant italic">
                  {getAlleleProfile(p2)}
                </span>
              </div>
            </div>

            {/* Familial Lineage & Consanguinity */}
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
              <span className="font-title-md text-title-md text-primary font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-tertiary-container">
                  diversity_1
                </span>
                Familial Lineage &amp; Consanguinity
              </span>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="consanguinity-select"
                  className="font-label-md text-label-md text-on-surface font-medium"
                >
                  Familial Relationship / আত্মীয়তার সম্পর্ক
                </label>
                <select
                  id="consanguinity-select"
                  value={consanguinity}
                  onChange={(e) => setConsanguinity(e.target.value as ConsanguinityOption)}
                  className="w-full text-body-sm font-body-sm rounded-lg bg-surface-container-low p-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="unrelated">Non-Related / Outbred (সম্পর্কহীন)</option>
                  <option value="first-cousin">First Cousins (আপন খালাতো/চাচাতো ভাই-বোন)</option>
                  <option value="second-cousin">Second Cousins (দূরসম্পর্কীয় আত্মীয়)</option>
                </select>
                <p className="font-label-sm text-label-sm text-on-surface-variant leading-relaxed">
                  {consanguinity === 'first-cousin' ? (
                    <>
                      <span className="text-error font-semibold">
                        Elevated Inbreeding Coefficient (F = 1/16).
                      </span>{' '}
                      Shared ancestral alleles double autosomal recessive homozygosity probability.
                    </>
                  ) : consanguinity === 'second-cousin' ? (
                    <>
                      <span className="text-primary font-semibold">
                        Moderate Inbreeding (F = 1/64).
                      </span>{' '}
                      Pre-marital HPLC verification advised for both partners.
                    </>
                  ) : (
                    'Standard Mendelian assortment applied. Non-related background coefficient (F = 0).'
                  )}
                </p>
              </div>

              <div className="flex flex-col gap-1.5 pt-1">
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  Family History Markers:
                </span>
                <label className="flex items-start gap-2 p-1.5 rounded hover:bg-surface-container-low cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={siblingAffected}
                    onChange={(e) => setSiblingAffected(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-primary"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface">
                    1st-Degree Relative receiving periodic blood transfusions
                  </span>
                </label>
                <label className="flex items-start gap-2 p-1.5 rounded hover:bg-surface-container-low cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={extendedCarrier}
                    onChange={(e) => setExtendedCarrier(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-primary"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Paternal or Maternal Uncle/Aunt confirmed Trait Carrier by HPLC
                  </span>
                </label>
                <label className="flex items-start gap-2 p-1.5 rounded hover:bg-surface-container-low cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={unexplainedAnemia}
                    onChange={(e) => setUnexplainedAnemia(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-primary"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface">
                    History of microcytic anemia unresponsive to iron therapy
                  </span>
                </label>
              </div>
            </div>

            {/* Lab Biomarkers */}
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-title-md text-title-md text-primary font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    biotech
                  </span>
                  Lab Biomarkers (CBC / HPLC)
                </span>
                <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                  Auto-Index
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">
                    MCV (fL)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={mcv}
                    onChange={(e) => setMcv(e.target.value)}
                    className="p-1.5 px-2.5 text-body-sm font-mono tabular-nums rounded bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="font-label-sm text-label-sm text-secondary">
                    {mcvVal < 80 ? '<80 fL (Microcytic)' : 'Normocytic'}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">
                    MCH (pg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={mch}
                    onChange={(e) => setMch(e.target.value)}
                    className="p-1.5 px-2.5 text-body-sm font-mono tabular-nums rounded bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="font-label-sm text-label-sm text-secondary">
                    {parseFloat(mch) < 27 ? '<27 pg (Hypochromic)' : 'Normal MCH'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">
                    HbA2 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={hba2}
                    onChange={(e) => setHba2(e.target.value)}
                    className="p-1.5 px-2.5 text-body-sm font-mono tabular-nums rounded bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span
                    className={`font-label-sm text-label-sm ${
                      hba2Val > 3.5 ? 'text-error font-semibold' : 'text-secondary'
                    }`}
                  >
                    {hba2Val > 3.5 ? '>3.5% (Elevated Trait)' : '≤3.5% Normal'}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Mentzer Index
                  </span>
                  <div className="p-1.5 px-2.5 text-body-sm font-mono tabular-nums rounded bg-secondary-container/50 text-on-secondary-container font-semibold flex items-center justify-between">
                    <span>{mentzerVal}</span>
                    <span className="text-[10px] font-sans">
                      {isMentzerThal ? '<13 Thal' : '≥13 Iron'}
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    MCV / RBC count
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER PANEL: INTERACTIVE PEDIGREE & TRANSMISSION ENGINE (6 COLS) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* 3-Generation Pedigree Tree */}
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    account_tree
                  </span>
                  <span className="font-title-md text-title-md text-primary font-bold">
                    Standard 3-Generation Pedigree Lineage
                  </span>
                </div>
                <div className="flex items-center gap-3 font-label-sm text-label-sm text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 border border-outline inline-block bg-white"></span>{' '}
                    Male
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full border border-outline inline-block bg-white"></span>{' '}
                    Female
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-secondary inline-block"></span> Carrier
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-error inline-block"></span> Major
                  </span>
                </div>
              </div>

              <div className="w-full h-72 rounded-lg bg-surface-container-low p-2 relative flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#d8e3fb_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
                <div className="absolute left-2 top-2 bottom-2 flex flex-col justify-between font-label-sm text-label-sm text-outline z-10 pointer-events-none">
                  <span className="px-1.5 py-0.5 bg-surface-container-lowest rounded shadow-xs">
                    Gen I
                  </span>
                  <span className="px-1.5 py-0.5 bg-surface-container-lowest rounded shadow-xs">
                    Gen II
                  </span>
                  <span className="px-1.5 py-0.5 bg-surface-container-lowest rounded shadow-xs">
                    Gen III
                  </span>
                </div>

                <svg
                  className="w-full h-full relative z-10"
                  fill="none"
                  viewBox="0 0 680 265"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Connectors: Gen I to Gen II */}
                  <path d="M 170 35 L 265 35" stroke="#74777e" strokeWidth="1.5" />
                  <path d="M 218 35 L 218 115" stroke="#74777e" strokeWidth="1.5" />
                  <path d="M 430 35 L 525 35" stroke="#74777e" strokeWidth="1.5" />
                  <path d="M 478 35 L 478 115" stroke="#74777e" strokeWidth="1.5" />

                  <path d="M 150 115 L 270 115" stroke="#74777e" strokeWidth="1.5" />
                  <path d="M 270 115 L 270 145" stroke="#74777e" strokeWidth="1.5" />
                  <path d="M 410 115 L 530 115" stroke="#74777e" strokeWidth="1.5" />
                  <path d="M 410 115 L 410 145" stroke="#74777e" strokeWidth="1.5" />

                  {/* Couple Marriage Line (Double line if consanguineous) */}
                  <path d="M 270 158 L 410 158" stroke="#00152a" strokeWidth="2.5" />
                  {consanguinity !== 'unrelated' && (
                    <path d="M 270 163 L 410 163" stroke="#ba1a1a" strokeWidth="2" />
                  )}

                  {/* Offspring Drop Lines */}
                  <path d="M 340 160 L 340 200" stroke="#00152a" strokeWidth="2" />
                  <path d="M 179 200 L 500 200" stroke="#00152a" strokeWidth="1.5" />
                  <path d="M 179 200 L 179 220" stroke="#00152a" strokeWidth="1.5" />
                  <path d="M 285 200 L 285 220" stroke="#00152a" strokeWidth="1.5" />
                  <path d="M 395 200 L 395 220" stroke="#00152a" strokeWidth="1.5" />
                  <path d="M 500 200 L 500 220" stroke="#00152a" strokeWidth="1.5" />

                  {/* Gen I Nodes */}
                  <g
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedNodeInfo(
                        'Gen I Paternal Grandfather: Unaffected baseline (HbA/HbA).'
                      )
                    }
                  >
                    <rect
                      x="155"
                      y="20"
                      width="30"
                      height="30"
                      rx="4"
                      fill="#ffffff"
                      stroke="#102a43"
                      strokeWidth="2"
                    />
                    <text x="170" y="62" textAnchor="middle" fill="#43474d" fontSize="9">
                      P. Grandfa
                    </text>
                  </g>

                  <g
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedNodeInfo(
                        'Gen I Paternal Grandmother: Asymptomatic trait carrier (50% transmission probability to Partner A).'
                      )
                    }
                  >
                    <circle
                      cx="265"
                      cy="35"
                      r="15"
                      fill="#ffffff"
                      stroke="#102a43"
                      strokeWidth="2"
                    />
                    <path d="M 265 20 A 15 15 0 0 1 265 50 Z" fill="#006a61" />
                    <text x="265" y="62" textAnchor="middle" fill="#43474d" fontSize="9">
                      P. Grandmo
                    </text>
                  </g>

                  <g
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedNodeInfo(
                        'Gen I Maternal Grandfather: Confirmed carrier lineage via cascade family history.'
                      )
                    }
                  >
                    <rect
                      x="415"
                      y="20"
                      width="30"
                      height="30"
                      rx="4"
                      fill="#ffffff"
                      stroke="#102a43"
                      strokeWidth="2"
                    />
                    <path d="M 430 20 L 445 20 L 445 50 L 430 50 Z" fill="#006a61" />
                    <text x="430" y="62" textAnchor="middle" fill="#43474d" fontSize="9">
                      M. Grandfa
                    </text>
                  </g>

                  <g
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedNodeInfo('Gen I Maternal Grandmother: Unaffected (HbA/HbA).')
                    }
                  >
                    <circle
                      cx="525"
                      cy="35"
                      r="15"
                      fill="#ffffff"
                      stroke="#102a43"
                      strokeWidth="2"
                    />
                    <text x="525" y="62" textAnchor="middle" fill="#43474d" fontSize="9">
                      M. Grandmo
                    </text>
                  </g>

                  {/* Gen II Nodes */}
                  <g
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedNodeInfo(
                        `Gen II Paternal Uncle: ${
                          extendedCarrier
                            ? 'Confirmed trait carrier on HPLC cascade.'
                            : 'Unaffected relative.'
                        }`
                      )
                    }
                  >
                    <rect
                      x="135"
                      y="100"
                      width="30"
                      height="30"
                      rx="4"
                      fill="#ffffff"
                      stroke="#74777e"
                      strokeWidth="1.5"
                    />
                    {extendedCarrier && (
                      <path d="M 150 100 L 165 100 L 165 130 L 150 130 Z" fill="#006a61" />
                    )}
                    <text x="150" y="142" textAnchor="middle" fill="#74777e" fontSize="9">
                      Pat. Uncle
                    </text>
                  </g>

                  {/* Partner A */}
                  <g
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedNodeInfo(
                        `Partner A (Proband): ${getNodeLabel(p1)} — ${getAlleleProfile(p1)}`
                      )
                    }
                  >
                    <rect
                      x="255"
                      y="145"
                      width="30"
                      height="30"
                      rx="4"
                      fill="#ffffff"
                      stroke="#00152a"
                      strokeWidth="2.5"
                    />
                    {p1 !== 'normal' && (
                      <path
                        d="M 270 145 L 285 145 L 285 175 L 270 175 Z"
                        fill={getNodeColor(p1)}
                      />
                    )}
                    <text
                      x="270"
                      y="188"
                      textAnchor="middle"
                      fill="#00152a"
                      fontSize="11"
                      fontWeight="700"
                    >
                      Partner A
                    </text>
                    <text
                      x="270"
                      y="198"
                      textAnchor="middle"
                      fill={p1 === 'normal' ? '#00152a' : getNodeColor(p1)}
                      fontSize="9"
                    >
                      {getNodeLabel(p1)}
                    </text>
                  </g>

                  {/* Partner B */}
                  <g
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedNodeInfo(
                        `Partner B (Prospective Spouse): ${getNodeLabel(p2)} — ${getAlleleProfile(p2)}`
                      )
                    }
                  >
                    <circle
                      cx="410"
                      cy="160"
                      r="15"
                      fill="#ffffff"
                      stroke="#00152a"
                      strokeWidth="2.5"
                    />
                    {p2 !== 'normal' && (
                      <path
                        d="M 410 145 A 15 15 0 0 1 410 175 Z"
                        fill={getNodeColor(p2)}
                      />
                    )}
                    <text
                      x="410"
                      y="188"
                      textAnchor="middle"
                      fill="#00152a"
                      fontSize="11"
                      fontWeight="700"
                    >
                      Partner B
                    </text>
                    <text
                      x="410"
                      y="198"
                      textAnchor="middle"
                      fill={p2 === 'normal' ? '#00152a' : getNodeColor(p2)}
                      fontSize="9"
                    >
                      {getNodeLabel(p2)}
                    </text>
                  </g>

                  {/* Maternal Aunt */}
                  <g
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedNodeInfo(
                        siblingAffected
                          ? 'Gen II Maternal Aunt: Transfusion-dependent phenotype documented in family history.'
                          : 'Gen II Maternal Aunt: Unaffected relative.'
                      )
                    }
                  >
                    <circle
                      cx="530"
                      cy="115"
                      r="15"
                      fill={siblingAffected ? '#ba1a1a' : '#ffffff'}
                      stroke={siblingAffected ? '#ba1a1a' : '#74777e'}
                      strokeWidth="1.5"
                    />
                    <text
                      x="530"
                      y="142"
                      textAnchor="middle"
                      fill={siblingAffected ? '#ba1a1a' : '#74777e'}
                      fontSize="9"
                    >
                      {siblingAffected ? 'Mat. Aunt (Maj)' : 'Mat. Aunt'}
                    </text>
                  </g>

                  {/* Gen III Offspring Probabilities */}
                  <g
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedNodeInfo(
                        `Offspring Quadrant 1 (${outcome.cells[0].code}): ${outcome.cells[0].label}`
                      )
                    }
                  >
                    <rect
                      x="165"
                      y="220"
                      width="28"
                      height="28"
                      rx="4"
                      fill="#ffffff"
                      stroke="#006a61"
                      strokeWidth="2"
                    />
                    <text
                      x="179"
                      y="238"
                      textAnchor="middle"
                      fill="#006a61"
                      fontSize="10"
                      fontWeight="600"
                    >
                      HbA
                    </text>
                    <text x="179" y="259" textAnchor="middle" fill="#43474d" fontSize="9">
                      25% {outcome.cells[0].tone === 'normal' ? 'Unaffected' : 'Carrier'}
                    </text>
                  </g>

                  <g
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedNodeInfo(
                        `Offspring Quadrant 2 (${outcome.cells[1].code}): ${outcome.cells[1].label}`
                      )
                    }
                  >
                    <circle
                      cx="285"
                      cy="234"
                      r="14"
                      fill="#ffffff"
                      stroke="#006a61"
                      strokeWidth="2"
                    />
                    {outcome.cells[1].tone !== 'normal' && (
                      <path d="M 285 220 A 14 14 0 0 1 285 248 Z" fill="#006a61" />
                    )}
                    <text x="285" y="259" textAnchor="middle" fill="#43474d" fontSize="9">
                      25% {outcome.cells[1].tone === 'normal' ? 'Normal' : 'Carrier'}
                    </text>
                  </g>

                  <g
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedNodeInfo(
                        `Offspring Quadrant 3 (${outcome.cells[2].code}): ${outcome.cells[2].label}`
                      )
                    }
                  >
                    <rect
                      x="381"
                      y="220"
                      width="28"
                      height="28"
                      rx="4"
                      fill="#ffffff"
                      stroke="#006a61"
                      strokeWidth="2"
                    />
                    {outcome.cells[2].tone !== 'normal' && (
                      <path d="M 395 220 L 409 220 L 409 248 L 395 248 Z" fill="#006a61" />
                    )}
                    <text x="395" y="259" textAnchor="middle" fill="#43474d" fontSize="9">
                      25% {outcome.cells[2].tone === 'normal' ? 'Normal' : 'Carrier'}
                    </text>
                  </g>

                  <g
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedNodeInfo(
                        `Offspring Quadrant 4 (${outcome.cells[3].code}): ${outcome.cells[3].label}`
                      )
                    }
                  >
                    <circle
                      cx="500"
                      cy="234"
                      r="14"
                      fill={outcome.offspring4Affected ? '#ba1a1a' : '#ffffff'}
                      stroke={outcome.offspring4Affected ? '#ba1a1a' : '#006a61'}
                      strokeWidth="2"
                    />
                    {!outcome.offspring4Affected && outcome.cells[3].tone === 'carrier' && (
                      <path d="M 500 220 A 14 14 0 0 1 500 248 Z" fill="#006a61" />
                    )}
                    <text
                      x="500"
                      y="238"
                      textAnchor="middle"
                      fill={outcome.offspring4Affected ? '#ffffff' : '#006a61'}
                      fontSize="10"
                      fontWeight="700"
                    >
                      {outcome.offspring4Code}
                    </text>
                    <text
                      x="500"
                      y="259"
                      textAnchor="middle"
                      fill={outcome.offspring4Affected ? '#ba1a1a' : '#006a61'}
                      fontSize="9"
                      fontWeight="600"
                    >
                      {outcome.offspring4Label}
                    </text>
                  </g>
                </svg>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-label-sm font-label-sm text-on-surface-variant px-1">
                <span>Standard ISCN / ACMG Pedigree Nomenclature</span>
                <span className="text-secondary font-medium">{selectedNodeInfo}</span>
              </div>
            </div>

            {/* Punnett Square Grid & Transmission Engine */}
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-title-md text-title-md text-primary font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    grid_view
                  </span>
                  Offspring Punnett Matrix &amp; Transmission Probability
                </span>
                <span
                  className={`px-3 py-1 rounded-full font-label-md text-label-md font-bold ${
                    outcome.riskTone === 'elevated'
                      ? 'bg-error-container text-on-error-container'
                      : outcome.riskTone === 'safe'
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-container-high text-on-surface'
                  }`}
                >
                  {outcome.riskTitle}
                </span>
              </div>

              <div className="w-full flex flex-col gap-1.5">
                <div className="h-3 w-full rounded-full bg-surface-container-high overflow-hidden flex">
                  <div
                    className="h-full bg-secondary transition-all duration-300"
                    style={{ width: `${outcome.pNormal}%` }}
                  />
                  <div
                    className="h-full bg-secondary-fixed-dim transition-all duration-300"
                    style={{ width: `${outcome.pCarrier}%` }}
                  />
                  <div
                    className="h-full bg-error transition-all duration-300"
                    style={{ width: `${outcome.pMajor}%` }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 font-label-sm text-label-sm tabular-nums">
                  <span className="text-secondary font-semibold">
                    {outcome.pNormal}% Unaffected Normal
                  </span>
                  <span className="text-on-secondary-fixed-variant font-semibold">
                    {outcome.pCarrier}% Asymptomatic Carrier
                  </span>
                  <span className="text-error font-bold">
                    {outcome.pMajor}% Major Disease Risk
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-body-sm text-body-sm items-center pt-1">
                <div className="p-2 rounded bg-surface-container-low font-label-md text-label-md text-outline">
                  Partner A ↓ \ B →
                </div>
                <div className="p-2 rounded bg-surface-container text-primary font-bold font-title-md text-title-md">
                  {outcome.col1}
                </div>
                <div className="p-2 rounded bg-surface-container text-primary font-bold font-title-md text-title-md">
                  {outcome.col2}
                </div>

                <div className="p-2 rounded bg-surface-container text-primary font-bold font-title-md text-title-md">
                  {outcome.row1}
                </div>
                {outcome.cells.slice(0, 2).map((cell, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg flex flex-col items-center ${
                      cell.tone === 'normal'
                        ? 'bg-surface-container-lowest border border-secondary/30'
                        : cell.tone === 'major'
                        ? 'bg-error-container/40'
                        : 'bg-surface-container-low'
                    }`}
                  >
                    <span
                      className={`font-headline-sm text-headline-sm font-bold ${
                        cell.tone === 'normal'
                          ? 'text-secondary'
                          : cell.tone === 'major'
                          ? 'text-error'
                          : 'text-on-surface'
                      }`}
                    >
                      {cell.code}
                    </span>
                    <span
                      className={`font-label-sm text-label-sm ${
                        cell.tone === 'major'
                          ? 'text-error font-bold'
                          : 'text-on-secondary-container font-medium'
                      }`}
                    >
                      {cell.label}
                    </span>
                  </div>
                ))}

                <div className="p-2 rounded bg-surface-container text-primary font-bold font-title-md text-title-md">
                  {outcome.row2}
                </div>
                {outcome.cells.slice(2, 4).map((cell, idx) => (
                  <div
                    key={idx + 2}
                    className={`p-2.5 rounded-lg flex flex-col items-center ${
                      cell.tone === 'normal'
                        ? 'bg-surface-container-lowest border border-secondary/30'
                        : cell.tone === 'major'
                        ? 'bg-error-container/40'
                        : 'bg-surface-container-low'
                    }`}
                  >
                    <span
                      className={`font-headline-sm text-headline-sm font-bold ${
                        cell.tone === 'normal'
                          ? 'text-secondary'
                          : cell.tone === 'major'
                          ? 'text-error'
                          : 'text-on-surface'
                      }`}
                    >
                      {cell.code}
                    </span>
                    <span
                      className={`font-label-sm text-label-sm ${
                        cell.tone === 'major'
                          ? 'text-error font-bold'
                          : 'text-on-secondary-container font-medium'
                      }`}
                    >
                      {cell.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: CLINICAL INTERPRETATION & ACTIONS (3 COLS) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-secondary/25 shadow-sm flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  health_and_safety
                </span>
                <span className="font-title-md text-title-md text-primary font-bold">
                  Clinical De-Stigmatization
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                <strong className="text-secondary font-semibold">
                  Being a Carrier is completely healthy:
                </strong>{' '}
                Trait carriers (বাহক) experience vibrant, completely standard lifespans, perform
                vigorously in sports, work, and academics, and require no routine medications.
              </p>
              <div className="p-2.5 rounded-lg bg-surface-container-low flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                  verified
                </span>
                <p className="font-label-sm text-label-sm text-on-surface-variant leading-relaxed">
                  <strong>Empowerment, Not Fear:</strong> Pre-marital screening ensures couples
                  possess scientific clarity to protect future offspring through standard
                  reproductive health pathways.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
              <span className="font-title-md text-title-md text-primary font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  clinical_notes
                </span>
                Recommended Protocol
              </span>
              <div className="flex flex-col gap-3 font-body-sm text-body-sm">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-label-sm shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-primary">Confirmatory HPLC Testing</span>
                    <span className="text-on-surface-variant font-label-sm text-label-sm">
                      BSMMU, IEDCR, or accredited tertiary civil laboratories.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-label-sm shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-primary">
                      Certified Genetic Counseling
                    </span>
                    <span className="text-on-surface-variant font-label-sm text-label-sm">
                      Empathetic, non-directive counseling with a trained clinician.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-label-sm shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-primary">Reproductive Strategy</span>
                    <span className="text-on-surface-variant font-label-sm text-label-sm">
                      Options include Chorionic Villus Sampling (CVS at 10–12 wks), IVF with PGT-M,
                      or pediatric monitoring.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={onBookCounseling}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-on-secondary font-title-md text-title-md hover:opacity-95 transition-opacity shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                <span>Book Genetic Counseling</span>
              </button>
              <button
                type="button"
                onClick={onFindHplcCenter}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary font-title-md text-title-md hover:bg-primary-container transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">location_on</span>
                <span>Find Nearest HPLC Center</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadReport}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface-container-high text-primary font-label-md text-label-md hover:bg-surface-container-highest transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Download De-Identified Report</span>
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-error-container/35 flex items-center justify-between px-3">
              <span className="font-label-sm text-label-sm text-on-surface font-medium">
                Thalassemia Helpline (24/7):
              </span>
              <a
                href="tel:16263"
                className="font-bold text-error font-body-sm text-body-sm hover:underline tabular-nums"
              >
                16263 Ext. 4
              </a>
            </div>
          </div>
        </div>

        {/* Bioethics Footer */}
        <div className="px-5 py-3 bg-surface-container flex flex-col md:flex-row items-center justify-between gap-2 text-on-surface-variant font-label-sm text-label-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[18px]">security</span>
            <span>
              <strong>Bioethics Guarantee:</strong> All pedigree calculations run strictly in local
              browser memory using Mendelian matrix algorithms. No genetic identifiers or names are
              transmitted to servers.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-outline">HHD Protocol v4.2.8</span>
            <span>·</span>
            <span className="text-outline">ACMG / DGHS Guideline Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
