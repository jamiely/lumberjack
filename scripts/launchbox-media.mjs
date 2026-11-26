// Builds LaunchBox / Big Box media for the cabinet from the game itself: title and gameplay screenshots,
// a 30 s gameplay video snap, a transparent clear logo, a box front, a banner and a background fanart.
//
//   node scripts/launchbox-media.mjs [--ref latest] [--art-only]
//
// --art-only skips the game and recomposes the logo and posters from the screenshots already in docs/launchbox/.
//
// --ref picks the build to capture: a git ref (default `latest`, the release the cabinet runs) is checked out
// into a temporary worktree and built there; `--ref .` captures this checkout as it is. Needs Google Chrome
// (Playwright's `chrome` channel) and ffmpeg. Output mirrors LaunchBox's own folders under docs/launchbox/, so
// installing is a copy of that tree over C:\Users\arcade\LaunchBox (see docs/launchbox/README.md).
/* global document, Image */
import { Buffer } from 'node:buffer';
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// --- Per-game settings ----------------------------------------------------------------------------------------
const GAME = {
  title: 'Lumberjack',
  tagline: 'Chop fast. Dodge branches!',
  query: '?character=lumberjack2',
  ready: () => Boolean(document.querySelector('img[alt="Lumberjack"]')?.complete),
  // Illustrated title.png supplies the lettering; Arial bold is the game's UI font.
  logo: { font: 'bold {size}px Arial, sans-serif', fill: '#ee951a', ink: '#35220e', gloss: 'rgba(255,255,255,0.35)' },
  colors: { dark: '#0f2a1b', mid: '#173f2b', accent: '#ee951a', text: '#fff1d6' },
  // Box front key art: crop below the gameplay HUD (cropTop, screen px),
  // placed under the poster's logo (boxTop, poster px).
  // focusY: the screen row the fanart's close-up centres on (the lumberjack).
  scene: { cropTop: 940, boxTop: 550, focusY: 1360 },
  /** Read the next visible branch and chop its opposite side with the real keyboard controls. */
  async play(page, ms) {
    if (await page.locator('img[alt="Lumberjack"]').count()) {
      await page.keyboard.press('Enter');
      await page.waitForTimeout(150);
    }
    const end = Date.now() + ms;
    for (let i = 0; Date.now() < end; i++) {
      const blocked = await page.evaluate(() => {
        const branches = [...document.querySelectorAll('[data-testid="game-board"] > div')];
        const next = branches.find((el) => el.style.backgroundImage.includes('branch.png') && parseFloat(el.style.bottom) === 271);
        return next ? (parseFloat(next.style.left) < 200 ? 'left' : 'right') : 'none';
      });
      await page.keyboard.press(blocked === 'left' ? 'ArrowRight' : blocked === 'right' ? 'ArrowLeft' : i % 2 ? 'ArrowLeft' : 'ArrowRight');
      const pause = 170 + (i % 4) * 25;
      if (Date.now() + pause >= end) break;
      await page.waitForTimeout(pause);
      if (await page.getByText('GAME OVER!', { exact: true }).count()) throw new Error('Capture reached game over');
    }
  },
};
// ---------------------------------------------------------------------------------------------------------------

const SCREEN = { width: 1050, height: 1680 };
// CSS font shorthand for the posters; single quotes so it fits inside a style="" attribute.
const font = (px) => GAME.logo.font.replace('{size}', px).replaceAll('"', "'");
const { dark, accent, text } = GAME.colors;
const VIDEO_SECONDS = 30;
const FFMPEG = process.env.FFMPEG ?? (existsSync('/opt/homebrew/bin/ffmpeg') ? '/opt/homebrew/bin/ffmpeg' : 'ffmpeg');
const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(repo, 'docs/launchbox');
const ref = process.argv.includes('--ref') ? process.argv[process.argv.indexOf('--ref') + 1] : 'latest';
const artOnly = process.argv.includes('--art-only');
const name = `${GAME.title}-01`;
const image = (type) => join(out, 'Images/Arcade', type, `${GAME.title}-${type === 'Box - Front' ? '02' : '01'}.png`);
const run = (cmd, args, cwd = repo) => execFileSync(cmd, args, { cwd, timeout: 180_000, stdio: ['ignore', 'pipe', 'inherit'] }).toString().trim();

