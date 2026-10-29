import {
  FacilityItem,
  FactsheetItem,
  GenotypeOption,
  NcdTopicCard,
  ResearchPaper,
  TelemetryDispatch,
} from '../types';

export const HOTLINKED_ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1U_8e34yvVGR9vVF7TCF8GcEFjAgRpjWaTtumehbY6EGf7PrBZitkBKkPheW2jCACJzdumDGSoyAiG6JlQh4dhQB5HjXsp1871NXrJ7NY6HLCh1ccmnRJEIi5yn6TfTBxCfVeJa6kRTbG9BDDB6r_Ks4iGmv86O7U5BTVY0r0A4JXlt1McVsWws86O5yy2-nrVhPLTZa_Qa03Y6OW_bQ1KUfcK0DVd32vmrP8AsfTyby8jlGxaYenehVKc',
  profileAvatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDsA7K8Z4_LdQz1l41LtFcWDD0t8YtXOGcJ_wCDN4j2zKU8TSiAkddMTvtEicxghgKmkQH6qBSaUVt3cKEzG7LauP8yqkU5XwlzYSB8WgQ7RgyZdCMJHzLzUNzTbdIn3kzvvQ-4fJmMltaUOla1YQkw546W1apwuuOpGyihq1tx_bUMm14Imt5-cVtcVJKuNKvdkRT9N3A9s8BRfD9EjOZMc3tKKGxZVEYKTikAMgcMO-zJIxqw7toN',
  geneticsHero:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB_DttjohZaR6CujwilZ0upZvKMH3u5Mm7zWzHXLr8s0NH_3q7UG3X8Rda7sxmhFHcH-woBBNiWBNKVFofWR8OTfiFljS5NNEnJxque93vkbILCc3QlbGylCKGfVdzwYlFGXkHDGAP877hxoxxJwrirRBBs1Yqpcbxy7LzHWnD5KMjLOSIYvjpW7Hk_7Wjb0VWi9th33EOmOqglt8OJ7nxXwVjVlGG534Ghl9XFHXBweVwpIJ3GEzvR',
  ncdNurseBp:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCkI5eUzZrvhVKzcmzBQvzLwVmKm6IU69zWUEbpdrCRWPMgy-dxaj6tijpxFjZ-kJ-Tw9LzLxOqzYGUMEQWguCvCrRCR5xTN-yB1g9sRXa4M7Nm99DBODUeVFN_gp-yhwVle7ydFSONvH1YOgTwkC1vfdahSxFEQIEPiJD37-0G9B6twEMPTLpAJT3A-m7WNdap5edgtniMpuDP-XJDkl2wGlWUoOEO9DIlHbyyjXAaptlP2EskfkJq',
  drFarhana:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBbbPjZr9r5qcxmZk_F4C0xxpNhdS5DiQDaUqSaDVSQk17qvM1I19a8gDGgYsvDD_ic2je8BX11qKYdsg_o5sVP0uAOYQ9XKNl9b1UxFbQL97wCA4X9jJ780TsyBgmKXccW3l7pLiohj7bUJk_FKA3AHK6Y-LLLg8Io7tE6qBTrdEwIEAdiC3c_pPzWs7HZMoOO9C5HZCMNQfGkIQlwB4VxFObnW6RA7TaqAY0zbK4RBuW9Gr6rXr0D',
  physicianBp:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDt7EN80UnLMy-DOmQHDQSwWsqUUrqsuhCno9Qm1tdD4Gg-uOgtnU3RBd9r-5SSM9C4NJ9t1WTvRpAEht7JMEAi0LFv9_25SwsvVoNMEDwT2aZ5GsCrXFGGVB29iwAvMMUpJoDV3Zv4nMZYvBjhI4A8cYTj2VoYLW7ObIQhNgsw5hnTgcErlqw32cZYUxwot2lRWSxTsSJPyT5myt06_51BFQkzw7Ou9wpzf2qA7R_ULuflVJqU4L6z',
  freshGroceries:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC31O4EdcN2YK9hjD1K9m-8EdjoWOXp-3FpLHfZuRIQ_WdIV_MjjoGkpk8pfABOqAKNYWW6TYqeSCK9g4H1BxG77Alx7TKJOYk6hNnw6dXbyqCGTibvB7gL2BXxcOP33q-vmr4rFTyMJZyxZ7r5URni7B2v_4qqE_KU74ioPXiAJdZFYCM97HxzPEZLtgMfQS7DiA53Y8DjxebvD3gkbotyu6oXV13hHH2sgv8tfqqYyD7iTD2t-FZC',
  ruralChulha:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCtTUypqiED76KzBrh1Iork7ZDqs1xmULqRq6NmYg8Es1lWXipRLDXPZuBDi2oVgwMxXO1ibQP_0b1UCEr7R0bCGHM0YhTSfEWWKRAkkduqMYl3t2jlz00JO7IMs80-lBdJpKd74EVh7CBHnwQlJ6GmJa1fE7IYZavk24EkpIWXVYdhL2QAZL46MW7XpRMo_vGsiZ9-I1murICvU6cRhGxADO0rqLtQtUoTe5fKnTxR-iGhrMBOkacZ',
  mobileSurveillanceMap:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBoeKMP-0dAw5n86kpDaQKEvvbOtfvb1K_jggRIpEa44x9q43pELhKZ5DhQxClEO7uxG9DZqiCW2bkfC_UOisZgyRtyHH1ehR5A0y6bu8L_tM-8R4cBUb0LAnAHVq9B5_OIMT0LTgoAm1Ldf89HOiJOktAtWfXYAqAXNuggi7miuBRHg2dOzaV16wddklJp0y8PIizg_9zDeDRqCoH_mh-J7gLkGldhXPewcsVPrl5oXe-101y13ZLs',
  mobileLabGridMap:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB6pKRhhOBYajHbKGmnnvOODCAO9Rz_vH2tBHbHqeBvwyXVTV6PZoqEL4OB_9UVkHH3aIkwKvNgWK9AkZWUfeb--8RtZo611ZZ1PJyrFrrNBvX8plQFDJcHT6btCzfagkvTfajLvWwRcCZEiiTZD-v1ObEBe59METoCVRVdM52HksBB3iLOd9_Rflkzgs5MhPQxqID0t30uxGvZ6ZyX7q6_dAY8GmXAZrPgOlESlFnFLFCT8CHihYdD',
  samityLab:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAiJwJhebbHYO70YtSiTy1b_mRlilejAg6X7O7G15ySNeRGMK1YVzHGK5U5EZwNlaBOecAwLKN6jJtVDTT-iurtbNY9hzbLVb09P0fGCyt7ncvKmS6lsxJNRF7Fic2tCN1IEBDCuC-_zka5m3ByDuPO5qdQ2-vwPitcYp8I__NHFquvM6NEXghnRs3zJY7qDqlURRqhcP-N8M95fVOAFmmrPvdln2OOlaV0pjEPS3nkEtdOQwLPCJlE',
  bsmmuHospital:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBXs-WPi_G2kDzTdzEF44XDcuwM_bZ_HHVfQijWYIvGa7ATZVqvaQ7Cf5ohoKhA0BDhqXPltMRjWjH9J49BBSWT6NpFwjxbllz16NI3ZhaXhuJYVpfvGYR_XojQ1xG-ExSVDvvdo8G2w6H2umLXDAkQNHdE-HsNom5aFkk1vwJdJP99BPHq8LnDNM79097f09lTEAJeK91_3YIzbxoypn6fXRYeNvUY74bP0DZUeLTZDNbTvTGWFjxY',
  cmchHospital:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDWdimPGhngkoOTFE1GwHmNADpq8k-Df-UaBtv-0D8T0Oa6-4_-4RyeAD4vKrhmSqwYUCcUrt2XEjW4W5Wbi2S2KeWdI5_je1EYv8Hl4s8jVw9ZJZY65DrYgqreTr_5K26jtlA5RLAdm2XXgv2bPPIRj_7ftz7R070BgIww7Qgff1yki6d_4Hhu2GRwAL4U1kjLwZqg6yXd3ltdRlebG0d-711gJTrzYBblwwP5xhDWb5Eyihp2JqE5',
  sylhetOsmani:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCM4wDoQ3q1Rss5X-XxAQiE1TASkcm1SLtxEXcvcm4Ig_371HG_z4ZU5r1dlJuiBrD57OIbSc-hmLLAU_UirE4pRVvepFBwxYyG3UvnBSPJCcxN70sUplFZiCQV3Bl7fbYKhAqt7EcgsG5_B6ydGYfJO_xjMUKoSkTCMpAWiBeM9RiikXIs_trSvHZwXvzdMUK4JEl8usrM4o8V8ErRAN0jh53vYjje3nvjudrg4rEVKKB9cMxL-0I3',
  desktopDhakaGisMap:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCZysebTGeBr4mNwnOZNmiEXSzHUyFlIy_a5GpQA6Oz6VhFs4TNnLPYh9bhs57gGapnP17V09O4_ldxfe5L0kTNLggY3AjOcknnA5ekrnl_cEece5HRs7_hbMUuKeVDLvTmjbWgwN0UveYj3pAj2iHHBDrNfzMxGRpQz_9d_Ix7pddh1XZ7gyMn9vmE1mlWxo4NHEwZ4DqZibSil5Otmeh-IwIWkxeW7H4PI9cjUr0fkdRstUgU1NhU',
  culinarySpices:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAHKpMnSgnVke5AcPLjrVlDkqbDDvxNtDeTdUsm_XYFHo0N59T8bRR-kE7qT8LH3vuO2CQqxtQY0HQWQY7MyK7v9qv0S0ym8Y8Uv8fI-oGE0pqgTKOklFD6GRAXdReI_3Cl9hk-sMAiPH7QUEHqcFvnO-4RNh_w7IhSJnXQnk35Ur2qghH4sLS8oVgH3CTDBADHdrKZSsckeBn0n978E6_gUeJx2YIaZvCHChaeOdD_a065mT9IB-2D',
  desktopBangladeshAerialMap:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCL0jdK6jQWzB07fuLuA0Z_jPok9H20WEQ8wuophYXuChaZVL2fTGRAeWkB0m4eWwWztLn2Mj5qjyLKTbgiRYH2fVMxRR-BrjIGiZH4kLUx_gTrSUUU4IXldJ5H_NQfCSMSCL9i7ZeF1_K-3vXch6oYHilOXyyTeUyG4j7PvTb4BnBvUPPhioHB-tOTt6XAElBYN8DK-9GRmy1at62gv-Gm7sTpJM6WKz-RTLaOMKcO0UM5NaEWathR',
};

