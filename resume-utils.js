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
    getCompanyName,
    getAboutSummary,
    listCertifications,
    findCertification,
  };
});
