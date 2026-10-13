async function check() {
  try {
    const htmlRes = await fetch('https://bbd-hrm.aiautono.io/track/180');
    const html = await htmlRes.text();
    const match = html.match(/src="(\/assets\/index-[^"]*\.js)"/);
    if (!match) return console.log('JS bundle not found in HTML');
    const jsUrl = 'https://bbd-hrm.aiautono.io' + match[1];
    const jsRes = await fetch(jsUrl);
    const js = await jsRes.text();
    const keyMatch = js.match(/AIza[a-zA-Z0-9\-_]*/);
    if (keyMatch) {
      console.log('EXACT API KEY FOUND IN BUNDLE:', keyMatch[0]);
    } else {
      console.log('API KEY MISSING IN BUNDLE!');
    }
  } catch (err) {
    console.error(err);
  }
}
check();