export const DIVISION_STATS = [
  { id: 'dhaka', name: 'Dhaka', share: 34, reach: 483102, screens: 6304, traitYield: '10.8%', dalys: 1306 },
  { id: 'chattogram', name: 'Chattogram', share: 22, reach: 312596, screens: 4079, traitYield: '11.6%', dalys: 845 },
  { id: 'rajshahi', name: 'Rajshahi', share: 15, reach: 213134, screens: 2781, traitYield: '12.4%', dalys: 576 },
  { id: 'khulna', name: 'Khulna', share: 11, reach: 156298, screens: 2039, traitYield: '10.9%', dalys: 422 },
  { id: 'sylhet', name: 'Sylhet', share: 8, reach: 113671, screens: 1483, traitYield: '11.4%', dalys: 307 },
  { id: 'rangpur', name: 'Rangpur', share: 6, reach: 85253, screens: 1112, traitYield: '13.1%', dalys: 230 },
  { id: 'barishal', name: 'Barishal', share: 4, reach: 56836, screens: 742, traitYield: '9.8%', dalys: 154 },
];

export const VERIFIED_FACILITIES: FacilityItem[] = [
  {
    id: 'bsmmu',
    name: 'Bangabandhu Sheikh Mujib Medical University (BSMMU)',
    shortName: 'BSMMU Dept. of Hematology',
    subtitle: 'Department of Hematology & Genetic Medicine Reference Laboratory',
    division: 'Dhaka',
    district: 'Dhaka',
    geoZone: 'dhaka-metro',
    address: 'Shahbagh, Ramna, Dhaka-1000 • Block C, Outdoor Diagnostic Wing Level 3',
    governanceTier: 'apex',
    governanceBadge: 'Apex Gov Lab',
    secondaryBadges: ['DGHS / HHD Verified 2025', 'ISO 15189 Certified Reference'],
    verifiedLabel: 'National Center of Excellence',
    tariffBracket: 'subsidized',
    costDisplay: '৳ 800',
    costNote: 'Complete Hb Variant Panel • Reg Ticket ৳ 10',
    hours: 'Sun–Thu: 8:00 AM – 2:30 PM • 24/7 Transfusion Wing',
    appointmentInfo: 'Outdoor Block C, Level 3',
    phone: '16263',
    phoneDisplay: 'Query via Batayon (16263)',
    image: HOTLINKED_ASSETS.bsmmuHospital,
    imageAlt: 'Bangabandhu Sheikh Mujib Medical University hospital pavilion in Shahbagh Dhaka',
    icon: 'biotech',
    accentColor: 'tertiary',
    specialties: ['hplc', 'counseling', 'prenatal', 'blood', 'cbc'],
    capabilityTags: ['Hemoglobinopathy Panel', 'Prenatal Molecular Diagnosis', 'DNA Mutation Testing'],
    detailedCapabilities: [
      'Automated Cation-Exchange HPLC (Bio-Rad D-10)',
      'Prenatal Molecular Diagnosis & Chorionic Villi',
      'Beta-Globin Sanger Sequencing Mutation Analysis',
      'Free Voluntary Pre-Marital Counseling Desk',
    ],
  },
  {
    id: 'samity',
    name: 'Bangladesh Thalassemia Samity Hospital',
    shortName: 'Bangladesh Thalassemia Samity Hospital',
    subtitle: 'Comprehensive Thalassemia Management & Genetic Prevention Center',
    division: 'Dhaka',
    district: 'Dhaka',
    geoZone: 'dhaka-metro',
    address: 'Green Road, Dhanmondi, Dhaka • Opposite Green Super Market',
    governanceTier: 'ngo',
    governanceBadge: 'Specialist Non-Profit',
    secondaryBadges: ['HHD Institutional Partner', 'Established 1999'],
    verifiedLabel: 'Verified Jan 2025',
    tariffBracket: 'zakat',
    costDisplay: '৳ 800 – ৳ 1,200',
    costNote: 'Zakat-Subsidized Available for low-income families',
    hours: 'Sat–Thu: 8:00 AM – 6:00 PM (Emergency Blood Bank open)',
    appointmentInfo: 'Pre-Marital Counseling Unit',
    phone: '+88029664412',
    phoneDisplay: '+880 2 9664412',
    image: HOTLINKED_ASSETS.samityLab,
    imageAlt: 'Medical diagnostic center in Dhaka with HPLC electrophoresis laboratory',
    icon: 'bloodtype',
    accentColor: 'secondary',
    specialties: ['hplc', 'cbc', 'counseling', 'blood'],
    capabilityTags: [
      'Complete Blood Count (CBC)',
      'HPLC Hemoglobin Electrophoresis',
      'Free Genetic Pre-test Counseling',
    ],
    detailedCapabilities: [
      'Automated CBC & Red Cell Indices (Mentzer / Green-King Index)',
      'HPLC Hemoglobin Variant Quantification',
      'Premarital Prospective Couple Screening & Counseling',
      'Dedicated Day-Care Transfusion Unit with Leukodepletion',
    ],
  },
  {
    id: 'afip',
    name: 'Armed Forces Institute of Pathology (AFIP)',
    shortName: 'Armed Forces Institute of Pathology (AFIP)',
    subtitle: 'National Reference Molecular & Hematology Diagnostics Institute',
    division: 'Dhaka',
    district: 'Dhaka',
    geoZone: 'dhaka-metro',
    address: 'Dhaka Cantonment, Dhaka-1206 • Reference Hematology Wing',
    governanceTier: 'apex',
    governanceBadge: 'National Reference Lab',
    secondaryBadges: ['ISO 15189 Certified', 'DGHS Reference Node'],
    verifiedLabel: 'ISO 15189 Certified',
    tariffBracket: 'subsidized',
    costDisplay: '৳ 950',
    costNote: 'High-Resolution HPLC Bio-Rad D10 Assay',
    hours: 'Sun–Thu: 8:00 AM – 3:00 PM',
    appointmentInfo: 'Civilian Outpatient Reception Desk 2',
    phone: '+88028711111',
    phoneDisplay: '+880 2 8711111',
    image: HOTLINKED_ASSETS.bsmmuHospital,
    imageAlt: 'Reference hematology and pathology facility in Dhaka',
    icon: 'science',
    accentColor: 'primary',
    specialties: ['hplc', 'cbc', 'prenatal'],
    capabilityTags: ['High-Resolution HPLC Bio-Rad D10', 'Molecular PCR', 'Reference QA'],
    detailedCapabilities: [
      'High-Resolution Cation-Exchange HPLC Variant Quantification',
      'Confirmatory Alpha & Beta Globin Gene Multiplex PCR',
      'Iron Ferritin & Microcytic Anemia Differential Panel',
      'Quality Assurance Reference Calibration Node',
    ],
  },
  {
    id: 'shishu',
    name: 'Bangladesh Shishu (Children) Hospital & Institute',
    shortName: 'Dhaka Shishu (Children) Hospital Center',
    subtitle: 'Pediatric Thalassemia Center & Family Genetic Counseling Unit',
    division: 'Dhaka',
    district: 'Dhaka',
    geoZone: 'dhaka-metro',
    address: 'Sher-e-Bangla Nagar, Dhaka-1207 • Thalassemia Block',
    governanceTier: 'apex',
    governanceBadge: 'Pediatric & Family Care',
    secondaryBadges: ['Public Health Rate', 'DGHS Accredited'],
    verifiedLabel: 'Family Support Hub',
    tariffBracket: 'counseling',
    costDisplay: '৳ 600 – ৳ 900',
    costNote: 'Public Health Subsidized Rate • Free Family Counseling',
    hours: 'Sat–Thu: 8:00 AM – 2:30 PM',
    appointmentInfo: 'Dedicated Family Support Group',
    phone: '+880258153333',
    phoneDisplay: '+880 2 58153333',
    image: HOTLINKED_ASSETS.samityLab,
    imageAlt: 'Pediatric hematology and family counseling unit in Dhaka',
    icon: 'family_restroom',
    accentColor: 'secondary',
    specialties: ['hplc', 'counseling', 'blood', 'cbc'],
    capabilityTags: ['Family Cascade Screening', 'HPLC Variant Test', 'Pediatric Hematology'],
    detailedCapabilities: [
      'Extended Sibling & Parental Cascade Carrier Screening',
      'Automated Hemoglobin Electrophoresis & CBC',
      'Compassionate Pre-Marital & Prenatal Counseling Unit',
      'Safe Chelation & Transfusion Day-Care Support',
    ],
  },
  {
    id: 'cmch',
    name: 'Chittagong Medical College Hospital (CMCH)',
    shortName: 'CMCH Thalassemia Care Center',
    subtitle: "Regional Hemoglobinopathy Center & Women's Preventive Screening Wing",
    division: 'Chattogram',
    district: 'Chittagong',
    geoZone: 'chattogram-sadar',
    address: 'Panchlaish, Chattogram-4203 • Outdoor Complex Gate 4',
    governanceTier: 'apex',
    governanceBadge: 'Public Tertiary',
    secondaryBadges: ['Chattogram Division Hub', 'Safe Blood Bank'],
    verifiedLabel: 'Division Hub',
    tariffBracket: 'subsidized',
    costDisplay: 'Standard ৳ 10',
    costNote: 'Govt. Outpatient Registration • Lab Tests Subsidized',
    hours: 'Daily: 8:30 AM – 2:30 PM • Emergency 24/7',
    appointmentInfo: 'Transfusion & Screening Unit Onsite',
    phone: '+88031619400',
    phoneDisplay: '+880 31 619400',
    image: HOTLINKED_ASSETS.cmchHospital,
    imageAlt: 'Chittagong Medical College Hospital hematology consultation center',
    icon: 'local_hospital',
    accentColor: 'primary',
    specialties: ['hplc', 'via', 'blood', 'counseling', 'ncd'],
    capabilityTags: ['Clinical Screening', 'Blood Safety Unit', 'Regional Family Counseling'],
    detailedCapabilities: [
      'Clinical Hemoglobin Analysis (HPLC & Alkaline Electrophoresis)',
      'VIA Cervical Screening Cell (Free under National Program)',
      'NAT-Screened Safe Blood Transfusion Support Unit',
      "Hill Tracts & Cox's Bazar Outreach Tele-Consult Hub",
    ],
  },
  {
    id: 'osmani',
    name: 'Sylhet MAG Osmani Medical College Hospital',
    shortName: 'Sylhet MAG Osmani Medical College Hospital',
    subtitle: 'NCD Prevention Cell & Hemoglobinopathy Surveillance Wing',
    division: 'Sylhet',
    district: 'Sylhet',
    geoZone: 'sylhet-sadar',
    address: 'Medical Road, Kajolshah, Sylhet-3100',
    governanceTier: 'apex',
    governanceBadge: 'Public Tertiary',
    secondaryBadges: ['Sylhet Division Hub', 'NCD Early Detection'],
    verifiedLabel: 'Sylhet Division',
    tariffBracket: 'free',
    costDisplay: 'Free at Gate 2 NCD Clinic',
    costNote: 'Standard OPD Ticket ৳ 10',
    hours: 'Sun–Thu: 8:00 AM – 2:30 PM • 24/7 Emergency Cell',
    appointmentInfo: 'NCD Prevention Cell (Gate 2)',
    phone: '+880821713667',
    phoneDisplay: '+880 821 713667',
    image: HOTLINKED_ASSETS.sylhetOsmani,
    imageAlt: 'Sylhet MAG Osmani Medical College Hospital outpatient clinic',
    icon: 'monitor_heart',
    accentColor: 'secondary',
    specialties: ['ncd', 'hplc', 'via', 'counseling'],
    capabilityTags: ['NCD Early Screening', 'Diabetes & Hypertension Center', 'Carrier Testing'],
    detailedCapabilities: [
      'NCD Early Screening Cell (Gate 2: Hypertension & Glycemic Registry)',
      'Automated Hemoglobin Electrophoresis Sub-Unit',
      'Free Universal VIA Cervical Cancer Screening',
      'Tea-Garden Mobile Outreach Worker Liaison Program',
    ],
  },
  {
    id: 'sreemangal-uhc',
    name: 'Sreemangal Upazila Health Complex (UHC)',
    shortName: 'Sreemangal Upazila Health Complex',
    subtitle: 'Primary Level Screening, NCD Corner & Maternal Child Health Clinic',
    division: 'Sylhet',
    district: 'Sylhet',
    geoZone: 'moulvibazar-sreemangal',
    address: 'Bhanugach Road, Sreemangal, Moulvibazar',
    governanceTier: 'uhc',
    governanceBadge: 'Upazila Sentinel',
    secondaryBadges: ['Moulvibazar District', 'DGHS Community Node'],
    verifiedLabel: 'Upazila Primary Hub',
    tariffBracket: 'free',
    costDisplay: '100% Free Public Care',
    costNote: 'OPD Ticket ৳ 5 / NCD Free',
    hours: 'Daily: 8:00 AM – 2:30 PM • Emergency 24/7 (On-Duty RMO)',
    appointmentInfo: 'NCD Corner Ground Floor',
    phone: '16263',
    phoneDisplay: 'Duty Medical Officer (16263)',
    image: HOTLINKED_ASSETS.sylhetOsmani,
    imageAlt: 'Upazila Health Complex community clinic in Sreemangal',
    icon: 'domain',
    accentColor: 'secondary',
    specialties: ['via', 'ncd', 'cbc'],
    capabilityTags: ['Free VIA Cervical Screening', 'NCD Corner (BP & Glucose)', 'Community Dispatch'],
    detailedCapabilities: [
      'Free Universal VIA Cervical Screening (Trained Senior Midwife)',
      'NCD Corner (Free Blood Pressure, Glucose & BMI Profiling)',
      'Tea Garden Community Health Worker Dispatch & Cold-Chain',
      'Direct Telemedicine Referral to Sylhet MAG Osmani Tertiary Center',
    ],
  },
  {
    id: 'rmch',
    name: 'Rajshahi Medical College Hospital (RMCH)',
    shortName: 'RMCH Hematology & Screening Hub',
    subtitle: 'North-West Regional Thalassemia & NCD Referral Center',
    division: 'Rajshahi',
    district: 'Rajshahi',
    geoZone: 'bogura-sadar',
    address: 'Laxmipur, Rajpara, Rajshahi-6000 • Diagnostic Block B',
    governanceTier: 'sadar',
    governanceBadge: 'Public Tertiary',
    secondaryBadges: ['Rajshahi High-Yield Node', 'DGHS Accredited'],
    verifiedLabel: 'North-West Hub',
    tariffBracket: 'subsidized',
    costDisplay: '৳ 700',
    costNote: 'Subsidized HPLC Assay • Reg Ticket ৳ 10',
    hours: 'Sat–Thu: 8:00 AM – 2:30 PM',
    appointmentInfo: 'Hematology OPD Room 204',
    phone: '+880721776001',
    phoneDisplay: '+880 721 776001',
    image: HOTLINKED_ASSETS.bsmmuHospital,
    imageAlt: 'Rajshahi Medical College regional hematology wing',
    icon: 'biotech',
    accentColor: 'tertiary',
    specialties: ['hplc', 'via', 'ncd', 'counseling', 'blood'],
    capabilityTags: ['HPLC Carrier Screening', 'HbE Regional Registry', 'Free VIA Desk'],
    detailedCapabilities: [
      'High-Volume HbE & Beta-Thalassemia Automated Capillary HPLC',
      'Youth & University Pre-Marital Voluntary Screening Desk',
      'NCD Hypertension & Diabetes Lifestyle Registry',
      'Regional NAT-Verified Transfusion Medicine Center',
    ],
  },
  {
    id: 'rp-mch',
    name: 'Rangpur Medical College Hospital',
    shortName: 'Rangpur Medical College Screening Unit',
    subtitle: 'Northern Rural Sentinel HPLC & Community NCD Center',
    division: 'Rangpur',
    district: 'Rangpur',
    geoZone: 'all',
    address: 'Dhap, Jail Road, Rangpur-5400',
    governanceTier: 'apex',
    governanceBadge: 'Public Tertiary',
    secondaryBadges: ['Rangpur Division Hub', 'Mobile Camp Base'],
    verifiedLabel: 'Rangpur Hub',
    tariffBracket: 'free',
    costDisplay: 'Free Youth Camp / ৳ 650 OPD',
    costNote: 'Subsidized Public Tariff • Reg Ticket ৳ 10',
    hours: 'Sat–Thu: 8:00 AM – 2:30 PM',
    appointmentInfo: 'Outpatient Hematology & NCD Cell',
    phone: '+88052162150',
    phoneDisplay: '+880 521 62150',
    image: HOTLINKED_ASSETS.cmchHospital,
    imageAlt: 'Rangpur Medical College Hospital screening facility',
    icon: 'local_hospital',
    accentColor: 'secondary',
    specialties: ['hplc', 'ncd', 'via', 'counseling'],
    capabilityTags: ['Mobile HPLC Van Base', 'Pre-Marital Counseling', 'NCD Corner'],
    detailedCapabilities: [
      'Base Station for Rural Upazila College HPLC Screening Camps',
      'Automated Hemoglobin Electrophoresis & CBC Profiling',
      'Complimentary Cervical VIA & Breast Clinical Screening',
      'Bilingual Genetic Counseling & Family Pedigree Mapping',
    ],
  },
  {
    id: 'kmch',
    name: 'Khulna Medical College Hospital (KMCH)',
    shortName: 'KMCH Coastal Health & Genetics Unit',
    subtitle: 'Southern Delta Salinity-Hypertension & Hemoglobinopathy Center',
    division: 'Khulna',
    district: 'Khulna',
    geoZone: 'all',
    address: 'Boyra, Khulna-9000 • Outpatient Wing',
    governanceTier: 'sadar',
    governanceBadge: 'Public Tertiary',
    secondaryBadges: ['Khulna Division Hub', 'Coastal Hypertension Node'],
    verifiedLabel: 'Khulna Hub',
    tariffBracket: 'subsidized',
    costDisplay: 'Standard ৳ 10',
    costNote: 'OPD Ticket ৳ 10 • Subsidized Hematology Panel',
    hours: 'Sat–Thu: 8:30 AM – 2:30 PM',
    appointmentInfo: 'NCD & Hematology Combined Desk',
    phone: '+88041761531',
    phoneDisplay: '+880 41 761531',
    image: HOTLINKED_ASSETS.sylhetOsmani,
    imageAlt: 'Khulna Medical College Hospital coastal health unit',
    icon: 'vital_signs',
    accentColor: 'primary',
    specialties: ['ncd', 'hplc', 'via', 'blood'],
    capabilityTags: ['Salinity-HTN Surveillance', 'HPLC Screening', 'Safe Blood Bank'],
    detailedCapabilities: [
      'Coastal Drinking-Water Salinity & Maternal Hypertension Protocol',
      'Capillary Hemoglobin Variant Electrophoresis',
      'Universal Free VIA Cervical Cancer Screening',
      '24/7 Emergency Blood Bank & Transfusion Support',
    ],
  },
];

