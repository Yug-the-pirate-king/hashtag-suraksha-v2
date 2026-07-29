/* ================================================================
   COURSEVERIFY CATALOG  ·  APP.JS  v9  (static JSON edition)
   Loads courses directly from courses.json in the same folder.
   Dashboard uses a local COBE WebGL globe.
   No backend server required.
   ================================================================ */

'use strict';

const COURSES_JSON = 'assets/courses.json';
const CATALOG_RICH_JSON = 'assets/course_catalog.json';

// ── State ────────────────────────────────────────────────────────
let globalData = null;
let richCatalogMap = null;
let currentFilter = { type: null, value: null };
let countryDataList = [];
let allCoursesData = [];
let currentPage = 1;
const PAGE_SIZE = 100;
let lastStatsHash = '';
let lastCountryHash = '';

let firstDataFetch = true;

// ── Tab filter state ─────────────────────────────────────────────
let courseFilter = { search: '', country: 'all', domain: 'all', qs: 'any', nirf: 'any', courseType: 'all' };

// ── edX All Courses filter state ────────────────────────────────────
let coursesPageSize = 12;
function getCoursesPageSize() {
    if (coursesPageSize === 'all') return Infinity;
    const n = parseInt(coursesPageSize, 10);
    return isNaN(n) || n < 1 ? 12 : n;
}
const favoriteCourses = new Set(JSON.parse(localStorage.getItem('cv_favorites') || '[]'));
let edxFilterState = {
    typePill: 'all',    // course type from #course-type-pills
    accessTypes: [],    // multi-select access types from #access-type-pills
    domainChip: 'all',  // domain category from #domain-chips-scroll
    levelPill: 'all',   // skill level from #skill-level-pills
    country: 'all',     // country filter (e.g. from globe/metrics)
    search: '',
    sort: 'relevance',
    view: 'grid',
    page: 1
};

function getSkillLevel(course) {
    // Infer skill level from access type, course type, and domain.
    const type = course.accessType || normalizeDomain(course.domain);
    const courseType = normalizeDomain(course.domain);
    const domain = getDomainCategory(course.id);
    const beginnerTypes = ['Free', 'Free to Audit', 'Certificate'];
    const advancedTypes = ["Bachelor's Degree", "Master's Degree"];
    if (beginnerTypes.includes(type) || beginnerTypes.includes(courseType)) return 'Beginner';
    if (advancedTypes.includes(type) || advancedTypes.includes(courseType)) return 'Advanced';
    if (domain === 'Foundational') return 'Beginner';
    if (domain === 'Data & Application' || domain === 'Legal & Ethical') return 'Intermediate';
    return 'Intermediate';
}

function matchLevelPill(course, level) {
    if (level === 'all') return true;
    return getSkillLevel(course) === level;
}

// ── Domain category by course idx (ID number) ───────────────────
const DOMAIN_RANGES = [
    { label: 'Free', min: 1, max: 25 },
    { label: 'Free to Audit', min: 26, max: 48 },
    { label: 'High Value Low Cost', min: 49, max: 100 },
    { label: 'Foundational', min: 101, max: 601 },
    { label: 'Network Infrastructure', min: 602, max: 1585 },
    { label: 'System & Endpoint', min: 1586, max: 1890 },
    { label: 'Cyber Forensics', min: 1891, max: 2634 },
    { label: 'Data & Application', min: 2635, max: 2965 },
    { label: 'Legal & Ethical', min: 2966, max: 3727 },
];

function getDomainCategory(idxRaw) {
    const idx = parseInt(idxRaw, 10);
    if (isNaN(idx)) return 'Uncategorised';
    for (const r of DOMAIN_RANGES) {
        if (idx >= r.min && idx <= r.max) return r.label;
    }
    return 'Uncategorised';
}

const ALL_DOMAIN_LABELS = DOMAIN_RANGES.map(r => r.label);

