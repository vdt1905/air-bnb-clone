import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function load(page){
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toHaveText('Romantic Jacuzzi 1BHK Candolim | Mirashya UG10');
  await page.locator('[data-testid="photo-grid"] img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));
}

test('listing uses the reference hero and has no desktop overflow',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await load(page);
  await expect(page.locator('[data-testid="photo-grid"] img')).toHaveCount(5);
  await expect(page.locator('[data-testid="photo-grid"] img').last()).toHaveAttribute('src','/images/mirashya/exterior-5.jpg');
  for(const width of [1280,1440,1910]){
    await page.setViewportSize({width,height:1000});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test('photo tour and lightbox preserve scroll and restore focus one layer at a time',async({page})=>{
  await load(page);
  await page.evaluate(()=>scrollTo(0,240));
  const trigger=page.getByTestId('show-all-photos');
  await trigger.click();
  await expect(page.getByTestId('tour-close')).toBeFocused();
  await expect(page.locator('#root')).toHaveAttribute('inert','');
  await expect(page.locator('.tour-category')).toHaveCount(9);
  await page.getByRole('button',{name:'Scroll to Living room 2',exact:true}).click();
  const room=page.locator('.tour-room').filter({has:page.getByRole('heading',{name:'Living room 2',exact:true})});
  const photo=room.locator('.tour-photo').first();
  await photo.click();
  await expect(page.locator('[role="dialog"]:not([inert])')).toHaveCount(1);
  await expect(page.locator('[data-modal-id="photos"]')).toHaveAttribute('inert','');
  const src=await page.getByTestId('lightbox-image').getAttribute('src');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByTestId('lightbox-image')).not.toHaveAttribute('src',src);
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByTestId('lightbox-image')).toHaveAttribute('src',src);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog',{name:'Photo tour',exact:true})).toBeVisible();
  await expect(photo).toBeFocused();
  await expect(page.locator('body')).toHaveCSS('position','fixed');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(240);
});

test('lightbox traps focus and browser Back follows overlay history',async({page})=>{
  await load(page);
  await page.getByTestId('show-all-photos').click();
  await page.locator('.tour-photo').first().click();
  await expect(page.getByTestId('lightbox-prev')).toHaveCount(0);
  await page.getByTestId('lightbox-next').focus();
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('lightbox-close')).toBeFocused();
  await page.goBack();
  await expect(page.getByRole('dialog',{name:'Photo tour',exact:true})).toBeVisible();
  await expect(page.getByTestId('lightbox-image')).toHaveCount(0);
  await page.goBack();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('a photo URL opens directly and survives refresh',async({page})=>{
  await page.goto('/listings/listing-001?modal=photos&photo=p05');
  await expect(page.getByTestId('lightbox-image')).toBeVisible();
  const src=await page.getByTestId('lightbox-image').getAttribute('src');
  await page.reload();
  await expect(page.getByTestId('lightbox-image')).toHaveAttribute('src',src);
});

test('dates and guest changes update the booking card and URL',async({page})=>{
  await load(page);
  const calendar=page.getByTestId('inline-calendar');
  await calendar.getByRole('button',{name:/20 October 2026$/}).click();
  await calendar.getByRole('button',{name:/24 October 2026$/}).click();
  await expect(page.getByTestId('booking-card')).toContainText('₹22,799');
  await expect(page).toHaveURL(/check_in=2026-10-20.*check_out=2026-10-24/);
  await page.getByTestId('guest-field').click();
  await page.getByRole('button',{name:'Increase Adults',exact:true}).click();
  await expect(page.getByTestId('guest-field')).toContainText('3 guests');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('guest-stepper')).toHaveCount(0);
  await page.getByRole('button',{name:'Clear dates',exact:true}).click();
  await expect(page.getByTestId('booking-card')).toContainText('Add dates for prices');
});

test('sticky reserve keeps the current section and shows feedback',async({page})=>{
  await load(page);
  await page.locator('#location').scrollIntoViewIfNeeded();
  const nav=page.getByTestId('sticky-nav');
  await expect(nav).toHaveAttribute('aria-hidden','false');
  const top=await page.evaluate(()=>scrollY);
  await nav.getByRole('button',{name:'Reserve',exact:true}).click();
  await expect(page.getByTestId('toast')).toHaveText('You won’t be charged yet');
  expect(await page.evaluate(()=>scrollY)).toBe(top);
});

test('amenities, review search, and map controls respond',async({page})=>{
  await load(page);
  await page.getByTestId('show-all-amenities').click();
  await expect(page.getByRole('dialog')).toContainText('Hot tub');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('show-all-amenities')).toBeFocused();
  await page.getByRole('button',{name:'Show all 19 reviews',exact:true}).click();
  await page.getByRole('textbox',{name:'Search reviews'}).fill('Amit');
  await expect(page.getByRole('dialog').getByRole('article')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Show property location'}).click();
  await expect(page.getByText('Your stay in Candolim',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Zoom in',exact:true}).click();
});

test('malformed dates do not crash the listing',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/listings/listing-001?check_in=2026-99-99&check_out=2026-10-25&adults=0');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await expect(page.getByTestId('booking-card')).toContainText('Add dates for prices');
  await expect(page.getByTestId('guest-field')).toContainText('1 guest');
  expect(errors).toEqual([]);
});

test('header search, account menu and language controls are keyboard reachable',async({page})=>{
  await load(page);
  await page.getByTestId('search-location').click();
  await expect(page.getByRole('textbox',{name:'Where to?'})).toBeFocused();
  await page.getByRole('button',{name:'Candolim, Goa For a relaxing beach getaway'}).click();
  const picker=page.getByTestId('date-picker');
  await expect(picker).toBeVisible();
  expect(await picker.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(picker).toHaveCount(0);
  await page.getByTestId('search-guests').click();
  await page.getByRole('button',{name:'Increase Adults',exact:true}).click();
  await page.keyboard.press('Escape');
  await page.getByTestId('account-menu-trigger').click();
  await page.getByRole('button',{name:'Help Centre',exact:true}).click();
  await expect(page.getByRole('dialog')).toContainText('Help Centre');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('account-menu-trigger')).toBeFocused();
  await page.getByRole('button',{name:'Choose a language and region'}).click();
  await expect(page.getByRole('dialog')).toContainText('English (India)');
  await page.keyboard.press('Escape');
});

test('share copies the current URL, Save is shared with the tour, and nearby stays slide',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await load(page);
  await page.getByRole('button',{name:'Share',exact:true}).click();
  await page.getByRole('button',{name:'Copy Link',exact:true}).click();
  await expect(page.getByRole('button',{name:'Link copied',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(page.url());
  await page.keyboard.press('Escape');
  await page.getByTestId('save-button').click();
  await expect(page.getByTestId('save-button')).toHaveAttribute('aria-pressed','true');
  await page.getByTestId('show-all-photos').click();
  await expect(page.getByRole('dialog').getByRole('button',{name:'Remove from wishlist'})).toHaveAttribute('aria-pressed','true');
  await page.keyboard.press('Escape');
  const section=page.getByRole('region',{name:'More stays nearby'});
  const before=await section.locator('ul').evaluate(e=>getComputedStyle(e).transform);
  await page.getByRole('button',{name:'Next stays'}).click();
  await expect(page.getByRole('button',{name:'Previous stays'})).toBeEnabled();
  await expect.poll(()=>section.locator('ul').evaluate(e=>getComputedStyle(e).transform)).not.toBe(before);
});

test('listing and both gallery layers pass automated accessibility checks',async({page})=>{
  await load(page);
  const audit=async()=>{
    const {violations}=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  };
  await audit();
  await page.getByTestId('show-all-photos').click();
  await audit();
  await page.locator('.tour-photo').first().click();
  await audit();
});
