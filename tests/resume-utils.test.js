const test = require('node:test');
const assert = require('node:assert/strict');

const {
  safeArray,
  getCompanyName,
  getAboutSummary,
  listCertifications,
  findCertification,
} = require('../resume-utils.js');

test('safeArray returns array input or fallback empty array', () => {
  assert.deepEqual(safeArray(['a', 'b']), ['a', 'b']);
  assert.deepEqual(safeArray(undefined), []);
  assert.deepEqual(safeArray(null), []);
  assert.deepEqual(safeArray('not-an-array'), []);
  assert.deepEqual(safeArray({ length: 2 }), []);
});

test('getCompanyName prefers company and falls back safely', () => {
  assert.equal(getCompanyName({ company: 'State Farm' }), 'State Farm');
  assert.equal(getCompanyName({ name: 'Legacy Key' }), 'Legacy Key');
  assert.equal(getCompanyName({}), 'Unspecified company');
});

test('getAboutSummary provides fallback when basics.summary is missing', () => {
  assert.equal(
    getAboutSummary({ basics: { summary: 'Hands-on security engineer.' } }),
    'Hands-on security engineer.'
  );
  assert.equal(
    getAboutSummary({ basics: { name: 'David Diaz' } }),
    'David Diaz is a cybersecurity professional focused on offensive security and practical risk reduction.'
  );
  assert.equal(
    getAboutSummary({}),
    'Cybersecurity professional focused on offensive security and practical risk reduction.'
  );
});

test('listCertifications normalizes certifications array schema', () => {
  const resumeData = {
    certifications: [
      { title: 'OSCP', awarder: 'Offensive Security', date: 'Nov 2020' },
      { title: 'OSWE', awarder: 'Offensive Security', date: 'Nov 2023' },
    ],
  };

  const certifications = listCertifications(resumeData);
  assert.equal(certifications.length, 2);
  assert.deepEqual(certifications[0], {
    title: 'OSCP',
    issuer: 'Offensive Security',
    date: 'Nov 2020',
    verify_url: '',
    accredible_id: '',
    summary: '',
  });
});

test('listCertifications supports legacy certificates object schema', () => {
  const resumeData = {
    certificates: {
      oscp: {
        title: 'OSCP',
        issuer: 'Offensive Security',
        verify_url: 'https://example.test/oscp',
        accredible_id: 'ABC123',
      },
    },
  };

  const certifications = listCertifications(resumeData);
  assert.equal(certifications.length, 1);
  assert.equal(certifications[0].title, 'OSCP');
  assert.equal(certifications[0].issuer, 'Offensive Security');
  assert.equal(certifications[0].verify_url, 'https://example.test/oscp');
  assert.equal(certifications[0].accredible_id, 'ABC123');
});

test('listCertifications supports awards array schema from JSON resume', () => {
  const resumeData = {
    awards: [
      {
        title: 'OSWE',
        awarder: 'Offensive Security',
        date: 'Nov 2023',
        summary: 'Advanced web application testing',
      },
    ],
  };

  const certifications = listCertifications(resumeData);
  assert.equal(certifications.length, 1);
  assert.equal(certifications[0].title, 'OSWE');
  assert.equal(certifications[0].issuer, 'Offensive Security');
  assert.equal(certifications[0].summary, 'Advanced web application testing');
});

test('findCertification matches case-insensitive partial title', () => {
  const certifications = [
    { title: 'OSCP', issuer: 'Offensive Security' },
    { title: 'eWPT', issuer: 'INE Security' },
  ];

  assert.equal(findCertification(certifications, 'os').title, 'OSCP');
  assert.equal(findCertification(certifications, 'wpt').title, 'eWPT');
  assert.equal(findCertification(certifications, 'does-not-exist'), null);
});
