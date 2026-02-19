(function initResumeUtils(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  root.resumeUtils = api;
})(typeof globalThis !== 'undefined' ? globalThis : window, () => {
  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function sanitizeDisplayText(value) {
    const text = value == null ? '' : String(value);
    return text
      .replace(/[\u0000-\u001f\u007f]+/g, ' ')
      .replace(/`([^`]*)`/g, '$1')
      .replace(/^[\s•*-]+/, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function isLikelyEasterEggText(text = '') {
    const normalized = sanitizeDisplayText(text).toLowerCase();
    return (
      normalized.includes('pty.spawn') ||
      normalized.includes("let's open a tty") ||
      normalized.includes('open a tty')
    );
  }

  function getDisplayEducationEntries(resumeData = {}) {
    return safeArray(resumeData.education)
      .filter((education) => {
        const combined = [
          education?.institution,
          education?.studyType,
          education?.area,
          education?.location,
        ]
          .map(sanitizeDisplayText)
          .join(' ');

        return !isLikelyEasterEggText(combined);
      })
      .map((education) => ({
        ...education,
        institution: sanitizeDisplayText(education?.institution),
        studyType: sanitizeDisplayText(education?.studyType),
        area: sanitizeDisplayText(education?.area),
        location: sanitizeDisplayText(education?.location),
        startDate: sanitizeDisplayText(education?.startDate),
        endDate: sanitizeDisplayText(education?.endDate),
        courses: safeArray(education?.courses).map(sanitizeDisplayText).filter(Boolean),
      }));
  }

  function isHttpUrl(url = '') {
    const candidate = sanitizeDisplayText(url);
    if (!candidate) {
      return false;
    }

    try {
      const parsed = new URL(candidate);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  function getCompanyName(job = {}) {
    return job.company || job.name || 'Unspecified company';
  }

  function getAboutSummary(resumeData = {}) {
    const summary = resumeData.basics?.summary;
    if (summary && summary.trim()) {
      return summary.trim();
    }

    const name = resumeData.basics?.name;
    if (name && name.trim()) {
      return `${name.trim()} is a cybersecurity professional focused on offensive security and practical risk reduction.`;
    }

    return 'Cybersecurity professional focused on offensive security and practical risk reduction.';
  }

  function normalizeCertification(cert = {}) {
    return {
      title: cert.title || 'Untitled certification',
      issuer: cert.issuer || cert.awarder || 'Unspecified issuer',
      date: cert.date || '',
      verify_url: cert.verify_url || cert.verifyUrl || '',
      accredible_id: cert.accredible_id || cert.credentialId || '',
      summary: cert.summary || '',
    };
  }

  function listCertifications(resumeData = {}) {
    if (Array.isArray(resumeData.certifications)) {
      return resumeData.certifications.map(normalizeCertification);
    }

    if (Array.isArray(resumeData.awards)) {
      return resumeData.awards.map(normalizeCertification);
    }

    if (resumeData.certificates && typeof resumeData.certificates === 'object') {
      return Object.values(resumeData.certificates).map(normalizeCertification);
    }

    return [];
  }

  function getVerifyCommandSuggestions(certifications = [], limit = 6) {
    const seen = new Set();

    return safeArray(certifications)
      .map((cert) => sanitizeDisplayText(cert?.title))
      .filter((title) => {
        if (!title) {
          return false;
        }
        const key = title.toLowerCase();
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      })
      .slice(0, Math.max(0, limit))
      .map((title) => `verify ${title}`);
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

  return {
    safeArray,
    sanitizeDisplayText,
    getDisplayEducationEntries,
    isHttpUrl,
    getCompanyName,
    getAboutSummary,
    listCertifications,
    getVerifyCommandSuggestions,
    findCertification,
  };
});