const work = mkdtempSync(join(tmpdir(), 'launchbox-media-'));
let source = repo;
if (ref !== '.' && !artOnly) {
  source = join(work, 'src');
  run('git', ['worktree', 'add', '--detach', source, ref]);
  symlinkSync(join(repo, 'node_modules'), join(source, 'node_modules'));
}
const commit = run('git', ['rev-parse', 'HEAD'], source);
if (!artOnly) {
  console.log(`capturing ${GAME.title} at ${ref} (${commit})`);
  run('npm', ['run', 'build:desktop:web'], source);
}
const url = `file://${join(source, 'dist/index.html')}${GAME.query}`;

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--allow-file-access-from-files', '--use-angle=metal', '--autoplay-policy=no-user-gesture-required'] });
try {
  for (const type of ['Screenshot - Game Title', 'Screenshot - Gameplay', 'Clear Logo', 'Box - Front', 'Banner', 'Fanart - Background']) {
    mkdirSync(dirname(image(type)), { recursive: true });
  }
  mkdirSync(join(out, 'Videos/Arcade'), { recursive: true });
  if (!artOnly) await capture();

  // Artwork: the logo in the game's own lettering, then posters composed around the captured scene.
  const art = await browser.newPage({ viewport: { width: 2000, height: 2000 }, deviceScaleFactor: 1 });
  const titleArt = ref === '.' ? readFileSync(join(source, 'public/images/title.png'))
    : execFileSync('git', ['show', `${ref}:public/images/title.png`], { cwd: repo, maxBuffer: 10 * 1024 * 1024 });
  const logo = await art.evaluate(drawLogo, `data:image/png;base64,${titleArt.toString('base64')}`);
  writeFileSync(image('Clear Logo'), Buffer.from(logo.split(',')[1], 'base64'));
  const dataUrl = (file) => `data:image/png;base64,${readFileSync(file).toString('base64')}`;
  const assets = { logo, play: dataUrl(image('Screenshot - Gameplay')), title: dataUrl(image('Screenshot - Game Title')) };
  await compose(art, image('Box - Front'), 1000, 1500, boxFront(assets));
  await compose(art, image('Banner'), 1000, 185, banner(assets));
  await compose(art, image('Fanart - Background'), SCREEN.width, SCREEN.height, fanart(assets));
  await art.close();
  console.log(`wrote ${out}`);
} finally {
  await browser.close();
  if (source !== repo) run('git', ['worktree', 'remove', '--force', source]);
  rmSync(work, { recursive: true, force: true });
}

/** Title and gameplay screenshots, then the video snap, each from a fresh run of the built game. */
async function capture() {
  // Screenshots from one run of the game.
  const errors = [];
  const page = await browser.newPage({ viewport: SCREEN, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url);
  await page.waitForFunction(GAME.ready);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: image('Screenshot - Game Title') });
  await GAME.play(page, 14_000);
  await page.screenshot({ path: image('Screenshot - Gameplay') });
  await page.close();
  if (errors.length) throw new Error(`page errors: ${errors.join('; ')}`);

  // Video snap: record a fresh run, then cut the page load off the front.
  const videoDir = join(work, 'video');
  const context = await browser.newContext({ viewport: SCREEN, deviceScaleFactor: 1, recordVideo: { dir: videoDir, size: SCREEN } });
  const started = Date.now();
  const vpage = await context.newPage();
  await vpage.goto(url);
  await vpage.waitForFunction(GAME.ready);
  await GAME.play(vpage, 1000);
  const lead = (Date.now() - started) / 1000;
  await GAME.play(vpage, VIDEO_SECONDS * 1000 + 500);
  await context.close();
  const webm = join(videoDir, readdirSync(videoDir)[0]);
  run(FFMPEG, ['-nostdin', '-loglevel', 'error', '-y', '-ss', lead.toFixed(2), '-i', webm, '-t', String(VIDEO_SECONDS),
    '-vf', 'scale=720:-2,fps=30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
    join(out, 'Videos/Arcade', `${name}.mp4`)]);
  writeFileSync(join(out, 'SOURCE.txt'), `${GAME.title} media captured from ${ref} (${commit}) by scripts/launchbox-media.mjs\n`);
}

