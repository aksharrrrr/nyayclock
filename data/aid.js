// NyayClock — Legal Aid & Government Schemes data layer
// Sources: nalsa.gov.in (verified live), Legal Services Authorities Act 1987 Sec 12,
// myScheme.gov.in catalog (4,772 schemes), MHA CVCF guidelines, SC/ST PoA Rules 2016,
// MoRTH hit-and-run solatium scheme, Tele-Law (DoJ). All public, all free.

const LEGAL_AID = {
  helplines: [
    { name: 'NALSA National Helpline', number: '15100', note: 'Toll-free, all India' },
    { name: 'Delhi DSLSA 24×7', number: '1516 / 9870101337', note: 'Delhi residents' },
    { name: 'Tele-Law (rural, via CSC)', number: '14454', note: 'Free pre-litigation advice' },
    { name: 'Women Helpline', number: '181', note: 'Integrated with One Stop Centres' },
    { name: 'Cyber Crime', number: '1930', note: 'Fund freeze window is critical' },
    { name: 'Ayushman Bharat', number: '14555', note: 'Health cover queries' },
  ],
  applyOnline: {
    url: 'https://scourtapp.nic.in/lsams/nologin/applicationFiling.action?requestLocale=en',
    name: 'NALSA LSAMS Online Application',
    note: 'Fully online, no login needed. Available in 10 Indian languages.',
    documents: ['Photo ID (Aadhaar/voter ID)', 'Photograph', 'Caste certificate no. (if SC/ST)', 'Income declaration (dropdown slabs)', 'Address proof', 'Brief case summary'],
  },
  // Section 12, Legal Services Authorities Act 1987
  eligibility: {
    automatic: [ // No income test
      { cat: 'All women', why: 'Sec 12(c) — even financially independent women qualify' },
      { cat: 'All children', why: 'Sec 12(c) — minors in any proceeding' },
      { cat: 'SC / ST members', why: 'Sec 12(a)' },
      { cat: 'Persons with disability / mental illness', why: 'Sec 12(d)' },
      { cat: 'Victims of trafficking / forced labour', why: 'Sec 12(b)' },
      { cat: 'Industrial workmen', why: 'Sec 12(f)' },
      { cat: 'Persons in custody (jail, protective home, psychiatric facility)', why: 'Sec 12(e)' },
      { cat: 'Victims of mass disaster, floods, caste atrocities', why: 'Sec 12(e) "undeserved want"' },
    ],
    incomeBased: {
      note: 'General category (incl. OBC men): qualifies by income. Statutory floor is ₹9,000/yr but every state prescribes far higher ceilings.',
      examples: 'Most states set the ceiling between ₹1 lakh and ₹3 lakh annual income; check your state SLSA.',
    },
    whatYouGet: [
      'A lawyer to represent you — trial courts up to Supreme Court',
      'Court fees, process fees & witness expenses paid',
      'Drafting of petitions, appeals, legal notices',
      'Certified copies of judgments/orders free',
      'Pure legal ADVICE even without a court case',
      'Help accessing welfare schemes you\u2019re entitled to',
      'You may request a specific panel lawyer (Regulation 7(6))',
    ],
  },
};

const VICTIM_COMPENSATION = [
  { scheme: 'Rape / gang rape victim compensation', amount: '₹3L minimum central; ₹5–10L in many states', where: 'Apply at District Legal Services Authority (DLSA)', when: 'After FIR; interim compensation possible WITHOUT conviction', law: 'Sec 357A CrPC / 396 BNSS + state schemes' },
  { scheme: 'Acid attack compensation', amount: '₹7–8.25L+ (state-dependent)', where: 'DLSA / District Magistrate', when: '50% on medical report itself', law: 'CVCF guidelines + state rules' },
  { scheme: 'Death of victim (dependents)', amount: '₹2–5 lakh', where: 'DLSA', when: 'After post-mortem/FIR', law: 'State Victim Compensation Scheme' },
  { scheme: 'Human trafficking victim', amount: '₹50K–₹2L', where: 'DLSA', when: 'On rescue/FIR', law: 'CVCF guidelines' },
  { scheme: 'SC/ST Atrocities relief', amount: '₹85K – ₹12.25L by severity (TN pays highest)', where: 'District Social Welfare Officer via DM/SP', when: '25% on FIR → 50% on charge-sheet → 25% on conviction', law: 'SC/ST (PoA) Rules 2016 Rule 12(4); 50% Centre : 50% State funded' },
  { scheme: 'Hit-and-run death (driver untraceable)', amount: '₹2,00,000', where: 'State nodal officer (usually SDM/RTO) via police report', when: 'Within scheme timeline after police report', law: 'Sec 161 MV Act Solatium Scheme (MoRTH)' },
  { scheme: 'Hit-and-run grievous hurt', amount: '₹50,000', where: 'Same as above', when: 'Same', law: 'Sec 161 MV Act' },
  { scheme: 'PM-Rahat (NEW 2026)', amount: 'Cashless assured hospital treatment for road accident victims', where: 'Empanelled hospitals', when: 'Immediately on admission', law: 'SO 951(E), notified 19 Feb 2026, MoRTH' },
];

const SUPPORT_SCHEMES = [
  { name: 'One Stop Centre (Sakhi)', benefit: 'Legal aid + police help + medical + shelter for women facing violence', how: 'Walk in, or call 181', url: 'https://wcd.gov.in' },
  { name: 'Tele-Law', benefit: 'Free lawyer consultation via video/CSC for rural citizens', how: 'Call 14454 or visit nearest Common Service Centre', url: 'https://tele-law.in' },
  { name: 'Swadhar Greh', benefit: 'Shelter + rehabilitation for deserted/widowed/destitute women', how: 'Via WCD department or NGO running the Greh', url: 'https://wcd.gov.in' },
  { name: 'IGNOAPS Old Age Pension', benefit: '₹200–500/month (states top up to ₹2–3K)', how: 'Apply at Gram Panchayat/municipal office; needs age proof + BPL/ration card', url: 'https://nsap.nic.in' },
  { name: 'IGNWPS Widow Pension', benefit: '₹300–500/month for widows 40+ (state top-ups common)', how: 'Same as above; death certificate of husband needed', url: 'https://nsap.nic.in' },
  { name: 'PMSBY Accident Insurance', benefit: '₹2L death / ₹1L disability cover for ₹20/YEAR — stackable with MACT awards', how: 'Enroll via any bank; auto-debit from savings account', url: 'https://jansuraksha.gov.in' },
  { name: 'e-Shram Registration', benefit: '₹2L accidental insurance + priority in welfare schemes for unorganised workers', how: 'Free at eshram.gov.in with Aadhaar + mobile', url: 'https://eshram.gov.in' },
  { name: 'Ayushman Bharat PM-JAY', benefit: '₹5L/year free family healthcare — removes biggest financial shock during disputes; now covers ALL citizens 70+', how: 'Check eligibility at beneficiary.nha.gov.in or call 14555', url: 'https://beneficiary.nha.gov.in' },
  { name: 'Witness Protection Scheme', benefit: 'Police protection, identity change, safe houses for threatened witnesses', how: 'Written application to Member-Secretary, State Legal Services Authority', url: 'https://mha.gov.in' },
  { name: 'SC/ST victim additional relief', benefit: 'Pension, government job, land, house, children\u2019s education for severe atrocities', how: 'Via DM/SP after FIR under PoA Act', url: 'https://nhapoa.gov.in' },
];

// Browser-compatible export (also usable in Node via module.exports guard)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LEGAL_AID, VICTIM_COMPENSATION, SUPPORT_SCHEMES };
}