export const NCD_TOPIC_CARDS: NcdTopicCard[] = [
  {
    id: 'hypertension',
    categoryLabel: 'Cardiovascular Priority',
    title: 'Hypertension & Stroke Prevention',
    badge: 'Screen: 30+ yrs',
    tags: ['cardio', 'metabolic'],
    icon: 'cardiology',
    accent: 'secondary',
    image: HOTLINKED_ASSETS.physicianBp,
    imageAlt:
      'South Asian female community physician measuring blood pressure of an adult Bangladeshi patient in a daylight clinic in Dhaka',
    imageOverlayLabel: 'Silent Killer Indicator',
    imageOverlayIcon: 'health_and_safety',
    contextHeading: 'Bangladesh Context: Reducing Dietary Sodium',
    contextBody:
      'Traditional curries, pickles (achar), and added raw table salt on rice (কাঁচা লবণ) raise average adult intake to nearly 9g/day (WHO target: <5g). Substitute excess salt with fresh lemon, roasted jeera, ginger, and garlic.',
    expandedProtocol: [
      'Eliminate raw table salt (কাঁচা লবণ) completely at the dining table — reduces systolic BP by 4–6 mmHg within 4 weeks.',
      'Normotensive adults (<120/80 mmHg): Re-screen every 6–12 months at any Community Clinic.',
      'Borderline / Elevated (120–139 / 80–89 mmHg): Maintain a 14-day morning/evening home BP log and consult an Upazila NCD Corner physician.',
    ],
    footerMeta: 'Normotensive: 6 mo | >130/80: Monthly Log',
    ctaLabel: 'Read Full Guideline',
  },
  {
    id: 'diabetes',
    categoryLabel: 'Metabolic Syndrome',
    title: 'Type 2 Diabetes & Pre-Diabetes Reversal',
    badge: 'Early Stage 98% Reversible',
    tags: ['diabetes', 'metabolic'],
    icon: 'bloodtype',
    accent: 'secondary',
    contextHeading: 'Dhaka & Rural Dietary Adaptation',
    contextBody:
      'Mitigate postprandial glucose surges by pairing plain white rice (polished Miniket/Nazirshail carb) with thick lentils (musur/mug daal), green leafy shaak (palong, lal shaak), and 15-minute brisk walking post dinner.',
    expandedProtocol: [
      'South Asian "thin-fat" metabolic phenotype warrants fasting glucose / HbA1c screening starting at age 25 if BMI ≥ 23 kg/m².',
      'Volumetric plate rule: Limit steamed white rice to 1 cup per meal; fill 50% of plate with non-starchy vegetables and leafy greens.',
      '15 minutes of brisk walking within 30 minutes after dinner reduces post-meal glycemic peak by up to 34%.',
    ],
    footerMeta: '150 min/wk moderate activity',
    ctaLabel: 'View Reversal Roadmap',
  },
  {
    id: 'cardiovascular',
    categoryLabel: 'Lipid & Arterial Integrity',
    title: 'Cardiovascular Wellness',
    badge: 'Athero Check',
    tags: ['cardio'],
    icon: 'ecg_heart',
    accent: 'secondary',
    image: HOTLINKED_ASSETS.freshGroceries,
    imageAlt:
      'Fresh South Asian healthy raw grocery selection including garlic, turmeric, guavas, mustard oil, and almonds',
    imageOverlayLabel: 'Lipid Optimization',
    imageOverlayIcon: 'check_circle',
    contextHeading: 'South Asian Lipid Phenotype',
    contextBody:
      'Higher baseline Lp(a) and small-dense LDL particles necessitate lipid checks starting at age 25 if family history of premature heart attack exists. Reduce reheated deep-frying oils (singara/puri street foods) to eliminate trans fats.',
    expandedProtocol: [
      'Request a fasting lipid profile + ApoB / Lp(a) baseline if a 1st-degree relative had cardiac events before age 55.',
      'Target South Asian waist circumference thresholds: <90 cm for men, <80 cm for women.',
      'Never reuse cooking oil more than once; switch from hydrogenated dalda/vanaspati to measured cold-pressed mustard or rice-bran oil.',
    ],
    footerMeta: 'Waist: <90cm (M), <80cm (F)',
    ctaLabel: 'Stress & Cortisol Protocol',
  },
  {
    id: 'cancer',
    categoryLabel: 'Screening Matrix',
    title: 'Early Detection & Cancer Screening',
    badge: 'Upazila Accessible',
    tags: ['cancer', 'tobacco'],
    icon: 'genetics',
    accent: 'tertiary',
    contextHeading: 'Complimentary Upazila Screening Pathways',
    contextBody:
      'Visual Inspection with Acetic Acid (VIA) for women aged 30–60 is offered free at all 492 Upazila Health Complexes. Eliminating areca nut (supari) and smokeless tobacco (zarda/gul) prevents over 50% of oral cancers.',
    expandedProtocol: [
      'Cervical VIA Screening (30–60 yrs): Complimentary 5-minute outpatient check every 3–5 years at all UHCs & Medical Colleges.',
      'Breast Health Protocol: Monthly self-examination (days 7–10 post-cycle) + annual Clinical Breast Exam (CBE) from age 35.',
      'Oral Mucosa Check: Any non-healing white (leukoplakia) or red patch lasting >2 weeks in paan/zarda users requires immediate dental/ENT biopsy.',
    ],
    footerMeta: 'Bilingual Guideline • Free at UHC',
    ctaLabel: 'Find Nearest VIA Facility',
  },
  {
    id: 'respiratory',
    categoryLabel: 'Pulmonary & Environmental',
    title: 'Chronic Respiratory & Clean Air Health',
    badge: 'AQI Defense',
    tags: ['tobacco'],
    icon: 'air',
    accent: 'secondary',
    image: HOTLINKED_ASSETS.ruralChulha,
    imageAlt:
      'Tranquil rural Bangladeshi village courtyard with improved ventilated earthen chulha stove at sunrise',
    imageOverlayLabel: 'COPD Mitigation',
    imageOverlayIcon: 'nest_eco_leaf',
    contextHeading: 'Biomass & Urban Winter Particulate Strategy',
    contextBody:
      'Rural women face indoor biomass smoke from traditional clay stoves (chulha), causing non-smoker COPD. In urban centres like Dhaka, winter PM2.5 exceeds safe limits 8-fold. Use N95/KF94 masks during Nov–Feb high AQI transit.',
    expandedProtocol: [
      'Install a simple flue chimney pipe and cross-ventilation window in rural kitchen outhouses — lowers indoor PM2.5 by 58%.',
      'Keep infants and toddlers away from kitchen ignition zones during morning and evening cooking.',
      'Check daily Dhaka/Chattogram AQI in winter; shift outdoor exercise indoors when AQI > 150.',
    ],
    footerMeta: 'N95 during high AQI',
    ctaLabel: 'Inhaler & Peak Flow Protocol',
  },
  {
    id: 'mental',
    categoryLabel: 'Neuro-Metabolic Resilience',
    title: 'Sleep Architecture, Stress & Maternal Wellbeing',
    badge: 'Community Care',
    tags: ['mental', 'metabolic'],
    icon: 'psychology',
    accent: 'primary',
    contextHeading: 'Cortisol, Glycemia & Circadian Rest',
    contextBody:
      'Chronic sleep deprivation (<6 hours/night) elevates evening cortisol, raising fasting blood glucose by 12–18% and blunting antihypertensive response. Community maternal mental health screening protects both mother and newborn.',
    expandedProtocol: [
      'Maintain a consistent 7–8 hour sleep window; avoid heavy spiced meals within 2 hours of bedtime.',
      'Postpartum sadness or anxiety persisting >2 weeks warrants compassionate screening via National Institute of Mental Health (NIMH) or 16263.',
      '10 minutes of slow diaphragmatic breathing lowers sympathetic vascular tone and resting heart rate.',
    ],
    footerMeta: 'NIMH & NCDC Validated',
    ctaLabel: 'Circadian Reset Guide',
  },
];

