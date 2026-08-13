/* ================================================================
   COURSEVERIFY CATALOG  ·  APP.JS  v9  (static JSON edition)
   Loads courses directly from courses.json in the same folder.
   Dashboard uses a local COBE WebGL globe.
   No backend server required.
   ================================================================ */

'use strict';

const COURSES_JSON = 'assets/course_catalog.json';
const CATALOG_RICH_JSON = 'assets/course_catalog.json';

// Valid image-file entries extracted once from "Cyber Image Links.xlsx". Drive
// blocks third-party embedding, so the corresponding supplied files are stored
// once in assets/course-banners rather than requested from Drive on every card.
const COURSE_BANNER_IMAGE_IDS = Object.freeze([
    '143OShCgZ-mzJv0Ennhl2xcR1IDDBkSbQ', '1YuKO5MzMiijFyEY6PckA7dBiYeY9dkHs', '1y33O6oZUnnpCHAb1v07uc6Xhgb4wgjP0',
    '142lYp-pHO6UIfUMquSGeBTASX6_73zqZ', '1ZNDO1ibl2JtyhR1DwNutxX5y033eab0J', '1qESbxMPyCe0LDqtyrbe1zm7DmBizY6Mq',
    '1NiFM-1D_ZOwOSQMo4HgdLoQbmscUYBPC', '1oWlRjtzVqrXw6KuC8FULLZPV3MOJ7G8i', '18mthO3jK9mpA8p-oxZkpgQbKkia-erpO',
    '1LHceTtFkQlEewg1_X_UB-xXHtGeIU_jd', '1He1qC6Iw-jgkJoDJXqiGhL-BmU6Z2JbX', '1tdPDP2y83i1BW7v775ZETFKYBJBEiWd9',
    '18ZHpGVHBmu03wWQ7xZeAvTIiTkqS-ABX', '1eYeMKhit_KfN4YN1JiqRAqZFagVBtl0e', '1hdERfoZoedGBzBUeNQxGvaMvzH8nPfOa',
    '1G9Rrw5x_rl6RGbACsww4_TXkh-Kl95Na', '15kPRbL8CoT9z-qdowiBcaTr-hgtN_sfT', '10-sVK9sbWufY3VHcQIG27_tz-PjOPSL4',
    '1P0IDbkJOwuMKlv1t35d0cqXtKcC--hud', '1rRLaqbH3IrO7lpG1OG7_eiSLZvj_i-63', '1jEunZZos-Zen1sWLZnQjBvu6edp4DwHA',
    '1UzIczvMOY5ytqQERpir3rS-AehWAMqUX', '1gvNWiqVUVD6zvB9HSW0g1rMajCKNHhVd', '1Dz17EQZPoztrgvJJ7sbU1epNfTMRqjQZ',
    '1KmuJk7PkbpSLekz-DHxYsxmZZJzhTdvL', '1jBkWT-TZl8vcBgUpUSX-gMo9VbNE_JWg', '1iSp8d8JHOahV_nmSWMwT7RD9euyxXs-N',
    '18tmnHpAGt0Dsq_h1JIF_r4YY1ZEuI4ic', '1DF6tO9uyFKfvp4AkB-0AaRGBfjcJqzA-', '1YlmqoF96fZC-On_zyd9AMayTxgBXF034',
    '1WOWG89w1L956UZY5r87JEC3kQ0xQcr2w', '1Klf-nVOIN0_EWU_MGXlSjGKEnBJm8vAV', '1-daAgL4vPZZj0MTOi7k_jnVsy-L6DywU',
    '1lk9yJV1PJ27gjr-Brx_0zBci9edmM_9a', '1hrjgoYZmKNSYFjINmEwx9gxlgm5hLZh8', '1WWG2NqOsgoON1lMPGLrXTqiqml1-PNr7',
    '1XiB-ZYbqpy5jrI4gkU0AVewsXk1FYivb', '15X1-fr7pC7RbIu07si6-9zYuNg9X7ghp', '1od1XCdhB-HfNFRSj6AUzIXanvpm-W2x6',
    '1WlbElmXmnUCwjFEa6bS22jEcqM3WhkYC', '1BKWGh6DYjIHD5yuTPShMxp3PFjckbUQs', '11j-DKfYW4K5xtca02NqydTWQdhElHJ0U',
    '1F6thesThIpRb8n1vXhoHBDOeVqjXtZyd', '1Y23tpjHlj_NvVb8Exbsm2T_nudx_NLc7', '1dbYfcIVpNmvkvBc5717nOvjxUcncxs2n',
    '1fTgfMuEWXpU4al-uNStZ-ZWMsM_l0rqH', '1klOIMS-Oj8nrT1jC-MfYhObymRWabpMk', '1gJ6LMQAPTyalwLwHJrPEmPvUnoHOTePZ',
    '1-5NN8NItWolQ8RalKK7VlKd0PQUxbaVH', '1Y7oRMqVukBIWK-k3ELjw1094dw-jhIbx', '1H2KZObtvK5uU8SsUDZPVU8CRBLz_kACD',
    '1zP0ML81JHKR2rJ_SamCjOcp7_TIWLem8', '1FIIS8kkzW7RvXDxuKQVEp8f3azwuHVIN', '1i8A-Gu7wgjQ38QLij2Si4hhG4nMWNST5',
    '1y6Wuk4veBwvpJbEhrYBLtdhvIF7vjGuv', '18HB859s_KNz0QnTFPfEudIra5eXh8wV9', '1ENGw8CUzrz08c5E78asugHFRi5yLGNZ3',
    '1FAaStzLvGGHyYYJcjdQuRNhozMFbvRi5', '1Jw4jYIZKfmO_I5ROi9M4lrsiHcWQIkgA', '1HbEsDK_I0TDy67nSju9wBY2FA-oiTB7C',
    '1dsNKNl38V35q9mtU-srtUUUD5yda-Zkc', '1ekl4S6tGY1skXEbWg3gRTly_T2dA2HJH', '1w2Eu5wEDJ05e6N-qMSe8q8uFw0cFBysx',
    '16P5IEGA6W5Z8uqwmWOcorr8h5cqb6anj', '159kwQcOCgm-nNAkJtIQPKxmz6B1ynM_d', '1XPPBtFb2ly_70rZyqjaMwrXo01Uw5yEo',
    '1o0YiONKFG_M_ZavRiM96Qw0TkVC7_dSd', '1-bBlO1lIGA1XFMdmGcZPnGF92nyFNl-y', '10Ps2tJtAdaMGEG-ML7L9QhMz08U0Pv45',
    '1IrqTayrFyI0KIeuHtYxo7PPQiyJGmID7', '1R483erzD1_6MQHe1TwVqJRlsoSRa9sMV', '1MdlbjyxDRLXPqcwIdD6zPtMlUC2vGRAq',
    '1uWAvk--5AKfbhJyVHoYf5EWPX5mRXDcQ', '1bnC5ie5YuDQhaolaUwnBQhsPSWDsCFpF', '1hM2rinkFdNjqV-0FUoFvaRbmogHQ659H',
    '1VuIE-3q37C0DsCeb8mVHtDwWUhLaD2XD', '16aYDCb51oBsGPkbGXWQfZ6WMbc7hcK-N', '14UC_haDYJUxpVZrGc_IntfHseKAJqQCc',
    '107xhRVPtHxqw9zNb4Ds3HhkkvoJEujb_', '1INNcDwB4ABe0_TKDg72ZwUyWjfsCnfeG', '1GrMHGmo_bh3rSRP3xIXFKk8cvg6dgXck',
    '1Swab_5P3ufAtuRMzj4ckSXGoyPYQtUpr', '1a5n5XIr5xSAXftr2B8dP21oRKJEGncSw', '15x8ASxAL18f_aaE5x6D5KTZTuQXPLZjz',
    '1LRIxmoDfumNVW1UHx5ceWtqswnUf4noj', '1wCvQl23Nh6iYH3MCJbgoAC0v7MI5t0R1', '1Ss9oWkai1WFcR85ra1KBHMM07Njo5xLt',
    '10KYRNSUM_M2kix58yNHYK104sN6RYDd8', '1-ogn6A_wPGCFJvf8bZW4DEq9BaMtKgcs', '1sk5ygrL8hjfL6_F99xNsjXPxK4L82fB7',
    '1CKh1TEAeh-z37DovT_w3dS6b2owdXAiF', '1xhrfTrnfYt1uQYXUvS8sy_pjzSLkPfzh', '1MRvwkN14RKq610AKn2t2pXBfxwLk5Enr',
    '1cj_CjRfut4l4dHeZHE3QcjLQoEascSrt', '1dWr2dgJoAS_3cj5c5bpNEhz476c6-wMQ', '1Af5JLmB1aZcMVzvKS6vgv9U3I1rHft5v',
    '1cJLoMa5yS8hfTc9yLuobyNoii4_o0Bkh', '10cD6KYcqYGsPsdNGfg-epanYCGEhP2k4', '117GsrtIXX968iOu6ypgfLMxwdOYMRg7-',
    '1IDnxvdyTFjvCExXWEL-x5aJMOFU2ENnS', '1513hR-mMaiZ1IkvrgzmFolmbD5jilk-s', '1vePSJ9crRWm8oo2Ibl626iIw9q4jPBQk',
    '1OMSBcmN1I_k9adzqLQvkh9Fdrf1AwIop', '1pjE18h-XQ1AHd-krtfFlVGpOjJOR575t', '1TeHpc5CV9QiiIDkxK0bjsBbW5s9Epidi',
    '1JoW8A8IWy_s0juqZ_mPhKTTAsC1He0cu', '1IyHOAaCN9pACLujKzx515Yzb37a9nZDt', '1lBJYPysjfnTPoMSwhojrgLs7EcNKr8cu',
    '1zJr7RSKcTH6u2z_5fUjNVQclFNxPjyZo', '1j32uBM-zCeCv4XmV7GbB19N6gFB2jcjY', '1GhVvdm6cJuYjO1NMrjLGgrG61UAWWb9h',
    '1Ri71QG7HoEfCDmVACYddLyU0ECH91dTI', '1TmAOMhTzs4N6Xvefew6Jx4LEnJvv1PnZ', '14VL_f9XrYWx_-QIkCEMYLV4krZZ-rozJ',
    '1wQlrbs5Vcqjkj079z3olTw64EEDzNA4L', '1Q1sfl8CunmeEBMT3l3IS5YpXq_9lFIWb', '1dbOvEIBCiJcrMuq8FcN-G73JGlRUN_2a',
    '1cgC_Qlr5zrU_aNLiTPfHiiW-R-3GGgSm', '1fszxbruve7G5G9X7725F1vn5gVzJn_4m', '1P6xAlCDhyh5D4yMNM3ZtUz3sr7oaW3BH',
    '1ipu2CYWNB-GLR0VIE1zAJKMaXJjcBowp'
]);

function getCourseImage(courseId) {
    if (!COURSE_BANNER_IMAGE_IDS.length) return '';
    // A stable string hash gives a random-looking distribution without Math.random(),
    // so a course keeps the same banner through rerenders, filtering, and refreshes.
    let hash = 2166136261;
    for (const char of String(courseId ?? '')) {
        hash ^= char.charCodeAt(0);
        hash = Math.imul(hash, 16777619);
    }
    const imageIndex = (hash >>> 0) % COURSE_BANNER_IMAGE_IDS.length;
    const imageNumber = String(imageIndex + 1).padStart(3, '0');
    const extension = imageIndex === 111 ? 'png' : (imageIndex === 112 ? 'avif' : 'webp');
    return `assets/course-banners/cyber-${imageNumber}.${extension}`;
}

// ── State ────────────────────────────────────────────────────────
let globalData = null;
let richCatalogMap = null;
let currentFilter = { type: null, value: null };
let countryDataList = [];
let allCoursesData = [];
let rawDomainCounts = {};
let currentPage = 1;
const PAGE_SIZE = 100;
let lastStatsHash = '';
let lastCountryHash = '';

let firstDataFetch = true;

// ── Tab filter state ─────────────────────────────────────────────
let courseFilter = { search: '', country: 'all', domain: 'all', qs: 'any', nirf: 'any', courseType: 'all' };

// ── edX All Courses filter state ────────────────────────────────────
let coursesPageSize = window.innerWidth <= 768 ? 100 : 250;
function getCoursesPageSize() { return window.innerWidth <= 768 ? 100 : 250; }
const favoriteCourses = new Set(JSON.parse(localStorage.getItem('cv_favorites') || '[]'));
let edxFilterState = {
    showSavedOnly: false,
    typePill: 'all',    // course type from #course-type-pills
    accessTypes: [],    // multi-select access types from #access-type-pills
    domainChip: 'all',  // domain category from #domain-chips-scroll
    levelPill: 'all',   // skill level from #skill-level-pills
    duration: 'all',    // duration bucket from #duration-pills
    mode: 'all',        // delivery mode from #mode-pills
    language: 'all',    // language from #language-pills
    ranking: 'all',     // ranking badge from #ranking-pills
    country: 'all',     // country filter (e.g. from globe/metrics)
    search: '',
    sort: 'relevance',
    view: 'grid',
    page: 1
};

function getSkillLevel(course) {
    const domainCats = Array.isArray(course.domains) && course.domains.length > 0 
        ? course.domains 
        : [getDomainCategory(course)];

    const type = course.accessType || normalizeDomain(course.domain);
    const courseType = normalizeDomain(course.domain);
    const advancedTypes = ["Bachelor's Degree", "Master's Degree"];

    if (advancedTypes.includes(type) || advancedTypes.includes(courseType)) return 'Advanced';

    if (domainCats.includes('System & Endpoint') || domainCats.includes('Cyber Forensics')) return 'Intermediate';
    if (domainCats.includes('Data & Application') || domainCats.includes('Legal & Ethical')) return 'Advanced';
    if (domainCats.includes('Foundational') || domainCats.includes('Network Infrastructure')) return 'Beginner';

    const beginnerTypes = ['Free', 'Free to Audit', 'Certificate'];
    if (beginnerTypes.includes(type) || beginnerTypes.includes(courseType)) return 'Beginner';

    return 'Intermediate';
}


function matchDomainChip(course, chip) {
    if (chip === 'all' || chip === 'Featured') return true;
    const mapping = {
        'foundational': 'Foundational',
        'network-infra': 'Network Infrastructure',
        'system-endpoint': 'System and Endpoint Security',
        'forensics-ir': 'Cyber Forensics',
        'data-app-security': 'Application & Data Security',
        'legal-compliance': 'Legal & Ethical'
    };
    const expected = mapping[chip];
    if (!expected) return false;
    return Array.isArray(course.domains) && course.domains.includes(expected);
}

function matchAccessTypes(course, types) {
    if (!types || types.length === 0) return true;
    return Array.isArray(course.domains) && course.domains.some(d => types.includes(d));
}

function matchTypePill(course, pill) {
    if (pill === 'all' || pill === 'All') return true;
    const rawType = String(course.course_type || '').toLowerCase().trim();
    const cName = String(course.name || '').toLowerCase().trim();
    if (pill === 'Post Graduate Diploma' && (rawType.includes('pg diploma') || cName.includes('pg diploma'))) return true;
    if (pill === 'Post Graduate Certificate' && (rawType.includes('pg cert') || cName.includes('pg cert'))) return true;
    if (pill === "Bachelor's Degree" && rawType.includes('bachelor')) return true;
    if (pill === "Master's Degree" && rawType.includes('master')) return true;

    // Exact match for the rest
    const normalized = rawType;
    return normalized === String(pill).toLowerCase().trim();
}

function matchLevelPill(course, level) {
    if (level === 'all') return true;
    return getSkillLevel(course) === level;
}



function getDomainCategory(courseOrId) {
    if (courseOrId && typeof courseOrId === 'object') {
        if (Array.isArray(courseOrId.domains) && courseOrId.domains.length > 0) return courseOrId.domains[0];
    }
    return 'Uncategorised';
}

const ALL_DOMAIN_LABELS = [
    'Free', 'Free to Audit', 'High Value Low Cost', 'Foundational', 
    'Network Infrastructure', 'System & Endpoint', 'Cyber Forensics', 
    'Data & Application', 'Legal & Ethical'
];

// ════════════════════════════════════════════════════════════════
//  CYBERSECURITY DOMAIN KNOWLEDGE DATA
// ════════════════════════════════════════════════════════════════
const CYBER_DOMAINS_DATA = [
    {
        id: 'foundational',
        title: 'Foundational',
        icon: '<svg style="width:24px;height:24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2zM4 19.5v-15"/></svg>',
        color: '#14b8a6',
        summary: 'Core concepts every cybersecurity learner needs — from threat basics to risk frameworks and governance.',
        subDomains: ['Cybersecurity Basics', 'Risk Management', 'Threat Landscape', 'Security Frameworks', 'Security Governance'],
        skills: ['Risk Assessment', 'Policy Writing', 'NIST/ISO 27001', 'Security Awareness', 'Asset Management'],
        roles: ['Security Analyst', 'GRC Analyst', 'IT Auditor', 'Risk Manager'],
        courseTypes: ['Certificate', 'Free to Audit', "Bachelor's Degree"],
        filterDomain: 'Foundational'
    },
    {
        id: 'network',
        title: 'Network Infrastructure',
        icon: '<svg style="width:24px;height:24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>',
        color: '#6366f1',
        summary: 'Protect the arteries of digital infrastructure — firewalls, IDS/IPS, cloud networks, and zero-trust architecture.',
        subDomains: ['Network Security', 'Firewalls & VPN', 'IDS/IPS', 'Cloud Security', 'Zero Trust Architecture'],
        skills: ['Packet Analysis', 'Firewall Rules', 'SDN Security', 'VPC Design', 'Network Segmentation'],
        roles: ['Network Security Engineer', 'Cloud Security Architect', 'SOC Analyst', 'Infrastructure Engineer'],
        courseTypes: ['Certificate', 'Diploma', "Master's Degree"],
        filterDomain: 'Network Infrastructure'
    },
    {
        id: 'endpoint',
        title: 'System & Endpoint',
        icon: '<svg style="width:24px;height:24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
        color: '#06b6d4',
        summary: 'Harden endpoints, operating systems, and mobile devices against malware, misconfiguration, and lateral movement.',
        subDomains: ['Endpoint Security', 'OS Hardening', 'Mobile Security', 'Patch Management', 'Malware Defense'],
        skills: ['EDR/XDR', 'OS Internals', 'Threat Hunting', 'Vulnerability Management', 'Incident Triage'],
        roles: ['Endpoint Security Engineer', 'SOC Analyst', 'Threat Hunter', 'System Administrator'],
        courseTypes: ['Certificate', 'Diploma', "Post Graduate Diploma"],
        filterDomain: 'System & Endpoint'
    },
    {
        id: 'forensics',
        title: 'Cyber Forensics',
        icon: '',
        color: '#8b5cf6',
        summary: 'Investigate breaches, recover digital evidence, and reconstruct attacks using forensic tools and incident-response playbooks.',
        subDomains: ['Digital Forensics', 'Incident Response', 'Reverse Engineering', 'eDiscovery', 'Threat Intelligence'],
        skills: ['Disk Imaging', 'Memory Forensics', 'Kill Chain Analysis', 'Chain of Custody', 'IOC Triage'],
        roles: ['Digital Forensics Specialist', 'Incident Responder', 'Malware Analyst', 'Threat Intel Analyst'],
        courseTypes: ['Certificate', "Post Graduate Certificate", "Master's Degree"],
        filterDomain: 'Cyber Forensics'
    },
    {
        id: 'data',
        title: 'Data & Application',
        icon: '️',
        color: '#f43f5e',
        summary: 'Secure code, databases, cryptography, and data privacy to protect the applications and information that power organizations.',
        subDomains: ['Application Security', 'Data Privacy', 'Cryptography', 'Database Security', 'DevSecOps'],
        skills: ['Secure Coding', 'OWASP Top 10', 'Encryption', 'Privacy by Design', 'CI/CD Security'],
        roles: ['Application Security Engineer', 'Data Privacy Officer', 'DevSecOps Engineer', 'Cryptographer'],
        courseTypes: ['Certificate', "Post Graduate Diploma", "Master's Degree"],
        filterDomain: 'Data & Application'
    },
    {
        id: 'legal',
        title: 'Legal & Ethical',
        icon: '⚖️',
        color: '#f59e0b',
        summary: 'Navigate cyber law, ethics, compliance, and reporting obligations across jurisdictions and industries.',
        subDomains: ['Cyber Law', 'Ethics & Professionalism', 'Regulatory Compliance', 'Incident Reporting', 'Digital Rights'],
        skills: ['Legal Research', 'Compliance Mapping', 'Incident Disclosure', 'Ethical Hacking Ethics', 'GDPR/CCPA'],
        roles: ['Cybersecurity Lawyer', 'Compliance Manager', 'Ethics Officer', 'Policy Advisor'],
        courseTypes: ['Certificate', 'Diploma', 'Free to Audit'],
        filterDomain: 'Legal & Ethical'
    }
];

// ── Academic-domain normalizer ──────────────────────────────────
const _CANON_DOMAIN_FRAGMENTS = [
    ['post graduate diploma', "Post Graduate Diploma"],
    ['post grad diploma', "Post Graduate Diploma"],
    ['graduate diploma', "Post Graduate Diploma"],
    ['post graduate certificate', "Post Graduate Certificate"],
    ['post grad certificate', "Post Graduate Certificate"],
    ['post grad cert', "Post Graduate Certificate"],
    ['bachelor', "Bachelor's Degree"],
    ['master', "Master's Degree"],
    ['pg', "Master's Degree"],
    ['diploma', "Diploma"],
    ['certificate', "Certificate"],
    ['cert', "Certificate"],
    ['free to audit', "Free to Audit"],
    ['high value low cost', "High Value Low Cost"],
    ['free', "Free"],
];
function normalizeDomain(raw) {
    if (!raw) return 'Other';
    const k = String(raw).toLowerCase().replace('gradiuate', 'graduate').trim();
    if (!k || ['unknown', 'unknown domain', 'none', 'null'].includes(k)) return 'Other';
    for (const [frag, label] of _CANON_DOMAIN_FRAGMENTS) {
        if (k.includes(frag)) return label;
    }
    return 'Other';
}

// ── Duration / Mode / Language helpers for new filter dimensions ─
const DURATION_UNITS = {
    y: 12,    // years → months
    m: 1,     // months → months
    w: 1 / 4.345, // weeks → months
    h: 0,     // hours → treat as under 1 month
    sp: 0     // self-paced → treat as under 1 month
};

