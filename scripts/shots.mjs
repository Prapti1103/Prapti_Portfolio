import { chromium } from 'playwright-core';
const sites = [
  ['court-translator','https://punecourttranslator.netlify.app/#/'],
  ['court-admin','https://punecourt.netlify.app/'],
  ['shahu-school','https://shrishahuprabodhini.in/'],
  ['shahu-admin','https://admin.shrishahuprabodhini.in/login'],
  ['sankalp','https://sankalpweb.netlify.app/'],
  ['mpsc','https://mpscranbhoomi.netlify.app/'],
  ['pmbooks','https://pmbooks.netlify.app/'],
  ['soil-serum','https://soil-serum-web.netlify.app/'],
];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless:false, args:['--headless=new','--ignore-certificate-errors'] });
for (const [n,u] of sites) {
  const p = await b.newPage({ viewport:{width:1440,height:900}, ignoreHTTPSErrors:true });
  try { await p.goto(u,{waitUntil:'networkidle',timeout:45000}); } catch(e){ console.log(n,'goto',e.message.slice(0,80)); }
  await p.waitForTimeout(2500);
  await p.screenshot({ path:`public/projects/${n}.jpg`, type:'jpeg', quality:78 });
  console.log(n, await p.title());
  await p.close();
}
await b.close();
