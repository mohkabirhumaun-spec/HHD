import React, { useState } from 'react';
import { HOTLINKED_ASSETS, PATIENT_FACTSHEETS } from '../data/healthData';
import { FactsheetItem } from '../types';
import { ResilientImage } from './ResilientImage';

interface DesktopPreventiveViewProps {
  onNavigateAccess: (specialty?: string) => void;
  onOpenVitalsModal: () => void;
  onDownloadFactsheet: (item: FactsheetItem) => void;
  onToast: (title: string, msg: string) => void;
}

export const DesktopPreventiveView: React.FC<DesktopPreventiveViewProps> = ({
  onNavigateAccess,
  onOpenVitalsModal,
  onDownloadFactsheet,
  onToast,
}) => {
  /* 3-Step Multi-Condition Prevention & Lifestyle Risk Evaluator State */
  const [evalStep, setEvalStep] = useState<1 | 2 | 3>(1);
  const [ageGroup, setAgeGroup] = useState<'under35' | '35to49' | '50plus'>('35to49');
  const [waistRisk, setWaistRisk] = useState<boolean>(true); // >90cm M / >80cm F South Asian cutoffs
  const [rawSalt, setRawSalt] = useState<'daily' | 'occasional' | 'none'>('daily');
  const [riceServings, setRiceServings] = useState<'high' | 'moderate' | 'swapped'>('high');
  const [transitWalk, setTransitWalk] = useState<'sedentary' | 'moderate' | 'active'>('sedentary');
  const [tobaccoSmoke, setTobaccoSmoke] = useState<'none' | 'smokeless' | 'smoker'>('none');
  const [knownBpOrSugar, setKnownBpOrSugar] = useState<'none' | 'borderline' | 'elevated'>('borderline');

  /* Dynamic 10-Year Preventable NCD Risk Index calculation */
  let rawScore = 11;
  if (ageGroup === '35to49') rawScore += 5;
  if (ageGroup === '50plus') rawScore += 10;
  if (waistRisk) rawScore += 5;
  if (rawSalt === 'daily') rawScore += 7;
  if (rawSalt === 'occasional') rawScore += 3;
  if (riceServings === 'high') rawScore += 5;
  if (riceServings === 'moderate') rawScore += 2;
  if (transitWalk === 'sedentary') rawScore += 6;
  if (transitWalk === 'moderate') rawScore += 2;
  if (tobaccoSmoke === 'smokeless') rawScore += 7;
  if (tobaccoSmoke === 'smoker') rawScore += 10;
  if (knownBpOrSugar === 'borderline') rawScore += 4;
  if (knownBpOrSugar === 'elevated') rawScore += 9;

  const unmanagedRiskPct = Math.min(48, Math.max(8, rawScore));
  const intervenedRiskPct = Math.max(5, Math.round(unmanagedRiskPct * 0.42));
  const riskReductionSaved = unmanagedRiskPct - intervenedRiskPct;

  const riskLabel =
    unmanagedRiskPct >= 28
      ? { badge: 'Elevated Modifiable Risk', color: 'text-error', bg: 'bg-error-container text-on-error-container' }
      : unmanagedRiskPct >= 18
      ? { badge: 'Moderate Metabolic Window', color: 'text-primary', bg: 'bg-secondary-container text-on-secondary-fixed' }
      : { badge: 'Low Baseline Trajectory', color: 'text-secondary', bg: 'bg-secondary-container text-on-secondary-fixed' };

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Header (Matches Image_13 / Image_14) */}
      <section className="rounded-2xl bg-gradient-to-r from-primary via-primary-container to-[#0b3b60] text-on-primary p-8 relative overflow-hidden shadow-sm">
        <div className="max-w-3xl flex flex-col gap-3 relative z-10">
          <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-md bg-secondary/25 border border-secondary-fixed/30 text-secondary-fixed font-label-sm text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">shield_with_heart</span>
            <span>Clinical Preventive Medicine • DGHS NCDC &amp; BIRDEM Protocols</span>
          </div>
          <h1 className="font-display-md text-[34px] xl:text-[38px] font-extrabold leading-tight tracking-tight">
            Chronic Disease Prevention &amp; South Asian Metabolic Intelligence
          </h1>
          <p className="font-body-md text-body-md text-on-primary/85 leading-relaxed">
            Non-communicable diseases account for <strong>67% of all mortality in Bangladesh</strong>—frequently
            striking 10 years earlier than Western cohorts. Intervene early with culturally grounded
            nutrition, culinary sodium reduction, clean household air, and free public cancer screening.
          </p>
        </div>
      </section>

      {/* 4-Metric Epidemiological Burden Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: 'Adult Hypertension Burden',
            stat: '21.4%',
            sub: '1 in 5 adults; 52% unaware of status',
            icon: 'blood_pressure',
          },
          {
            label: 'Glycemic / Pre-Diabetes Window',
            stat: '13.1M',
            sub: 'South Asian visceral adiposity phenotype',
            icon: 'glucose',
          },
          {
            label: 'Mean Dietary Salt Intake',
            stat: '9.0g / day',
            sub: '80% above WHO <5g/day cardiovascular limit',
            icon: 'nutrition',
          },
          {
            label: 'Free VIA Cervical Centers',
            stat: '492 UHCs',
            sub: 'Zero-cost screening for women aged 30–60',
            icon: 'female',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs flex items-start justify-between gap-3"
          >
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-xs text-outline uppercase font-bold">
                {item.label}
              </span>
              <span className="font-headline-lg text-[28px] font-extrabold text-primary tabular-nums">
                {item.stat}
              </span>
              <span className="font-body-sm text-xs text-on-surface-variant">{item.sub}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface-container-low text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Interactive 3-Step Multi-Condition Prevention & Lifestyle Risk Evaluator */}
      <section className="rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs overflow-hidden">
        <div className="bg-surface-container-low px-6 py-4 border-b border-surface-container flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-label-sm text-xs text-secondary font-bold uppercase tracking-wider">
              Interactive Clinical Risk Engine • Zero Data Stored Externally
            </span>
            <h2 className="font-headline-sm text-xl text-primary font-extrabold">
              Multi-Condition Prevention &amp; Lifestyle Risk Evaluator
            </h2>
          </div>

          {/* 3-Step Stepper Tabs */}
          <div className="flex items-center gap-2">
            {[
              { step: 1 as const, label: '1. Anthropometry & Age' },
              { step: 2 as const, label: '2. Culinary & Transit' },
              { step: 3 as const, label: '3. Tobacco & Vitals' },
            ].map((s) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setEvalStep(s.step)}
                className={`px-3.5 py-2 rounded-lg font-label-md text-xs font-bold transition-colors ${
                  evalStep === s.step
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          {/* Left 7 Cols: Step Controls */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-5">
            {evalStep === 1 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-title-sm text-sm text-primary font-bold">
                    Age Cohort (South Asian Early-Onset Calibration)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'under35', label: '18–34 Years', sub: 'Peak prevention window' },
                      { id: '35to49', label: '35–49 Years', sub: 'Annual BP & HbA1c screen' },
                      { id: '50plus', label: '50+ Years', sub: 'Comprehensive CVD panel' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAgeGroup(opt.id as typeof ageGroup)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          ageGroup === opt.id
                            ? 'bg-primary text-on-primary border-primary shadow-xs'
                            : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container'
                        }`}
                      >
                        <div className="font-title-sm text-sm font-bold">{opt.label}</div>
                        <div
                          className={`text-xs mt-0.5 ${
                            ageGroup === opt.id ? 'text-secondary-fixed' : 'text-on-surface-variant'
                          }`}
                        >
                          {opt.sub}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-title-sm text-sm text-primary font-bold">
                    South Asian Central Waist Cutoff (IDF Standard: ≥90 cm Men / ≥80 cm Women)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setWaistRisk(true)}
                      className={`p-3.5 rounded-xl border text-left ${
                        waistRisk
                          ? 'bg-secondary text-on-secondary border-secondary'
                          : 'bg-surface-container-low text-on-surface border-outline-variant/30'
                      }`}
                    >
                      <div className="font-bold text-sm">Above Cutoff (Central Adiposity)</div>
                      <div className="text-xs opacity-85">Common even at BMI 23.0 kg/m²</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWaistRisk(false)}
                      className={`p-3.5 rounded-xl border text-left ${
                        !waistRisk
                          ? 'bg-secondary text-on-secondary border-secondary'
                          : 'bg-surface-container-low text-on-surface border-outline-variant/30'
                      }`}
                    >
                      <div className="font-bold text-sm">Within Optimal Waist Range</div>
                      <div className="text-xs opacity-85">&lt;90 cm (M) / &lt;80 cm (F)</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {evalStep === 2 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-title-sm text-sm text-primary font-bold">
                    Table Raw Salt Habit (পাতে কাঁচা লবণ)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'daily', label: 'Daily Pinch Salt', sub: '+6–8 mmHg BP load' },
                      { id: 'occasional', label: 'Occasional / Bhorta', sub: 'Moderate sodium load' },
                      { id: 'none', label: 'Zero Raw Salt', sub: 'Optimal vascular habit' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setRawSalt(opt.id as typeof rawSalt)}
                        className={`p-3 rounded-xl border text-left ${
                          rawSalt === opt.id
                            ? 'bg-primary text-on-primary border-primary'
                            : 'bg-surface-container-low text-on-surface border-outline-variant/30'
                        }`}
                      >
                        <div className="font-bold text-sm">{opt.label}</div>
                        <div
                          className={`text-xs mt-0.5 ${
                            rawSalt === opt.id ? 'text-secondary-fixed' : 'text-on-surface-variant'
                          }`}
                        >
                          {opt.sub}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-xs text-primary font-bold uppercase">
                      Daily Refined Rice Plate Ratio
                    </label>
                    <select
                      value={riceServings}
                      onChange={(e) => setRiceServings(e.target.value as typeof riceServings)}
                      className="p-3 rounded-xl bg-surface-container-low text-primary font-semibold text-sm border border-outline-variant/30 focus:outline-none"
                    >
                      <option value="high">3x Daily Polished White Rice (&gt;70% plate)</option>
                      <option value="moderate">2x Parboiled Rice + Dal/Vegetables</option>
                      <option value="swapped">50% Fiber/Lentil Plate + Controlled Rice</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-xs text-primary font-bold uppercase">
                      Daily Commute &amp; Brisk Walking
                    </label>
                    <select
                      value={transitWalk}
                      onChange={(e) => setTransitWalk(e.target.value as typeof transitWalk)}
                      className="p-3 rounded-xl bg-surface-container-low text-primary font-semibold text-sm border border-outline-variant/30 focus:outline-none"
                    >
                      <option value="sedentary">Desk/Motorized (&lt;60 min walk/wk)</option>
                      <option value="moderate">90–140 min Brisk Walk / Week</option>
                      <option value="active">150+ min Brisk Walk + Post-Meal Stroll</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {evalStep === 3 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-title-sm text-sm text-primary font-bold">
                    Tobacco, Bidi &amp; Smokeless Zarda / Sadapata Exposure
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'none', label: 'Tobacco-Free', sub: 'Zero smoking or Zarda' },
                      { id: 'smokeless', label: 'Paan-Zarda / Gul', sub: 'Oral & vascular risk' },
                      { id: 'smoker', label: 'Cigarette / Bidi', sub: 'High endothelial injury' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setTobaccoSmoke(opt.id as typeof tobaccoSmoke)}
                        className={`p-3 rounded-xl border text-left ${
                          tobaccoSmoke === opt.id
                            ? 'bg-primary text-on-primary border-primary'
                            : 'bg-surface-container-low text-on-surface border-outline-variant/30'
                        }`}
                      >
                        <div className="font-bold text-sm">{opt.label}</div>
                        <div
                          className={`text-xs mt-0.5 ${
                            tobaccoSmoke === opt.id
                              ? 'text-secondary-fixed'
                              : 'text-on-surface-variant'
                          }`}
                        >
                          {opt.sub}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-title-sm text-sm text-primary font-bold">
                    Latest Blood Pressure / Glycemic Reading
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'none', label: 'Optimal (<120/80)' },
                      { id: 'borderline', label: 'Borderline / Unchecked' },
                      { id: 'elevated', label: '≥130/85 or HbA1c ≥5.7%' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setKnownBpOrSugar(opt.id as typeof knownBpOrSugar)}
                        className={`p-3 rounded-xl border text-left font-bold text-xs ${
                          knownBpOrSugar === opt.id
                            ? 'bg-secondary text-on-secondary border-secondary'
                            : 'bg-surface-container-low text-on-surface border-outline-variant/30'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-surface-container">
              <div className="flex items-center gap-2">
                {evalStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setEvalStep((s) => (s === 3 ? 2 : 1))}
                    className="px-4 py-2 rounded-lg bg-surface-container text-primary font-label-md text-xs font-bold"
                  >
                    Previous Step
                  </button>
                )}
                {evalStep < 3 && (
                  <button
                    type="button"
                    onClick={() => setEvalStep((s) => (s === 1 ? 2 : 3))}
                    className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-xs font-bold flex items-center gap-1"
                  >
                    <span>Next Dimension</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onOpenVitalsModal}
                className="font-label-md text-xs text-secondary font-bold flex items-center gap-1 hover:underline"
              >
                <span className="material-symbols-outlined text-[16px]">calculate</span>
                <span>Enter Exact mmHg / HbA1c Numbers</span>
              </button>
            </div>
          </div>

          {/* Right 5 Cols: Live Computed Risk Trajectory Output */}
          <div className="lg:col-span-5 rounded-xl bg-surface-container-low p-5 border border-outline-variant/30 flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-label-sm text-[11px] text-outline uppercase font-bold">
                  10-Year Preventable NCD Risk Index
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span
                    className={`font-display-md text-[38px] font-extrabold tabular-nums leading-none ${riskLabel.color}`}
                  >
                    {unmanagedRiskPct}%
                  </span>
                  <span className="font-label-md text-xs text-on-surface-variant">
                    unmanaged trajectory
                  </span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-md font-label-sm text-[11px] font-bold ${riskLabel.bg}`}>
                {riskLabel.badge}
              </span>
            </div>

            {/* Trajectory Comparison Bars */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface">Current Unmanaged Habits</span>
                  <span className="font-mono tabular-nums text-error font-bold">{unmanagedRiskPct}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-surface-container-highest overflow-hidden">
                  <div
                    className="h-full bg-error transition-all duration-300"
                    style={{ width: `${Math.min(100, unmanagedRiskPct * 2)}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-secondary font-bold">
                    With Targeted Lifestyle Protocol (-{riskReductionSaved}% Absolute)
                  </span>
                  <span className="font-mono tabular-nums text-secondary font-bold">
                    {intervenedRiskPct}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-surface-container-highest overflow-hidden">
                  <div
                    className="h-full bg-secondary transition-all duration-300"
                    style={{ width: `${Math.min(100, intervenedRiskPct * 2)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Personalized Prescription Bullets */}
            <div className="p-3.5 rounded-xl bg-surface-container-lowest flex flex-col gap-1.5 text-xs">
              <span className="font-label-sm text-[10px] text-primary font-bold uppercase">
                Priority Clinical Actions
              </span>
              {rawSalt !== 'none' && (
                <div className="flex items-start gap-1.5 text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[15px] shrink-0">
                    check_circle
                  </span>
                  <span>Remove table raw salt (কাঁচা লবণ) to drop systolic BP by 5–7 mmHg.</span>
                </div>
              )}
              {riceServings === 'high' && (
                <div className="flex items-start gap-1.5 text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[15px] shrink-0">
                    check_circle
                  </span>
                  <span>Swap 1 cup white rice for masoor dal + leafy shak to cut glycemic load 30%.</span>
                </div>
              )}
              {tobaccoSmoke !== 'none' && (
                <div className="flex items-start gap-1.5 text-on-surface">
                  <span className="material-symbols-outlined text-error text-[15px] shrink-0">
                    warning
                  </span>
                  <span>Eliminate Zarda/smoking; request free oral mucosal check at UHC NCD Corner.</span>
                </div>
              )}
              <div className="flex items-start gap-1.5 text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[15px] shrink-0">
                  verified
                </span>
                <span>Book free annual BP &amp; fasting capillary glucose check at your nearest UHC.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateAccess('ncd')}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-container flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              <span>Locate Nearest Public NCD &amp; VIA Screening Clinic</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2x2 Targeted Lifestyle Medicine Bento Grid (Modules A–D) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-xs text-secondary font-bold uppercase tracking-wider">
              Culturally Adapted Interventions
            </span>
            <h2 className="font-headline-sm text-2xl text-primary font-extrabold">
              Targeted Lifestyle Medicine Modules
            </h2>
          </div>
          <button
            type="button"
            onClick={() =>
              onToast(
                'Clinical ProtocolSynced',
                'Showing 2025 DGHS Non-Communicable Disease Control (NCDC) clinical guidance.'
              )
            }
            className="px-3 py-1.5 rounded-lg bg-surface-container-low text-primary font-label-sm text-xs font-bold"
          >
            NIPSOM / BIRDEM 2025 Edition
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Module A: Culinary Sodium & Hypertension */}
          <article className="rounded-2xl bg-surface-container-lowest border border-surface-container overflow-hidden shadow-xs flex flex-col">
            <div className="h-48 relative">
              <ResilientImage
                src={HOTLINKED_ASSETS.culinarySpices}
                alt="Traditional Bangladeshi spices turmeric garlic and herbs replacing excess table salt"
                className="w-full h-full object-cover"
                fallbackIcon="nutrition"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-primary/85 text-on-primary font-label-sm text-[11px] font-bold">
                Module A • Vascular &amp; Stroke Prevention
              </div>
            </div>
            <div className="p-6 flex flex-col gap-3 flex-1 justify-between">
              <div className="flex flex-col gap-2">
                <h3 className="font-title-lg text-lg text-primary font-bold">
                  Zero Table Salt (কাঁচা লবণ বর্জন) &amp; Spice Flavor Architecture
                </h3>
                <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                  Bangladeshi households consume ~9g salt daily—nearly double the WHO 5g ceiling.
                  Replacing extra plate salt, salted ilish, and achar brine with roasted cumin, lemon,
                  garlic, and green chili reduces stroke incidence by <strong>24%</strong>.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between text-xs">
                <span className="font-semibold text-primary">Target Home BP: &lt; 130/80 mmHg</span>
                <button
                  type="button"
                  onClick={onOpenVitalsModal}
                  className="text-secondary font-bold hover:underline"
                >
                  Check BP Norms →
                </button>
              </div>
            </div>
          </article>

          {/* Module B: Glycemic Plate & Pre-Diabetes Reversal */}
          <article className="rounded-2xl bg-surface-container-lowest border border-surface-container overflow-hidden shadow-xs flex flex-col">
            <div className="h-48 relative">
              <ResilientImage
                src={HOTLINKED_ASSETS.freshGroceries}
                alt="Fresh Bangladeshi leafy greens lentils and low-glycemic produce"
                className="w-full h-full object-cover"
                fallbackIcon="eco"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-secondary text-on-secondary font-label-sm text-[11px] font-bold">
                Module B • BIRDEM Glycemic Remission
              </div>
            </div>
            <div className="p-6 flex flex-col gap-3 flex-1 justify-between">
              <div className="flex flex-col gap-2">
                <h3 className="font-title-lg text-lg text-primary font-bold">
                  The Bangladeshi 25-25-50 Glycemic Plate &amp; HbA1c Gauge
                </h3>
                <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                  Limit parboiled rice (সিদ্ধ চাল) to <strong>25% of the plate</strong>, pair with 25%
                  fish/egg/thick dal protein, and fill 50% with non-starchy shak &amp; vegetables—followed
                  by a 15-minute post-meal walk.
                </p>
              </div>

              {/* HbA1c Visual Threshold Bar */}
              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-1.5">
                <div className="flex justify-between font-mono text-[11px] font-bold">
                  <span className="text-secondary">&lt;5.7% Normal</span>
                  <span className="text-primary">5.7–6.4% Reversible Pre-DM</span>
                  <span className="text-error">≥6.5% Diabetes</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden flex">
                  <div className="w-1/3 bg-secondary" />
                  <div className="w-1/3 bg-primary-container" />
                  <div className="w-1/3 bg-error" />
                </div>
              </div>
            </div>
          </article>

          {/* Module C: Women's VIA Cervical & Breast Screening */}
          <article className="rounded-2xl bg-surface-container-lowest border border-surface-container overflow-hidden shadow-xs flex flex-col">
            <div className="h-48 relative">
              <ResilientImage
                src={HOTLINKED_ASSETS.physicianBp}
                alt="Female clinician conducting preventive outpatient consultation"
                className="w-full h-full object-cover"
                fallbackIcon="female"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-tertiary text-on-tertiary font-label-sm text-[11px] font-bold">
                Module C • Oncology Early Detection
              </div>
            </div>
            <div className="p-6 flex flex-col gap-3 flex-1 justify-between">
              <div className="flex flex-col gap-2">
                <h3 className="font-title-lg text-lg text-primary font-bold">
                  Free VIA Cervical &amp; Clinical Breast Screening Pathway
                </h3>
                <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                  Visual Inspection with Acetic Acid (VIA) is painless, takes 5 minutes, and is staffed
                  by trained female nurses at 492 Upazila Health Complexes and Medical Colleges at{' '}
                  <strong>৳ 0 cost</strong> every 3 years for women aged 30–60.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateAccess('via')}
                className="self-start px-4 py-2 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-xs font-bold hover:opacity-90 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                <span>Find Female-Staffed VIA Clinic</span>
              </button>
            </div>
          </article>

          {/* Module D: Household Biomass Smoke (Chulha) & Tobacco */}
          <article className="rounded-2xl bg-surface-container-lowest border border-surface-container overflow-hidden shadow-xs flex flex-col">
            <div className="h-48 relative">
              <ResilientImage
                src={HOTLINKED_ASSETS.ruralChulha}
                alt="Clean ventilated rural kitchen stove intervention reducing indoor PM2.5 smoke"
                className="w-full h-full object-cover"
                fallbackIcon="air"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-primary/85 text-on-primary font-label-sm text-[11px] font-bold">
                Module D • Pulmonary &amp; Oral Protection
              </div>
            </div>
            <div className="p-6 flex flex-col gap-3 flex-1 justify-between">
              <div className="flex flex-col gap-2">
                <h3 className="font-title-lg text-lg text-primary font-bold">
                  Clean Kitchen Ventilation (উন্নত চুলা) &amp; Zarda Cessation
                </h3>
                <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                  Unvented biomass chulhas expose rural women and infants to PM2.5 levels equivalent
                  to 20+ cigarettes/day. Upgrading to chimney Bondhu Chulha cuts COPD risk by 42%,
                  while quitting Zarda/Sadapata prevents 80% of oral carcinomas.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low text-xs text-primary font-semibold flex items-center justify-between">
                <span>Winter Urban AQI &gt; 200: N95/KN95 Transit Advisory</span>
                <span className="text-secondary font-bold">IEDCR Env Health</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Bilingual Clinic Downloads Grid */}
      <section className="rounded-2xl bg-surface-container-low p-6 border border-outline-variant/30 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-label-sm text-xs text-secondary font-bold uppercase tracking-wider">
              CC-BY 4.0 Community Clinic Printables
            </span>
            <h2 className="font-headline-sm text-xl text-primary font-extrabold">
              Bilingual Patient Handouts &amp; Household Charts (বাংলা / English)
            </h2>
          </div>
          <span className="font-label-sm text-xs text-on-surface-variant">
            Approved for Upazila Health Complex &amp; NGO Waiting Rooms
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PATIENT_FACTSHEETS.map((sheet) => (
            <div
              key={sheet.id}
              className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container flex flex-col justify-between gap-3"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-fixed font-label-sm text-[10px] font-bold">
                    {sheet.tag}
                  </span>
                  <span className="font-mono text-[11px] text-outline">{sheet.size}</span>
                </div>
                <h3 className="font-title-md text-base text-primary font-bold mt-1">
                  {sheet.title}
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant">{sheet.description}</p>
              </div>

              <button
                type="button"
                onClick={() => onDownloadFactsheet(sheet)}
                className="w-full py-2 rounded-lg bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-container flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download {sheet.language} Guide</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
