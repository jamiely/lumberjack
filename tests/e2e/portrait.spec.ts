import { test, expect, type Page } from '@playwright/test';

// Vermilion's cabinet monitor is rotated (1050x1680); a common portrait display is 1080x1920.
// The 9:16 board must stay entirely on screen and fill the limiting dimension in every scene.
async function expectBoardFits(page: Page, width: number, height: number) {
  const box = await page.getByTestId('scaled-game-content').boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(-0.5);
  expect(box!.y).toBeGreaterThanOrEqual(-0.5);
  expect(box!.x + box!.width).toBeLessThanOrEqual(width + 0.5);
  expect(box!.y + box!.height).toBeLessThanOrEqual(height + 0.5);
  expect(Math.max(box!.width / width, box!.height / height)).toBeCloseTo(1, 2);
}

for (const [width, height] of [[1050, 1680], [1080, 1920], [1920, 1080]]) {
  test(`keeps every scene in frame at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/?testMode=true');

    await expect(page.getByText('PRESS ANY BUTTON TO PLAY')).toBeInViewport({ ratio: 1 });
    await expectBoardFits(page, width, height);

    await page.keyboard.press('Enter');
    await expect(page.getByTestId('game-board')).toBeVisible();
    await expectBoardFits(page, width, height);

    // Same collision sequence as scene-flow.spec.ts: the right branch ends the game.
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByText('PRESS ANY BUTTON TO PLAY AGAIN')).toBeInViewport({ ratio: 1, timeout: 5000 });
    await expect(page.getByText(/YOUR SCORE:/)).toBeInViewport({ ratio: 1 });
    await expectBoardFits(page, width, height);
  });
}