function parseDurationMonths(raw) {
    if (!raw || raw === '-') return NaN;
    const s = String(raw).toLowerCase().replace(/\s+/g, '');
    // Handle slash-separated options (e.g. "1/3/6M", "3/4Y") by taking the max.
    if (s.includes('/')) {
        const parts = s.split('/');
        const months = parts.map(p => parseDurationMonths(p)).filter(n => !isNaN(n));
        return months.length ? Math.max(...months) : NaN;
    }
    // Handle ranges like "8-16M" by taking the max.
    if (s.includes('-')) {
        const months = s.split('-').map(p => parseDurationMonths(p)).filter(n => !isNaN(n));
        return months.length ? Math.max(...months) : NaN;
    }
    // Special tokens.
    if (s === 'sp' || s.includes('self') || s.includes('paced')) return 0;
    // Extract number + unit.
    const m = s.match(/([0-9]*\.?[0-9]+)([ymwh]?)/);
    if (!m) return NaN;
    const val = parseFloat(m[1]);
    const unit = m[2] || 'm';
    const factor = DURATION_UNITS[unit] ?? 1;
    return val * factor;
}

function getDurationBucket(months) {
    if (months === null || months === undefined || isNaN(months)) return null;
    if (months < 1) return 'short';
    if (months <= 3) return '1-3';
    if (months <= 6) return '3-6';
    if (months <= 12) return '6-12';
    if (months <= 24) return '1-2';
    if (months <= 48) return '2-4';
    return '4+';
}

function getCourseDuration(course) {
    if (course._durationMonths !== undefined) return { months: course._durationMonths, bucket: course._durationBucket };
    const months = parseDurationMonths(course.duration);
    const bucket = getDurationBucket(months);
    course._durationMonths = months;
    course._durationBucket = bucket;
    return { months, bucket };
}

function getCourseMode(course) {
    if (course._mode) return course._mode;
    const raw = String(course.mode || '').toLowerCase();
    let mode = 'Other';
    if (raw.includes('hybrid')) mode = 'Hybrid';
    else if (raw.includes('online')) mode = 'Online';
    else if (raw.includes('offline')) mode = 'Offline';
    course._mode = mode;
    return mode;
}

function getCourseLanguage(course) {
    if (course._language) return course._language;
    let lang = course.language;
    if (!lang && Array.isArray(course.pdf_table)) {
        const entry = course.pdf_table.find(e => e.attribute === 'Language');
        if (entry && entry.original) {
            lang = String(entry.original).split(/[,;(]/)[0].trim();
        }
    }
    // Normalize common variations.
    const canonical = {
        'eng': 'English', 'english': 'English', 'en': 'English',
        'hindi': 'Hindi', 'hi': 'Hindi',
        'spanish': 'Spanish', 'es': 'Spanish',
        'french': 'French', 'fr': 'French',
        'german': 'German', 'de': 'German',
        'portuguese': 'Portuguese', 'pt': 'Portuguese',
        'italian': 'Italian', 'it': 'Italian',
        'chinese': 'Chinese', 'zh': 'Chinese',
        'japanese': 'Japanese', 'ja': 'Japanese',
        'korean': 'Korean', 'ko': 'Korean',
        'arabic': 'Arabic', 'ar': 'Arabic',
        'russian': 'Russian', 'ru': 'Russian',
        'tamil': 'Tamil', 'telugu': 'Telugu', 'marathi': 'Marathi',
        'bengali': 'Bengali', 'gujarati': 'Gujarati', 'kannada': 'Kannada',
        'malayalam': 'Malayalam', 'punjabi': 'Punjabi', 'urdu': 'Urdu'
    }[String(lang).toLowerCase().trim()] || (lang || 'English');
    course._language = canonical;
    return canonical;
}

// ════════════════════════════════════════════════════════════════
//  CANONICAL FILTER DIMENSIONS (derived at runtime)
//  These fields drive the three independent filter dimensions:
//  skillLevel, accessType, and domainSlug/domainLabel.
// ════════════════════════════════════════════════════════════════

const ACCESS_TYPES = ['Free', 'Free to Audit', 'High Value Low Cost'];

const DOMAIN_SLUG_MAP = {
    'Foundational': 'foundational',
    'Network Infrastructure': 'network-infra',
    'System & Endpoint': 'system-endpoint',
    'Cyber Forensics': 'forensics-ir',
    'Data & Application': 'data-app-security',
    'Legal & Ethical': 'legal-compliance'
};

const SLUG_LABEL_MAP = Object.fromEntries(
    Object.entries(DOMAIN_SLUG_MAP).map(([label, slug]) => [slug, label])
);

const DOMAIN_COLOR_MAP = {
    'foundational': '#14b8a6',
    'network-infra': '#6366f1',
    'system-endpoint': '#06b6d4',
    'forensics-ir': '#8b5cf6',
    'data-app-security': '#f43f5e',
    'legal-compliance': '#f59e0b'
};

const DOMAIN_CLASS_MAP = {
    'foundational': 'domain-tint-foundational',
    'network-infra': 'domain-tint-network-infra',
    'system-endpoint': 'domain-tint-system-endpoint',
    'forensics-ir': 'domain-tint-forensics-ir',
    'data-app-security': 'domain-tint-data-app-security',
    'legal-compliance': 'domain-tint-legal-compliance'
};

function getAccessType(course) {
    if (Array.isArray(course.domains)) {
        if (course.domains.includes('Free')) return 'Free';
        if (course.domains.includes('Free to Audit')) return 'Free to Audit';
        if (course.domains.includes('High Value Low Cost')) return 'High Value Low Cost';
    }
    return 'Paid';
}

function getDomainSlug(course) {
    const cat = getDomainCategory(course);
    return DOMAIN_SLUG_MAP[cat] || 'other';
}

function getDomainLabel(course) {
    return SLUG_LABEL_MAP[getDomainSlug(course)] || getDomainCategory(course);
}

const LOGO_MAP = {
    "Indian Institute of Technology Kanpur": "https://www.iitk.ac.in/new/images/logo/iitk-logo.jpg",
    "IIT Kanpur": "https://www.iitk.ac.in/new/images/logo/iitk-logo.jpg",
    "Indian Institute of Technology Indore": "https://www.iiti.ac.in/public/images/logo.png",
    "IIT Indore": "https://www.iiti.ac.in/public/images/logo.png",
    "Indian Institute of Technology Jodhpur": "https://iitj.ac.in/logo/IITJ_Logo_with_name.png",
    "IIT Jodhpur": "https://iitj.ac.in/logo/IITJ_Logo_with_name.png"
};

function enrichCourse(course) {
    course.rawIds = Array.isArray(course.id) ? course.id : [course.id];
    course.id = Math.min(...course.rawIds);
    if (!Array.isArray(course.domains)) {
        course.domains = course.domain ? [course.domain] : [];
    }

    const academicDomains = course.domains.filter(d => !['Free', 'Free to Audit', 'High Value Low Cost'].includes(d));
    if (academicDomains.length > 0) {
        course.domain = academicDomains[0];
    } else if (course.domains.length > 0) {
        course.domain = course.domains[0];
    }

    course.accessType = getAccessType(course);
    course.skillLevel = getSkillLevel(course);
    course.domainSlug = getDomainSlug(course);
    course.domainLabel = getDomainLabel(course);
    course.durationInfo = getCourseDuration(course);
    course.mode = getCourseMode(course);
    course.language = getCourseLanguage(course);

    if (!course.logo_url && course.university) {
        for (const [key, url] of Object.entries(LOGO_MAP)) {
            if (course.university.includes(key)) {
                course.logo_url = url;
                break;
            }
        }
    }

    return course;
}

function enrichAllCourses(courses) {
    courses.forEach(enrichCourse);
    return courses;
}

// ── Country flag emoji helper ─────────────────────────────────────
const FLAG_MAP = {
    'United States': 'US', 'United Kingdom': 'UK', 'Australia': 'AU', 'Canada': 'CA',
    'India': 'IN', 'Germany': 'DE', 'France': 'FR', 'Singapore': 'SG', 'Ireland': 'IE',
    'Netherlands': 'NL', 'Switzerland': 'CH', 'New Zealand': 'NZ'
};
function getFlag(name) {
    if (!name) return '';
    for (const [key, flag] of Object.entries(FLAG_MAP)) {
        if (name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(name.toLowerCase())) return flag;
    }
    return '';
}


function populateDynamicFilters() {
    // Append any extra languages found in the data to the static #language-pills.
    // The static markup already holds the main options and their event listeners.
    const langSet = new Set();
    allCoursesData.forEach(c => {
        if (c.language) langSet.add(c.language);
    });
    const langPillsWrap = document.getElementById('language-pills');
    if (!langPillsWrap) return;
    const existing = new Set(
        Array.from(langPillsWrap.querySelectorAll('.type-pill[data-language]')).map(b => b.dataset.language)
    );
    const extras = Array.from(langSet)
        .filter(l => l && !existing.has(l) && l.toLowerCase() !== 'all')
        .sort();
    extras.forEach(l => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'type-pill';
        btn.dataset.language = l;
        btn.setAttribute('aria-pressed', 'false');
        btn.innerHTML = `${escHtml(l)} <span class="filter-count">0</span>`;
        langPillsWrap.appendChild(btn);
    });
}
//  TABS
// ================================================================
async function switchTab(targetId) {
    document.querySelectorAll('.tab-content').forEach(t => {
        t.classList.remove('active', 'tab-enter');
    });
    document.querySelectorAll('#nav-tabs a, .catalog-tabbar a').forEach(a => a.classList.remove('active'));
    const content = document.getElementById(targetId);
    if (content) {
        content.classList.add('active', 'tab-enter');
        setTimeout(() => content.classList.remove('tab-enter'), 350);
    }
    const link = document.querySelector(`#nav-tabs a[data-target="${targetId}"], .catalog-tabbar a[data-target="${targetId}"]`);
    if (link) link.classList.add('active');
    if (targetId === 'tab-courses') loadAllCourses();
    if (targetId !== 'tab-dashboard') hideGlobeTooltip();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideGlobeTooltip() {
    const tooltipEl = document.getElementById('cobe-tooltip');
    if (tooltipEl) {
        tooltipEl.classList.remove('visible');
        tooltipEl.style.display = 'none';
    }
}

function initTabs() {
    document.querySelectorAll('#nav-tabs a[data-target], #mobile-nav-drawer a[data-target], .catalog-tabbar a[data-target]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            switchTab(a.getAttribute('data-target'));
        });
    });
}

// ================================================================
//  INTERACTIVE 3D GLOBE (COBE)
// ================================================================
let globeInstance = null;   // { isCobe, pointOfView(), controls() }
let selectedCountry = null;
let hoverCountry = null;      // shared across globe init/update/highlight
let cobeMarkers = [];

const COUNTRY_COORDS = {
    'India': [20.5937, 78.9629], 'United States': [37.0902, -95.7129], 'United States of America': [37.0902, -95.7129],
    'United Kingdom': [55.3781, -3.4360], 'Australia': [-25.2744, 133.7751], 'Canada': [56.1304, -106.3468],
    'Germany': [51.1657, 10.4515], 'France': [46.2276, 2.2137], 'Singapore': [1.3521, 103.8198],
    'South Africa': [-30.5595, 22.9375], 'New Zealand': [-40.9006, 174.886], 'UAE': [23.4241, 53.8478],
    'United Arab Emirates': [23.4241, 53.8478], 'China': [35.8617, 104.1954], 'Japan': [36.2048, 138.2529],
    'Netherlands': [52.1326, 5.2913], 'Switzerland': [46.8182, 8.2275], 'Brazil': [-14.235, -51.9253],
    'Italy': [41.8719, 12.5674], 'Spain': [40.4637, -3.7492], 'Ireland': [53.1424, -7.6921],
    'Sweden': [60.1282, 18.6435], 'Denmark': [56.2639, 9.5018], 'South Korea': [35.9078, 127.7669],
    'Malaysia': [4.2105, 101.9758], 'Hong Kong': [22.3193, 114.1694], 'Saudi Arabia': [23.8859, 45.0792],
    'Luxembourg': [49.8153, 6.1296], 'Russia': [61.524, 105.3188], 'Mexico': [23.6345, -102.5528],
    'Israel': [31.0461, 34.8516], 'Turkey': [38.9637, 35.2433], 'Thailand': [15.87, 100.9925],
    'Indonesia': [-0.7893, 113.9213], 'Philippines': [12.8797, 121.774], 'Colombia': [4.5709, -74.2973],
    'Chile': [-35.6751, -71.543], 'Nigeria': [9.082, 8.6753], 'Kenya': [-0.0236, 37.9062],
    'Egypt': [26.8206, 30.8025], 'Pakistan': [30.3753, 69.3451], 'Bangladesh': [23.685, 90.3563],
    'Sri Lanka': [7.8731, 80.7718], 'Nepal': [28.3949, 84.124], 'Taiwan': [23.6978, 120.9605],
    'Finland': [61.9241, 25.7482], 'Norway': [60.472, 8.4689], 'Poland': [51.9194, 19.1451],
    'Austria': [47.5162, 14.5501], 'Belgium': [50.5039, 4.4699], 'Portugal': [39.3999, -8.2245],
    'Greece': [39.0742, 21.8243], 'Czech Republic': [49.8175, 15.473]
};

const GLOBAL_HUBS = [
    { name: "India", lat: 20.5937, lng: 78.9629 },
    { name: "United States", lat: 37.0902, lng: -95.7129 },
    { name: "United Kingdom", lat: 55.3781, lng: -3.4360 },
    { name: "Australia", lat: -25.2744, lng: 133.7751 },
    { name: "Germany", lat: 51.1657, lng: 10.4515 },
    { name: "Canada", lat: 56.1304, lng: -106.3468 },
    { name: "Singapore", lat: 1.3521, lng: 103.8198 },
    { name: "France", lat: 46.2276, lng: 2.2137 },
    { name: "Japan", lat: 36.2048, lng: 138.2529 }
];

// Countries that currently have courses (updated after data loads).
let activeCountryEntries = Object.entries(COUNTRY_COORDS);
function getActiveCountryEntries() { return activeCountryEntries; }

function getCountryCourseCount(name, countryCounts) {
    const counts = countryCounts || {};
    return Object.entries(counts)
        .filter(([k]) => isSameCountry(k, name))
        .reduce((s, [, v]) => s + v, 0);
}

function updateActiveCountryEntries(countryCounts) {
    activeCountryEntries = Object.entries(COUNTRY_COORDS).filter(([name]) => {
        return getCountryCourseCount(name, countryCounts) > 0;
    });
}

// Skip arcs between countries that are extremely close (avoids cluttered short lines).
const MIN_ARC_DISTANCE_KM = 600;

function generateDenseArcData() {
    // Build a representative network of arcs.  We avoid a single India-centric hub
    // because India dominates the dataset.  Instead we pick a few regional anchors
    // and connect nearby active countries to their nearest anchor.
    const entries = getActiveCountryEntries();
    const arcs = [];
    if (entries.length <= 1) return arcs;

    function greatCircleDistance(lat1, lng1, lat2, lng2) {
        const toRad = Math.PI / 180;
        const dLat = (lat2 - lat1) * toRad;
        const dLng = (lng2 - lng1) * toRad;
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLng / 2) ** 2;
        return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    function addArc(a, b) {
        const d = greatCircleDistance(a.lat, a.lng, b.lat, b.lng);
        if (d < MIN_ARC_DISTANCE_KM) return;
        arcs.push({
            startLat: a.lat,
            startLng: a.lng,
            endLat: b.lat,
            endLng: b.lng
        });
    }

    if (entries.length <= 20) {
        for (let i = 0; i < entries.length; i++) {
            for (let j = i + 1; j < entries.length; j++) {
                addArc(
                    { lat: entries[i][1][0], lng: entries[i][1][1] },
                    { lat: entries[j][1][0], lng: entries[j][1][1] }
                );
            }
        }
        return arcs;
    }

    const anchors = [
        { name: 'India', lat: 20.5937, lng: 78.9629 },
        { name: 'United States', lat: 37.0902, lng: -95.7129 },
        { name: 'United Kingdom', lat: 55.3781, lng: -3.4360 },
        { name: 'Australia', lat: -25.2744, lng: 133.7751 }
    ];

    // Group each active country with its nearest anchor.
    const anchorGroups = new Map();
    entries.forEach(([name, [lat, lng]]) => {
        let bestAnchor = anchors[0];
        let bestDist = Infinity;
        for (const a of anchors) {
            const d = greatCircleDistance(lat, lng, a.lat, a.lng);
            if (d < bestDist) {
                bestDist = d;
                bestAnchor = a;
            }
        }
        if (!anchorGroups.has(bestAnchor.name)) anchorGroups.set(bestAnchor.name, []);
        anchorGroups.get(bestAnchor.name).push({ name, lat, lng });
    });

    // Within each regional group, connect each country to a few nearest neighbours.
    for (const group of anchorGroups.values()) {
        if (group.length <= 1) continue;
        group.forEach((src, i) => {
            const others = group
                .filter((_, idx) => idx !== i)
                .map(dest => ({
                    dest,
                    dist: greatCircleDistance(src.lat, src.lng, dest.lat, dest.lng)
                }))
                .sort((a, b) => a.dist - b.dist)
                .slice(0, Math.min(2, group.length - 1));
            others.forEach(({ dest }) => addArc(src, dest));
        });
    }

    // Link the anchors to each other so the regions feel globally connected.
    for (let i = 0; i < anchors.length; i++) {
        for (let j = i + 1; j < anchors.length; j++) {
            addArc(anchors[i], anchors[j]);
        }
    }

    return arcs;
}

// Convert hex (#rrggbb) to COBE RGB triple [0..1]
function hexToRgb01(hex) {
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r / 255, g / 255, b / 255];
}

const GLOBE_THEMES = {
    dark: {
        // Ocean white, continents dark charcoal.  COBE's map texture is colored by
        // mapBrightness; with dark=0 the baseColor is the ocean, and a low positive
        // mapBrightness makes the landmasses visible as a dark grey shape.
        base: '#FFFFFF',
        bg: '#000000',
        halo: '#22D3EE',
        marker: '#22D3EE',
        arc: '#22D3EE',
        dark: 0,
        diffuse: 0.6,
        mapBrightness: 1.5,
        mapBaseBrightness: 0.02
    },
    light: {
        // Ocean: subtle premium light blue/grey
        base: '#e2e8f0',
        bg: '#f8fafc',
        halo: '#1D4ED8',
        marker: '#0891B2',
        arc: '#0891B2',
        dark: 0,
        diffuse: 1.2,
        mapBrightness: 6,
        mapBaseBrightness: 0.1
    }
};

function getGlobeTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? GLOBE_THEMES.dark : GLOBE_THEMES.light;
}

function applyGlobeTheme() {
    const t = getGlobeTheme();
    const base = hexToRgb01(t.base);
    const glow = hexToRgb01(t.halo);
    const marker = hexToRgb01(t.marker);
    const arc = hexToRgb01(t.arc);

    if (cobeGlobe) {
        const denseArcs = generateDenseArcData().map(a => ({
            from: [a.startLat, a.startLng],
            to: [a.endLat, a.endLng],
            color: arc
        }));

        cobeGlobe.update({
            baseColor: base,
            glowColor: glow,
            markerColor: marker,
            arcColor: arc,
            dark: t.dark,
            diffuse: t.diffuse,
            mapBrightness: t.mapBrightness,
            mapBaseBrightness: t.mapBaseBrightness,
            arcWidth: 0.6,
            arcHeight: 0.26,
            markers: cobeMarkers,
            arcs: denseArcs
        });
    }
}

function initGlobe() {
    const container = document.getElementById('globe-container');
    if (!container) {
        console.warn('[Globe] container #globe-container not found');
        return;
    }
    // COBE is loaded as an ES module which is asynchronous.
    // Retry with backoff so the globe loads once window.createGlobe is available.
    if (typeof window.createGlobe !== 'function') {
        let retries = 0;
        const maxRetries = 30; // up to ~3 seconds
        function tryInit() {
            if (typeof window.createGlobe === 'function') {
                _doInitGlobe(container);
            } else if (retries < maxRetries) {
                retries++;
                setTimeout(tryInit, 100);
            } else {
                container.innerHTML = '<div class="globe-fallback">Globe could not load. Please serve this page from a web server (not file://) and refresh.</div>';
                console.error('[Globe] COBE (window.createGlobe) never became available.');
            }
        }
        setTimeout(tryInit, 100);
        return;
    }
    _doInitGlobe(container);
}

function _doInitGlobe(container) {
    initCobeGlobe(container);

    globeInstance.pointOfView({
        lat: 20.5937,
        lng: 78.9629,
        altitude: 2.1
    }, 0);

    const controls = globeInstance.controls();
    controls.enableZoom = false;
    controls.minDistance = 250;
    controls.maxDistance = 250;
}

let cobeGlobe = null;
let cobeState = { phi: -2.949, theta: 0.359, scale: 1.024 };
let cobeAutoRotate = true;
let cobeIsDragging = false;
let cobeAnimationId = null;
let cobeMinScale = 0.78;
let cobeMaxScale = 1.08;
let cobeZoomMinDistance = 200;
let cobeZoomMaxDistance = 380;

function syncGlobeScaleBounds() {
    const base = 215;
    cobeMaxScale = Math.min(1.08, base / cobeZoomMinDistance);
    cobeMinScale = Math.max(0.78, base / cobeZoomMaxDistance);
}
syncGlobeScaleBounds();

