function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function sanitizeDisplayText(value) {
  const text = value == null ? '' : String(value);
  return text
    .replace(/[\u0000-\u001f\u007f-\u009f]+/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/^[\s•*-]+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isHttpUrl(url = '') {
  try {
    const parsed = new URL(sanitizeDisplayText(url));
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function getCompanyName(job = {}) {
  return job.company || 'Unspecified company';
}

function uniqueTitles(certifications) {
  const seen = new Set();
  const titles = [];
  safeArray(certifications).forEach((cert) => {
    const title = sanitizeDisplayText(cert?.title);
    const key = title.toLowerCase();
    if (title && !seen.has(key)) {
      seen.add(key);
      titles.push(title);
    }
  });
  return titles;
}

function listCertifications(resumeData = {}) {
  return safeArray(resumeData.awards).map((cert) => ({
    title: cert.title || 'Untitled certification',
    issuer: cert.awarder || 'Unspecified issuer',
    date: cert.date || '',
    verify_url: cert.verify_url || '',
    summary: cert.summary || '',
  }));
}

function getVerifyCommandSuggestions(certifications = [], limit = 3) {
  return uniqueTitles(certifications)
    .slice(0, Math.max(0, limit))
    .map((title) => `verify ${title}`);
}

function getClosestCertificationSuggestions(certifications = [], query = '', limit = 3) {
  const titles = uniqueTitles(certifications);
  const needle = sanitizeDisplayText(query).toLowerCase();
  const matches = needle
    ? titles.filter((title) => title.toLowerCase().includes(needle))
    : titles;
  return (matches.length ? matches : titles).slice(0, Math.max(0, limit));
}

function findCertification(certifications, query = '') {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return null;
  }
  return (
    certifications.find((cert) => {
      const title = (cert.title || '').toLowerCase();
      const issuer = (cert.issuer || '').toLowerCase();
      return title.includes(needle) || issuer.includes(needle);
    }) || null
  );
}

var resumeUtils = {
  safeArray,
  sanitizeDisplayText,
  isHttpUrl,
  getCompanyName,
  listCertifications,
  getVerifyCommandSuggestions,
  getClosestCertificationSuggestions,
  findCertification,
};

if (typeof module === 'object' && module.exports) {
  module.exports = resumeUtils;
}
