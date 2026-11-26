# LaunchBox / Big Box media

Media for the Vermilion cabinet's LaunchBox "Arcade" platform, made from the game itself by
`node scripts/launchbox-media.mjs` (default: the `latest` release the cabinet runs; `--ref .` for this checkout,
`--art-only` to recompose the logo and posters from the screenshots here). `SOURCE.txt` names the captured commit.
Requires the repository's installed dependencies, system Google Chrome (Playwright's `chrome` channel) and ffmpeg.
The script builds the selected ref's desktop web target for relative offline asset URLs.

The folders mirror LaunchBox's own, and files are named `Lumberjack-01` so LaunchBox matches them to the game,
except `Box - Front/Lumberjack-02.png`, which preserves the cabinet's existing custom `Lumberjack-01.png` box.
To install or restore, close LaunchBox and Big Box, then copy `Images/` and `Videos/` over
`C:\Users\arcade\LaunchBox\` (this tree is the backup; the cabinet's collector does not archive media).

Capture uses the normal game with `?character=lumberjack2`: Enter starts, then Left/Right Arrow chops opposite
upcoming visible branches, keeping play alive without modifying game code or enabling deterministic test mode.
Tagline: "Chop fast. Dodge branches!", based on the design's chopping, branch avoidance and time pressure.
The transparent clear logo is the selected ref's bundled `public/images/title.png`, trimmed to its alpha bounds:
its own illustrated wood-cut lettering and axe, not a substitute system typeface. The tagline uses the game's
Arial bold UI font. The palette uses the title's wood-orange and dark-brown ink over the game's forest greens.
If Playwright requests its video encoder, install it with `npx playwright install ffmpeg` (Chrome remains system Chrome).

Outputs: six PNGs (title, gameplay, transparent clear logo, 1000×1500 box front, 1000×185 banner,
1050×1680 background) and a silent 30-second, 720-wide H.264 MP4 video snap.