function initCobeGlobe(container) {
    container.innerHTML = '';
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const canvas = document.createElement('canvas');
    canvas.id = 'cobe-canvas';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    container.appendChild(canvas);

    setTimeout(() => {
        const wrapper = canvas.parentElement;
        if (wrapper && wrapper !== container) {
            wrapper.style.pointerEvents = 'auto';
            wrapper.style.width = '100%';
            wrapper.style.height = '100%';
        }
    }, 0);

    const markerEntries = getActiveCountryEntries();
    cobeMarkers = markerEntries.map(([name, [lat, lng]], i) => ({
        id: 'cobe-' + i,
        location: [lat, lng],
        size: 0.022,
        color: [0.133, 0.827, 0.933]
    }));

    const arcs = generateDenseArcData().map((arc, i) => ({
        id: 'arc-' + i,
        from: [arc.startLat, arc.startLng],
        to: [arc.endLat, arc.endLng],
        color: [0.133, 0.827, 0.933]
    }));

    try {
        const t = getGlobeTheme();
        cobeGlobe = window.createGlobe(canvas, {
            devicePixelRatio: dpr,
            width: width,
            height: height,
            phi: cobeState.phi,
            theta: cobeState.theta,
            dark: t.dark,
            diffuse: t.diffuse,
            scale: cobeState.scale,
            mapSamples: 22000,
            mapBrightness: t.mapBrightness,
            mapBaseBrightness: t.mapBaseBrightness,
            baseColor: hexToRgb01(t.base),
            markerColor: hexToRgb01(t.marker),
            glowColor: hexToRgb01(t.halo),
            arcColor: hexToRgb01(t.arc),
            arcWidth: 0.5,
            arcHeight: 0.24,
            markerElevation: 0.025,
            offset: [0, 0],
            markers: cobeMarkers,
            arcs: arcs,
            onRender: (state) => {
                state.phi = cobeState.phi;
                state.theta = cobeState.theta;
                state.scale = cobeState.scale;
            }
        });
    } catch (err) {
        console.error('[Globe] COBE init failed:', err);
        container.innerHTML = '<div class="globe-fallback">Unable to create 3D globe.</div>';
        return;
    }

    globeInstance = {
        isCobe: true,
        controls: () => ({
            autoRotate: cobeAutoRotate,
            enableZoom: true,
            get minDistance() { return cobeZoomMinDistance; },
            set minDistance(v) { cobeZoomMinDistance = Number(v) || 200; syncGlobeScaleBounds(); },
            get maxDistance() { return cobeZoomMaxDistance; },
            set maxDistance(v) { cobeZoomMaxDistance = Number(v) || 380; syncGlobeScaleBounds(); }
        }),
        pointOfView: ({ lat = 20, lng = 0, altitude = 2.5 }, duration = 1000) => {
            // Match COBE's rotation convention used in cobeProject() so the clicked
            // country ends up centered and facing the viewer (north up).
            const targetPhi = -lng * (Math.PI / 180) - Math.PI / 2;
            const targetTheta = lat * (Math.PI / 180);
            // COBE uses a unit sphere scale rather than a camera distance; lower scale
            // pulls the globe back so it occupies ~55–60 % of the viewport height.
            const targetScale = Math.max(cobeMinScale, Math.min(cobeMaxScale, 2.15 / altitude));
            const startPhi = cobeState.phi;
            const startTheta = cobeState.theta;
            const startScale = cobeState.scale;
            const startTime = performance.now();

            let deltaPhi = targetPhi - startPhi;
            while (deltaPhi > Math.PI) deltaPhi -= 2 * Math.PI;
            while (deltaPhi < -Math.PI) deltaPhi += 2 * Math.PI;

            cobeAutoRotate = false;
            function animateView(now) {
                const p = Math.min(1, (now - startTime) / duration);
                const ease = 1 - Math.pow(1 - p, 3);
                cobeState.phi = startPhi + deltaPhi * ease;
                cobeState.theta = startTheta + (targetTheta - startTheta) * ease;
                cobeState.scale = startScale + (targetScale - startScale) * ease;
                cobeGlobe.update(cobeState);
                if (p < 1) {
                    requestAnimationFrame(animateView);
                } else {
                    cobeAutoRotate = true;
                }
            }
            requestAnimationFrame(animateView);
        }
    };

    // Projection that mirrors COBE's internal rotation matrix so we can hit-test countries
    function latLonTo3D([lat, lon]) {
        const latRad = (lat * Math.PI) / 180;
        const lonRad = (lon * Math.PI) / 180 - Math.PI;
        const cosLat = Math.cos(latRad);
        return [-cosLat * Math.cos(lonRad), Math.sin(latRad), cosLat * Math.sin(lonRad)];
    }

    function cobeProject(lat, lng) {
        const p = latLonTo3D([lat, lng]);
        const r = 1.0;
        const pos = [p[0] * r, p[1] * r, p[2] * r];

        const cx = Math.cos(cobeState.theta);
        const cy = Math.cos(cobeState.phi);
        const sx = Math.sin(cobeState.theta);
        const sy = Math.sin(cobeState.phi);
        const aspect = canvas.width / canvas.height;

        const rx = cy * pos[0] + sy * pos[2];
        const ry = sy * sx * pos[0] + cx * pos[1] - cy * sx * pos[2];
        const rz = -sy * cx * pos[0] + sx * pos[1] + cy * cx * pos[2];

        return {
            x: ((rx / aspect) * cobeState.scale + 1) / 2,
            y: (-ry * cobeState.scale + 1) / 2,
            visible: rz > 0.05
        };
    }

    function getHoveredCountry(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        const clickX = (clientX - rect.left) / rect.width;
        const clickY = (clientY - rect.top) / rect.height;

        let best = null;
        let bestDist = Infinity;
        getActiveCountryEntries().forEach(([name, [lat, lng]]) => {
            const proj = cobeProject(lat, lng);
            if (!proj.visible) return;
            const dx = proj.x - clickX;
            const dy = proj.y - clickY;
            const dist = Math.hypot(dx, dy);
            if (dist < bestDist) {
                bestDist = dist;
                best = { name, dist };
            }
        });
        return bestDist < 0.25 ? best?.name : null;
    }

    // Tooltip
    let tooltipEl = document.getElementById('cobe-tooltip');
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'cobe-tooltip';
        tooltipEl.className = 'globe-tooltip';
        tooltipEl.style.cssText = 'position:fixed; display:none; pointer-events:none; z-index:100;';
        document.body.appendChild(tooltipEl);
    }

    function showTooltip(e, name, count) {
        const flag = getFlag(name);
        tooltipEl.innerHTML = `<b>${flag} ${escHtml(name)}</b>${count ? `<br/>${count.toLocaleString()} course${count === 1 ? '' : 's'}` : '<br/>Click to view'}`;
        tooltipEl.style.display = 'block';
        const tipRect = tooltipEl.getBoundingClientRect();
        let left = e.clientX + 14;
        let top = e.clientY + 14;
        if (left + tipRect.width > window.innerWidth - 12) left = e.clientX - tipRect.width - 12;
        if (top + tipRect.height > window.innerHeight - 12) top = e.clientY - tipRect.height - 12;
        tooltipEl.style.left = left + 'px';
        tooltipEl.style.top = top + 'px';
        tooltipEl.classList.add('visible');
    }
    function hideTooltip() {
        tooltipEl.classList.remove('visible');
        tooltipEl.style.display = 'none';
    }

    // Mouse / touch interaction
    let dragStartX = 0, dragStartY = 0, hasDragged = false, isDown = false;
    let lastHoverCountry = null;
    let mouseDownCountry = null;
    let mouseDownOnCanvas = false;

    function updateHover(clientX, clientY) {
        if (isDown) { hideTooltip(); return; }
        const country = getHoveredCountry(clientX, clientY);
        if (country !== hoverCountry) {
            hoverCountry = country;
            updateGlobeHighlight(globalData?.country_counts || {});
        }
        if (country) {
            const count = (globalData?.country_counts && Object.entries(globalData.country_counts)
                .filter(([k]) => isSameCountry(k, country)).reduce((s, [, v]) => s + v, 0)) || 0;
            showTooltip({ clientX, clientY }, country, count);
            canvas.style.cursor = 'pointer';
            lastHoverCountry = country;
        } else {
            hideTooltip();
            canvas.style.cursor = 'grab';
            lastHoverCountry = null;
        }
    }

    canvas.addEventListener('mousemove', e => updateHover(e.clientX, e.clientY));
    canvas.addEventListener('mouseleave', () => { hideTooltip(); hoverCountry = null; });

    canvas.addEventListener('mousedown', e => {
        isDown = true;
        mouseDownOnCanvas = true;
        cobeIsDragging = true;
        hasDragged = false;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        cobeAutoRotate = false;
        canvas.style.cursor = 'grabbing';
        mouseDownCountry = getHoveredCountry(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', e => {
        const startedOnCanvas = mouseDownOnCanvas;
        mouseDownOnCanvas = false;
        if (!isDown) return;
        isDown = false;
        cobeIsDragging = false;
        canvas.style.cursor = 'grab';
        const clickCountry = !hasDragged ? (mouseDownCountry || lastHoverCountry) : null;
        if (clickCountry) {
            handleCountryClick(clickCountry);
        } else if (startedOnCanvas && !hasDragged) {
            // Clicked the globe background: show all courses without filters.
            jumpToCourses({});
        }
        mouseDownCountry = null;
        setTimeout(() => { cobeAutoRotate = true; }, 2500);
    });

    window.addEventListener('mousemove', e => {
        if (!isDown) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        if (Math.hypot(dx, dy) > TAP_THRESHOLD_PX) hasDragged = true;

        const sens = 0.005;
        cobeState.phi += dx * sens;
        cobeState.theta = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, cobeState.theta + dy * sens));
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        cobeGlobe.update(cobeState);
    });

    // Touch support
    const TAP_THRESHOLD_PX = window.matchMedia('(pointer: coarse)').matches ? 14 : 6;

    canvas.addEventListener('touchstart', e => {
        if (e.touches.length === 1) {
            const t = e.touches[0];
            isDown = true;
            mouseDownOnCanvas = true;
            cobeIsDragging = true;
            hasDragged = false;
            dragStartX = t.clientX;
            dragStartY = t.clientY;
            cobeAutoRotate = false;
            mouseDownCountry = getHoveredCountry(t.clientX, t.clientY);
            // Keep tooltip hidden while touching on mobile
            hideTooltip();
        }
    }, { passive: true });

    window.addEventListener('touchend', e => {
        const startedOnCanvas = mouseDownOnCanvas;
        mouseDownOnCanvas = false;
        if (!isDown) return;
        isDown = false;
        cobeIsDragging = false;
        const clickCountry = !hasDragged ? (mouseDownCountry || lastHoverCountry) : null;
        if (clickCountry) {
            handleCountryClick(clickCountry);
        } else if (startedOnCanvas && !hasDragged) {
            jumpToCourses({});
        }
        mouseDownCountry = null;
        // Always hide tooltip on touch end so it doesn't stick on mobile
        hideTooltip();
        setTimeout(() => { cobeAutoRotate = true; }, 2000);
    });

    window.addEventListener('touchmove', e => {
        if (!isDown || e.touches.length !== 1) return;
        const t = e.touches[0];
        const dx = t.clientX - dragStartX;
        const dy = t.clientY - dragStartY;
        if (Math.hypot(dx, dy) > TAP_THRESHOLD_PX) hasDragged = true;
        const sens = 0.006;
        cobeState.phi += dx * sens;
        cobeState.theta = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, cobeState.theta + dy * sens));
        dragStartX = t.clientX;
        dragStartY = t.clientY;
        cobeGlobe.update(cobeState);
    }, { passive: true });

    // Keyboard controls for globe (rotation only — zoom disabled)
    canvas.setAttribute('tabindex', '0');
    canvas.setAttribute('aria-label', 'Interactive 3D globe. Use arrow keys to rotate.');
    canvas.addEventListener('keydown', e => {
        const key = e.key;
        const step = 0.04;
        let handled = true;
        if (key === 'ArrowLeft') cobeState.phi -= step;
        else if (key === 'ArrowRight') cobeState.phi += step;
        else if (key === 'ArrowUp') cobeState.theta = Math.min(Math.PI / 2 - 0.1, cobeState.theta + step);
        else if (key === 'ArrowDown') cobeState.theta = Math.max(-Math.PI / 2 + 0.1, cobeState.theta - step);
        else handled = false;
        if (handled) {
            e.preventDefault();
            cobeAutoRotate = false;
            cobeGlobe.update(cobeState);
        }
    });

    // Resize handling
    const ro = new ResizeObserver(() => {
        const w = container.clientWidth || 800;
        const h = container.clientHeight || 600;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        cobeGlobe.update({ width: w, height: h });
    });
    ro.observe(container);

    function animate() {
        if (cobeAutoRotate && !cobeIsDragging) {
            cobeState.phi += 0.005;
        }
        // Keep selected-country pulse animating
        if (selectedCountry) updateGlobeHighlight(globalData?.country_counts || {});
        cobeGlobe.update(cobeState);
        cobeAnimationId = requestAnimationFrame(animate);
    }
    cobeAnimationId = requestAnimationFrame(animate);

    applyGlobeTheme();

    console.log('[Globe] COBE active. Markers:', cobeMarkers.length, 'Arcs:', arcs.length);
    updateGlobeHighlight(globalData?.country_counts || {});

    // Click outside / Esc to close country detail panel
    const panel = document.getElementById('course-details-panel');
    if (panel) {
        document.addEventListener('click', e => {
            if (!panel.contains(e.target) && !canvas.contains(e.target) && panel.style.display !== 'none') {
                resetCountrySelection();
            }
        });
    }
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && panel && panel.style.display !== 'none') resetCountrySelection();
    });
}

function getCountryCoords(countryName) {
    for (const [name, [lat, lng]] of Object.entries(COUNTRY_COORDS)) {
        if (isSameCountry(name, countryName)) return { lat, lng };
    }
    return null;
}

function handleCountryClick(countryName) {
    selectedCountry = countryName;
    currentFilter = { type: 'country', value: countryName };

    if (globeInstance) {
        const coords = getCountryCoords(countryName);
        if (coords) {
            globeInstance.pointOfView({ lat: coords.lat, lng: coords.lng, altitude: 1.6 }, 1000);
        }
        globeInstance.controls().autoRotate = false;
    }

    // Show the in-dashboard detail panel as well, using substring country matching.
    const matches = allCoursesData.filter(c => isSameCountry(c.country, countryName));
    renderCountryDetailPanel(countryName, matches);

    jumpToCourses({ country: countryName });
}

function renderCountryDetailPanel(countryName, courses) {
    const panel = document.getElementById('course-details-panel');
    const tbody = document.getElementById('course-details-body');
    const nameEl = document.getElementById('country-detail-name');
    const flagEl = document.getElementById('country-detail-flag');
    const countEl = document.getElementById('country-detail-count');
    const btnName = document.getElementById('country-btn-name');
    if (!panel || !tbody) return;

    if (nameEl) nameEl.textContent = countryName;
    if (flagEl) flagEl.textContent = getFlag(countryName);
    if (countEl) countEl.textContent = `${courses.length} course${courses.length === 1 ? '' : 's'}`;
    if (btnName) btnName.textContent = countryName;

    // Sync every "total courses" counter in the UI with the filtered set.
    const totalValFallback = document.getElementById('total-courses-val');
    if (totalValFallback) totalValFallback.textContent = courses.length.toLocaleString();

    // Quick stats
    const qsCount = courses.filter(c => c.has_qs_badge).length;
    const domainMap = {};
    courses.forEach(c => {
        const dom = getDomainCategory(c) || 'Other';
        domainMap[dom] = (domainMap[dom] || 0) + 1;
    });
    const topDomains = Object.entries(domainMap).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const topDomain = topDomains[0]?.[0] || '—';

    const cdsTotal = document.getElementById('cds-total');
    const cdsQs = document.getElementById('cds-qs');
    const cdsDomain = document.getElementById('cds-domain');
    if (cdsTotal) countUp(cdsTotal, courses.length, courses.length.toLocaleString());
    if (cdsQs) countUp(cdsQs, qsCount, qsCount.toLocaleString());
    if (cdsDomain) cdsDomain.textContent = topDomain;

    const topicList = document.getElementById('country-detail-topic-list');
    if (topicList) {
        topicList.innerHTML = topDomains.length
            ? topDomains.map(([dom, cnt]) => `<span class="country-detail-topic" title="${cnt} courses">${escHtml(dom)} <span style="opacity:.7;">(${cnt})</span></span>`).join('')
            : '<span class="country-detail-topic">No domain data</span>';
    }

    // Wire the View All Courses button
    const viewBtn = document.getElementById('country-view-table');
    if (viewBtn) {
        viewBtn.onclick = () => viewCountryInTable(countryName);
    }

    const qsRank = c => c.qs ? String(c.qs) : (c.has_qs_badge ? 'Yes' : 'No');
    const nirfRank = c => c.nirf ? String(c.nirf) : (c.has_nirf_badge ? 'Yes' : 'No');

    function formatRankCell(val, badgeType) {
        if (!val || val === 'No') return '<span class="rank-text muted">—</span>';
        if (badgeType === 'qs') return `<span class="table-rank-badge qs"> ${escHtml(val)}</span>`;
        if (badgeType === 'nirf') return `<span class="table-rank-badge nirf"> ${escHtml(val)}</span>`;
        return escHtml(val);
    }

    tbody.innerHTML = courses.length === 0
        ? `<tr class="empty-row">
            <td colspan="5" class="empty-state">
                <div class="empty-icon"></div>
                <strong>No courses found</strong>
                <div class="empty-sub">Try a different country or reset the filters.</div>
            </td>
          </tr>`
        : courses.slice(0, 20).map((c, i) => {
            const qsVal = c.qs ? String(c.qs) : (c.has_qs_badge ? 'Ranked' : '');
            const nirfVal = c.nirf ? String(c.nirf) : (c.has_nirf_badge ? 'Ranked' : '');
            const saved = favoriteCourses.has(String(c.id));
            return `
            <tr tabindex="0" data-course-id="${c.id}" title="View ${escHtml(c.name)}">
                <td class="course-name-cell freeze-col">
                    <span class="row-num">${(i + 1).toString().padStart(2, '0')}</span>
                    <strong>${escHtml(c.name)}</strong>
                </td>
                <td>${escHtml(c.university || '—')}</td>
                <td class="col-center">${formatRankCell(qsVal, 'qs')}</td>
                <td class="col-center">${formatRankCell(nirfVal, 'nirf')}</td>
                <td class="col-actions">
                    <div class="row-actions" role="group" aria-label="Row actions">
                        <button class="row-action" title="View details" aria-label="View details" onclick="event.stopPropagation(); showCourseModal('${c.id}')"></button>
                        <button class="row-action ${saved ? 'saved' : ''}" title="${saved ? 'Remove from saved' : 'Save course'}" aria-label="${saved ? 'Remove from saved' : 'Save course'}" aria-pressed="${saved}" onclick="event.stopPropagation(); toggleFavorite('${c.id}', this)">${saved ? '♥' : '♡'}</button>
                        <a class="row-action" href="${escHtml(getCourseUrl(c))}" target="_blank" rel="noopener" title="Visit course website" aria-label="Visit course website" onclick="event.stopPropagation();">↗</a>
                    </div>
                </td>
            </tr>`;
        }).join('');

    // Make rows keyboard-activatable
    tbody.querySelectorAll('tr[data-course-id]').forEach(row => {
        row.addEventListener('click', () => showCourseModal(row.dataset.courseId));
        row.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showCourseModal(row.dataset.courseId); }
        });
    });

    panel.style.display = 'flex';
    panel.classList.add('is-open');

    const dashRight = document.querySelector('.dash-right');
    if (dashRight) dashRight.classList.add('has-active-selection');
}

function viewCountryInTable(countryName) {
    jumpToCourses({ country: countryName });
}

function resetCountrySelection() {
    selectedCountry = null;
    currentFilter = { type: null, value: null };
    const panel = document.getElementById('course-details-panel');
    if (panel) {
        panel.style.display = 'none';
        panel.classList.remove('is-open');
    }
    const dashRight = document.querySelector('.dash-right');
    if (dashRight) dashRight.classList.remove('has-active-selection');
    if (globeInstance) {
        globeInstance.pointOfView({ lat: 20.5937, lng: 78.9629, altitude: 2.1 }, 1200);
        globeInstance.controls().autoRotate = true;
    }
    // When no country is selected, default the course list back to all countries.
    jumpToCourses({ country: 'all' });
    // Restore global dashboard data
    if (globalData) {
        updateDashboardExtras(globalData);
        updateCards(globalData.stats);
    }
}

function updateGlobeHighlight(countryCounts) {
    if (!globeInstance?.isCobe || !cobeGlobe) return;
    const counts = countryCounts || {};
    const max = Math.max(...Object.values(counts), 1);
    const markerEntries = getActiveCountryEntries();
    const theme = getGlobeTheme();
    const baseMarker = hexToRgb01(theme.marker);
    const selectedMarker = hexToRgb01('#00f2fe');   // bright cyan for active selection
    const hoverMarker = hexToRgb01('#ffffff');      // white glow on hover
    const dimFactor = selectedCountry ? 0.45 : 1;
    const pulse = selectedCountry ? 1 + Math.sin(performance.now() / 250) * 0.08 : 1;
    cobeMarkers = markerEntries.map(([name, [lat, lng]], i) => {
        const count = getCountryCourseCount(name, counts);
        const isSelected = selectedCountry && isSameCountry(selectedCountry, name);
        const isHovered = hoverCountry && isSameCountry(hoverCountry, name);
        // Square-root scale with a hard max so India doesn't swallow smaller dots.
        const maxSize = 0.055;
        const minSize = 0.018;
        let size = isSelected ? 0.065 * pulse : Math.min(maxSize, minSize + (Math.sqrt(count) / Math.sqrt(max)) * (maxSize - minSize));
        if (isHovered) size *= 1.25;
        let color;
        if (isSelected) color = selectedMarker;
        else if (isHovered) color = hoverMarker;
        else color = baseMarker;
        // Dim non-selected markers when a country is selected.
        if (selectedCountry && !isSelected) {
            color = [color[0] * dimFactor, color[1] * dimFactor, color[2] * dimFactor];
        }
        return {
            id: 'cobe-' + i,
            location: [lat, lng],
            size,
            color
        };
    });
    cobeGlobe.update({ markers: cobeMarkers });
}

function refreshGlobeMarkersAndArcs(countryCounts) {
    updateActiveCountryEntries(countryCounts);
    if (!globeInstance?.isCobe || !cobeGlobe) return;
    const counts = countryCounts || {};
    const max = Math.max(...Object.values(counts), 1);
    const markerEntries = getActiveCountryEntries();
    const theme = getGlobeTheme();
    const baseMarker = hexToRgb01(theme.marker);
    cobeMarkers = markerEntries.map(([name, [lat, lng]], i) => ({
        id: 'cobe-' + i,
        location: [lat, lng],
        size: Math.min(0.055, 0.018 + (Math.sqrt(getCountryCourseCount(name, counts)) / Math.sqrt(max)) * (0.055 - 0.018)),
        color: baseMarker
    }));
    const arcColor = hexToRgb01(theme.arc);
    const arcs = generateDenseArcData().map((arc, i) => ({
        id: 'arc-' + i,
        from: [arc.startLat, arc.startLng],
        to: [arc.endLat, arc.endLng],
        color: arcColor
    }));
    cobeGlobe.update({ markers: cobeMarkers, arcs });
}

