// Generates public/Prapti-Mangade-Resume.pdf and public/og-image.png from src/data.
// Run: node scripts/make-assets.mjs   (needs `npm i -D playwright` + a Chromium)
import { chromium } from 'playwright-core';
import { profile, about, services } from '../src/data/profile.js';
import { experience } from '../src/data/experience.js';
import { skillGroups } from '../src/data/skills.js';
import { projects } from '../src/data/projects.js';

const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
const b = await chromium.launch({ executablePath: exe, headless: false, args: ['--headless=new'] });
const font = `<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">`;

const resume = `<!doctype html><html><head><meta charset="utf-8">${font}<style>
@page{size:A4;margin:14mm 14mm}
body{font-family:Inter,sans-serif;color:#1d1419;font-size:10.2pt;line-height:1.45;margin:0}
h1{font-family:Sora;font-size:26pt;margin:0;letter-spacing:-.02em} h1 span{color:#e0156f}
.head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #e0156f;padding-bottom:10px;margin-bottom:12px}
.role{font-family:Sora;font-weight:600;color:#6e5f69;margin-top:2px}
.contact{text-align:right;font-size:9pt;color:#3b2d36;line-height:1.6}
h2{font-family:Sora;font-size:11.5pt;text-transform:uppercase;letter-spacing:.12em;color:#e0156f;margin:14px 0 6px}
.job{margin-bottom:9px;break-inside:avoid}.job .t{display:flex;justify-content:space-between;font-weight:600}
.job .p{color:#6e5f69;font-size:9pt}
ul{margin:4px 0 0;padding-left:16px} li{margin-bottom:2px}
.skills div{margin-bottom:3px} .skills b{display:inline-block;width:150px}
.proj{margin-bottom:7px;break-inside:avoid}.proj b{font-family:Sora}.proj a{color:#e0156f;text-decoration:none;font-size:8.8pt}
.stack{color:#6e5f69;font-size:8.8pt}
</style></head><body>
<div class="head"><div><h1>${profile.firstName} <span>${profile.lastName}</span></h1><div class="role">${profile.headline} · React · .NET · Java</div></div>
<div class="contact">${profile.email}<br>${profile.location}<br>linkedin.com/in/prapti-mangade1103<br>github.com/Prapti1103</div></div>
<h2>Summary</h2><p>${profile.intro} ${about.paragraphs[1]}</p>
<h2>Experience</h2>${experience.map(e => `<div class="job"><div class="t"><span>${e.role}${e.company ? ' — ' + e.company : ''}</span><span class="p">${e.period}</span></div><ul>${e.points.map(p => `<li>${p}</li>`).join('')}</ul></div>`).join('')}
<h2>Selected Projects</h2>${projects.map(p => `<div class="proj"><b>${p.title}</b> — ${p.summary} <span class="stack">[${p.stack.join(', ')}]</span><br><a>${(p.live || '').replace('https://', '')}</a>${p.repo ? ` · <a>${p.repo.replace('https://', '')}</a>` : ''}</div>`).join('')}
<h2>Skills</h2><div class="skills">${skillGroups.slice(0, 5).map(g => `<div><b>${g.title}</b>${g.items.join(' · ')}</div>`).join('')}</div>
</body></html>`;
const p = await b.newPage();
await p.setContent(resume, { waitUntil: 'networkidle' });
await p.pdf({ path: 'public/Prapti-Mangade-Resume.pdf', format: 'A4', printBackground: true });

const og = `<!doctype html><html><head>${font}<style>
body{margin:0;width:1200px;height:630px;background:#0b0709;color:#fff;font-family:Inter;position:relative;overflow:hidden}
.c{position:absolute;border-radius:50%;border:1.5px solid rgba(255,46,136,.28)}
.g{position:absolute;width:700px;height:700px;right:-200px;top:-200px;background:radial-gradient(circle,rgba(255,46,136,.45),transparent 60%)}
.w{position:absolute;left:80px;top:150px}
.k{font-family:monospace;color:#ff2e88;letter-spacing:.2em;font-size:20px}
h1{font-family:Sora;font-size:96px;margin:14px 0 0;line-height:1;letter-spacing:-.04em}
h1 span{background:linear-gradient(100deg,#ff2e88,#ff6fb1,#b5179e);-webkit-background-clip:text;color:transparent}
p{font-size:28px;color:#d7ccd3;margin-top:26px}
.m{position:absolute;right:110px;top:175px;width:280px;height:280px;border-radius:50%;display:grid;place-items:center;font-family:Sora;font-weight:800;font-size:110px;background:#161015;box-shadow:0 0 0 14px #ff2e8833,0 0 80px #ff2e8866;color:#ff2e88}
</style></head><body><div class="g"></div>
<div class="c" style="width:900px;height:900px;left:-300px;top:-200px"></div><div class="c" style="width:1300px;height:1300px;left:200px;top:-500px"></div>
<div class="w"><div class="k">PORTFOLIO</div><h1>Prapti<br><span>Mangade</span></h1><p>Full-Stack · React · .NET Developer</p></div><div class="m">PM</div></body></html>`;
const o = await b.newPage({ viewport: { width: 1200, height: 630 } });
await o.setContent(og, { waitUntil: 'networkidle' });
await o.screenshot({ path: 'public/og-image.png' });
await b.close();
console.log('assets generated');