// ════════════════════════════════════════════════════════════════
//  CYBERSECURITY DOMAIN KNOWLEDGE DATA
// ════════════════════════════════════════════════════════════════
const CYBER_DOMAINS_DATA = [
    {
        id: 'foundational',
        title: 'Foundational',
        icon: '🧱',
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
        icon: '🌐',
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
        icon: '💻',
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
        icon: '🔍',
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
        icon: '🗄️',
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
    const norm = normalizeDomain(course.domain);
    if (ACCESS_TYPES.includes(norm)) return norm;
    return 'Paid';
}

function getDomainSlug(course) {
    const cat = getDomainCategory(course.id);
    return DOMAIN_SLUG_MAP[cat] || 'other';
}

function getDomainLabel(course) {
    return SLUG_LABEL_MAP[getDomainSlug(course)] || getDomainCategory(course.id);
}

function enrichCourse(course) {
    course.skillLevel = getSkillLevel(course);
    course.accessType = getAccessType(course);
    course.domainSlug = getDomainSlug(course);
    course.domainLabel = getDomainLabel(course);
    return course;
}

function enrichAllCourses(courses) {
    courses.forEach(enrichCourse);
    return courses;
}

// ── Country flag emoji helper ─────────────────────────────────────
const FLAG_MAP = {
    'India': '🇮🇳', 'United States': '🇺🇸', 'Australia': '🇦🇺',
    'United Kingdom': '🇬🇧', 'Canada': '🇨🇦', 'Germany': '🇩🇪',
    'France': '🇫🇷', 'Singapore': '🇸🇬', 'South Africa': '🇿🇦',
    'New Zealand': '🇳🇿', 'UAE': '🇦🇪', 'China': '🇨🇳',
    'Japan': '🇯🇵', 'Netherlands': '🇳🇱', 'Switzerland': '🇨🇭',
    'Brazil': '🇧🇷', 'Italy': '🇮🇹', 'Spain': '🇪🇸',
    'Ireland': '🇮🇪', 'Sweden': '🇸🇪', 'Denmark': '🇩🇰',
};
function getFlag(name) {
    if (!name) return '🌐';
    for (const [key, flag] of Object.entries(FLAG_MAP)) {
        if (name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(name.toLowerCase())) return flag;
    }
    return '🌐';
}

// ================================================================
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

// Read a CSS custom property from :root as a hex string (or fallback).
function getCssHex(name, fallback) {
    try {
        const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        return raw || fallback;
    } catch (e) {
        return fallback;
    }
}

const GLOBE_THEMES = {
    dark: {
        // Ocean white, continents dark charcoal.  COBE's map texture is colored by
        // mapBrightness; with dark=0 the baseColor is the ocean, and a low positive
        // mapBrightness makes the landmasses visible as a dark grey shape.
        base: '#FFFFFF',
        bg: '#0B1113',
        halo: getCssHex('--globe-halo', '#3FBE85'),
        marker: getCssHex('--globe-marker', '#3FBE85'),
        arc: getCssHex('--globe-arc', '#F0954A'),
        dark: 0,
        diffuse: 0.6,
        mapBrightness: 1.5,
        mapBaseBrightness: 0.02
    },
    light: {
        // Ocean: warm neutral so the globe matches the paper palette.
        base: getCssHex('--globe-base', '#E4E0D2'),
        bg: getCssHex('--globe-bg', '#F6F3EA'),
        halo: getCssHex('--globe-halo', '#1C8F5D'),
        marker: getCssHex('--globe-marker', '#1C8F5D'),
        arc: getCssHex('--globe-arc', '#D9720F'),
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
    const initialMarkerColor = hexToRgb01(getCssHex('--globe-marker', '#1C8F5D'));
    const initialArcColor = hexToRgb01(getCssHex('--globe-arc', '#D9720F'));
    cobeMarkers = markerEntries.map(([name, [lat, lng]], i) => ({
        id: 'cobe-' + i,
        location: [lat, lng],
        size: 0.022,
        color: initialMarkerColor
    }));

    const arcs = generateDenseArcData().map((arc, i) => ({
        id: 'arc-' + i,
        from: [arc.startLat, arc.startLng],
        to: [arc.endLat, arc.endLng],
        color: initialArcColor
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
        const dom = getDomainCategory(c.id) || 'Other';
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
        if (badgeType === 'qs') return `<span class="table-rank-badge qs">🌟 ${escHtml(val)}</span>`;
        if (badgeType === 'nirf') return `<span class="table-rank-badge nirf">🇮🇳 ${escHtml(val)}</span>`;
        return escHtml(val);
    }

    tbody.innerHTML = courses.length === 0
        ? `<tr class="empty-row">
            <td colspan="5" class="empty-state">
                <div class="empty-icon">📭</div>
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
                        <button class="row-action" title="View details" aria-label="View details" onclick="event.stopPropagation(); showCourseModal('${c.id}')">👁</button>
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
        const key = name;
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
    if (document.getElementById('country-detail-flag')) document.getElementById('country-detail-flag').textContent = '🔬';

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
        if (f.domain !== 'all' && getDomainCategory(c.id) !== f.domain) return false;
        if (f.courseType !== 'all' && normalizeDomain(c.domain) !== f.courseType) return false;
        if (f.qs === 'yes' && !c.has_qs_badge) return false;
        if (f.qs === 'no' && c.has_qs_badge) return false;
        if (f.nirf === 'yes' && !c.has_nirf_badge) return false;
        if (f.nirf === 'no' && c.has_nirf_badge) return false;
        if (q && !`${c.name} ${c.university || ''} ${c.country || ''} ${c.domain || ''} ${getDomainCategory(c.id)} ${normalizeDomain(c.domain)}`.toLowerCase().includes(q)) return false;
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
const ALL_TYPE_PILLS = [
    "All", "Bachelor's Degree", "Master's Degree", "Post Graduate Diploma",
    "Post Graduate Certificate", "Diploma", "Certificate"
];

const ALL_ACCESS_TYPES = ['Free', 'Free to Audit', 'High Value Low Cost'];

const ALL_DOMAIN_CHIPS = [
    "Featured", "Foundational", "Network Infrastructure", "System & Endpoint",
    "Cyber Forensics", "Data & Application", "Legal & Ethical"
];

function matchTypePill(course, pill) {
    if (pill === 'all' || pill === 'All') return true;
    const norm = normalizeDomain(course.domain);
    return norm === pill;
}

function matchAccessTypes(course, types) {
    if (!types || types.length === 0) return true;
    return types.includes(course.accessType);
}

function matchDomainChip(course, chip) {
    if (chip === 'all' || chip === 'Featured') return true;
    if (course.domainSlug && chip === course.domainSlug) return true;
    return getDomainCategory(course.id) === chip;
}

function matchCountry(course, country) {
    if (!country || country === 'all') return true;
    return isSameCountry(course.country, country);
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
    }
    return result;
}

function getEdxFilteredBase(exclude = {}) {
    const state = { ...edxFilterState, ...exclude };
    const q = (state.search || '').trim().toLowerCase();
    let result = allCoursesData.filter(c =>
        matchTypePill(c, state.typePill) &&
        matchAccessTypes(c, state.accessTypes) &&
        matchDomainChip(c, state.domainChip) &&
        matchLevelPill(c, state.levelPill) &&
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

    const typeCounts = {};
    const accessCounts = {};
    const domainCounts = {};
    const levelCounts = {};

    document.querySelectorAll('#course-type-pills .type-pill').forEach(b => {
        const type = b.dataset.type || 'all';
        typeCounts[type] = typeBase.filter(c => matchTypePill(c, type)).length;
    });
    document.querySelectorAll('#access-type-pills .type-pill').forEach(b => {
        const access = b.dataset.access || '';
        accessCounts[access] = accessBase.filter(c => c.accessType === access).length;
    });
    document.querySelectorAll('#domain-chips-scroll .domain-chip').forEach(b => {
        const domain = b.dataset.domain || 'all';
        domainCounts[domain] = domainBase.filter(c => matchDomainChip(c, domain)).length;
    });
    document.querySelectorAll('#skill-level-pills .type-pill').forEach(b => {
        const level = b.dataset.level || 'all';
        levelCounts[level] = levelBase.filter(c => matchLevelPill(c, level)).length;
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
        btn.textContent = saved ? '♥' : '♡';
    }
    const card = document.querySelector(`.clean-course-card[data-course-id="${CSS.escape(key)}"]`);
    if (card) card.classList.toggle('saved', saved);
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
    if (course.has_qs_badge && course.has_nirf_badge) return `<span class="rank-pill dual">🏆 DUAL RANKED</span>`;
    if (course.has_qs_badge) return `<span class="rank-pill qs">🌟 QS RANKED</span>`;
    if (course.has_nirf_badge) return `<span class="rank-pill nirf">🇮🇳 NIRF RANKED</span>`;
    return '';
}

function renderSkeletonCards(count = 12) {
    return Array.from({ length: count }, () => `
        <article class="clean-course-card skeleton-card" aria-hidden="true">
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

    const all = getEdxFilteredCourses();
    const total = all.length;
    if (countEl) countEl.textContent = `${total.toLocaleString()} course${total === 1 ? '' : 's'}`;
    updateHeroState(total);

    renderActiveFilterChips();

    if (total === 0) {
        row.innerHTML = `
            <div class="edx-empty">
                <div class="edx-empty-icon" aria-hidden="true">🔍</div>
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
    const start = (page - 1) * pageSize;
    const pageCourses = all.slice(start, start + pageSize);

    row.innerHTML = pageCourses.map((c, i) => {
        const initials = getUniversityInitials(c.university);
        const access = getAccessPill(c);
        const duration = formatDurationShort(c);
        const mode = formatMode(c);
        const rank = getRankPill(c);
        const flag = getFlag(c.country);
        const cid = String(c.id);
        const saved = favoriteCourses.has(cid);
        const level = c.skillLevel || getSkillLevel(c);
        const levelClass = level.toLowerCase();
        const courseType = normalizeDomain(c.domain) || 'Course';
        const domainClass = DOMAIN_CLASS_MAP[c.domainSlug] || '';
        const verifiedBadge = (c.has_qs_badge || c.has_nirf_badge) ? `<span class="verified-badge" title="Verified by ranking">✓ Verified</span>` : '';
        const hasBanner = c.banner_url && c.banner_url.trim() !== '';
        const hasLogo = c.logo_url && c.logo_url.trim() !== '';
        const stampClass = c.stamp === 'hot' ? 'hot' : (c.stamp === 'jobskills' ? 'jobskills' : '');
        const stampLabel = c.stamp === 'hot' ? 'Hot Pick' : (c.stamp === 'jobskills' ? 'Job Skills' : '');
        const badges = [];
        if (c.has_qs_badge) badges.push('<span class="badge qs">QS Ranked</span>');
        if (c.has_nirf_badge) badges.push('<span class="badge nirf">NIRF</span>');
        if (c.scholarship_match || c.has_scholarship) badges.push('<span class="badge scholar">Scholarship</span>');
        badges.push(`<span class="badge">${escHtml(courseType)}</span>`);
        badges.push(`<span class="badge">${escHtml(level)}</span>`);
        badges.push(`<span class="badge ${access.cls}">${escHtml(access.label || access.text || '')}</span>`);
        const costClass = ((c.cost && c.cost.toLowerCase() === 'free') || c.free_match || c.has_free) ? 'free' : '';
        const skillsDesc = c.skills_description || c.skills || '';
        return `
        <article class="clean-course-card card ${saved ? 'saved' : ''} ${domainClass}" style="animation: fadeStagger 0.4s ease ${i * 0.04}s both;" data-course-id="${c.id}" tabindex="0" role="button" aria-label="Open ${escHtml(c.name)}">
            <div class="card-banner ${hasBanner ? '' : 'no-image'}" ${hasBanner ? `style="background-image:url('${escHtml(c.banner_url)}')"` : ''} onclick="showCourseModal('${c.id}')">
                <div class="logo-wrap ${hasLogo ? 'has-logo' : ''}" onclick="event.stopPropagation();">
                    ${hasLogo ? `<img src="${c.logo_url}" alt="${escHtml(c.university)} logo" loading="lazy" onerror="this.parentNode.classList.remove('has-logo'); this.style.display='none';" />` : ''}
                    <span class="logo-fallback">${escHtml(initials)}</span>
                </div>
                ${stampClass ? `<span class="stamp ${stampClass}">${stampLabel}</span>` : ''}
            </div>
            <div class="card-body" onclick="showCourseModal('${c.id}')">
                <div class="uni-name">
                    ${escHtml(c.university || '—')}
                    <span class="country">${flag} ${escHtml(c.country || '—')}</span>
                </div>
                <h3 class="course-title" title="${escHtml(c.name)}">${escHtml(c.name)}</h3>
                <p class="skills-desc">${escHtml(skillsDesc)}</p>
                <div class="badge-row">${badges.join('')}</div>
                <div class="meta-row">
                    <span>${escHtml(duration)} · ${escHtml(mode)} · ${escHtml(c.course_type || courseType || 'Course')}</span>
                    <span class="cost ${costClass}">${escHtml(c.cost || '—')}</span>
                </div>
                <div class="card-footer-actions" style="display:flex; gap:8px; margin-top:auto;">
                    <button class="btn" style="flex:1;" onclick="event.stopPropagation(); showCourseModal('${c.id}')">View Details</button>
                    <button class="btn btn-save ${saved ? 'saved' : ''}" style="width:44px;" onclick="event.stopPropagation(); toggleFavorite('${c.id}', this)" title="${saved ? 'Remove from saved' : 'Save course'}" aria-label="${saved ? 'Remove from saved' : 'Save course'}" aria-pressed="${saved}">${saved ? '♥' : '♡'}</button>
                </div>
            </div>
        </article>`;
    }).join('');

    // Wire keyboard activation for cards
    row.querySelectorAll('.clean-course-card[data-course-id]').forEach(card => {
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showCourseModal(card.dataset.courseId);
            }
        });
    });

    renderPagination(page, total);
    updateCourseViewClass();
    updateFilterCounts();
}

function renderPagination(currentPage, total) {
    const el = document.getElementById('courses-pagination');
    const metaEl = document.getElementById('courses-pagination-meta');
    const wrapEl = document.getElementById('courses-pagination-wrap');
    if (!el) return;

    const pageSize = getCoursesPageSize();
    const isAll = pageSize === Infinity;
    const pages = isAll ? 1 : Math.ceil(total / pageSize);
    const start = total === 0 ? 0 : (isAll ? 1 : (currentPage - 1) * pageSize + 1);
    const end = isAll ? total : Math.min(currentPage * pageSize, total);

    if (metaEl) metaEl.textContent = `Showing ${start.toLocaleString()}–${end.toLocaleString()} of ${total.toLocaleString()} courses`;
    if (wrapEl) wrapEl.classList.toggle('has-pagination', pages > 1);

    if (pages <= 1) { el.innerHTML = ''; return; }

    const cp = Math.max(1, Math.min(currentPage, pages));
    const addPage = (p, label = p) =>
        `<button class="pagination-btn ${p === cp ? 'active' : ''}" data-page="${p}" aria-label="Page ${p}" ${p === cp ? 'aria-current="true"' : ''}>${label}</button>`;
    const addEllipsis = () => `<span class="pagination-btn ellipsis" aria-hidden="true">…</span>`;

    let html = `<button class="pagination-btn" data-page="first" aria-label="First page" ${cp <= 1 ? 'disabled' : ''}>«</button>`;
    html += `<button class="pagination-btn" data-page="prev" aria-label="Previous page" ${cp <= 1 ? 'disabled' : ''}>‹</button>`;

    if (pages <= 7) {
        for (let i = 1; i <= pages; i++) html += addPage(i);
    } else {
        html += addPage(1);
        if (cp > 3) html += addEllipsis();

        const start = Math.max(2, cp - 1);
        const end = Math.min(pages - 1, cp + 1);
        for (let i = start; i <= end; i++) html += addPage(i);

        if (cp < pages - 2) html += addEllipsis();
        html += addPage(pages);
    }

    html += `<button class="pagination-btn" data-page="next" aria-label="Next page" ${cp >= pages ? 'disabled' : ''}>›</button>`;
    html += `<button class="pagination-btn" data-page="last" aria-label="Last page" ${cp >= pages ? 'disabled' : ''}>»</button>`;
    el.innerHTML = html;
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
    const row = document.getElementById('edx-cards-row');
    if (row) row.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    row.classList.toggle('list-view', edxFilterState.view === 'list');
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
        relevance: 'Relevance', name: 'Name A–Z', nameDesc: 'Name Z–A', country: 'Country A–Z', qs: 'QS Ranked first'
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
    if (key === 'country') { edxFilterState.country = 'all'; courseFilter.country = 'all'; }
    if (key === 'sort') edxFilterState.sort = 'relevance';
    edxFilterState.page = 1;
    syncEdxUIFromState();
    renderEdxCards();
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
    document.querySelectorAll('.courses-view-toggle .view-btn').forEach(b => {
        const active = b.id === `view-${edxFilterState.view}`;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
    });
    const countrySelect = document.getElementById('course-country-filter');
    if (countrySelect) countrySelect.value = edxFilterState.country || 'all';
    highlightDomainExplorerCard(edxFilterState.domainChip);
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
        b.setAttribute('aria-pressed', String(active));
    });
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
        b.setAttribute('aria-pressed', String(active));
    });
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

function syncEdxFiltersFromLegacy() {
    // If legacy courseFilter has values, reflect them in the new pill bars.
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
            // Prevent background scrolling on mobile
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

    // Close drawer when selecting a filter on mobile
    sidebar.addEventListener('click', e => {
        const target = e.target;
        const isFilterClick = target.closest('.type-pill, .domain-chip, .country-filter-select, .accordion-trigger');
        if (!isFilterClick) return;
        const isAccordion = target.closest('.accordion-trigger');
        if (isAccordion) return; // keep accordion toggles working
        if (window.innerWidth <= 900 && workspace.classList.contains('filters-open')) {
            // Small delay so the user sees the selection register
            setTimeout(() => setFiltersOpen(false), 180);
        }
    });

    // Close on escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && workspace.classList.contains('filters-open')) {
            setFiltersOpen(false);
            if (mobileToggle) mobileToggle.focus();
        }
    });

    // Reset drawer state on desktop resize
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
    edxFilterState = { typePill: 'all', accessTypes: [], domainChip: 'all', levelPill: 'all', country: 'all', search: '', sort: 'relevance', view: edxFilterState.view, page: 1 };
    courseFilter = { search: '', country: 'all', domain: 'all', qs: 'any', nirf: 'any', courseType: 'all' };
    syncEdxUIFromState();
    renderEdxCards();
}

function setCourseView(view) {
    edxFilterState.view = view;
    document.querySelectorAll('.courses-view-toggle .view-btn').forEach(b => {
        const active = b.id === `view-${view}`;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
    });
    updateCourseViewClass();
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

        if (/^[1-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const chips = Array.from(document.querySelectorAll('#domain-chips-scroll .domain-chip'));
            const idx = parseInt(e.key, 10) - 1;
            if (chips[idx]) {
                e.preventDefault();
                chips[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                setEdxDomainChip(chips[idx].dataset.domain || 'all');
            }
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
    if (!rich) return course;
    return {
        ...course,
        logo_url: rich.logo_url || course.logo_url || '',
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
    const row = document.getElementById('edx-cards-row');
    if (allCoursesData.length > 0 && !force) { renderEdxCards(); return; }
    if (row) row.innerHTML = renderSkeletonCards(12) + `<div class="courses-loading-text" aria-live="polite">Loading courses…</div>`;
    showLoadingCurtain('Loading courses…');
    try {
        const [res] = await Promise.all([fetch(COURSES_JSON), loadRichCatalog()]);
        const data = await res.json();
        allCoursesData = (Array.isArray(data) ? data : data.courses || []).sort((a, b) => parseInt(a.id || '9') - parseInt(b.id || '9'));
        allCoursesData = allCoursesData.map(mergeRichFields);
        enrichAllCourses(allCoursesData);

        // Build globalData here too, so Dashboard Insights can render even if the
        // initial fetchData() hasn't finished or failed.
        const stats = computeStats(allCoursesData);
        const countryCounts = computeCountryCounts(allCoursesData);
        const domainCounts = computeDomainCounts(allCoursesData);
        globalData = { status: 'success', documents: allCoursesData, stats, country_counts: countryCounts, domain_counts: domainCounts };


        refreshFilterOptions();
        populateCountryFilter();
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
    // Kept for compatibility with legacy callers; the edX grid is the live view.
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

// ================================================================
//  GLOBAL NAVBAR SEARCH
// ================================================================
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
        const domain = (c.domainLabel || getDomainCategory(c.id)).toLowerCase();
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
            <div class="global-search-item-meta">${escHtml(m.c.university || '—')} · ${escHtml(m.c.country || '—')} · ${getDomainCategory(m.c.id)}</div>
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

// ================================================================
//  ONBOARDING QUIZ
// ================================================================
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

    // Persistent help / restart tour button
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

    if (!localStorage.getItem('cvOnboardingSeen') && !onboardingHasOpened) {
        onboardingHasOpened = true;
        setTimeout(() => openOnboarding(false), 900);
    }

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
            (!onboardingState.domain || getDomainCategory(c.id) === onboardingState.domain) &&
            (!effectiveCourseType || matchTypePill(c, effectiveCourseType))
        ).length;

        if (title) title.textContent = `${count} recommended course${count === 1 ? '' : 's'}`;
        if (text) text.textContent = `Based on ${level.toLowerCase()} courses in ${domain.toLowerCase()} for ${goalLabel.toLowerCase()}.`;
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
        { label: 'Domain Category', value: getDomainCategory(c.id) },
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
            const [res] = await Promise.all([fetch(COURSES_JSON), loadRichCatalog()]);
            const data = await res.json();
            allCoursesData = Array.isArray(data) ? data : data.courses || [];
            allCoursesData = allCoursesData.map(mergeRichFields);
            enrichAllCourses(allCoursesData);
            refreshFilterOptions();
        } catch (e) { return; }
    }
    let c = allCoursesData.find(x => String(x.id) === String(courseId));
    if (!c && fallbackName) c = allCoursesData.find(x => x.name === fallbackName && (x.university || '') === (fallbackUni || ''));
    if (!c) { showToast('Course not found', 'error'); return; }

    const domain = getDomainCategory(c.id);
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
    courses.forEach(c => {
        const cat = getDomainCategory(c.id);
        if (cat && cat !== 'Uncategorised') counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
}

async function fetchData() {
    if (!globalData) document.body.dataset.loading = 'true';
    showLoadingCurtain('Loading course data…');
    try {
        const [res] = await Promise.all([fetch(COURSES_JSON + '?v=' + Date.now()), loadRichCatalog()]);
        const data = await res.json();
        allCoursesData = (Array.isArray(data) ? data : data.courses || []).sort((a, b) => parseInt(a.id || '9') - parseInt(b.id || '9'));
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