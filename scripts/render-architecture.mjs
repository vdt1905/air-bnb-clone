import fs from 'node:fs/promises';
import {chromium} from '@playwright/test';

// Source for the standalone, editable architecture image included in the handoff.
const colors={ink:'#17302b',muted:'#577069',line:'#adc4bc',mint:'#e7f1eb',pink:'#fff0f3',white:'#fff'};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(x,y,s,size=18,weight=400,color=colors.ink)=>`<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${color}">${esc(s)}</text>`;
const box=(x,y,w,title,lines,fill=colors.white)=>`<rect x="${x}" y="${y}" width="${w}" height="100" rx="14" fill="${fill}" stroke="${colors.line}"/>${text(x+20,y+33,title,21,600)}${lines.map((s,i)=>text(x+20,y+59+i*21,s,16,400,colors.muted)).join('')}`;
const arrow=(x1,y1,x2,y2,dashed=false)=>`<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${colors.muted}" stroke-width="2" ${dashed?'stroke-dasharray="6 5"':''} marker-end="url(#arrow)"/>`;
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1170" viewBox="0 0 1600 1170" font-family="Arial, sans-serif">
<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="${colors.muted}"/></marker></defs>
<rect width="1600" height="1170" fill="#f8faf8"/>
${text(64,65,'Vacation rental marketplace',38,700)}
${text(64,98,'Production architecture · independently scalable reads, transactional bookings, and asynchronous media',20,400,colors.muted)}
<rect x="64" y="131" width="1472" height="42" rx="10" fill="${colors.pink}"/>
${text(80,159,'PROPOSAL: production system below. Submitted app: React/Vite + Express + fixture data; no real payments or bookings.',16,500)}
${text(64,213,'01 / GLOBAL DELIVERY',15,700,colors.muted)}
${box(64,236,265,'Guests & hosts',['Browser / mobile apps','HTTPS, accessible interfaces'])}
${box(384,236,315,'CDN + edge security',['WAF, rate limiting, image CDN','Cache public listing pages'],colors.mint)}
${box(755,236,365,'Web frontend / BFF',['SSR + client hydration','Cache tags; authenticated sessions'])}
${box(1176,236,360,'API gateway',['Auth, quotas, request routing','Stateless regional replicas'],colors.mint)}
${arrow(329,286,384,286)}${arrow(699,286,755,286)}${arrow(1120,286,1176,286)}
${text(64,395,'02 / DOMAIN SERVICES · CONTAINERS ACROSS MULTIPLE AVAILABILITY ZONES',15,700,colors.muted)}
<path d="M1356 336V405" fill="none" stroke="${colors.muted}" stroke-width="2"/>
${box(64,420,270,'Listings & reviews',['Listing details, amenities','Read replicas + cache'])}
${box(364,420,330,'Availability & booking',['Inventory holds; price quotes','Idempotent reservation writes'],colors.pink)}
${box(724,420,270,'Users & messaging',['Profiles, access control','WebSocket conversation fanout'])}
${box(1024,420,240,'Search',['Geo + date + price filters','Ranking and pagination'])}
${box(1294,420,242,'Media',['Signed upload URLs','Resize / validate / encode'])}
<path d="M199 420V405H1415V420M529 405V420M859 405V420M1144 405V420" fill="none" stroke="${colors.line}" stroke-width="2"/>
${text(64,584,'03 / DATA & EVENTS',15,700,colors.muted)}
${box(64,613,430,'PostgreSQL · source of truth',['Transactions; constraints prevent double booking','Read replicas; regional ownership per listing'],colors.mint)}
${box(524,613,270,'Redis',['Hot listing caches + TTLs','Short-lived inventory holds'])}
${box(824,613,340,'Search index',['OpenSearch geo / text queries','Eventual consistency; rebuildable'],colors.mint)}
${box(1194,613,342,'Object storage',['Originals + optimized image variants','CDN access; versioned object keys'])}
${arrow(314,520,314,613)}<path d="M529 520V560H394V613" fill="none" stroke="${colors.muted}" stroke-width="2" marker-end="url(#arrow)"/>
${arrow(659,520,659,613)}${arrow(1144,520,1144,613)}${arrow(1415,520,1415,613)}
${box(64,784,430,'Transactional outbox + event bus',['Booking events published after database commit','At-least-once delivery; deduplicated consumers'],colors.mint)}
${box(554,784,390,'Background workers',['Email, notifications, image processing','Retries with backoff; dead-letter queue'])}
${box(1004,784,532,'Payments provider',['Tokenized checkout; idempotency keys + signed webhooks','Reconcile failures; never store raw card information'],colors.pink)}
${arrow(279,713,279,784)}${arrow(494,834,554,834)}${arrow(944,834,1004,834)}
<path d="M430 784V750H994V713" fill="none" stroke="${colors.muted}" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#arrow)"/>
${text(836,739,'Index updates',14,400,colors.muted)}
${text(64,942,'04 / DEPLOYMENT & OPERATIONS',15,700,colors.muted)}
${box(64,966,470,'Private source → CI → registry → deploy',['Build, unit / browser / security checks; IaC','Canary releases; health checks; quick rollback'])}
${box(564,966,460,'Scale each workload independently',['API replicas by latency / CPU; workers by queue lag','CDN absorbs read traffic; autoscale search nodes'])}
${box(1054,966,482,'Observe & recover',['Tracing, metrics, structured logs and alerting','Multi-AZ replicas; backups; restore drills; failover'])}
${text(64,1120,'Consistency: bookings and inventory are transactional. Search, caches, notifications, and analytics update asynchronously.',17,500)}
${text(64,1147,'Security: least-privilege identities, encrypted transport/storage, secrets manager, audit trails, and bounded access to personal data.',16,400,colors.muted)}
</svg>`;
await fs.mkdir('docs/architecture',{recursive:true});
await fs.writeFile('docs/architecture/marketplace-architecture.svg',svg);
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
  const page=await browser.newPage({viewport:{width:1600,height:1170},deviceScaleFactor:1});
  await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  await page.screenshot({path:'docs/architecture/marketplace-architecture.png',fullPage:true});
}finally{await browser.close();}
console.log('Architecture SVG and PNG generated.');