function renderCountryBarChart(intlCountries, total) {
    const container = document.getElementById('quantity-bars');
    if (!container) return;
    if (!intlCountries.length) { container.innerHTML = ''; return; }
    const max = Math.max(...intlCountries.map(c => c[1]), 1);
    container.innerHTML = intlCountries.map(([name, count]) => {
        const pct = (count / total) * 100;
        const relative = (count / max) * 100;
        return `
            <div class="simple-bar clickable" data-country="${escHtml(name)}" role="button" tabindex="0" title="Show courses from ${escHtml(name)}">
                <div class="simple-bar-label"><span>${escHtml(getFlag(name))} ${escHtml(name)}</span> <span>${count.toLocaleString()} · ${pct.toFixed(1)}%</span></div>
                <div class="simple-bar-track"><div class="simple-bar-fill" style="width:${relative}%"></div></div>
            </div>`;
    }).join('');

    container.querySelectorAll('.simple-bar.clickable').forEach(bar => {
        bar.addEventListener('click', () => {
            jumpToCourses({ country: bar.dataset.country });
        });
        bar.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jumpToCourses({ country: bar.dataset.country }); }
        });
    });
}

function initStickyFilterBar() {
    const bar = document.getElementById('trending-filter-container');
    if (!bar) return;
    const observer = new IntersectionObserver(([entry]) => {
        bar.classList.toggle('is-stuck', entry.intersectionRatio < 1);
    }, { threshold: [1], rootMargin: '-1px 0px 0px 0px' });
    observer.observe(bar);
}

function initDashboardClickableMetrics() {
    document.querySelectorAll('.metric-row.clickable[data-filter-type]').forEach(row => {
        const type = row.dataset.filterType;
        row.addEventListener('click', () => jumpToCourses({ courseType: type }));
        row.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jumpToCourses({ courseType: type }); }
        });
    });
    document.querySelectorAll('.metric-card.clickable[data-filter-all]').forEach(card => {
        card.addEventListener('click', () => jumpToCourses({}));
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jumpToCourses({}); }
        });
    });
    document.querySelectorAll('.metric-card.clickable[data-filter-country]').forEach(card => {
        const country = card.dataset.filterCountry;
        card.addEventListener('click', () => jumpToCourses({ country }));
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jumpToCourses({ country }); }
        });
    });
}

function updateDashboardExtras(data) {
    if (!data) return;
    const docs = data.documents || [];
    const total = docs.length || data.stats?.total || 1;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    const setPct = (id, v) => { const el = document.getElementById(id); if (el) el.style.width = v; };

    let iitCount = 0, iiitCount = 0, nitCount = 0;
    const seen = { iit: new Set(), iiit: new Set(), nit: new Set() };
    docs.forEach(c => {
        const uni = (c.university || '').toUpperCase();
        const name = (c.name || '').toLowerCase();
        const key = uni;
        if (/\bIIIT\b/.test(uni) || /\bIIIT\b/.test(c.university || '')) {
            if (!seen.iiit.has(key)) { iiitCount++; seen.iiit.add(key); }
        } else if (/\bIIT\b/.test(uni) && !/\bIIIT\b/.test(uni) && !/\bNIT\b/.test(uni)) {
            if (!seen.iit.has(key)) { iitCount++; seen.iit.add(key); }
        }
        if (/\bNIT\b/.test(uni)) {
            if (!seen.nit.has(key)) { nitCount++; seen.nit.add(key); }
        }
    });
    countUp('dash-iit-count', iitCount, iitCount.toLocaleString());
    countUp('dash-iiit-count', iiitCount, iiitCount.toLocaleString());
    countUp('dash-nit-count', nitCount, nitCount.toLocaleString());
    const instMax = Math.max(iitCount, iiitCount, nitCount, 1);
    setPct('dash-iit-bar', (iitCount / instMax * 100) + '%');
    setPct('dash-iiit-bar', (iiitCount / instMax * 100) + '%');
    setPct('dash-nit-bar', (nitCount / instMax * 100) + '%');

    const domainCounts = data.domain_counts || {};
    const freeCount = domainCounts['Free'] || 0;
    const ftaCount = domainCounts['Free to Audit'] || 0;
    const hvlcCount = domainCounts['High Value Low Cost'] || 0;
    countUp('dash-free-count', freeCount, freeCount.toLocaleString());
    countUp('dash-fta-count', ftaCount, ftaCount.toLocaleString());
    countUp('dash-hvlc-count', hvlcCount, hvlcCount.toLocaleString());

    const countryCounts = data.country_counts || {};
    const sortedCountries = Object.entries(countryCounts)
        .filter(([k]) => isValidCountry(k))
        .sort((a, b) => b[1] - a[1]);

    const indiaEntry = sortedCountries.find(([k]) => isSameCountry(k, 'India'));
    if (indiaEntry) {
        const [name, count] = indiaEntry;
        countUp('india-stat-count', count, count.toLocaleString());
        set('india-stat-pct', `${Math.round(count / total * 100)}% of catalog`);
    } else {
        set('india-stat-count', '—');
        set('india-stat-pct', 'No data');
    }

    const intlCountries = sortedCountries.filter(([k]) => !isSameCountry(k, 'India')).slice(0, 4);
    renderCountryBarChart(intlCountries, total);

    updateGlobeHighlight(countryCounts);
}

// ================================================================
//  CHARTS INIT
// ================================================================
function initCharts() { /* charts removed — analytics-free catalog */ }

// ================================================================
//  DATA UPDATES
// ================================================================
function updateCards(stats) {
    const total = stats.total || 0;
    countUp('total-count', total, total.toLocaleString());
}

function updateBarChart() { /* removed with analytics */ }

function isValidCountry(k) {
    if (!k) return false;
    const s = String(k).trim().toLowerCase();
    return s !== '' && s !== 'undefined' && s !== 'unknown' && s !== 'null' && !s.startsWith('not found');
}

function isSameCountry(a, b) {
    if (!a || !b) return false;
    const al = String(a).trim().toLowerCase();
    const bl = String(b).trim().toLowerCase();
    if (!al || !bl) return false;
    return al === bl || al.includes(bl) || bl.includes(al);
}

function updateLineChart() { /* removed with analytics */ }

function updateMapChart() { /* removed with analytics */ }

function updateCountryLeaderboard(countryCounts, containerId = 'country-list') {
    const el = document.getElementById(containerId);
    if (!el) return;
    const entries = Object.entries(countryCounts || {})
        .filter(([k]) => isValidCountry(k))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15);
    const max = entries[0]?.[1] || 1;
    el.innerHTML = entries.map(([name, cnt]) => `
        <div class="country-row" onclick="applyFilter('country','${name.replace(/'/g, "\\'")}')">
            <span class="c-flag">${getFlag(name)}</span>
            <span class="c-name">${name}</span>
            <div class="c-bar-wrap"><div class="c-bar" style="width:${Math.round(cnt / max * 100)}%"></div></div>
            <span class="c-count">${cnt}</span>
        </div>
    `).join('');
}

// ================================================================
//  DASHBOARD BAR-CHART FILTER (filtered detail panel)
// ================================================================
function applyFilter(type, value) {
    currentFilter = { type, value };
    if (type === 'country' && value) {
        handleCountryClick(value);
        return;
    }
    if (!value || !type) {
        resetCountrySelection();
        return;
    }
    // Domain filtering kept for legacy chart interactions
    const panel = document.getElementById('course-details-panel');
    const tbody = document.getElementById('course-details-body');
    if (!tbody || !globalData?.documents) return;
    const filtered = globalData.documents.filter(c => normalizeDomain(c.domain) === value);
    if (panel) panel.style.display = 'flex';
    if (document.getElementById('country-detail-name')) document.getElementById('country-detail-name').textContent = value;
    if (document.getElementById('country-detail-count')) document.getElementById('country-detail-count').textContent = `${filtered.length} course${filtered.length === 1 ? '' : 's'}`;
    if (document.getElementById('country-detail-flag')) document.getElementById('country-detail-flag').textContent = '';

    const qsRank = c => c.qs ? String(c.qs) : (c.has_qs_badge ? 'Yes' : 'No');
    const nirfRank = c => c.nirf ? String(c.nirf) : (c.has_nirf_badge ? 'Yes' : 'No');

    tbody.innerHTML = filtered.length === 0
        ? '<tr><td colspan="4" class="empty-state"><strong>No courses found</strong>Adjust filters to see matching courses.</td></tr>'
        : filtered.map(c => `
            <tr>
                <td class="course-name-cell" title="${escHtml(c.name)}"><strong>${escHtml(c.name)}</strong></td>
                <td>${escHtml(c.university || '—')}</td>
                <td>${escHtml(qsRank(c))}</td>
                <td>${escHtml(nirfRank(c))}</td>
            </tr>`).join('');
}

// ================================================================
//  TAB FILTERS
// ================================================================
function populateSelect(selectId, values) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    const current = sel.value;
    const first = sel.querySelector('option');
    sel.innerHTML = '';
    if (first) sel.appendChild(first);
    [...values].filter(Boolean).sort().forEach(v => {
        const o = document.createElement('option');
        o.value = v; o.textContent = v;
        sel.appendChild(o);
    });
    sel.value = [...sel.options].some(o => o.value === current) ? current : (first ? first.value : 'all');
}

function refreshFilterOptions() {
    const cCountries = new Set();
    allCoursesData.forEach(c => { if (c.country) cCountries.add(c.country); });
    populateSelect('cf-country', cCountries);
    populateSelect('cf-domain', ALL_DOMAIN_LABELS);
}

function getFilteredCourseData() {
    const f = courseFilter;
    const q = f.search.trim().toLowerCase();
    return allCoursesData.filter(c => {
        if (f.country !== 'all' && !isSameCountry(c.country, f.country)) return false;
        if (f.domain !== 'all' && getDomainCategory(c) !== f.domain) return false;
        if (f.courseType !== 'all' && normalizeDomain(c.domain) !== f.courseType) return false;
        if (f.qs === 'yes' && !c.has_qs_badge) return false;
        if (f.qs === 'no' && c.has_qs_badge) return false;
        if (f.nirf === 'yes' && !c.has_nirf_badge) return false;
        if (f.nirf === 'no' && c.has_nirf_badge) return false;
        if (q && !`${c.name} ${c.university || ''} ${c.country || ''} ${c.domain || ''} ${getDomainCategory(c)} ${normalizeDomain(c.domain)}`.toLowerCase().includes(q)) return false;
        return true;
    });
}

function syncCourseFilters() {
    const f = courseFilter;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
    set('cf-search', f.search); set('cf-course-type', f.courseType); set('cf-country', f.country); set('cf-domain', f.domain);
    set('cf-qs', f.qs); set('cf-nirf', f.nirf);
}

function applyCourseFilter() { currentPage = 1; renderCoursesPage(); }

function initFilters() {
    // Legacy course-filters are no longer in the DOM; edX tabs/chips handle filtering.
    // Keep this function as a no-op so existing callers don't break.
}

// ================================================================
//  ALL COURSES — edX-style tabbed carousel
// ================================================================


function matchCountry(course, country) {
    if (!country || country === 'all') return true;
    return isSameCountry(course.country, country);
}

function matchDurationPill(course, bucket) {
    if (!bucket || bucket === 'all') return true;
    const info = course.durationInfo || getCourseDuration(course);
    return info.bucket === bucket;
}

function matchModePill(course, mode) {
    if (!mode || mode === 'all') return true;
    return (course.mode || getCourseMode(course)) === mode;
}

function matchLanguagePill(course, language) {
    if (!language || language === 'all') return true;
    return (course.language || getCourseLanguage(course)) === language;
}

function matchRankingPill(course, ranking) {
    if (!ranking || ranking === 'all') return true;
    if (ranking === 'qs') return !!course.has_qs_badge;
    if (ranking === 'nirf') return !!course.has_nirf_badge;
    if (ranking === 'dual') return !!course.has_qs_badge && !!course.has_nirf_badge;
    return false;
}

function getEdxFilteredCourses() {
    let result = getEdxFilteredBase();
    const sort = edxFilterState.sort;
    if (sort === 'name') {
        result = result.slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sort === 'nameDesc') {
        result = result.slice().sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    } else if (sort === 'country') {
        result = result.slice().sort((a, b) => (a.country || '').localeCompare(b.country || ''));
    } else if (sort === 'qs') {
        result = result.slice().sort((a, b) => (b.has_qs_badge ? 1 : 0) - (a.has_qs_badge ? 1 : 0));
    } else {
        result = result.slice().sort((a, b) => parseInt(a.id || '9') - parseInt(b.id || '9'));
    }
    return result;
}

function getEdxFilteredBase(exclude = {}) {
    const state = { ...edxFilterState, ...exclude };
    const q = (state.search || '').trim().toLowerCase();
    let result = allCoursesData.filter(c =>
        (!state.showSavedOnly || favoriteCourses.has(String(c.id))) &&
        matchTypePill(c, state.typePill) &&
        matchAccessTypes(c, state.accessTypes) &&
        matchDomainChip(c, state.domainChip) &&
        matchLevelPill(c, state.levelPill) &&
        matchDurationPill(c, state.duration) &&
        matchModePill(c, state.mode) &&
        matchLanguagePill(c, state.language) &&
        matchRankingPill(c, state.ranking) &&
        matchCountry(c, state.country)
    );
    if (q) {
        result = result.filter(c =>
            (c.name || '').toLowerCase().includes(q) ||
            (c.university || '').toLowerCase().includes(q) ||
            (c.country || '').toLowerCase().includes(q) ||
            (c.domainLabel || '').toLowerCase().includes(q) ||
            (c.accessType || '').toLowerCase().includes(q)
        );
    }
    const al = String(a).trim().toLowerCase();
    const bl = String(b).trim().toLowerCase();
    if (!al || !bl) return false;
    return al === bl || al.includes(bl) || bl.includes(al);
}

function updateLineChart() { /* removed with analytics */ }

function updateMapChart() { /* removed with analytics */ }

function updateCountryLeaderboard(countryCounts, containerId = 'country-list') {
    const el = document.getElementById(containerId);
    if (!el) return;
    const entries = Object.entries(countryCounts || {})
        .filter(([k]) => isValidCountry(k))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15);
    const max = entries[0]?.[1] || 1;
    el.innerHTML = entries.map(([name, cnt]) => `
        <div class="country-row" onclick="applyFilter('country','${name.replace(/'/g, "\\'")}')">
            <span class="c-flag">${getFlag(name)}</span>
            <span class="c-name">${name}</span>
            <div class="c-bar-wrap"><div class="c-bar" style="width:${Math.round(cnt / max * 100)}%"></div></div>
            <span class="c-count">${cnt}</span>
        </div>
    `).join('');
}

// ================================================================
//  DASHBOARD BAR-CHART FILTER (filtered detail panel)
// ================================================================
function applyFilter(type, value) {
    currentFilter = { type, value };
    if (type === 'country' && value) {
        handleCountryClick(value);
        return;
    }
    if (!value || !type) {
        resetCountrySelection();
        return;
    }
    // Domain filtering kept for legacy chart interactions
    const panel = document.getElementById('course-details-panel');
    const tbody = document.getElementById('course-details-body');
    if (!tbody || !globalData?.documents) return;
    const filtered = globalData.documents.filter(c => normalizeDomain(c.domain) === value);
    if (panel) panel.style.display = 'flex';
    if (document.getElementById('country-detail-name')) document.getElementById('country-detail-name').textContent = value;
    if (document.getElementById('country-detail-count')) document.getElementById('country-detail-count').textContent = `${filtered.length} course${filtered.length === 1 ? '' : 's'}`;
    if (document.getElementById('country-detail-flag')) document.getElementById('country-detail-flag').textContent = '';

    const qsRank = c => c.qs ? String(c.qs) : (c.has_qs_badge ? 'Yes' : 'No');
    const nirfRank = c => c.nirf ? String(c.nirf) : (c.has_nirf_badge ? 'Yes' : 'No');

    tbody.innerHTML = filtered.length === 0
        ? '<tr><td colspan="4" class="empty-state"><strong>No courses found</strong>Adjust filters to see matching courses.</td></tr>'
        : filtered.map(c => `
            <tr>
                <td class="course-name-cell" title="${escHtml(c.name)}"><strong>${escHtml(c.name)}</strong></td>
                <td>${escHtml(c.university || '—')}</td>
                <td>${escHtml(qsRank(c))}</td>
                <td>${escHtml(nirfRank(c))}</td>
            </tr>`).join('');
}

// ================================================================
//  TAB FILTERS
// ================================================================
function populateSelect(selectId, values) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    const current = sel.value;
    const first = sel.querySelector('option');
    sel.innerHTML = '';
    if (first) sel.appendChild(first);
    [...values].filter(Boolean).sort().forEach(v => {
        const o = document.createElement('option');
        o.value = v; o.textContent = v;
        sel.appendChild(o);
    });
    sel.value = [...sel.options].some(o => o.value === current) ? current : (first ? first.value : 'all');
}

function refreshFilterOptions() {
    const cCountries = new Set();
    allCoursesData.forEach(c => { if (c.country) cCountries.add(c.country); });
    populateSelect('cf-country', cCountries);
    populateSelect('cf-domain', ALL_DOMAIN_LABELS);
}

function getFilteredCourseData() {
    const f = courseFilter;
    const q = f.search.trim().toLowerCase();
    return allCoursesData.filter(c => {
        if (f.country !== 'all' && !isSameCountry(c.country, f.country)) return false;
        if (f.domain !== 'all' && getDomainCategory(c) !== f.domain) return false;
        if (f.courseType !== 'all' && normalizeDomain(c.domain) !== f.courseType) return false;
        if (f.qs === 'yes' && !c.has_qs_badge) return false;
        if (f.qs === 'no' && c.has_qs_badge) return false;
        if (f.nirf === 'yes' && !c.has_nirf_badge) return false;
        if (f.nirf === 'no' && c.has_nirf_badge) return false;
        if (q && !`${c.name} ${c.university || ''} ${c.country || ''} ${c.domain || ''} ${getDomainCategory(c)} ${normalizeDomain(c.domain)}`.toLowerCase().includes(q)) return false;
        return true;
    });
}

function syncCourseFilters() {
    const f = courseFilter;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
    set('cf-search', f.search); set('cf-course-type', f.courseType); set('cf-country', f.country); set('cf-domain', f.domain);
    set('cf-qs', f.qs); set('cf-nirf', f.nirf);
}

function applyCourseFilter() { currentPage = 1; renderCoursesPage(); }

function initFilters() {
    // Legacy course-filters are no longer in the DOM; edX tabs/chips handle filtering.
    // Keep this function as a no-op so existing callers don't break.
}

// ================================================================
//  ALL COURSES — edX-style tabbed carousel
// ================================================================


function matchCountry(course, country) {
    if (!country || country === 'all') return true;
    return isSameCountry(course.country, country);
}

function matchDurationPill(course, bucket) {
    if (!bucket || bucket === 'all') return true;
    const info = course.durationInfo || getCourseDuration(course);
    return info.bucket === bucket;
}

function matchModePill(course, mode) {
    if (!mode || mode === 'all') return true;
    return (course.mode || getCourseMode(course)) === mode;
}

function matchLanguagePill(course, language) {
    if (!language || language === 'all') return true;
    return (course.language || getCourseLanguage(course)) === language;
}

function matchRankingPill(course, ranking) {
    if (!ranking || ranking === 'all') return true;
    if (ranking === 'qs') return !!course.has_qs_badge;
    if (ranking === 'nirf') return !!course.has_nirf_badge;
    if (ranking === 'dual') return !!course.has_qs_badge && !!course.has_nirf_badge;
    return false;
}

function getEdxFilteredCourses() {
    let result = getEdxFilteredBase();
    const sort = edxFilterState.sort;
    if (sort === 'name') {
        result = result.slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sort === 'nameDesc') {
        result = result.slice().sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    } else if (sort === 'country') {
        result = result.slice().sort((a, b) => (a.country || '').localeCompare(b.country || ''));
    } else if (sort === 'qs') {
        result = result.slice().sort((a, b) => (b.has_qs_badge ? 1 : 0) - (a.has_qs_badge ? 1 : 0));
    } else {
        result = result.slice().sort((a, b) => parseInt(a.id || '9') - parseInt(b.id || '9'));
    }
    return result;
}

function getEdxFilteredBase(exclude = {}) {
    const state = { ...edxFilterState, ...exclude };
    const q = (state.search || '').trim().toLowerCase();
    let result = allCoursesData.filter(c =>
        (!state.showSavedOnly || favoriteCourses.has(String(c.id))) &&
        matchTypePill(c, state.typePill) &&
        matchAccessTypes(c, state.accessTypes) &&
        matchDomainChip(c, state.domainChip) &&
        matchLevelPill(c, state.levelPill) &&
        matchDurationPill(c, state.duration) &&
        matchModePill(c, state.mode) &&
        matchLanguagePill(c, state.language) &&
        matchRankingPill(c, state.ranking) &&
        matchCountry(c, state.country)
    );
    if (q) {
        result = result.filter(c =>
            (c.name || '').toLowerCase().includes(q) ||
            (c.university || '').toLowerCase().includes(q) ||
            (c.country || '').toLowerCase().includes(q) ||
            (c.domainLabel || '').toLowerCase().includes(q) ||
            (c.accessType || '').toLowerCase().includes(q)
        );
    }
    return result;
}



