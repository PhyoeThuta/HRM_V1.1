async function check() {
  const htmlRes = await fetch('https://bbd-hrm.aiautono.io/track/180');
  const html = await htmlRes.text();
  const match = html.match(/src="(\/assets\/index-[^"]*\.js)"/);
  if (!match) return console.log('JS bundle not found in HTML');
  const jsUrl = 'https://bbd-hrm.aiautono.io' + match[1];
  const jsRes = await fetch(jsUrl);
  const js = await jsRes.text();
  if (js.includes('AIza')) {
    console.log('API KEY FOUND IN BUNDLE!');
  } else {
    console.log('API KEY MISSING IN BUNDLE!');
  }
}
check();