/** Runs in the page: preserve the game's illustrated lettering and trim its transparent margins. */
async function drawLogo(url) {
  const img = new Image();
  img.src = url;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0);
  const { data } = g.getImageData(0, 0, c.width, c.height);
  let [l, t, r, b] = [c.width, c.height, 0, 0];
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 32) continue;
    const p = (i - 3) / 4;
    const px = p % c.width;
    const py = (p - px) / c.width;
    l = Math.min(l, px); r = Math.max(r, px); t = Math.min(t, py); b = Math.max(b, py);
  }
  const pad = 12;
  const o = document.createElement('canvas');
  o.width = r - l + 1 + pad * 2;
  o.height = b - t + 1 + pad * 2;
  o.getContext('2d').drawImage(c, l, t, r - l + 1, b - t + 1, pad, pad, r - l + 1, b - t + 1);
  return o.toDataURL('image/png');
}

async function compose(page, file, width, height, html) {
  await page.setViewportSize({ width, height });
  await page.setContent(`<!doctype html><style>*{box-sizing:border-box}html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden}</style>${html}`);
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
  await page.screenshot({ path: file });
}

function boxFront({ logo, play }) {
  return `<div style="position:relative;width:1000px;height:1500px;background:${dark};overflow:hidden;border:14px solid ${GAME.logo.ink}">
    <div style="position:absolute;left:-25px;top:${GAME.scene.boxTop}px;width:1050px;bottom:0;overflow:hidden">
      <img src="${play}" style="position:absolute;left:0;top:-${GAME.scene.cropTop}px;width:1050px;height:1680px">
    </div>
    <div style="position:absolute;inset:0;background:linear-gradient(${dark} 0%, ${dark}ee 14%, transparent 34%, transparent 72%, ${dark}f0 88%, ${dark} 100%)"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%, transparent 55%, ${dark}cc 100%)"></div>
    <img src="${logo}" style="position:absolute;left:50%;top:40px;width:900px;transform:translateX(-50%) rotate(-3deg);filter:drop-shadow(0 14px 0 ${GAME.logo.ink}) drop-shadow(0 0 40px ${accent}aa)">
    <div style="position:absolute;left:0;right:0;bottom:70px;text-align:center;font:${font(46)};white-space:nowrap;color:${text};-webkit-text-stroke:11px ${GAME.logo.ink};paint-order:stroke fill">${GAME.tagline}</div>
  </div>`;
}

function banner({ logo, play }) {
  return `<div style="position:relative;width:1000px;height:185px;background:${dark};overflow:hidden">
    <img src="${play}" style="position:absolute;left:0;top:-1150px;width:1000px;filter:saturate(1.1)">
    <div style="position:absolute;inset:0;background:linear-gradient(90deg, ${dark}f2 0%, ${dark}c0 45%, transparent 100%)"></div>
    <img src="${logo}" style="position:absolute;left:36px;top:50%;height:132px;transform:translateY(-50%);filter:drop-shadow(0 6px 0 ${GAME.logo.ink})">
  </div>`;
}

function fanart({ play }) {
  return `<div style="position:relative;width:${SCREEN.width}px;height:${SCREEN.height}px;background:${dark};overflow:hidden">
    <img src="${play}" style="position:absolute;width:${SCREEN.width * 1.9}px;height:${SCREEN.height * 1.9}px;left:${-(SCREEN.width * 0.95 - SCREEN.width / 2)}px;top:${-(GAME.scene.focusY * 1.9 - SCREEN.height / 2)}px;filter:blur(3px) saturate(1.2) brightness(0.72)">
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%, transparent 30%, ${dark}d9 95%)"></div>
  </div>`;
}