function updateFilterCounts() {
    const typeBase = getEdxFilteredBase({ typePill: 'all' });
    const accessBase = getEdxFilteredBase({ accessTypes: [] });
    const domainBase = getEdxFilteredBase({ domainChip: 'all' });
    const levelBase = getEdxFilteredBase({ levelPill: 'all' });
    const durationBase = getEdxFilteredBase({ duration: 'all' });
    const modeBase = getEdxFilteredBase({ mode: 'all' });
    const languageBase = getEdxFilteredBase({ language: 'all' });
    const rankingBase = getEdxFilteredBase({ ranking: 'all' });

    const typeCounts = {};
    const accessCounts = {};
    const domainCounts = {};
    const levelCounts = {};
    const durationCounts = {};
    const modeCounts = {};
    const languageCounts = {};
    const rankingCounts = {};

    function countUnique(arr, filterFn, deduplicate=false) {
        let count = 0;
        const seen = new Set();
        for (let i = 0; i < arr.length; i++) {
            if (filterFn(arr[i])) {
                if (deduplicate) {
                    const key = arr[i].raw_index !== undefined ? arr[i].raw_index : String(arr[i].id);
                    if (!seen.has(key)) {
                        seen.add(key);
                        count++;
                    }
                } else {
                    count++;
                }
            }
        }
        return count;
    }

    document.querySelectorAll('#course-type-pills .type-pill').forEach(b => {
        const type = b.dataset.type || 'all';
        typeCounts[type] = countUnique(typeBase, c => matchTypePill(c, type));
    });
    document.querySelectorAll('#access-type-pills .type-pill').forEach(b => {
        const access = b.dataset.access || '';
        accessCounts[access] = countUnique(accessBase, c => getAccessType(c) === access, true);
    });
    document.querySelectorAll('#domain-chips-scroll .domain-chip').forEach(b => {
        const domain = b.dataset.domain || 'all';
        if (domain === 'all') {
            domainCounts[domain] = countUnique(domainBase, () => true, false); // Do not deduplicate All/Featured
        } else {
            domainCounts[domain] = countUnique(domainBase, c => matchDomainChip(c, domain), true);
        }
    });
    document.querySelectorAll('#skill-level-pills .type-pill').forEach(b => {
        const level = b.dataset.level || 'all';
        levelCounts[level] = countUnique(levelBase, c => matchLevelPill(c, level));
    });
    document.querySelectorAll('#duration-pills .type-pill').forEach(b => {
        const duration = b.dataset.duration || 'all';
        durationCounts[duration] = countUnique(durationBase, c => matchDurationPill(c, duration));
    });
    document.querySelectorAll('#mode-pills .type-pill').forEach(b => {
        const mode = b.dataset.mode || 'all';
        modeCounts[mode] = countUnique(modeBase, c => matchModePill(c, mode));
    });
    document.querySelectorAll('#language-pills .type-pill').forEach(b => {
        const language = b.dataset.language || 'all';
        languageCounts[language] = countUnique(languageBase, c => matchLanguagePill(c, language));
    });
    document.querySelectorAll('#ranking-pills .type-pill').forEach(b => {
        const ranking = b.dataset.ranking || 'all';
        rankingCounts[ranking] = countUnique(rankingBase, c => matchRankingPill(c, ranking));
    });

    document.querySelectorAll('#course-type-pills .type-pill').forEach(b => {
        const type = b.dataset.type || 'all';
        const count = typeCounts[type] ?? 0;
        const countEl = b.querySelector('.filter-count');
        if (countEl) countEl.textContent = count;
        b.title = `${type === 'all' ? 'All' : type} courses (${count})`;
    });
    document.querySelectorAll('#access-type-pills .type-pill').forEach(b => {
        const access = b.dataset.access || '';
        const count = accessCounts[access] ?? 0;
        const countEl = b.querySelector('.filter-count');
        if (countEl) countEl.textContent = count;
        b.title = `${access} courses (${count})`;
    });
    document.querySelectorAll('#domain-chips-scroll .domain-chip').forEach(b => {
        const domain = b.dataset.domain || 'all';
        const count = domainCounts[domain] ?? 0;
        const countEl = b.querySelector('.filter-count');
        if (countEl) countEl.textContent = count;
        b.title = `${domain === 'all' ? 'Featured' : domain} (${count})`;
    });
    document.querySelectorAll('#skill-level-pills .type-pill').forEach(b => {
        const level = b.dataset.level || 'all';
        const count = levelCounts[level] ?? 0;
        const countEl = b.querySelector('.filter-count');
        if (countEl) countEl.textContent = count;
        b.title = `${level === 'all' ? 'All' : level} level (${count})`;
    });
    document.querySelectorAll('#duration-pills .type-pill').forEach(b => {
        const duration = b.dataset.duration || 'all';
        const count = durationCounts[duration] ?? 0;
        const countEl = b.querySelector('.filter-count');
        if (countEl) countEl.textContent = count;
        b.title = `${duration === 'all' ? 'All durations' : duration} (${count})`;
    });
    document.querySelectorAll('#mode-pills .type-pill').forEach(b => {
        const mode = b.dataset.mode || 'all';
        const count = modeCounts[mode] ?? 0;
        const countEl = b.querySelector('.filter-count');
        if (countEl) countEl.textContent = count;
        b.title = `${mode === 'all' ? 'All modes' : mode} (${count})`;
    });
    document.querySelectorAll('#language-pills .type-pill').forEach(b => {
        const language = b.dataset.language || 'all';
        const count = languageCounts[language] ?? 0;
        const countEl = b.querySelector('.filter-count');
        if (countEl) countEl.textContent = count;
        b.title = `${language === 'all' ? 'All languages' : language} (${count})`;
    });
    document.querySelectorAll('#ranking-pills .type-pill').forEach(b => {
        const ranking = b.dataset.ranking || 'all';
        const count = rankingCounts[ranking] ?? 0;
        const countEl = b.querySelector('.filter-count');
        if (countEl) countEl.textContent = count;
        b.title = `${ranking === 'all' ? 'All rankings' : ranking} (${count})`;
    });
}

function getUniversityInitials(name) {
    if (!name) return 'CV';
    const words = String(name).trim().split(/\s+/).filter(w => w.length > 1 && !/^(the|of|and|&|for|in)$/i.test(w));
    const firstLetters = words.slice(0, 2).map(w => w[0].toUpperCase());
    return firstLetters.join('') || name[0].toUpperCase();
}

function getAccessPill(course) {
    const norm = course.accessType || normalizeDomain(course.domain);
    if (norm === 'Free') return { label: 'FREE', cls: 'free' };
    if (norm === 'Free to Audit') return { label: 'FREE TO AUDIT', cls: 'audit' };
    if (norm === 'High Value Low Cost') return { label: 'HIGH VALUE', cls: 'value' };
    return { label: 'PAID', cls: 'paid' };
}

function formatDurationShort(course) {
    if (course.duration) {
        const d = String(course.duration).trim();
        const m = d.match(/(\d+)\s*months?/i);
        if (m) return `${m[1]}M`;
        const w = d.match(/(\d+)\s*weeks?/i);
        if (w) return `${w[1]}W`;
        return d;
    }
    const weeks = (parseInt(course.id, 10) % 12) + 2;
    return `${weeks}W`;
}

function formatMode(course) {
    if (course.mode) return course.mode;
    if (course.duration && /online/i.test(String(course.duration))) return 'Online';
    return 'Online';
}

function toggleFavorite(id, btn) {
    const key = String(id);
    if (favoriteCourses.has(key)) favoriteCourses.delete(key);
    else favoriteCourses.add(key);
    localStorage.setItem('cv_favorites', JSON.stringify(Array.from(favoriteCourses)));
    const saved = favoriteCourses.has(key);
    if (btn) {
        btn.classList.toggle('saved', saved);
        btn.setAttribute('aria-pressed', saved);
        btn.title = saved ? 'Remove from saved' : 'Save course';
        if (btn.classList.contains('row-action')) { btn.innerHTML = `<i class=\"${saved ? 'fa-solid' : 'fa-regular'} fa-heart\"></i>`; } else if (!btn.classList.contains('btn-save-floating')) { btn.textContent = saved ? '♥' : '♡'; }
    }
    const card = document.querySelector(`.clean-course-card[data-course-id="${CSS.escape(key)}"]`);
    if (card) {
        card.classList.toggle('saved', saved);
        const floatBtn = card.querySelector('.btn-save-floating');
        if (floatBtn) floatBtn.classList.toggle('saved', saved);
    }
    showToast(saved ? 'Course saved' : 'Removed from saved');
}

const toastQueue = [];
let toastProcessing = false;
const TOAST_DURATION = 3000;

function showToast(message, type = 'info') {
    toastQueue.push({ message, type });
    if (!toastProcessing) processToastQueue();
}

function processToastQueue() {
    if (toastQueue.length === 0) { toastProcessing = false; return; }
    toastProcessing = true;
    const { message, type } = toastQueue.shift();
    const toast = document.getElementById('toast');
    if (!toast) return;

    const iconMap = {
        success: '✓', error: '✕', warning: '⚠', info: 'ℹ'
    };
    const titleMap = {
        success: 'Success', error: 'Error', warning: 'Warning', info: 'Info'
    };

    const iconEl = document.getElementById('toast-icon');
    const titleEl = document.getElementById('toast-title');
    const msgEl = document.getElementById('toast-msg');
    const progressEl = document.getElementById('toast-progress');

    if (iconEl) iconEl.textContent = iconMap[type] || iconMap.info;
    if (titleEl) titleEl.textContent = titleMap[type] || titleMap.info;
    if (msgEl) msgEl.textContent = message;
    announce(message);

    toast.className = `toast show ${type}`;
    if (progressEl) progressEl.style.animation = 'none';
    requestAnimationFrame(() => {
        if (progressEl) progressEl.style.animation = `toastProgress ${TOAST_DURATION}ms linear forwards`;
    });

    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(processToastQueue, 250);
    }, TOAST_DURATION);
}

function setButtonLoading(btn, loading = true) {
    if (!btn) return;
    if (loading) {
        if (!btn.dataset.originalText) btn.dataset.originalText = btn.textContent;
        btn.textContent = '';
        const spinner = document.createElement('span');
        spinner.className = 'btn-spinner';
        spinner.setAttribute('aria-hidden', 'true');
        btn.appendChild(spinner);
        btn.appendChild(document.createTextNode(' Loading…'));
        btn.disabled = true;
    } else {
        btn.textContent = btn.dataset.originalText || btn.textContent.replace(' Loading…', '');
        btn.disabled = false;
    }
}

function showLoadingCurtain(message = 'Loading…') {
    const curtain = document.getElementById('loading-curtain');
    const msgEl = document.getElementById('loading-curtain-msg');
    if (msgEl) msgEl.textContent = message;
    if (curtain) {
        curtain.classList.add('open');
        curtain.setAttribute('aria-hidden', 'false');
    }
}

function hideLoadingCurtain() {
    const curtain = document.getElementById('loading-curtain');
    if (curtain) {
        curtain.classList.remove('open');
        curtain.setAttribute('aria-hidden', 'true');
    }
}

async function shareCourse(course) {
    const text = `${course.name} — ${course.university || 'CourseVerify'}`;
    const url = window.location.href.split('?')[0] + `?course=${encodeURIComponent(course.id)}`;
    try {
        if (navigator.share) {
            await navigator.share({ title: text, text, url });
        } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(url);
            showToast('Course link copied to clipboard');
        } else {
            window.prompt('Copy this link:', url);
        }
    } catch (e) {
        // User cancelled or share failed
    }
}

function getRankPill(course) {
    if (course.has_qs_badge && course.has_nirf_badge) return `<span class="rank-pill dual"> DUAL RANKED</span>`;
    if (course.has_qs_badge) return `<span class="rank-pill qs"> QS RANKED</span>`;
    if (course.has_nirf_badge) return `<span class="rank-pill nirf"> NIRF RANKED</span>`;
    return '';
}

function renderSkeletonCards(count = 12) {
    return Array.from({ length: count }, () => `
        <article class="clean-course-card skeleton-card" aria-hidden="true">

        <div class="grid-view-content">
            
            <div class="skeleton-header">
                <div class="skeleton-badge"></div>
                <div style="flex:1;">
                    <div class="skeleton-row short"></div>
                    <div class="skeleton-row" style="width:35%;"></div>
                </div>
            </div>
            <div class="skeleton-row med"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row short"></div>
        
        </div>
                                        <div class="list-view-content" style="display: none; align-items: center;">
            <div class="list-col list-col-logo" style="display: flex; align-items: center; justify-content: center; width: 48px; flex-shrink: 0;">
                ${hasLogo ? `<div class="logo-wrap" style="width:48px;height:48px;border-radius:50%;border:1px solid #e5e7eb;background:#ffffff;display:flex;align-items:center;justify-content:center;padding:4px;overflow:hidden;flex-shrink:0;">
                    <img src="${c.logo_url}" style="width:100%;height:100%;object-fit:contain;" alt="" onerror="this.remove()" />
                </div>` : `<div class="logo-wrap" style="width:48px;height:48px;border-radius:50%;border:1px solid #e5e7eb;background:#ffffff;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;"></div>`}
            </div>
            <div class="list-col list-col-course">
                <a href="${escHtml(getCourseUrl(c))}" target="_blank" style="font-size:14px; font-weight:700; color:var(--text-1); text-decoration:none;">${escHtml(c.name)}</a>
                <div style="font-size:12px; color:var(--text-3); margin-top:4px; display:flex; align-items:center;">
                    ${escHtml(c.university)} &middot; ${escHtml(c.country || 'India')}
                </div>
            </div>
            <div class="list-col list-col-skills" style="display:flex; flex-wrap:wrap; gap:6px;">
                ${badges.join('')}
                ${(mode && mode !== 'Other' && mode.toLowerCase() !== 'free' && mode.toLowerCase() !== 'free to audit') ? `<span class="badge mode">${escHtml(mode)}</span>` : ''}
            </div>
            <div class="list-col list-col-duration" style="font-size:13px; color:var(--text-2); display:flex; align-items:center; gap:6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                ${escHtml(duration)}
            </div>
            <div class="list-col list-col-cost">
                <span class="cost ${costClass}" style="font-size:13px; font-weight:600;">${escHtml(c.cost || '—')}</span>
            </div>
            <div class="list-col list-col-actions" style="display:flex; gap:8px; align-items:center; justify-content:center;">
                <a class="lv-btn-visit" href="${escHtml(getCourseUrl(c))}" target="_blank" onclick="event.stopPropagation();">Visit site &rarr;</a>
                <button class="row-action ${saved ? 'saved' : ''}" style="width:36px; height:36px; border-radius:6px; background:#111827; color:#fff; border:none; cursor:pointer; font-size:16px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;" title="${saved ? 'Remove from saved' : 'Save course'}" aria-label="${saved ? 'Remove from saved' : 'Save course'}" aria-pressed="${saved}" onclick="event.stopPropagation(); toggleFavorite('${c.id}', this)">
                    <i class="${saved ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
            </div>
        </div>
    
</article>
    `).join('');
}

function updateHeroState(total) {
    const titleEl = document.getElementById('edx-section-title');
    const countEl = document.getElementById('hero-course-count');
    const summaryEl = document.getElementById('hero-summary-text');
    const f = edxFilterState;

    if (countEl) countEl.textContent = total.toLocaleString();

    let heading = 'All Courses';
    if (f.search.trim()) heading = 'Search Results';
    else if (f.country && f.country !== 'all') heading = `Courses in ${f.country}`;
    else if (f.domainChip && f.domainChip !== 'all') heading = `${f.domainChip} Courses`;
    else if (f.typePill && f.typePill !== 'all') heading = `${f.typePill} Courses`;
    else if (f.accessTypes && f.accessTypes.length) heading = `${f.accessTypes.join(' / ')} Courses`;
    else if (f.levelPill && f.levelPill !== 'all') heading = `${f.levelPill} Level`;
    if (titleEl) titleEl.textContent = heading;

    const parts = [];
    if (f.search.trim()) parts.push(`matching "${f.search.trim()}"`);
    if (f.country && f.country !== 'all') parts.push(`from ${f.country}`);
    if (f.domainChip && f.domainChip !== 'all') parts.push(`in ${f.domainChip}`);
    if (f.typePill && f.typePill !== 'all') parts.push(`${f.typePill} format`);
    if (f.accessTypes && f.accessTypes.length) parts.push(`${f.accessTypes.join(' + ')} access`);
    if (f.levelPill && f.levelPill !== 'all') parts.push(`${f.levelPill} level`);

    let summary = `Browse the full catalog below.`;
    if (parts.length) {
        summary = `Showing ${total.toLocaleString()} courses ${parts.join(', ')}.`;
    } else if (total > 0) {
        summary = `${total.toLocaleString()} verified courses across categories, levels, and countries.`;
    }
    if (summaryEl) summaryEl.textContent = summary;
}

function renderEdxCards() {
    const row = document.getElementById('edx-cards-row');
    const countEl = document.getElementById('edx-result-count');
    const paginationEl = document.getElementById('courses-pagination');
    if (!row) return;

    const allBase = getEdxFilteredBase();
    const all = getEdxFilteredCourses();
    const total = allBase.length;
    if (countEl) countEl.textContent = `${total.toLocaleString()} course${total === 1 ? '' : 's'}`;
    updateHeroState(total);

    renderActiveFilterChips();

    if (total === 0) {
        row.innerHTML = `
            <div class="edx-empty">
                <div class="edx-empty-icon" aria-hidden="true"></div>
                <h3>No courses match your filters</h3>
                <p class="edx-empty-sub">Try clearing some filters or changing your search terms to see more results.</p>
                <div class="edx-empty-actions">
                    <button class="btn-view-details" onclick="clearAllCourseFilters()">Clear all filters</button>
                    <button class="btn-quick-view" onclick="jumpToCourses({})">Browse everything</button>
                </div>
            </div>`;
        if (paginationEl) paginationEl.innerHTML = '';
        updateCourseViewClass();
        return;
    }

    const pageSize = getCoursesPageSize();
    const page = edxFilterState.page || 1;
    const start = 0;
    const end = page * pageSize;
    const pageCourses = all.slice(start, end);

    row.innerHTML = pageCourses.map((c, i) => {
        const initials = getUniversityInitials(c.university);
        const duration = formatDurationShort(c);
        const mode = formatMode(c);
        const rank = getRankPill(c);
        const flag = getFlag(c.country);
        const language = c.language || 'English';
        const cid = String(c.id);
        const saved = favoriteCourses.has(cid);
        const level = c.skillLevel || getSkillLevel(c);
        const levelClass = level.toLowerCase();
        const courseType = normalizeDomain(c.domain) || 'Course';
        const domainClass = DOMAIN_CLASS_MAP[c.domainSlug] || '';
        const verifiedBadge = (c.has_qs_badge || c.has_nirf_badge) ? `<span class="verified-badge" title="Verified by ranking">✓ Verified</span>` : '';
        const bannerImage = (c.banner_url && c.banner_url.trim()) || getCourseImage(c.id);
        const hasLogo = c.logo_url && c.logo_url.trim() !== '';
        const stampClass = c.stamp === 'hot' ? 'hot' : (c.stamp === 'jobskills' ? 'jobskills' : '');
        const stampLabel = c.stamp === 'hot' ? 'Hot Pick' : (c.stamp === 'jobskills' ? 'Job Skills' : '');
        const badges = [];
        if (c.has_qs_badge) badges.push('<span class="badge qs">QS Ranked</span>');
        if (c.has_nirf_badge) badges.push('<span class="badge nirf">NIRF</span>');
        if (c.scholarship_match || c.has_scholarship) badges.push('<span class="badge scholar">Scholarship</span>');
        let academicType = c.course_type || c.courseType || courseType;
        if (academicType && academicType !== 'Other' && academicType.toLowerCase() !== 'free' && academicType.toLowerCase() !== 'free to audit') {
            badges.push(`<span class="badge">${escHtml(academicType)}</span>`);
        }
        badges.push(`<span class="badge">${escHtml(level)}</span>`);
        badges.push(`<span class="badge lang" style="background: #D97706; color: #fff; border-color: #D97706;">${escHtml(language)}</span>`);

        // Domain badge removed by user request
        const costClass = ((c.cost && c.cost.toLowerCase() === 'free') || c.free_match || c.has_free) ? 'free' : '';
        const skillsDesc = c.skills_description || c.skills || '';
        return `
        <article class="clean-course-card card ${saved ? 'saved' : ''} ${domainClass}" style="animation: fadeStagger 0.4s ease ${i * 0.04}s both;" data-course-id="${c.id}" tabindex="0" role="button" aria-label="Open ${escHtml(c.name)}">

        <div class="grid-view-content">
            
            <div class="card-banner no-image">
                ${bannerImage ? `<img class="course-banner-image" src="${escHtml(bannerImage)}" alt="" onerror="this.remove()" />` : ''}
                <button class="btn-save-floating ${saved ? 'saved' : ''}" onclick="event.stopPropagation(); toggleFavorite('${c.id}', this)" title="${saved ? 'Remove from saved' : 'Save course'}" aria-label="${saved ? 'Remove from saved' : 'Save course'}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="heart-icon"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
                <div class="logo-wrap ${hasLogo ? 'has-logo' : ''}">
                    ${hasLogo ? `<img src="${c.logo_url}" alt="${escHtml(c.university)} logo" loading="lazy" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(c.university)}&background=random&color=fff&size=128&font-size=0.33';" />` : ''}
                    <span class="logo-fallback"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.4"><path d="M3 21h18"></path><path d="M3 10h18"></path><path d="M5 6l7-3 7 3"></path><path d="M4 10v11"></path><path d="M20 10v11"></path><path d="M8 14v3"></path><path d="M12 14v3"></path><path d="M16 14v3"></path></svg></span>
                </div>
                ${stampClass ? `<span class="stamp ${stampClass}">${stampLabel}</span>` : ''}
            </div>
            <div class="card-body">
                <p class="edx-card-uni">${escHtml(c.university)}</p>
                ${c.affiliated_uni ? `<p class="edx-card-loc" style="font-size:11px; opacity:0.8; margin-bottom:4px;">Affiliated to: ${escHtml(c.affiliated_uni)}</p>` : ''}
                <p class="edx-card-loc">${escHtml(c.country || 'India')}${c.uni_state && c.mode && c.mode.toLowerCase().includes('offline') ? ` &middot; ${escHtml(c.uni_state)}` : ''}</p>
                <h3 class="edx-card-title" title="${escHtml(c.name)}">${escHtml(c.name)}</h3>
                <span style="display:flex; gap: 8px;">
                    ${Array.isArray(c.domains) && c.domains.includes('Free to Audit') ? '<span style="color:#2563eb; font-weight:700; font-size:12px; margin-right:8px;">Free to Learn</span>' : ''}
                    ${c.has_scholarship ? '<span class="status-badge low-cost" style="background:#fef3c7; color:#d97706; border:1px solid #fde68a;">Scholarship</span>' : ''}
                </span>
                <p class="skills-desc">${escHtml(skillsDesc)}</p>
                <div class="badge-row">${badges.join('')}</div>
                <div class="meta-row">
                    <span>${escHtml(duration)} · ${escHtml(mode)} · ${escHtml(c.course_type || courseType || 'Course')}</span>
                    <span class="cost ${costClass}">${escHtml(c.cost || '—')}</span>
                </div>
                <div class="card-footer-actions" style="display:flex; gap:8px; margin-top:auto;">
                    <a class="btn" style="flex:1; text-align:center;" href="${escHtml(getCourseUrl(c))}" target="_blank" rel="noopener" onclick="event.stopPropagation();" title="Visit ${escHtml(c.university || 'course')} website">Visit website →</a>
                    <button class="btn btn-save ${saved ? 'saved' : ''}" style="width:44px;" onclick="event.stopPropagation(); toggleFavorite('${c.id}', this)" title="${saved ? 'Remove from saved' : 'Save course'}" aria-label="${saved ? 'Remove from saved' : 'Save course'}" aria-pressed="${saved}">${saved ? '♥' : '♡'}</button>
                </div>
            </div>
        
        </div>
                                        <div class="list-view-content" style="display: none; align-items: center;">
            <div class="list-col list-col-logo" style="display: flex; align-items: center; justify-content: center; width: 48px; flex-shrink: 0;">
                ${hasLogo ? `<div class="logo-wrap" style="width:48px;height:48px;border-radius:50%;border:1px solid #e5e7eb;background:#ffffff;display:flex;align-items:center;justify-content:center;padding:4px;overflow:hidden;flex-shrink:0;">
                    <img src="${c.logo_url}" style="width:100%;height:100%;object-fit:contain;" alt="" onerror="this.remove()" />
                </div>` : `<div class="logo-wrap" style="width:48px;height:48px;border-radius:50%;border:1px solid #e5e7eb;background:#ffffff;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;"></div>`}
            </div>
            <div class="list-col list-col-course">
                <a href="${escHtml(getCourseUrl(c))}" target="_blank" style="font-size:14px; font-weight:700; color:var(--text-1); text-decoration:none;">${escHtml(c.name)}</a>
                <div style="font-size:12px; color:var(--text-3); margin-top:4px; display:flex; align-items:center;">
                    ${escHtml(c.university)} &middot; ${escHtml(c.country || 'India')}
                </div>
            </div>
            <div class="list-col list-col-skills" style="display:flex; flex-wrap:wrap; gap:6px;">
                ${badges.join('')}
                ${(mode && mode !== 'Other' && mode.toLowerCase() !== 'free' && mode.toLowerCase() !== 'free to audit') ? `<span class="badge mode">${escHtml(mode)}</span>` : ''}
            </div>
            <div class="list-col list-col-duration" style="font-size:13px; color:var(--text-2); display:flex; align-items:center; gap:6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                ${escHtml(duration)}
            </div>
            <div class="list-col list-col-cost">
                <span class="cost ${costClass}" style="font-size:13px; font-weight:600;">${escHtml(c.cost || '—')}</span>
            </div>
            <div class="list-col list-col-actions" style="display:flex; gap:8px; align-items:center; justify-content:center;">
                <a class="lv-btn-visit" href="${escHtml(getCourseUrl(c))}" target="_blank" onclick="event.stopPropagation();">Visit site &rarr;</a>
                <button class="row-action ${saved ? 'saved' : ''}" style="width:36px; height:36px; border-radius:6px; background:#111827; color:#fff; border:none; cursor:pointer; font-size:16px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;" title="${saved ? 'Remove from saved' : 'Save course'}" aria-label="${saved ? 'Remove from saved' : 'Save course'}" aria-pressed="${saved}" onclick="event.stopPropagation(); toggleFavorite('${c.id}', this)">
                    <i class="${saved ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
            </div>
        </div>
    
</article>`;
    }).join('');

    row.querySelectorAll('.clean-course-card[data-course-id]').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = card.querySelector('.card-footer-actions a.btn');
                if (link) link.focus();
            }
        });
    });

    renderPagination(page, total);
    updateCourseViewClass();
    updateFilterCounts();
    setupInfiniteScroll(all.length, end);
}

function renderPagination(currentPage, total) {
    const el = document.getElementById('courses-pagination');
    const metaEl = document.getElementById('courses-pagination-meta');
    const wrapEl = document.getElementById('courses-pagination-wrap');
    if (!el) return;

    const pageSize = getCoursesPageSize();
    const isAll = pageSize === Infinity;
    const start = total === 0 ? 0 : 1;
    const end = isAll ? total : Math.min(currentPage * pageSize, total);

    if (metaEl) metaEl.textContent = `Showing ${start.toLocaleString()}–${end.toLocaleString()} of ${total.toLocaleString()} courses`;

    if (wrapEl) wrapEl.style.display = 'none';
    el.innerHTML = '';
}

function goToCoursePage(page) {
    const all = getEdxFilteredCourses();
    const pageSize = getCoursesPageSize();
    const pages = pageSize === Infinity ? 1 : Math.ceil(all.length / pageSize) || 1;
    let next = page;
    if (page === 'first') next = 1;
    if (page === 'last') next = pages;
    if (page === 'prev') next = Math.max(1, (edxFilterState.page || 1) - 1);
    if (page === 'next') next = Math.min(pages, (edxFilterState.page || 1) + 1);
    edxFilterState.page = next;
    renderEdxCards();
}

let _infiniteScrollObserver = null;
let _infiniteScrollSentinel = null;
let _isLoadingMore = false;

function setupInfiniteScroll(totalItems, currentlyShown) {
    if (_infiniteScrollObserver) {
        _infiniteScrollObserver.disconnect();
        _infiniteScrollObserver = null;
    }
    if (_infiniteScrollSentinel) {
        _infiniteScrollSentinel.remove();
        _infiniteScrollSentinel = null;
    }

    const existingLoadMore = document.querySelector('.load-more-wrap');
    if (existingLoadMore) {
        existingLoadMore.remove();
    }

    if (currentlyShown >= totalItems) return;

    const isMobile = window.innerWidth <= 900;
    const maxScrollLimit = isMobile ? 100 : 250;

    const row = document.getElementById('edx-cards-row');
    if (!row) return;

    if (currentlyShown >= maxScrollLimit) {
        const btnWrap = document.createElement('div');
        btnWrap.className = 'load-more-wrap';
        btnWrap.style = 'text-align:center; padding: 30px 20px; width: 100%;';
        btnWrap.innerHTML = `<button type="button" class="btn-quick-view" style="font-size: 14px; padding: 12px 24px;" onclick="window._loadMoreManual()">Load More Courses</button>`;
        window._loadMoreManual = function () {
            edxFilterState.page = (edxFilterState.page || 1) + 1;
            renderEdxCards();
        };
        row.parentNode.insertBefore(btnWrap, row.nextSibling);
        return;
    }

    _infiniteScrollSentinel = document.createElement('div');
    _infiniteScrollSentinel.className = 'infinite-scroll-sentinel';
    _infiniteScrollSentinel.style.height = '100px';
    _infiniteScrollSentinel.style.width = '100%';
    _infiniteScrollSentinel.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted, #666);">Loading more courses...</div>`;

    row.parentNode.insertBefore(_infiniteScrollSentinel, row.nextSibling);

    _infiniteScrollObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !_isLoadingMore) {
            _isLoadingMore = true;
            edxFilterState.page = (edxFilterState.page || 1) + 1;

            renderEdxCards();

            setTimeout(() => {
                _isLoadingMore = false;
            }, 50);
        }
    }, { rootMargin: '100px' });

    _infiniteScrollObserver.observe(_infiniteScrollSentinel);
}


