const test = require('node:test');
const assert = require('node:assert/strict');

const {
  safeArray,
  sanitizeDisplayText,
  isHttpUrl,
  getCompanyName,
  listCertifications,
  getVerifyCommandSuggestions,
  getClosestCertificationSuggestions,
  findCertification,
} = require('../resume-utils.js');

test('safeArray returns array input or fallback empty array', () => {
  assert.deepEqual(safeArray(['a', 'b']), ['a', 'b']);
  assert.deepEqual(safeArray(undefined), []);
  assert.deepEqual(safeArray('not-an-array'), []);
});

test('sanitizeDisplayText removes markdown/backtick clutter and bullet prefixes', () => {
  assert.equal(
    sanitizeDisplayText("  • Python: `python -c 'import pty; pty.spawn(\"/bin/bash\")'`  "),
    "Python: python -c 'import pty; pty.spawn(\"/bin/bash\")'"
  );
  assert.equal(sanitizeDisplayText('\n\t  Hello   world \r\n'), 'Hello world');
});

test('isHttpUrl returns true only for valid http/https urls', () => {
  assert.equal(isHttpUrl('https://credentials.offsec.com/example'), true);
  assert.equal(isHttpUrl('Disney GitLab'), false);
  assert.equal(isHttpUrl('ftp://example.com'), false);
});

test('getCompanyName uses company or a fallback', () => {
  assert.equal(getCompanyName({ company: 'State Farm' }), 'State Farm');
  assert.equal(getCompanyName({}), 'Unspecified company');
});

test('listCertifications reads awards', () => {
  const certifications = listCertifications({
    awards: [
      { title: 'OSWE', awarder: 'Offensive Security', date: 'Nov 2023', summary: 'Advanced web' },
    ],
  });
  assert.equal(certifications.length, 1);
  assert.deepEqual(certifications[0], {
    title: 'OSWE',
    issuer: 'Offensive Security',
    date: 'Nov 2023',
    verify_url: '',
    summary: 'Advanced web',
  });
});

test('getVerifyCommandSuggestions builds unique sanitized verify commands', () => {
  assert.deepEqual(
    getVerifyCommandSuggestions([
      { title: 'OSWE' },
      { title: '  • `OSCP`  ' },
      { title: 'oswe' },
      { title: '' },
    ]),
    ['verify OSWE', 'verify OSCP']
  );
});

test('getClosestCertificationSuggestions returns matches or first N', () => {
  const certifications = [
    { title: 'OSWE' },
    { title: 'eWPT' },
    { title: 'OSCP' },
    { title: 'Splunk-CCU' },
  ];
  assert.deepEqual(getClosestCertificationSuggestions(certifications, 'os', 3), ['OSWE', 'OSCP']);
  assert.deepEqual(getClosestCertificationSuggestions(certifications, 'nope', 3), ['OSWE', 'eWPT', 'OSCP']);
});

test('findCertification matches case-insensitive partial title', () => {
  const certifications = [
    { title: 'OSCP', issuer: 'Offensive Security' },
    { title: 'eWPT', issuer: 'INE Security' },
  ];
  assert.equal(findCertification(certifications, 'os').title, 'OSCP');
  assert.equal(findCertification(certifications, 'does-not-exist'), null);
});