export const PATIENT_FACTSHEETS: FactsheetItem[] = [
  {
    id: 'fs-htn-bn',
    tag: 'POSTER • BANGLA',
    formatLabel: 'A4 / A3 Print',
    title: 'কাঁচা লবণ বর্জন ও উচ্চ রক্তচাপ প্রতিরোধ গাইড',
    subtitle: 'Hypertension & Salt Control (Bangla) • 1.4 MB',
    description:
      'Visual illustrated patient chart detailing sodium reduction, raw salt elimination, and blood pressure monitoring intervals for rural households.',
    size: '1.4 MB',
    language: 'Bangla',
  },
  {
    id: 'fs-carb-en',
    tag: 'CLINICAL CHART',
    formatLabel: 'Dual Language',
    title: 'White Rice Swap & Post-Meal Activity Matrix',
    subtitle: 'Type 2 Diabetes: Carb Swap Chart (EN/BN) • 2.1 MB',
    description:
      'Nutritional density guide: Substituting unpolished coarse grains, leafy greens (শাক), and lentils to curb metabolic spike post-prandially.',
    size: '2.1 MB',
    language: 'EN + বাংলা',
  },
  {
    id: 'fs-via-bn',
    tag: 'PROVIDER PROTOCOL',
    formatLabel: 'Clinical Grade',
    title: 'জরায়ুমুখ ও স্তন ক্যান্সার প্রাথমিক স্ক্রিনিং (VIA Flow)',
    subtitle: 'Cervical (VIA) & Colposcopy Referral Flow • 3.8 MB',
    description:
      'Upazila health worker checklist for conducting 5% acetic acid tests, recording positive lesions, and rapid BSMMU e-referrals.',
    size: '3.8 MB',
    language: 'Bangla + EN',
  },
];