async function shareCourseById(id) {
    const c = getCourseById(id);
    if (c) shareCourse(c);
}

function getCourseById(id) {
    return allCoursesData.find(c => String(c.id) === String(id));
}

function getCourseUrl(course) {
    return course?.url || course?.course_url || course?.link || '#';
}

function updateCourseViewClass() {
    const row = document.getElementById('edx-cards-row');
    if (!row) return;
    const isList = edxFilterState.view === 'list';
    row.classList.toggle('list-view', isList);

    if (!isList) {
        const workspace = document.getElementById('catalog-workspace');
        const collapsed = workspace && workspace.classList.contains('sidebar-collapsed');
        const cols = collapsed ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)';
        row.style.setProperty('display', 'grid', 'important');
        row.style.setProperty('grid-template-columns', cols, 'important');
        row.style.setProperty('gap', '20px', 'important');
    } else {
        row.style.removeProperty('display');
        row.style.removeProperty('grid-template-columns');
        row.style.removeProperty('gap');
    }

    let header = document.getElementById('list-view-header');
    if (isList) {
        if (!header) {
            header = document.createElement('div');
            header.id = 'list-view-header';
            header.className = 'list-view-header';
            header.innerHTML = `
                <div class="list-col list-col-logo"></div>
                <div class="list-col list-col-course">COURSE</div>
                <div class="list-col list-col-skills">BADGES</div>
                <div class="list-col list-col-duration">DURATION</div>
                <div class="list-col list-col-cost">COST</div>
                <div class="list-col list-col-actions">ACTIONS</div>
            `;
            row.parentNode.insertBefore(header, row);
        }
        header.style.removeProperty('display');
    } else {
        if (header) header.style.setProperty('display', 'none', 'important');
    }

    applyViewToggleGlow(isList ? 'list' : 'grid');
}

function renderActiveFilterChips() {
    const container = document.getElementById('active-filters');
    if (!container) return;
    const chips = [];
    const f = edxFilterState;
    if (f.search.trim()) chips.push({ key: 'search', label: `Search: "${f.search.trim()}"`, cls: 'chip-search' });
    if (f.typePill && f.typePill !== 'all') chips.push({ key: 'typePill', label: f.typePill, cls: 'chip-type' });
    (f.accessTypes || []).forEach(access => {
        chips.push({ key: `accessType:${access}`, label: access, cls: 'chip-access' });
    });
    if (f.domainChip && f.domainChip !== 'all') chips.push({ key: 'domainChip', label: f.domainChip, cls: 'chip-domain' });
    if (f.levelPill && f.levelPill !== 'all') chips.push({ key: 'levelPill', label: `Level: ${f.levelPill}`, cls: `chip-level chip-level-${f.levelPill.toLowerCase()}` });
    if (f.duration && f.duration !== 'all') chips.push({ key: 'duration', label: `Duration: ${f.duration}`, cls: 'chip-duration' });
    if (f.mode && f.mode !== 'all') chips.push({ key: 'mode', label: `Mode: ${f.mode}`, cls: 'chip-mode' });
    if (f.language && f.language !== 'all') chips.push({ key: 'language', label: `Language: ${f.language}`, cls: 'chip-language' });
    if (f.ranking && f.ranking !== 'all') chips.push({ key: 'ranking', label: `Ranking: ${f.ranking.toUpperCase()}`, cls: 'chip-ranking' });
    if (f.country && f.country !== 'all') chips.push({ key: 'country', label: `Country: ${f.country}`, cls: 'chip-country' });
    if (f.sort && f.sort !== 'relevance') chips.push({ key: 'sort', label: `Sort: ${sortLabel(f.sort)}`, cls: 'chip-sort' });

    if (chips.length === 0) {
        container.innerHTML = '';
        return;
    }

    let html = chips.map(c => `
        <span class="filter-chip ${escHtml(c.cls || '')}">
            ${escHtml(c.label)}
            <button aria-label="Remove ${escHtml(c.label)} filter" onclick="removeFilterChip('${c.key}')">×</button>
        </span>
    `).join('');

    if (chips.length > 1) {
        html += `<button class="filter-chip chip-clear" onclick="clearAllCourseFilters()">Clear all ×</button>`;
    }

    container.innerHTML = html;
}

function sortLabel(sort) {
    return {
        relevance: 'Relevance', name: 'Name A–Z', nameDesc: 'Name Z–A', country: 'Country A–Z', qs: 'QS Ranked first', nirf: 'NIRF Rated first'
    }[sort] || sort;
}

function removeFilterChip(key) {
    if (key === 'search') edxFilterState.search = '';
    if (key === 'typePill') edxFilterState.typePill = 'all';
    if (key.startsWith('accessType:')) {
        const access = key.split(':')[1];
        const idx = edxFilterState.accessTypes.indexOf(access);
        if (idx >= 0) edxFilterState.accessTypes.splice(idx, 1);
    }
    if (key === 'domainChip') edxFilterState.domainChip = 'all';
    if (key === 'levelPill') edxFilterState.levelPill = 'all';
    if (key === 'duration') edxFilterState.duration = 'all';
    if (key === 'mode') edxFilterState.mode = 'all';
    if (key === 'language') edxFilterState.language = 'all';
    if (key === 'ranking') edxFilterState.ranking = 'all';
    if (key === 'country') { edxFilterState.country = 'all'; courseFilter.country = 'all'; }
    if (key === 'sort') edxFilterState.sort = 'relevance';
    edxFilterState.page = 1;
    syncEdxUIFromState();
    renderEdxCards();
}

function updateDropdownButtonText(groupId, defaultText) {
    const group = document.getElementById(groupId);
    if (!group) return;
    const wrap = group.closest('.pill-dropdown');
    if (!wrap) return;
    const btn = wrap.querySelector('.pill-dropdown-btn');
    if (!btn) return;

    let activePill = group.querySelector('.active');
    let activeText = activePill ? activePill.textContent.trim() : 'All';
    let isAll = activeText.toLowerCase() === 'all';

    const svgIcon = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

    if (isAll) {
        btn.innerHTML = `${defaultText} ${svgIcon}`;
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.style.background = '';
    } else {
        btn.innerHTML = `${defaultText}: <span style="font-weight: 700; color: inherit;">${activeText}</span> ${svgIcon}`;
        btn.style.color = 'var(--primary)';
        btn.style.borderColor = 'var(--primary)';
        btn.style.background = 'var(--bg-highlight, rgba(0, 112, 243, 0.05))';
    }
}

