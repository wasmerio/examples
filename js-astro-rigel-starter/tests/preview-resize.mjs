import assert from 'node:assert/strict';

export async function testPreviewResize({ cdp, evaluate, waitFor, open, reload }) {
  const selector = '.preview-divider';
  const restored = `location.hash === ${JSON.stringify(await evaluate('location.hash'))} && !!document.querySelector('.preview-divider') && !!document.querySelector('.site-preview iframe')?.contentDocument?.querySelector('[data-rigel-text]')`;
  const metrics = () => evaluate(`(() => {
    const d=document.querySelector('${selector}'), p=document.querySelector('.site-preview'), m=document.querySelector('main');
    const r=d.getBoundingClientRect();
    return { x:r.x+r.width/2, y:200, editor:m.getBoundingClientRect().width, preview:p.getBoundingClientRect().width, value:+d.getAttribute('aria-valuenow'), min:+d.getAttribute('aria-valuemin'), max:+d.getAttribute('aria-valuemax'), saved:JSON.parse(localStorage.getItem('rigelcms.settings')).userPref.previewSplit };
  })()`);
  const mouse = (type, x, y=200) => cdp('Input.dispatchMouseEvent', {type,x,y,button:'left',buttons:type==='mouseReleased'?0:1,clickCount:type==='mouseMoved'?0:1});
  const key = async key => {
    await evaluate(`document.querySelector('${selector}').focus()`);
    await cdp('Input.dispatchKeyEvent',{type:'keyDown',key});
    await cdp('Input.dispatchKeyEvent',{type:'keyUp',key});
  };
  const settled = () => evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
  await settled();
  const initial=await metrics();
  assert.equal(initial.value,50);
  await evaluate("window.resizeDoc=document.querySelector('.site-preview iframe').contentDocument");
  await mouse('mousePressed',initial.x);
  await waitFor("document.querySelector('.content').classList.contains('resizing-preview')");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.site-preview iframe')).pointerEvents"),'none');
  await mouse('mouseMoved',initial.x+120);
  await settled();
  const moved=await metrics();
  assert(moved.editor > initial.editor+100);
  assert(moved.preview < initial.preview-100);
  await mouse('mouseReleased',initial.x+120);
  await waitFor("!document.querySelector('.resizing-preview')");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.site-preview iframe')).pointerEvents"),'auto');
  assert.equal(await evaluate("window.resizeDoc===document.querySelector('.site-preview iframe').contentDocument"),true);
  assert.equal(await evaluate("document.querySelector('.save-button').disabled"),true);
  await open();
  assert.equal((await metrics()).saved,moved.saved);
  await reload();
  await waitFor(restored);
  await settled();
  assert.equal((await metrics()).saved,moved.saved);
  assert(Math.abs((await metrics()).editor-moved.editor)<2);
  await key('ArrowLeft'); await settled();
  assert((await metrics()).editor<moved.editor);
  await key('ArrowRight'); await settled();
  assert(Math.abs((await metrics()).editor-moved.editor)<2);
  await key('Home'); await settled();
  const low=await metrics();
  assert.equal(low.value,low.min); assert(low.editor>=319);
  await key('End'); await settled();
  const high=await metrics();
  assert.equal(high.value,high.max); assert(high.preview>=319);
  await mouse('mousePressed',high.x);
  await mouse('mouseMoved',1279); await mouse('mouseReleased',1279); await settled();
  assert.equal((await metrics()).value,high.max);
  const right=await metrics();
  await mouse('mousePressed',right.x);
  await mouse('mouseMoved',0); await mouse('mouseReleased',0); await settled();
  assert.equal((await metrics()).value,low.min);
  for (const cleanup of ["document.querySelector('.preview-divider').dispatchEvent(new PointerEvent('pointercancel',{pointerId:1}))", "document.querySelector('.preview-divider').releasePointerCapture(1)"]) {
    await mouse('mousePressed',(await metrics()).x);
    await mouse('mouseMoved',(await metrics()).x+1);
    await evaluate(cleanup);
    await mouse('mouseMoved',(await metrics()).x+1); await settled();
    assert.equal(await evaluate("!!document.querySelector('.resizing-preview')"),false);
    await mouse('mouseReleased',(await metrics()).x);
  }
  const saved=(await metrics()).saved;
  for (const width of [1050,800,390]) {
    await cdp('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:false});
    await settled();
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.preview-divider')).display"),'none');
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'),true);
    assert.equal(await evaluate("document.querySelector('.site-preview').getBoundingClientRect().top >= document.querySelector('main').getBoundingClientRect().bottom"),true);
    assert.equal((await metrics()).saved,saved);
  }
  await cdp('Emulation.clearDeviceMetricsOverride'); await settled();
  assert.equal((await metrics()).saved,saved);
  for (const bad of ['bad',-1,2,null]) {
    await evaluate(`localStorage.setItem('rigelcms.settings',JSON.stringify({userPref:{previewSplit:${JSON.stringify(bad)}}}))`);
    await reload();
    await waitFor(restored); await settled();
    assert.equal((await metrics()).saved,0.5);
  }
  await evaluate("window.realSetItem=Storage.prototype.setItem; Storage.prototype.setItem=function(){throw new Error('blocked')}");
  await key('ArrowRight');
  await waitFor("document.querySelector('main [role=alert]')?.textContent.includes('Settings could not be saved')");
  await evaluate('Storage.prototype.setItem=window.realSetItem');
  await key('ArrowLeft');
  await waitFor("!document.querySelector('main [role=alert]')");
  await waitFor("!!document.querySelector('.site-preview iframe')?.contentDocument?.querySelector('[data-rigel-text]')");
  console.log('PASS: preview real CDP drag/capture/iframe guard; selection+reload persistence; arrows/Home/End; bounds; cancel/lostcapture; mobile stack; invalid storage fallback and blocked-storage recovery; no dirty content');
}
