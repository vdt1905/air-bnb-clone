import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';

// Run npm run build and npm run preview before this script.
const browser=await chromium.launch({channel:'chrome',headless:true});
const output='docs/reference';
await fs.mkdir(output,{recursive:true});
try {
  const page=await browser.newPage({viewport:{width:1910,height:925},deviceScaleFactor:1});
  await page.goto('http://127.0.0.1:5190');
  await page.getByRole('heading',{level:1}).waitFor();
  await page.locator('[data-testid="photo-grid"] img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));
  await page.screenshot({path:`${output}/implementation-listing.png`});
  await page.getByTestId('show-all-photos').click();
  await page.locator('.tour-category img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));
  await page.locator('.tour-photo img').first().evaluate(e=>e.decode());
  await page.waitForTimeout(350);
  await page.screenshot({path:`${output}/implementation-tour.png`});
  await page.locator('.tour-photo').first().click();
  await page.getByTestId('lightbox-image').evaluate(e=>e.decode());
  await page.waitForTimeout(350);
  await page.screenshot({path:`${output}/implementation-lightbox.png`});
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await page.locator('#sleeping-heading').evaluate(e=>window.scrollTo(0,scrollY+e.getBoundingClientRect().top-110));
  await expect(page.getByTestId('sticky-nav')).toHaveAttribute('aria-hidden','false');
  await expect.poll(async()=>Math.round((await page.getByTestId('sticky-nav').boundingBox()).y)).toBe(0);
  await page.waitForTimeout(250);
  await page.screenshot({path:`${output}/implementation-booking.png`});
  await page.locator('#reviews').evaluate(e=>window.scrollTo(0,scrollY+e.getBoundingClientRect().top-75));
  await page.waitForTimeout(400);
  await page.screenshot({path:`${output}/implementation-reviews.png`});
  console.log('Captured the listing, photo tour, lightbox, booking and review views.');
} finally {await browser.close();}