function syncEdxUIFromState() {
    const searchInput = document.getElementById('course-search');
    if (searchInput) searchInput.value = edxFilterState.search;
    const sortSelect = document.getElementById('course-sort');
    if (sortSelect) sortSelect.value = edxFilterState.sort;

    document.querySelectorAll('#course-type-pills .type-pill').forEach(b => {
        const active = b.dataset.type === edxFilterState.typePill;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('#access-type-pills .type-pill').forEach(b => {
        const active = edxFilterState.accessTypes.includes(b.dataset.access);
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('#domain-chips-scroll .domain-chip').forEach(b => {
        const active = b.dataset.domain === edxFilterState.domainChip;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('#skill-level-pills .type-pill').forEach(b => {
        const active = b.dataset.level === edxFilterState.levelPill;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('#duration-pills .type-pill').forEach(b => {
        const active = (b.dataset.duration || 'all') === (edxFilterState.duration || 'all');
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('#language-pills .type-pill').forEach(b => {
        const active = (b.dataset.language || 'all') === (edxFilterState.language || 'all');
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('#mode-pills .type-pill').forEach(b => {
        const active = (b.dataset.mode || 'all') === (edxFilterState.mode || 'all');
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('#ranking-pills .type-pill').forEach(b => {
        const active = (b.dataset.ranking || 'all') === (edxFilterState.ranking || 'all');
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
    });

    document.querySelectorAll('.courses-view-toggle .view-btn').forEach(b => {
        const active = b.id === `view-${edxFilterState.view}`;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
    });
    const countrySelect = document.getElementById('course-country-filter');
    if (countrySelect) countrySelect.value = edxFilterState.country || 'all';
    highlightDomainExplorerCard(edxFilterState.domainChip);

    updateDropdownButtonText('course-type-pills', 'Category');
    updateDropdownButtonText('duration-pills', 'Duration');
    updateDropdownButtonText('language-pills', 'Language');
    updateDropdownButtonText('skill-level-pills', 'Level');
    updateDropdownButtonText('mode-pills', 'Mode');
    updateDropdownButtonText('ranking-pills', 'Ranking');
    updateDropdownButtonText('domain-chips-scroll', 'Topic');
}

function populateCountryFilter() {
    const select = document.getElementById('course-country-filter');
    if (!select) return;
    const current = select.value || edxFilterState.country || 'all';
    const countries = [...new Set(allCoursesData.map(c => c.country).filter(isValidCountry))].sort();
    select.innerHTML = '<option value="all">All countries</option>';
    countries.forEach(country => {
        const opt = document.createElement('option');
        opt.value = country;
        opt.textContent = `${getFlag(country)} ${country}`;
        select.appendChild(opt);
    });
    select.value = countries.includes(current) ? current : 'all';
}

function setEdxTypePill(pill) {
    edxFilterState.typePill = pill;
    edxFilterState.page = 1;
    document.querySelectorAll('#course-type-pills .type-pill').forEach(b => {
        const active = b.dataset.type === pill;
        b.classList.toggle('active', active);
    });
    syncEdxUIFromState();
    renderEdxCards();
}

function setEdxAccessType(access) {
    const types = edxFilterState.accessTypes;
    const idx = types.indexOf(access);
    if (idx >= 0) types.splice(idx, 1);
    else types.push(access);
    edxFilterState.page = 1;
    document.querySelectorAll('#access-type-pills .type-pill').forEach(b => {
        const active = types.includes(b.dataset.access);
        b.classList.toggle('active', active);
    });
    syncEdxUIFromState();
    renderEdxCards();
}

function setEdxDomainChip(chip) {
    edxFilterState.domainChip = chip;
    edxFilterState.page = 1;
    document.querySelectorAll('#domain-chips-scroll .domain-chip').forEach(b => {
        const active = b.dataset.domain === chip;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
    });
    highlightDomainExplorerCard(chip);
    syncEdxUIFromState();
    renderEdxCards();
}

function highlightDomainExplorerCard(chip) {
    const chipSlug = DOMAIN_SLUG_MAP[chip] || chip;
    document.querySelectorAll('#domain-cards-grid .domain-card').forEach(card => {
        const active = card.dataset.domain === chipSlug;
        card.classList.toggle('active', active);
    });
}

function setEdxLevelPill(level) {
    edxFilterState.levelPill = level;
    edxFilterState.page = 1;
    document.querySelectorAll('#skill-level-pills .type-pill').forEach(b => {
        const active = b.dataset.level === level;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
    });
    renderEdxCards();
}

function setEdxDurationPill(bucket) {
    edxFilterState.duration = bucket || 'all';
    edxFilterState.page = 1;
    document.querySelectorAll('#duration-pills .type-pill').forEach(b => {
        const active = (b.dataset.duration || 'all') === edxFilterState.duration;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
    });
    renderEdxCards();
}

function setEdxModePill(mode) {
    edxFilterState.mode = mode || 'all';
    edxFilterState.page = 1;
    document.querySelectorAll('#mode-pills .type-pill').forEach(b => {
        const active = (b.dataset.mode || 'all') === edxFilterState.mode;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
    });
    renderEdxCards();
}

function setEdxLanguagePill(language) {
    edxFilterState.language = language || 'all';
    edxFilterState.page = 1;
    document.querySelectorAll('#language-pills .type-pill').forEach(b => {
        const active = (b.dataset.language || 'all') === edxFilterState.language;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
    });
    renderEdxCards();
}

function setEdxRankingPill(ranking) {
    edxFilterState.ranking = ranking || 'all';
    edxFilterState.page = 1;
    document.querySelectorAll('#ranking-pills .type-pill').forEach(b => {
        const active = (b.dataset.ranking || 'all') === edxFilterState.ranking;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
    });
    renderEdxCards();
}

function syncEdxFiltersFromLegacy() {
    const f = courseFilter;
    if (f.courseType && f.courseType !== 'all') {
        if (ALL_ACCESS_TYPES.includes(f.courseType)) {
            if (!edxFilterState.accessTypes.includes(f.courseType)) edxFilterState.accessTypes.push(f.courseType);
        } else if (ALL_TYPE_PILLS.includes(f.courseType)) {
            edxFilterState.typePill = f.courseType;
        }
    }
    if (f.domain && f.domain !== 'all' && ALL_DOMAIN_CHIPS.includes(f.domain)) {
        edxFilterState.domainChip = f.domain;
    }
    if (f.country && f.country !== 'all') {
        edxFilterState.country = f.country;
    }
    if (f.search && f.search.trim()) {
        edxFilterState.search = f.search.trim();
    }
}

function initEdxControls() {
    const typePills = document.getElementById('course-type-pills');
    if (typePills) {
        typePills.addEventListener('click', e => {
            const btn = e.target.closest('.type-pill');
            if (btn) setEdxTypePill(btn.dataset.type || 'all');
        });
    }

    const accessPills = document.getElementById('access-type-pills');
    if (accessPills) {
        accessPills.addEventListener('click', e => {
            const btn = e.target.closest('.type-pill');
            if (btn) setEdxAccessType(btn.dataset.access || '');
        });
    }

    const domainChips = document.getElementById('domain-chips-scroll');
    if (domainChips) {
        domainChips.addEventListener('click', e => {
            const btn = e.target.closest('.domain-chip');
            if (btn) setEdxDomainChip(btn.dataset.domain || 'all');
        });
    }

    const levelPills = document.getElementById('skill-level-pills');
    if (levelPills) {
        levelPills.addEventListener('click', e => {
            const btn = e.target.closest('.type-pill');
            if (btn) setEdxLevelPill(btn.dataset.level || 'all');
        });
    }

    const durationPills = document.getElementById('duration-pills');
    if (durationPills) {
        durationPills.addEventListener('click', e => {
            const btn = e.target.closest('.type-pill');
            if (btn) setEdxDurationPill(btn.dataset.duration || 'all');
        });
    }

    const modePills = document.getElementById('mode-pills');
    if (modePills) {
        modePills.addEventListener('click', e => {
            const btn = e.target.closest('.type-pill');
            if (btn) setEdxModePill(btn.dataset.mode || 'all');
        });
    }

    const languagePills = document.getElementById('language-pills');
    if (languagePills) {
        languagePills.addEventListener('click', e => {
            const btn = e.target.closest('.type-pill');
            if (btn) setEdxLanguagePill(btn.dataset.language || 'all');
        });
    }

    const rankingPills = document.getElementById('ranking-pills');
    if (rankingPills) {
        rankingPills.addEventListener('click', e => {
            const btn = e.target.closest('.type-pill');
            if (btn) setEdxRankingPill(btn.dataset.ranking || 'all');
        });
    }

    const countrySelect = document.getElementById('course-country-filter');
    if (countrySelect) {
        countrySelect.value = edxFilterState.country || 'all';
        countrySelect.addEventListener('change', e => {
            edxFilterState.country = e.target.value || 'all';
            courseFilter.country = edxFilterState.country;
            edxFilterState.page = 1;
            renderEdxCards();
        });
    }

    const searchInput = document.getElementById('course-search');
    if (searchInput) {
        searchInput.value = edxFilterState.search;
        searchInput.addEventListener('input', debounce(e => {
            edxFilterState.search = e.target.value;
            edxFilterState.page = 1;
            renderEdxCards();
        }, 200));
        searchInput.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                edxFilterState.search = '';
                searchInput.value = '';
                edxFilterState.page = 1;
                renderEdxCards();
            }
        });
    }

    const searchClear = document.getElementById('search-clear-btn');
    if (searchClear) {
        searchClear.addEventListener('click', () => {
            edxFilterState.search = '';
            if (searchInput) searchInput.value = '';
            edxFilterState.page = 1;
            renderEdxCards();
            if (searchInput) searchInput.focus();
        });
    }

    const sortSelect = document.getElementById('course-sort');
    if (sortSelect) {
        sortSelect.value = edxFilterState.sort;
        sortSelect.addEventListener('change', e => {
            edxFilterState.sort = e.target.value;
            edxFilterState.page = 1;
            renderEdxCards();
        });
    }

    const pageSizeSelect = document.getElementById('courses-page-size');
    if (pageSizeSelect) {
        pageSizeSelect.value = String(coursesPageSize);
        pageSizeSelect.addEventListener('change', e => {
            coursesPageSize = e.target.value;
            edxFilterState.page = 1;
            renderEdxCards();
        });
    }

    const viewGrid = document.getElementById('view-grid');
    const viewList = document.getElementById('view-list');
    if (viewGrid && viewList) {
        viewGrid.addEventListener('click', () => setCourseView('grid'));
        viewList.addEventListener('click', () => setCourseView('list'));
    }

    document.getElementById('edx-reset-filters')?.addEventListener('click', () => clearAllCourseFilters());

    initSidebarFilters();
    initSidebarAccordions();

    const pagination = document.getElementById('courses-pagination');
    if (pagination) {
        pagination.addEventListener('click', e => {
            const btn = e.target.closest('.pagination-btn');
            if (!btn) return;
            const page = btn.dataset.page;
            if (page) goToCoursePage(page);
        });
    }

    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        const onScroll = () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    initCourseKeyboardShortcuts();
}

function initSidebarFilters() {
    const workspace = document.getElementById('catalog-workspace');
    const sidebar = document.getElementById('catalog-sidebar');
    const btn = document.getElementById('catalog-sidebar-toggle');
    if (!workspace || !sidebar || !btn) return;

    const saved = localStorage.getItem('cvFiltersCollapsed') === '1';
    if (saved) workspace.classList.add('sidebar-collapsed');
    updateCollapseState();

    btn.addEventListener('click', () => {
        workspace.classList.toggle('sidebar-collapsed');
        localStorage.setItem('cvFiltersCollapsed', workspace.classList.contains('sidebar-collapsed') ? '1' : '0');
        updateCollapseState();
        updateCourseViewClass();
    });

    function updateCollapseState() {
        const collapsed = workspace.classList.contains('sidebar-collapsed');
        const icon = btn.querySelector('.sidebar-toggle-icon');
        if (icon) icon.textContent = collapsed ? '›' : '‹';
        btn.setAttribute('aria-expanded', String(!collapsed));
    }

    const clearBtn = document.getElementById('sidebar-clear-filters');
    if (clearBtn) clearBtn.addEventListener('click', () => clearAllCourseFilters());

    const mobileToggle = document.getElementById('catalog-mobile-toggle');
    const mobileOverlay = document.getElementById('catalog-mobile-overlay');

    function setFiltersOpen(open) {
        workspace.classList.toggle('filters-open', open);
        document.body.classList.toggle('filters-drawer-open', open);
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', String(open));
        if (mobileOverlay) mobileOverlay.setAttribute('aria-hidden', String(!open));
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    if (mobileToggle && workspace) {
        mobileToggle.addEventListener('click', () => {
            setFiltersOpen(!workspace.classList.contains('filters-open'));
        });
    }

    if (mobileOverlay && workspace) {
        mobileOverlay.addEventListener('click', () => setFiltersOpen(false));
    }

    sidebar.addEventListener('click', e => {
        const target = e.target;
        const isFilterClick = target.closest('.type-pill, .domain-chip, .country-filter-select, .accordion-trigger');
        if (!isFilterClick) return;
        const isAccordion = target.closest('.accordion-trigger');
        if (isAccordion) return;
        if (window.innerWidth <= 900 && workspace.classList.contains('filters-open')) {
            setTimeout(() => setFiltersOpen(false), 180);
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && workspace.classList.contains('filters-open')) {
            setFiltersOpen(false);
            if (mobileToggle) mobileToggle.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && workspace.classList.contains('filters-open')) {
            setFiltersOpen(false);
        }
    });
}

function initSidebarAccordions() {
    const sidebarBody = document.getElementById('catalog-sidebar-body');
    if (!sidebarBody) return;
    sidebarBody.addEventListener('click', e => {
        const trigger = e.target.closest('.accordion-trigger');
        if (!trigger) return;
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!expanded));
    });
}

function clearAllCourseFilters() {
    edxFilterState = {
        typePill: 'all', accessTypes: [], domainChip: 'all', levelPill: 'all',
        duration: 'all', mode: 'all', language: 'all', ranking: 'all',
        country: 'all', search: '', sort: 'relevance', view: edxFilterState.view, page: 1
    };
    courseFilter = { search: '', country: 'all', domain: 'all', qs: 'any', nirf: 'any', courseType: 'all' };
    syncEdxUIFromState();
    renderEdxCards();
}

function setCourseView(view) {
    if (edxFilterState.view === view) return;
    edxFilterState.view = view;
    document.querySelectorAll('.view-btn').forEach(b => {
        const active = b.id === 'view-' + view;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
    });
    updateCourseViewClass();
}

function applyViewToggleGlow(view) {
    const gridBtn = document.getElementById('view-grid');
    const listBtn = document.getElementById('view-list');
    if (!gridBtn || !listBtn) return;

    if (view === 'grid') {
        gridBtn.style.cssText = 'background:rgba(59,130,246,0.15)!important;color:#2563eb!important;';
        listBtn.style.cssText = 'background:transparent!important;color:inherit!important;';
    } else {
        listBtn.style.cssText = 'background:rgba(59,130,246,0.15)!important;color:#2563eb!important;';
        gridBtn.style.cssText = 'background:transparent!important;color:inherit!important;';
    }
}

function initCourseKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'SELECT' || active.isContentEditable)) return;

        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('global-search-input');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
            return;
        }

        if (e.key === 'Escape') {
            const searchInput = document.getElementById('course-search');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                edxFilterState.search = '';
                edxFilterState.page = 1;
                renderEdxCards();
            }
            return;
        }
    });
}

function debounce(fn, ms) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
    };
}

function scrollDomains(dx) {
    const el = document.getElementById('domain-chips-scroll');
    if (el) el.scrollBy({ left: dx, behavior: 'smooth' });
}

async function loadRichCatalog() {
    if (richCatalogMap) return richCatalogMap;
    try {
        const res = await fetch(CATALOG_RICH_JSON);
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        richCatalogMap = new Map();
        for (const c of list) {
            const id = Array.isArray(c.id) ? c.id[0] : c.id;
            const key = `${String(c.name || '').trim().toLowerCase()}::${String(c.university || '').trim().toLowerCase()}`;
            richCatalogMap.set(key, c);
            if (id) richCatalogMap.set(`id:${id}`, c);
        }
    } catch (e) {
        console.warn('Rich catalog load failed:', e);
        richCatalogMap = new Map();
    }
    return richCatalogMap;
}

function mergeRichFields(course) {
    if (!richCatalogMap) return course;
    const idKey = course.id ? `id:${course.id}` : null;
    const nameKey = `${String(course.name || '').trim().toLowerCase()}::${String(course.university || '').trim().toLowerCase()}`;
    const rich = (idKey && richCatalogMap.get(idKey)) || richCatalogMap.get(nameKey);
    let logo_url = rich.logo_url || course.logo_url || '';


    return {
        ...course,
        ...rich,
        id: course.id,
        domains: course.domains,
        raw_index: course.raw_index,
        logo_url: logo_url,
        banner_url: rich.banner_url || course.banner_url || '',
        skills_description: rich.skills_description || course.skills_description || course.skills || '',
        course_type: rich.course_type || course.course_type || normalizeDomain(course.domain) || 'Course',
        has_scholarship: !!(rich.has_scholarship || course.has_scholarship || course.scholarship_match),
        has_free: !!(rich.has_free || course.has_free || course.free_match),
        has_qs_badge: !!(rich.has_qs_badge || course.has_qs_badge),
        has_nirf_badge: !!(rich.has_nirf_badge || course.has_nirf_badge),
    };
}

async function loadAllCourses(force = false) {
    console.log('APP.JS VERSION: PATCHED WITH DOMAIN SLICING - IF THIS IS NOT IN THE CONSOLE, YOUR CACHE IS STALE');
    const row = document.getElementById('edx-cards-row');
    if (allCoursesData.length > 0 && !force) { renderEdxCards(); return; }
    if (row) row.innerHTML = renderSkeletonCards(12) + '<div class="courses-loading-text" aria-live="polite">Loading courses…</div>';
    showLoadingCurtain('Loading courses…');
    try {
        const [res] = await Promise.all([fetch(COURSES_JSON + '?v=' + Date.now()), loadRichCatalog()]);
        const data = await res.json();
        const raw = Array.isArray(data) ? data : data.courses || [];

        rawDomainCounts = { 'foundational': 0, 'network-infra': 0, 'system-endpoint': 0, 'forensics-ir': 0, 'data-app-security': 0, 'legal-compliance': 0 };
        const mappingKeys = { 'Foundational': 'foundational', 'Network Infrastructure': 'network-infra', 'System and Endpoint Security': 'system-endpoint', 'Cyber Forensics': 'forensics-ir', 'Application & Data Security': 'data-app-security', 'Legal & Ethical': 'legal-compliance' };
        (typeof rawData !== 'undefined' ? rawData : (typeof raw !== 'undefined' ? raw : [])).forEach(c => {
            if (Array.isArray(c.domains)) {
                c.domains.forEach(d => {
                    if (mappingKeys[d]) rawDomainCounts[mappingKeys[d]]++;
                });
            }
        });
        let expanded = [];
        raw.forEach(c => {
            if (Array.isArray(c.id)) {
                c.id.forEach((idVal, idx) => {
                    let newC = { ...c, id: idVal };
                    if (Array.isArray(c.domains) && c.domains.length > idx) {
                        newC.domains = [c.domains[idx]];
                    } else {
                        newC.domains = [];
                    }
                    expanded.push(newC);
                });
            } else {
                let newC = { ...c, raw_index: rawIndex };
                expanded.push(newC);
            }
        });
        allCoursesData = expanded.sort((a, b) => parseInt(a.id || '9') - parseInt(b.id || '9'));
        allCoursesData = allCoursesData.map(mergeRichFields);
        enrichAllCourses(allCoursesData);

        const stats = computeStats(allCoursesData);
        const countryCounts = computeCountryCounts(allCoursesData);
        const domainCounts = computeDomainCounts(allCoursesData);
        globalData = { status: 'success', documents: allCoursesData, stats, country_counts: countryCounts, domain_counts: domainCounts };

        refreshFilterOptions();
        populateCountryFilter();
        populateDynamicFilters();

        syncEdxFiltersFromLegacy();
        syncEdxUIFromState();
        setEdxTypePill(edxFilterState.typePill);
        setEdxDomainChip(edxFilterState.domainChip);
        renderEdxCards();
    } catch (e) {
        if (row) row.innerHTML = `<div class="edx-empty" style="color:var(--red);">Error loading courses.</div>`;
        console.error('loadAllCourses error:', e);
    } finally {
        hideLoadingCurtain();
    }
}

function renderCoursesPage() {
    renderEdxCards();
}

function applyCourseFilter() {
    currentPage = 1;
    syncEdxFiltersFromLegacy();
    syncEdxUIFromState();
    renderEdxCards();
}

function jumpToCourses(partial) {
    courseFilter = { search: '', country: 'all', domain: 'all', qs: 'any', nirf: 'any', courseType: 'all', ...partial };
    edxFilterState = {
        typePill: 'all', accessTypes: [], domainChip: 'all', levelPill: 'all', country: partial?.country || 'all',
        search: partial?.search ?? '', sort: 'relevance', view: edxFilterState.view, page: 1
    };
    if (partial && partial.domain && ALL_DOMAIN_CHIPS.includes(partial.domain)) {
        edxFilterState.domainChip = partial.domain;
    }
    if (partial && partial.courseType) {
        if (ALL_ACCESS_TYPES.includes(partial.courseType)) {
            edxFilterState.accessTypes = [partial.courseType];
        } else if (ALL_TYPE_PILLS.includes(partial.courseType)) {
            edxFilterState.typePill = partial.courseType;
        }
    }
    if (partial && partial.level) {
        edxFilterState.levelPill = partial.level;
    }
    if (partial && partial.country) {
        edxFilterState.country = partial.country;
    }
    setEdxTypePill(edxFilterState.typePill);
    setEdxDomainChip(edxFilterState.domainChip);
    setEdxLevelPill(edxFilterState.levelPill);
    syncEdxUIFromState();
    applyCourseFilter();
    const section = document.getElementById('all-courses-section');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initGlobalSearch() {
    const input = document.getElementById('global-search-input');
    const results = document.getElementById('global-search-results');
    if (!input || !results) return;

    input.addEventListener('input', debounce(() => renderGlobalSearch(input.value), 150));
    input.addEventListener('focus', () => {
        if (input.value.trim()) renderGlobalSearch(input.value);
    });
    input.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            input.value = '';
            results.classList.remove('open');
            results.innerHTML = '';
            input.blur();
        }
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            navigateGlobalSearchResults(e.key === 'ArrowDown' ? 1 : -1);
        }
        if (e.key === 'Enter') {
            const active = results.querySelector('.global-search-item.active');
            if (active) active.click();
            else doGlobalSearch(input.value.trim());
        }
    });

    document.addEventListener('click', e => {
        if (!document.getElementById('navbar-search').contains(e.target)) {
            results.classList.remove('open');
        }
    });
}

function renderGlobalSearch(query) {
    const results = document.getElementById('global-search-results');
    const q = query.trim().toLowerCase();
    if (!q) { results.classList.remove('open'); results.innerHTML = ''; return; }

    const pool = allCoursesData.length ? allCoursesData : (globalData?.documents || []);
    const matches = pool.map(c => {
        const name = (c.name || '').toLowerCase();
        const uni = (c.university || '').toLowerCase();
        const country = (c.country || '').toLowerCase();
        const domain = (c.domainLabel || getDomainCategory(c)).toLowerCase();
        const access = (c.accessType || '').toLowerCase();
        let score = 0;
        if (name.startsWith(q)) score += 100;
        else if (name.includes(q)) score += 50;
        if (uni.includes(q)) score += 30;
        if (country.includes(q)) score += 20;
        if (domain.includes(q)) score += 10;
        if (access.includes(q)) score += 10;
        return { c, score };
    }).filter(m => m.score > 0).sort((a, b) => b.score - a.score).slice(0, 8);

    if (!matches.length) {
        results.innerHTML = `<div class="global-search-empty">No matches for “${escHtml(q)}”</div>
            <div class="global-search-action" onclick="doGlobalSearch('${escHtml(q)}')">Search all courses →</div>`;
        results.classList.add('open');
        return;
    }

    results.innerHTML = matches.map((m, i) => `
        <div class="global-search-item ${i === 0 ? 'active' : ''}" data-index="${i}" tabindex="-1"
            onclick="openGlobalSearchResult('${m.c.id}')">
            <div class="global-search-item-title">${escHtml(m.c.name)}</div>
            <div class="global-search-item-meta">${escHtml(m.c.university || '—')} · ${escHtml(m.c.country || '—')} · ${getDomainCategory(m.c)}</div>
        </div>
    `).join('') + `
        <div class="global-search-action" onclick="doGlobalSearch('${escHtml(q)}')">View all ${matches.length === 8 ? 'matching' : ''} results →</div>`;
    results.classList.add('open');
}

function navigateGlobalSearchResults(dir) {
    const results = document.getElementById('global-search-results');
    const items = Array.from(results.querySelectorAll('.global-search-item'));
    if (!items.length) return;
    const active = results.querySelector('.global-search-item.active');
    let idx = active ? items.indexOf(active) : -1;
    idx = (idx + dir + items.length) % items.length;
    items.forEach(it => it.classList.remove('active'));
    items[idx].classList.add('active');
    items[idx].scrollIntoView({ block: 'nearest' });
}

function openGlobalSearchResult(id) {
    showCourseModal(id);
    const input = document.getElementById('global-search-input');
    const results = document.getElementById('global-search-results');
    if (input) input.value = '';
    if (results) { results.classList.remove('open'); results.innerHTML = ''; }
}

function doGlobalSearch(query) {
    if (!query) return;
    jumpToCourses({ search: query });
    const input = document.getElementById('global-search-input');
    const results = document.getElementById('global-search-results');
    if (input) input.value = '';
    if (results) { results.classList.remove('open'); results.innerHTML = ''; }
}

let onboardingState = { step: 1, level: null, domain: null, goal: null };
let onboardingHasOpened = false;

