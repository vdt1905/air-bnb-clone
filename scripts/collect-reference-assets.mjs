// Collects only rendered photo URLs and font resources, never application code.
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('https://www.airbnb.co.in/rooms/1599895892448055764');
  const show = page.getByRole('button', { name: 'Show all photos', exact: true });
  await show.waitFor();
  const hero = await page.locator('img').evaluateAll(es => es.filter(e => e.src.includes('Hosting-1599')).map(e => e.currentSrc || e.src));
  await show.click({ timeout: 10000 });
  await page.waitForTimeout(1500);
  const dialog = page.locator('[role="dialog"][aria-label="Photo tour"]');
  await dialog.waitFor({timeout:20000});
  const count = await dialog.locator('section').count();
  const roomMap = new Map();
  const capture = async () => {
    const current = await dialog.evaluate(e => [...e.querySelectorAll('section')].map(s => ({ text: s.innerText, images: [...s.querySelectorAll('img')].map(i => i.currentSrc || i.src) })).filter(s => s.images.length));
    for (const s of current) {
      const name=s.text.split('\n')[0];
      const old=roomMap.get(name);
      roomMap.set(name,{text:s.text,images:[...new Map([...(old?.images??[]),...s.images].map(u=>[u.split('?')[0],u])).values()]});
    }
  };
  await capture();
  for (let i = 0; i < count; i++) {
    await dialog.locator('section').nth(i).evaluate(e => e.scrollIntoView());
    await page.waitForTimeout(350);
    await capture();
  }
  const sections = [...roomMap.values()];
  if(sections.length < 9) throw new Error(`Only ${sections.length} room groups observed; keep previous manifest.`);
  const data = { hero, sections };
  await fs.writeFile('docs/reference/observed-photos.json', JSON.stringify(data, null, 2));
  await fs.mkdir('client/public/images/mirashya', { recursive: true });
  const manifest = [];
  for (const section of sections) {
    const name = section.text.split('\n')[0];
    let n = 0;
    for (const remote of section.images) {
      const source = remote.replace(/im_w=\d+/, 'im_w=1440');
      const file = `${name.toLowerCase().replace(/\s+/g, '-')}-${++n}.jpg`;
      const response = await page.request.get(source);
      if (!response.ok()) throw new Error(`Asset failed: ${response.status()} ${source}`);
      await fs.writeFile(`client/public/images/mirashya/${file}`, await response.body());
      manifest.push({ room: name, url: `/images/mirashya/${file}`, source });
    }
  }
  await fs.writeFile('docs/reference/asset-manifest.json', JSON.stringify(manifest, null, 2));
  await fs.writeFile('server/src/data/photos.json', JSON.stringify(manifest.map(({room,url})=>({room,url})),null,2));
  await page.keyboard.press('Escape');
  await page.getByText('Meet your host', { exact: true }).first().evaluate(e => e.scrollIntoView());
  await page.waitForTimeout(1500);
  const profiles = await page.locator('img').evaluateAll(es => es.filter(i => i.currentSrc.startsWith('https://a0.muscache.com/') && !i.currentSrc.includes('Hosting-1599')).map(i => ({ src: i.currentSrc, alt: i.alt })));
  const fonts = await page.evaluate(() => performance.getEntriesByType('resource').map(r => r.name).filter(n => /woff/.test(n)));
  await fs.writeFile('docs/reference/observed-assets.json', JSON.stringify({ profiles, fonts, hero }, null, 2));
  console.log(JSON.stringify({ photos: manifest.length, groups: sections.map(s => s.text.split('\n')[0]), profiles, fonts, hero }));
} finally { await browser.close(); }
