(async () => {
  const version = new URL(location.href).searchParams.get('version') || 'current';
  const scriptPath = version === 'old' ? '/tests/previous-v7.txt' : '/clean-google-search.user.js';
  const source = await (await fetch(scriptPath)).text();
  document.getElementById('source').textContent = source;
  const cases = ['base', 'german', 'missing', 'ambiguous', 'dynamic'];
  const results = [];
  for (const testCase of cases) {
    const frame = document.createElement('iframe');
    frame.style.cssText = 'width:900px;height:700px';
    const result = new Promise(resolve => {
      const listener = event => {
        if (event.source !== frame.contentWindow || event.data?.kind !== 'test-result') return;
        window.removeEventListener('message', listener); resolve(event.data);
      };
      window.addEventListener('message', listener);
    });
    frame.src = '/search?case=' + testCase + '&version=' + version;
    document.body.append(frame);
    results.push(await result);
    frame.remove();
  }
  const assertions = results.flatMap(r => r.assertions);
  const report = {version, passed:assertions.filter(a => a.pass).length, failed:assertions.filter(a => !a.pass).length, results};
  document.getElementById('report').textContent = JSON.stringify(report, null, 2);
})();