function initOnboarding() {
    const overlay = document.getElementById('onboarding-modal');
    const closeBtn = document.getElementById('onboarding-close');
    const nextBtn = document.getElementById('onboarding-next');
    const backBtn = document.getElementById('onboarding-back');
    const skipBtn = document.getElementById('onboarding-skip');
    const ctaBtn = document.getElementById('onboarding-cta');
    const helpBtn = document.getElementById('catalog-help-btn');
    if (!overlay) return;

    helpBtn?.addEventListener('click', () => openOnboarding(true));

    closeBtn?.addEventListener('click', closeOnboarding);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeOnboarding();
    });
    nextBtn?.addEventListener('click', onboardingNext);
    backBtn?.addEventListener('click', onboardingBack);
    skipBtn?.addEventListener('click', () => {
        closeOnboarding();
        const section = document.getElementById('all-courses-section');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    ctaBtn?.addEventListener('click', () => {
        closeOnboarding();
        const params = { level: onboardingState.level, domain: onboardingState.domain };
        const courseType = getOnboardingCourseType(onboardingState.goal);
        if (courseType) params.courseType = courseType;
        jumpToCourses(params);
    });

    document.querySelectorAll('.onboarding-option').forEach(btn => {
        btn.addEventListener('click', e => {
            const target = e.target.closest('.onboarding-option');
            if (!target) return;
            const step = target.closest('.onboarding-step')?.dataset.step;
            const stepSelector = `.onboarding-step[data-step="${step}"] .onboarding-option`;
            document.querySelectorAll(stepSelector).forEach(b => b.classList.remove('selected'));
            target.classList.add('selected');

            if (step === '1') {
                onboardingState.level = target.dataset.level || null;
            } else if (step === '2') {
                onboardingState.domain = target.dataset.domain || null;
            } else if (step === '3') {
                onboardingState.goal = target.dataset.goal || null;
            }
            onboardingNext();
        });
    });

    initWelcomeBanner();
}

function initWelcomeBanner() {
    const banner = document.getElementById('dash-welcome-banner');
    const closeBtn = document.getElementById('dash-welcome-close');
    const tourBtn = document.getElementById('dash-welcome-tour');
    if (!banner) return;

    if (localStorage.getItem('cvWelcomeDismissed')) {
        banner.classList.add('dismissed');
    }

    closeBtn?.addEventListener('click', () => {
        banner.classList.add('dismissed');
        localStorage.setItem('cvWelcomeDismissed', '1');
    });

    tourBtn?.addEventListener('click', () => {
        localStorage.setItem('cvWelcomeDismissed', '1');
        banner.classList.add('dismissed');
        openOnboarding(true);
    });
}

function openOnboarding(trackOpen = false) {
    const overlay = document.getElementById('onboarding-modal');
    if (!overlay) return;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    onboardingState = { step: 1, level: null, domain: null, goal: null };
    document.querySelectorAll('.onboarding-option').forEach(b => b.classList.remove('selected'));
    renderOnboardingStep(1);
    trapFocus(overlay);
    document.addEventListener('keydown', onboardingEscapeHandler);
    if (trackOpen) localStorage.setItem('cvOnboardingSeen', '1');
}

function closeOnboarding() {
    const overlay = document.getElementById('onboarding-modal');
    if (overlay) {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        releaseFocus(overlay);
    }
    localStorage.setItem('cvOnboardingSeen', '1');
    document.removeEventListener('keydown', onboardingEscapeHandler);
}

function onboardingEscapeHandler(e) {
    if (e.key === 'Escape') closeOnboarding();
}

function onboardingNext() {
    if (onboardingState.step === 1 && !onboardingState.level) return;
    if (onboardingState.step === 2 && !onboardingState.domain) return;
    if (onboardingState.step === 3 && !onboardingState.goal) return;
    if (onboardingState.step < 4) {
        onboardingState.step++;
        renderOnboardingStep(onboardingState.step);
    } else {
        closeOnboarding();
    }
}

function onboardingBack() {
    if (onboardingState.step > 1) {
        onboardingState.step--;
        renderOnboardingStep(onboardingState.step);
    }
}

function renderOnboardingStep(step) {
    onboardingState.step = step;
    document.querySelectorAll('.onboarding-step').forEach(s => s.classList.toggle('active', parseInt(s.dataset.step, 10) === step));
    document.querySelectorAll('.onboarding-dots .dot').forEach(d => d.classList.toggle('active', parseInt(d.dataset.step, 10) === step));

    const backBtn = document.getElementById('onboarding-back');
    const nextBtn = document.getElementById('onboarding-next');
    if (backBtn) backBtn.disabled = step === 1;
    if (nextBtn) nextBtn.textContent = step === 4 ? 'Done' : 'Next';

    if (step === 4) {
        const title = document.getElementById('onboarding-result-title');
        const text = document.getElementById('onboarding-result-text');
        const tags = document.getElementById('onboarding-result-tags');
        const level = onboardingState.level || 'Any level';
        const domain = onboardingState.domain || 'All domains';
        const goalLabel = {
            career: 'Career growth',
            upskill: 'Quick upskill',
            degree: 'Degree path',
            cert: 'Certification prep'
        }[onboardingState.goal] || 'General browse';

        const effectiveCourseType = getOnboardingCourseType(onboardingState.goal);
        const count = allCoursesData.filter(c =>
            (!onboardingState.level || getSkillLevel(c) === onboardingState.level) &&
            (!onboardingState.domain || getDomainCategory(c) === onboardingState.domain) &&
            (!effectiveCourseType || matchTypePill(c, effectiveCourseType))
        ).length;

        if (title) title.textContent = `${count} course${count === 1 ? '' : 's'} for your pathway`;
        const rolePhrase = {
            'Beginner': 'starting out',
            'Intermediate': 'building on the basics',
            'Advanced': 'leveling up'
        }[level] || 'exploring';
        const domainPhrase = domain === 'All domains' ? 'cybersecurity' : domain;
        const goalPhrase = goalLabel.toLowerCase();
        if (text) text.textContent = `You’re ${rolePhrase} in ${domainPhrase} and aiming for ${goalPhrase}. These verified courses are matched to move you toward that goal.`;
        if (tags) {
            tags.innerHTML = `
                <span class="onboarding-result-tag"><span class="tag-dot" style="background:${getDomainColor(onboardingState.domain)}"></span>${escHtml(level)}</span>
                <span class="onboarding-result-tag"><span class="tag-dot" style="background:${getDomainColor(onboardingState.domain)}"></span>${escHtml(domain)}</span>
                <span class="onboarding-result-tag"><span class="tag-dot"></span>${escHtml(goalLabel)}</span>
            `;
        }
    }
}

function getOnboardingCourseType(goal) {
    if (!goal) return null;
    if (goal === 'upskill' || goal === 'cert') return 'Certificate';
    // career and degree use the broader level+domain view; degree users can then pick Bachelor's / Master's / Diploma
    return null;
}

function getDomainColor(domain) {
    const map = {
        'Foundational': '#14b8a6',
        'Network Infrastructure': '#6366f1',
        'System & Endpoint': '#06b6d4',
        'Cyber Forensics': '#8b5cf6',
        'Data & Application': '#f43f5e',
        'Legal & Ethical': '#f59e0b'
    };
    return map[domain] || '#22D3EE';
}

// ================================================================
//  MODAL
// ================================================================
function buildCourseDetails(c) {
    const langRow = (c.pdf_table || []).find(r => r.attribute === 'Language');
    const rows = [
        { label: 'University', value: c.university },
        { label: 'Domain', value: c.domain },
        { label: 'Domain Category', value: getDomainCategory(c) },
        { label: 'Country', value: c.country },
        { label: 'Cost', value: c.cost },
        { label: 'Duration', value: c.duration },
        { label: 'Mode', value: c.mode },
        { label: 'Skills', value: c.skills },
        { label: 'QS Ranked', value: c.has_qs_badge ? 'Yes' : 'No' },
        { label: 'NIRF Ranked', value: c.has_nirf_badge ? 'Yes' : 'No' },
    ];
    if (langRow && langRow.original) rows.push({ label: 'Language', value: langRow.original });

    return `<div style="display:grid; grid-template-columns:minmax(120px, 30%) 1fr; gap:12px 16px;">
        ${rows.map(r => `
            <div style="color:var(--text-3); font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; padding-top:4px;">${escHtml(r.label)}</div>
            <div style="color:var(--text-1); font-size:0.9rem; line-height:1.4;">${escHtml(r.value) || '—'}</div>
        `).join('')}
    </div>`;
}

async function showCourseModal(courseId, fallbackName, fallbackUni) {
    if (allCoursesData.length === 0) {
        try {
            const [res] = await Promise.all([fetch(COURSES_JSON + '?v=' + Date.now()), loadRichCatalog()]);
            const data = await res.json();
            const raw = Array.isArray(data) ? data : data.courses || [];

            rawDomainCounts = { 'foundational': 0, 'network-infra': 0, 'system-endpoint': 0, 'forensics-ir': 0, 'data-app-security': 0, 'legal-compliance': 0 };
            const mappingKeys = { 'Foundational': 'foundational', 'Network Infrastructure': 'network-infra', 'System and Endpoint Security': 'system-endpoint', 'Cyber Forensics': 'forensics-ir', 'Application & Data Security': 'data-app-security', 'Legal & Ethical': 'legal-compliance' };
            (typeof rawData !== 'undefined' ? rawData : (typeof raw !== 'undefined' ? raw : [])).forEach(c => {
                if (Array.isArray(c.domains)) {
                    c.domains.forEach(d => {
                        if (mappingKeys[d]) rawDomainCounts[mappingKeys[d]]++;
                    });
                }
            });
            let expanded = [];
            raw.forEach(c => {
                if (Array.isArray(c.id)) {
                    c.id.forEach((idVal, idx) => {
                        let newC = { ...c, id: idVal };
                        if (Array.isArray(c.domains) && c.domains.length > idx) {
                            newC.domains = [c.domains[idx]];
                        } else {
                            newC.domains = [];
                        }
                        expanded.push(newC);
                    });
                } else {
                    expanded.push(c);
                }
            });
            allCoursesData = expanded.sort((a, b) => parseInt(a.id || '9') - parseInt(b.id || '9'));
            allCoursesData = allCoursesData.map(mergeRichFields);
            enrichAllCourses(allCoursesData);
            refreshFilterOptions();
        } catch (e) { return; }
    }
    let c = allCoursesData.find(x => String(x.id) === String(courseId));
    if (!c && fallbackName) c = allCoursesData.find(x => x.name === fallbackName && (x.university || '') === (fallbackUni || ''));
    if (!c) { showToast('Course not found', 'error'); return; }

    const domain = getDomainCategory(c);
    const accentMap = {
        'Foundational': 'accent-teal',
        'Network Infrastructure': 'accent-indigo',
        'System & Endpoint': 'accent-cyan',
        'Cyber Forensics': 'accent-violet',
        'Data & Application': 'accent-rose',
        'Legal & Ethical': 'accent-amber'
    };
    const hdr = document.getElementById('modal-hdr');
    if (hdr) {
        hdr.className = 'modal-hdr';
        if (accentMap[domain]) hdr.classList.add(accentMap[domain]);
    }

    document.getElementById('modal-course-title').textContent = c.name;
    document.getElementById('modal-body').innerHTML = buildCourseDetails(c);

    const primary = document.getElementById('modal-primary');
    if (primary) {
        const url = getCourseUrl(c);
        primary.href = url;
        primary.textContent = (url && url !== '#') ? '↗ Visit course website' : 'No external link available';
        primary.style.display = 'inline-flex';
        primary.classList.toggle('disabled', !url || url === '#');
    }

    const modal = document.getElementById('course-modal');
    modal.classList.add('open');
    trapFocus(modal);
    document.body.style.overflow = 'hidden';
}

function closeCourseModal() {
    const modal = document.getElementById('course-modal');
    if (modal) {
        modal.classList.remove('open');
        releaseFocus(modal);
    }
    document.body.style.overflow = '';
}

function recomputeAndRender() {
    const stats = computeStats(allCoursesData);
    const countryCounts = computeCountryCounts(allCoursesData);
    const domainCounts = computeDomainCounts(allCoursesData);
    globalData = { status: 'success', documents: allCoursesData, stats, country_counts: countryCounts, domain_counts: domainCounts };
    updateCards(stats);
    updateCountryLeaderboard(countryCounts, 'country-list');
    updateDashboardExtras(globalData);
    applyCourseFilter();
    if (currentFilter.type) applyFilter(currentFilter.type, currentFilter.value);
}

function initModal() {
    const modal = document.getElementById('course-modal');
    const closeBtn = document.getElementById('close-modal');
    const secondaryBtn = document.getElementById('modal-secondary');

    closeBtn?.addEventListener('click', closeCourseModal);
    secondaryBtn?.addEventListener('click', closeCourseModal);

    modal?.addEventListener('click', e => {
        if (e.target === modal) closeCourseModal();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal?.classList.contains('open')) {
            closeCourseModal();
        }
    });

    // Suggestion overlay close
    const suggest = document.getElementById('suggest-overlay');
    const suggestClose = document.getElementById('suggest-close');
    suggestClose?.addEventListener('click', () => suggest?.classList.remove('open'));
    suggest?.addEventListener('click', e => { if (e.target === suggest) suggest.classList.remove('open'); });
}

function trapFocus(container) {
    const focusable = Array.from(container.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(el => el.offsetParent !== null);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first.focus();
    container._focusTrap = e => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };
    container.addEventListener('keydown', container._focusTrap);
}

function releaseFocus(container) {
    if (container && container._focusTrap) {
        container.removeEventListener('keydown', container._focusTrap);
        delete container._focusTrap;
    }
}

// ================================================================
//  DATA FETCH FROM LOCAL JSON
// ================================================================
function computeStats(courses) {
    return { total: courses.length };
}

function computeCountryCounts(courses) {
    const counts = {};
    courses.forEach(c => {
        if (c.country && isValidCountry(c.country)) {
            counts[c.country] = (counts[c.country] || 0) + 1;
        }
    });
    return counts;
}

function computeDomainCounts(courses) {
    const counts = {};
    const seen = new Set();
    courses.forEach(c => {
        const key = c.raw_index !== undefined ? c.raw_index : String(c.id);
        if (!seen.has(key)) {
            seen.add(key);
            if (Array.isArray(c.domains)) {
                c.domains.forEach(d => {
                    if (d && d !== 'Other' && d !== 'Uncategorised') {
                        counts[d] = (counts[d] || 0) + 1;
                    }
                });
            }
        }
    });
    return counts;
}

async function fetchData() {
    if (!globalData) document.body.dataset.loading = 'true';
    showLoadingCurtain('Loading course data…');
    try {
        const [res] = await Promise.all([fetch(COURSES_JSON + '?v=' + Date.now()), loadRichCatalog()]);
        const data = await res.json();
        const rawData = Array.isArray(data) ? data : data.courses || [];


        rawDomainCounts = { 'foundational': 0, 'network-infra': 0, 'system-endpoint': 0, 'forensics-ir': 0, 'data-app-security': 0, 'legal-compliance': 0 };
        const mappingKeys = { 'Foundational': 'foundational', 'Network Infrastructure': 'network-infra', 'System and Endpoint Security': 'system-endpoint', 'Cyber Forensics': 'forensics-ir', 'Application & Data Security': 'data-app-security', 'Legal & Ethical': 'legal-compliance' };
        (typeof rawData !== 'undefined' ? rawData : (typeof raw !== 'undefined' ? raw : [])).forEach(c => {
            if (Array.isArray(c.domains)) {
                c.domains.forEach(d => {
                    if (mappingKeys[d]) rawDomainCounts[mappingKeys[d]]++;
                });
            }
        });
        let expanded = [];
        rawData.forEach((c, rawIndex) => {
            if (Array.isArray(c.id)) {
                c.id.forEach((idVal, idx) => {
                    let newC = { ...c, id: idVal, raw_index: rawIndex };
                    if (Array.isArray(c.domains) && c.domains.length > idx) {
                        newC.domains = [c.domains[idx]];
                    } else {
                        newC.domains = [];
                    }
                    expanded.push(newC);
                });
            } else {
                let newC = { ...c, raw_index: rawIndex };
                expanded.push(newC);
            }
        });
        allCoursesData = expanded.sort((a, b) => parseInt(a.id || '9') - parseInt(b.id || '9'));
        allCoursesData = allCoursesData.map(mergeRichFields);
        enrichAllCourses(allCoursesData);

        const stats = computeStats(allCoursesData);
        const countryCounts = computeCountryCounts(allCoursesData);
        const domainCounts = computeDomainCounts(allCoursesData);
        globalData = { status: 'success', documents: allCoursesData, stats, country_counts: countryCounts, domain_counts: domainCounts };

        const animate = firstDataFetch;
        firstDataFetch = false;
        _applyData(globalData, animate);
        populateCountryFilter();
        populateDynamicFilters();

        // Render the All Courses grid when the section exists on this page.
        if (document.getElementById('all-courses-section')) {
            loadAllCourses();
        }
    } catch (e) {
        console.error('Data fetch error:', e);
    } finally {
        document.body.dataset.loading = 'false';
        hideLoadingCurtain();
    }
}

function _applyData(data, animate) {
    if (!data || data.status !== 'success') return;

    const statsHash = JSON.stringify(data.stats);
    const countryHash = JSON.stringify(data.country_counts);

    if (statsHash !== lastStatsHash) {
        updateCards(data.stats);
        lastStatsHash = statsHash;
    }
    if (countryHash !== lastCountryHash) {
        updateCountryLeaderboard(data.country_counts, 'country-list');
        refreshGlobeMarkersAndArcs(data.country_counts);
        lastCountryHash = countryHash;
    }
    updateDashboardExtras(data);
    if (currentFilter.type) applyFilter(currentFilter.type, currentFilter.value);
    document.body.dataset.loading = 'false';
}

// ================================================================
//  HELPERS
// ================================================================
function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escJs(str) {
    if (!str) return '';
    return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

/**
 * Animate a number from 0 to target, optionally formatting the final value.
 * Accepts an element id or an HTMLElement.
 */
function countUp(targetOrEl, targetValue, finalText = null, duration = 800) {
    const el = typeof targetOrEl === 'string' ? document.getElementById(targetOrEl) : targetOrEl;
    if (!el) return;
    const start = performance.now();
    const startValue = 0;
    function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const ease = 1 - Math.pow(1 - p, 3);
        const current = Math.round(startValue + (targetValue - startValue) * ease);
        el.textContent = current.toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
        else if (finalText !== null) el.textContent = finalText;
    }
    requestAnimationFrame(tick);
}

// ================================================================
//  INIT
// ================================================================
// app.js is loaded with `defer`, so the DOM is already ready here.
initGlobe();
initFilters();
initModal();
initEdxControls();
initGlobalSearch();
initOnboarding();
initStickyFilterBar();
initDashboardClickableMetrics();
// initDomainFeedObserver removed — domain feed is rendered on dashboard scroll instead

fetchData();

// ================================================================
//  BATCH 2-4 UI POLISH — Navbar, Dashboard, Globe, Cards
// ================================================================

function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    function update() {
        const doc = document.documentElement;
        const scroll = doc.scrollTop || document.body.scrollTop;
        const height = doc.scrollHeight - doc.clientHeight;
        const pct = height > 0 ? (scroll / height) * 100 : 0;
        bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
}

function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn') || document.getElementById('hamburger');
    const drawer = document.getElementById('mobile-nav-drawer');
    if (!btn || !drawer) return;

    function toggle() {
        const open = drawer.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    }

    btn.addEventListener('click', toggle);
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        drawer.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
    }));

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) toggle();
    });
}

function initNavbarKeyboardNav() {
    const tabs = Array.from(document.querySelectorAll('#nav-tabs a'));
    tabs.forEach((a, i) => {
        a.addEventListener('keydown', e => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const next = tabs[(i + 1) % tabs.length];
                next.focus();
                next.click();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prev = tabs[(i - 1 + tabs.length) % tabs.length];
                prev.focus();
                prev.click();
            }
        });
    });
}

function updateNavbarAria() {
    document.querySelectorAll('#nav-tabs a, .catalog-tabbar a').forEach(a => {
        const active = a.classList.contains('active');
        a.setAttribute('aria-current', active ? 'page' : 'false');
    });
}

function initGlobeControls() {
    const resetBtn = document.getElementById('globe-reset-btn');
    const fsBtn = document.getElementById('globe-fullscreen-btn');
    const container = document.getElementById('globe-container');

    if (resetBtn && globeInstance?.pointOfView) {
        resetBtn.addEventListener('click', () => {
            globeInstance.pointOfView({ lat: 20.5937, lng: 78.9629, altitude: 2.1 }, 800);
        });
    }

    if (fsBtn && container) {
        fsBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                container.requestFullscreen?.().catch(() => { });
            } else {
                document.exitFullscreen?.().catch(() => { });
            }
        });
    }
}

function initCountryPanelShortcuts() {
    const panel = document.getElementById('course-details-panel');
    const clearBtn = document.getElementById('clear-filter');
    if (!panel) return;
    if (clearBtn) {
        clearBtn.addEventListener('click', () => resetCountrySelection());
    }
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && panel.style.display !== 'none') {
            resetCountrySelection();
        }
    });
}

function initDashboardCountUp() {
    // Observe when metric values change and animate them once.
    const ids = ['total-count', 'india-stat-count', 'dash-iit-count', 'dash-iiit-count', 'dash-nit-count', 'dash-free-count', 'dash-fta-count', 'dash-hvlc-count'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        let done = false;
        const obs = new MutationObserver(() => {
            if (done || el.textContent === '0' || el.textContent === '—') return;
            done = true;
            el.style.transition = 'transform 0.3s var(--ease-spring)';
            el.style.transform = 'scale(1.12)';
            setTimeout(() => el.style.transform = 'scale(1)', 300);
            obs.disconnect();
        });
        obs.observe(el, { childList: true, subtree: true, characterData: true });
    });
}

// Run the new polish initializers after the existing ones.
initScrollProgress();
initMobileMenu();
initNavbarKeyboardNav();
initGlobeControls();
initCountryPanelShortcuts();
initDashboardCountUp();


// ================================================================
//  CHART HELPERS (used by Dashboard Insights)
// ================================================================






function renderDashboardInsights() { /* analytics removed */ }

function updateDashboardCharts() { /* analytics removed */ }

function renderDomainCards(gridId, sectionId) {
    const grid = document.getElementById(gridId);
    const section = document.getElementById(sectionId);
    if (!grid) return;
    if (grid.dataset.rendered === 'true') return;
    grid.dataset.rendered = 'true';

    grid.innerHTML = CYBER_DOMAINS_DATA.map((d, i) => {
        const slug = DOMAIN_SLUG_MAP[d.filterDomain] || 'other';
        const pills = (d.courseTypes || []).map(t =>
            `<button class="domain-type-pill" onclick="event.stopPropagation(); jumpToCourses({courseType:'${escJs(t)}', domain:'${escJs(d.filterDomain)}'})" title="Show ${escHtml(t)} courses in ${escHtml(d.title)}">${escHtml(t)}</button>`
        ).join('');
        const skills = (d.skills || []).slice(0, 5).map(s =>
            `<span class="domain-skill">${escHtml(s)}</span>`
        ).join('');
        const roles = (d.roles || []).slice(0, 3).join(' • ');
        return `
        <article class="domain-card" data-domain="${escHtml(slug)}" style="--domain-color:${escHtml(d.color)}; animation: fadeStagger 0.5s ease ${i * 0.08}s both;" onclick="jumpToCourses({domain:'${escJs(d.filterDomain)}'})" tabindex="0" role="button" aria-label="Explore ${escHtml(d.title)} courses">
            <div class="domain-card-hdr">
                <div class="domain-icon" style="color:${escHtml(d.color)}; border-color:${escHtml(d.color)}40; background:${escHtml(d.color)}14;">${d.icon}</div>
                <div class="domain-card-title-wrap">
                    <div class="domain-card-title">${escHtml(d.title)}</div>
                    <div class="domain-card-roles">${escHtml(roles)}</div>
                </div>
            </div>
            <div class="domain-summary">${escHtml(d.summary)}</div>
            ${skills ? `<div class="domain-section">
                <div class="domain-section-label">Top Skills</div>
                <div class="domain-skills">${skills}</div>
            </div>` : ''}
            <div class="domain-actions">
                <button class="domain-primary-btn" onclick="event.stopPropagation(); jumpToCourses({domain:'${escJs(d.filterDomain)}'})">Explore ${escHtml(d.title)} Courses</button>
                <div class="domain-types">${pills}</div>
            </div>
        </article>`;
    }).join('');

    // Sync active highlight after initial render
    highlightDomainExplorerCard(edxFilterState.domainChip);

    if (section) {
        section.classList.add('domain-visible');
        section.style.opacity = '1';
    }
}

function initDomainExplorer() {
    const dashboardSection = document.getElementById('domain-info-section');
    const dashboardGrid = document.getElementById('domain-cards-grid');

    if (dashboardSection && dashboardGrid) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) renderDomainCards('domain-cards-grid', 'domain-info-section');
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
        obs.observe(dashboardSection);
        if (dashboardSection.getBoundingClientRect().top < window.innerHeight) {
            renderDomainCards('domain-cards-grid', 'domain-info-section');
        }

        dashboardGrid.addEventListener('keydown', e => {
            const card = e.target.closest('.domain-card');
            if (!card) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    }
}

// ================================================================
//  BATCH 9-10 — MICRO-INTERACTIONS, ACCESSIBILITY, ANNOUNCEMENTS
// ================================================================

function createLiveRegion() {
    if (document.getElementById('live-region')) return;
    const el = document.createElement('div');
    el.id = 'live-region';
    el.className = 'sr-only';
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
    document.body.appendChild(el);
}

function announce(message) {
    createLiveRegion();
    const el = document.getElementById('live-region');
    if (el) {
        el.textContent = '';
        // small delay so screen readers notice the change
        requestAnimationFrame(() => { el.textContent = message; });
    }
}

function initRipple() {
    const selectors = '.btn-view-details, .modal-btn.primary, .modal-btn.secondary, .edx-reset-btn, .type-pill, .domain-chip, .chip-scroll-btn, .view-btn, .pagination-btn, .card-action-btn, .row-action';
    document.querySelectorAll(selectors).forEach(btn => btn.classList.add('ripple'));
    document.addEventListener('click', e => {
        const btn = e.target.closest('.ripple');
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
}

function initMagneticButtons() {
    document.querySelectorAll('.btn-view-details, .modal-btn.primary').forEach(btn => {
        btn.classList.add('magnetic');
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const dx = e.clientX - rect.left - rect.width / 2;
            const dy = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${dx * 0.12}px, ${dy * 0.12}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

function initBatch9And10() {
    createLiveRegion();
    initRipple();
    initMagneticButtons();
    initDomainExplorer();
}

initBatch9And10();

window.toggleSavedFilter = function () {
    edxFilterState.showSavedOnly = !edxFilterState.showSavedOnly;
    edxFilterState.page = 1;
    const bmBtn = document.getElementById('navBookmarkBtn');
    if (edxFilterState.showSavedOnly) {
        document.body.classList.add('showing-saved-only');
        if (bmBtn) bmBtn.classList.add('active-glow');
        showToast('Showing bookmarked courses');
    } else {
        document.body.classList.remove('showing-saved-only');
        if (bmBtn) bmBtn.classList.remove('active-glow');
        showToast('Showing all courses');
    }
    renderEdxCards();
};



// NAV BOOKMARK BTN LOGIC
document.addEventListener('DOMContentLoaded', () => {
    const navBookmarkBtn = document.getElementById('navBookmarkBtn');
    if(navBookmarkBtn) {
        navBookmarkBtn.addEventListener('click', () => {
            edxFilterState.showSavedOnly = !edxFilterState.showSavedOnly;
            if(edxFilterState.showSavedOnly) {
                navBookmarkBtn.classList.add('active-glow');
            } else {
                navBookmarkBtn.classList.remove('active-glow');
            }
            applyCourseFilter();
        });
        
        // Initial state

    }
});

// Update toggleFavorite to handle the top nav heart
const originalToggleFavorite = toggleFavorite;
toggleFavorite = function(id, btn) {
    originalToggleFavorite(id, btn);
    const navBookmarkBtn = document.getElementById('navBookmarkBtn');
    if(navBookmarkBtn) {

    }
};