export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: 'paper-1',
    category: 'Health Economics',
    date: 'March 2025',
    title:
      'Economic Burden of Hereditary Hemoglobinopathies in South Asia: Cost-Effectiveness of Universal Pre-Marital Carrier Screening',
    authors: 'Dr. Farhana Sultana, MBBS, MPH; Prof. M. A. Aziz, FCPS',
    affiliation: 'Lead Epidemiologist • Dhaka University, BSMMU & Global Health Collaborators',
    doi: '10.1016/j.banglahealth.2025.04',
    size: '2.4 MB',
    quote:
      '“Universal voluntary pre-marital carrier identification in Bangladesh prevents an estimated 1,200 annual high-cost lifelong transfusions per 100,000 population, delivering an 18:1 macroeconomic public health return.”',
    abstract:
      'Using a multi-cohort Markov decision-tree model across all 8 administrative divisions of Bangladesh (n = 18,540 capillary HPLC assays), we evaluated one-time couple pre-marital carrier screening (~৳2,500) against lifetime transfusion and iron-chelation management (৳250,000–৳450,000/yr). Proactive screening averts catastrophic out-of-pocket household medical impoverishment in 91.4% of at-risk families.',
    keyFindings: [
      'National combined carrier prevalence stands at 11.2% (HbE trait 62% of variants, β-Thalassemia trait 31%, other variants 7%).',
      'Marginal public delivery cost averages ৳42.50 ($0.38 USD) per citizen reached — 88% below the WHO South Asia cost-effectiveness ceiling.',
      'Pre-marital cascade screening yields an 18x lifetime economic dividend while fully preserving reproductive autonomy.',
    ],
  },
  {
    id: 'paper-2',
    category: 'DGHS Protocol',
    date: 'February 2025',
    title: 'National VIA Cervical Cancer Upazila Scaling Protocol & Digital Registry Concordance',
    authors: 'NIPSOM Oncology Working Group & DGHS Maternal Health Cell',
    affiliation: 'National Institute of Preventive and Social Medicine (NIPSOM)',
    doi: 'DGHS-NCD-MAN-09',
    size: '1.8 MB',
    quote:
      '“Decentralizing complimentary 5% acetic acid visual screening to 492 Upazila Health Complexes reduced median time-to-colposcopy referral from 114 days to 19 days.”',
    abstract:
      'Operational evaluation of nurse-midwife led Visual Inspection with Acetic Acid (VIA) across 64 districts, paired with digital smartphone cervicography peer review at BSMMU.',
    keyFindings: [
      '94.2% diagnostic concordance between trained Upazila senior midwives and tertiary colposcopy specialists.',
      'Zero out-of-pocket screening tariff increased rural female participation by 3.1x year-over-year.',
      'Integrated smokeless tobacco (zarda/sadapata) cessation counseling concurrently lowered oral precancerous lesions.',
    ],
  },
  {
    id: 'paper-3',
    category: 'Molecular Epidemiology',
    date: 'January 2025',
    title: 'Discordance Between Red Cell Indices and Cation-Exchange HPLC in Iron-Deficient Populations',
    authors: 'BSMMU Dept. of Hematology & IEDCR Molecular Reference Team',
    affiliation: 'BSMMU & Institute of Epidemiology, Disease Control and Research (IEDCR)',
    doi: '10.1016/j.jiph.2025.01.019',
    size: '3.1 MB',
    quote:
      '“Relying on CBC MCV alone misses 27% of Hemoglobin E heterozygotes; automated HPLC remains indispensable for premarital confirmation.”',
    abstract:
      'Comparative diagnostic accuracy study of Complete Blood Count (Mentzer Index) versus Bio-Rad D-10 automated cation-exchange HPLC and confirmatory Sanger PCR across 482 sentinel samples.',
    keyFindings: [
      '100% concordance between district capillary HPLC HbA2 >3.5% cutoffs and tertiary BSMMU PCR genotyping.',
      'Co-existing iron deficiency anemia transiently lowers HbA2; iron repletion + HPLC eliminates false negatives.',
      'HbE/β-Thalassemia compound heterozygosity represents 4.2% of matched carrier couples in northern divisions.',
    ],
  },
];

export const TELEMETRY_DISPATCHES: TelemetryDispatch[] = [
  {
    id: 'tel-1',
    division: 'Rangpur Division',
    regionHeader: 'RANGPUR RURAL UPAZILA',
    timestamp: '8m ago',
    title: 'Rangpur Rural Upazila HPLC Camp Complete',
    summary:
      'Mobile diagnostic van completed screening cohort: 342 pre-marital college students with automated HPLC analyzer. 38 Beta-Thalassemia traits identified; targeted genetic counseling initiated on-site.',
    nodeLabel: 'Upazila Health Complex #4',
    nodeIcon: 'local_hospital',
    metricA: '342 Samples',
    metricB: '11.1% Trait Yield',
    accent: 'secondary',
  },
  {
    id: 'tel-2',
    division: 'Sylhet Division',
    regionHeader: 'SYLHET (SREEMANGAL)',
    timestamp: '24m ago',
    title: 'Tea Garden Community Health Worker Deployment',
    summary:
      '1,120 tea garden laborer families enrolled in bilingual (Bengali & Sadri dialect) NCD dietary hypertension and raw salt reduction field protocol.',
    nodeLabel: 'Field Agent: Sabina Yasmin (Worker #42)',
    nodeIcon: 'volunteer_activism',
    metricA: '18 Sessions',
    metricB: '1,120 Registered',
    accent: 'tertiary',
  },
  {
    id: 'tel-3',
    division: 'Dhaka Division',
    regionHeader: 'BSMMU HEMATOLOGY LAB',
    timestamp: '1h ago',
    title: 'Batch 482 Molecular Confirmatory PCR Validated',
    summary:
      'Batch 482 molecular confirmatory PCR assays completed. 100% concordance confirmed with district automated capillary electrophoresis results.',
    nodeLabel: 'Tertiary Quality Assurance Node',
    nodeIcon: 'biotech',
    metricA: '482 PCR Assays',
    metricB: '100% Concordance',
    accent: 'primary',
  },
  {
    id: 'tel-4',
    division: 'Chattogram Division',
    regionHeader: 'CHATTOGRAM HILL TRACTS',
    timestamp: '2h ago',
    title: 'Rangamati Cold-Chain Capillary Kit Dispatch',
    summary:
      'Rangamati civil surgeon health team dispatched temperature-stabilized capillary collection kits for 12 indigenous community clinics.',
    nodeLabel: 'Cold Chain Telemetry: 4.2°C Stable',
    nodeIcon: 'ac_unit',
    metricA: '12 Clinics',
    metricB: '4.2°C Verified',
    accent: 'secondary',
  },
];

export interface PunnettCalculationResult {
  pNormal: number;
  pCarrier: number;
  pMajor: number;
  riskTitle: string;
  riskTone: 'safe' | 'elevated' | 'indeterminate';
  col1: string;
  col2: string;
  row1: string;
  row2: string;
  cells: {
    code: string;
    label: string;
    tone: 'normal' | 'carrier' | 'major';
  }[];
  offspring4Code: string;
  offspring4Label: string;
  offspring4Affected: boolean;
}

export function calculateMendelianOutcome(
  g1: GenotypeOption,
  g2: GenotypeOption
): PunnettCalculationResult {
  if (g1 === 'beta-thal' && g2 === 'beta-thal') {
    return {
      pNormal: 25,
      pCarrier: 50,
      pMajor: 25,
      riskTitle: '25% High Probability of Beta-Thalassemia Major',
      riskTone: 'elevated',
      col1: 'HbA (Normal)',
      col2: 'β-Thal (Trait)',
      row1: 'HbA (Normal)',
      row2: 'β-Thal (Trait)',
      cells: [
        { code: 'HbA / HbA', label: 'Unaffected (25%)', tone: 'normal' },
        { code: 'HbA / β-Thal', label: 'Carrier Trait (25%)', tone: 'carrier' },
        { code: 'HbA / β-Thal', label: 'Carrier Trait (25%)', tone: 'carrier' },
        { code: 'β-Thal / β-Thal', label: 'Thal Major (25%)', tone: 'major' },
      ],
      offspring4Code: 'β/β',
      offspring4Label: '25% Major',
      offspring4Affected: true,
    };
  }

  if (g1 === 'hbe' && g2 === 'hbe') {
    return {
      pNormal: 25,
      pCarrier: 50,
      pMajor: 25,
      riskTitle: '25% Homozygous HbE / HbE Genotype (Mild-Moderate)',
      riskTone: 'elevated',
      col1: 'HbA (Normal)',
      col2: 'HbE (Trait)',
      row1: 'HbA (Normal)',
      row2: 'HbE (Trait)',
      cells: [
        { code: 'HbA / HbA', label: 'Unaffected (25%)', tone: 'normal' },
        { code: 'HbA / HbE', label: 'HbE Trait (25%)', tone: 'carrier' },
        { code: 'HbA / HbE', label: 'HbE Trait (25%)', tone: 'carrier' },
        { code: 'HbE / HbE', label: 'HbE Disease (25%)', tone: 'major' },
      ],
      offspring4Code: 'E/E',
      offspring4Label: '25% HbE/E',
      offspring4Affected: true,
    };
  }

  if ((g1 === 'beta-thal' && g2 === 'hbe') || (g1 === 'hbe' && g2 === 'beta-thal')) {
    const row2 = g1 === 'beta-thal' ? 'β-Thal (Trait)' : 'HbE (Trait)';
    const col2 = g2 === 'beta-thal' ? 'β-Thal (Trait)' : 'HbE (Trait)';
    return {
      pNormal: 25,
      pCarrier: 50,
      pMajor: 25,
      riskTitle: '25% Probability of HbE / β-Thalassemia Compound Heterozygote',
      riskTone: 'elevated',
      col1: 'HbA (Normal)',
      col2,
      row1: 'HbA (Normal)',
      row2,
      cells: [
        { code: 'HbA / HbA', label: 'Normal (25%)', tone: 'normal' },
        { code: `HbA / ${g2 === 'hbe' ? 'HbE' : 'β-Thal'}`, label: 'Carrier Trait (25%)', tone: 'carrier' },
        { code: `HbA / ${g1 === 'hbe' ? 'HbE' : 'β-Thal'}`, label: 'Carrier Trait (25%)', tone: 'carrier' },
        { code: 'β-Thal / HbE', label: 'HbE/β-Thal (25%)', tone: 'major' },
      ],
      offspring4Code: 'β/E',
      offspring4Label: '25% HbE/β-Thal',
      offspring4Affected: true,
    };
  }

  if (g1 === 'normal' && g2 === 'normal') {
    return {
      pNormal: 100,
      pCarrier: 0,
      pMajor: 0,
      riskTitle: '0% Risk: Baseline Population Transmission',
      riskTone: 'safe',
      col1: 'HbA',
      col2: 'HbA',
      row1: 'HbA',
      row2: 'HbA',
      cells: [
        { code: 'HbA / HbA', label: 'Normal (25%)', tone: 'normal' },
        { code: 'HbA / HbA', label: 'Normal (25%)', tone: 'normal' },
        { code: 'HbA / HbA', label: 'Normal (25%)', tone: 'normal' },
        { code: 'HbA / HbA', label: 'Normal (25%)', tone: 'normal' },
      ],
      offspring4Code: 'HbA',
      offspring4Label: '25% Normal',
      offspring4Affected: false,
    };
  }

  if (
    (g1 === 'normal' && (g2 === 'beta-thal' || g2 === 'hbe')) ||
    (g2 === 'normal' && (g1 === 'beta-thal' || g1 === 'hbe'))
  ) {
    const p1Trait = g1 === 'beta-thal' ? 'β-Thal' : g1 === 'hbe' ? 'HbE' : 'HbA';
    const p2Trait = g2 === 'beta-thal' ? 'β-Thal' : g2 === 'hbe' ? 'HbE' : 'HbA';
    const activeTrait = g1 === 'normal' ? p2Trait : p1Trait;
    return {
      pNormal: 50,
      pCarrier: 50,
      pMajor: 0,
      riskTitle: '0% Risk of Major Disease (50% Healthy Carrier)',
      riskTone: 'safe',
      col1: 'HbA',
      col2: p2Trait,
      row1: 'HbA',
      row2: p1Trait,
      cells: [
        { code: 'HbA / HbA', label: 'Unaffected (25%)', tone: 'normal' },
        {
          code: g2 === 'normal' ? 'HbA / HbA' : `HbA / ${activeTrait}`,
          label: g2 === 'normal' ? 'Unaffected (25%)' : 'Carrier Trait (25%)',
          tone: g2 === 'normal' ? 'normal' : 'carrier',
        },
        {
          code: g1 === 'normal' ? 'HbA / HbA' : `HbA / ${activeTrait}`,
          label: g1 === 'normal' ? 'Unaffected (25%)' : 'Carrier Trait (25%)',
          tone: g1 === 'normal' ? 'normal' : 'carrier',
        },
        { code: `HbA / ${activeTrait}`, label: 'Carrier Trait (25%)', tone: 'carrier' },
      ],
      offspring4Code: 'HbA',
      offspring4Label: '0% Major',
      offspring4Affected: false,
    };
  }

  return {
    pNormal: 75,
    pCarrier: 20,
    pMajor: 5,
    riskTitle: 'Indeterminate Risk: HPLC Screening Advised',
    riskTone: 'indeterminate',
    col1: 'HbA',
    col2: g2 === 'unknown' ? '?' : g2 === 'beta-thal' ? 'β-Thal' : g2 === 'hbe' ? 'HbE' : 'HbA',
    row1: 'HbA',
    row2: g1 === 'unknown' ? '?' : g1 === 'beta-thal' ? 'β-Thal' : g1 === 'hbe' ? 'HbE' : 'HbA',
    cells: [
      { code: 'HbA / HbA', label: 'Likely Normal', tone: 'normal' },
      { code: 'HbA / ?', label: 'Pending HPLC', tone: 'carrier' },
      { code: '? / HbA', label: 'Pending HPLC', tone: 'carrier' },
      { code: '? / ?', label: 'Screen Both Partners', tone: 'major' },
    ],
    offspring4Code: '?',
    offspring4Label: 'HPLC Needed',
    offspring4Affected: false,
  };
}
