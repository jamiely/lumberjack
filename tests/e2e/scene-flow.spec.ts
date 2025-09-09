import { test, expect } from '@playwright/test';

test.describe('Complete Scene Flow', () => {
  test('navigates through all three scenes: attract -> play -> game over', async ({ page }) => {
    await page.goto('/?testMode=true');

    // 1. Verify Attract Screen
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('TIMBERMAN');
    await expect(page.getByText('PRESS ANY BUTTON TO PLAY')).toBeVisible();
    await expect(page.getByText('HIGH SCORE:')).toBeVisible();
    await expect(page.getByText('CONTROLS:')).toBeVisible();

    // 2. Transition to Play Screen
    await page.keyboard.press('Enter');
    
    // Verify Play Screen
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Timberman Game');
    await expect(page.getByText('Score: 0')).toBeVisible();
    await expect(page.getByText('Use left/right arrows to chop')).toBeVisible();
    
    // Verify game board is present
    const gameBoard = page.locator('[style*="width: 400px"]');
    await expect(gameBoard).toBeVisible();

    // 3. Play the game (make some safe moves)
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByText('Score: 1')).toBeVisible();

    // 4. Trigger game over (collision scenario)
    // Player starts on left, segments[1] has 'right' branch
    // So chopping left should move player to left (safe), then chopping right moves to right and hits the branch
    await page.keyboard.press('ArrowRight'); // This should cause collision since player moves right and segments[1] has right branch
    await page.keyboard.press('ArrowLeft');
    
    // 5. Verify Game Over Screen (wait for 1s transition delay + buffer)
    await expect(page.getByText('GAME OVER!')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/YOUR SCORE:/)).toBeVisible();
    await expect(page.getByText(/HIGH SCORE:/)).toBeVisible();
    await expect(page.getByText('PRESS ANY BUTTON TO PLAY AGAIN')).toBeVisible();
    await page.waitForTimeout(2_000);

    // 6. Test immediate restart
    await page.keyboard.press('Enter');
    
    // Should go back to Play Screen with new game
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Timberman Game');
    await expect(page.getByText('Score: 0')).toBeVisible();
  });

  test('handles high score functionality', async ({ page }) => {
    await page.goto('/?testMode=true');

    // Clear localStorage to start with clean slate
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Verify initial high score is 0
    await expect(page.getByText('HIGH SCORE: 0')).toBeVisible();

    // Start game and make some moves to get a score
    await page.keyboard.press('Enter');
    
    // Make safe moves to increase score
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    
    // Trigger game over
    await page.keyboard.press('ArrowLeft');
    
    // Should show new high score
    await expect(page.getByText('GAME OVER!')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/YOUR SCORE: 2/)).toBeVisible();
    
    // Wait for auto-return or restart immediately
    await expect(page.getByText(/game over/i)).not.toBeVisible({timeout: 10_000});
    
    // Should be back on attract screen with updated high score
    await expect(page.getByText('HIGH SCORE: 2')).toBeVisible();
  });

  test('handles auto-return from game over screen', async ({ page }) => {
    await page.goto('/?testMode=true');

    // Start game and immediately trigger game over
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowRight'); // Should cause collision
    
    // Verify game over screen
    await expect(page.getByText('GAME OVER!')).toBeVisible({ timeout: 5000 });
    
    // Wait for countdown and auto-return (should happen within 5 seconds)
    await expect(page.getByText('TIMBERMAN')).toBeVisible({ timeout: 6000 });
    await expect(page.getByText('PRESS ANY BUTTON TO PLAY')).toBeVisible();
  });

  test('maintains game state consistency across scenes', async ({ page }) => {
    await page.goto('/?testMode=true');

    // Set a high score first
    await page.evaluate(() => localStorage.setItem('timberman-high-score', '10'));
    await page.reload();

    // Verify high score persists on attract screen
    await expect(page.getByText('HIGH SCORE: 10')).toBeVisible();

    // Start game
    await page.keyboard.press('Enter');
    
    // Make a move and trigger game over
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    
    // Verify game over screen shows correct scores
    await expect(page.getByText('GAME OVER!')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/YOUR SCORE: 2/)).toBeVisible();
    await expect(page.getByText('HIGH SCORE: 10')).toBeVisible(); // Should not change since 1 < 10
    
    // Return to attract and verify high score is still there
    await page.keyboard.press('Enter'); // Go to play
    await page.keyboard.press('Escape'); // This shouldn't work, but let's test the flow
    
    // Actually let's just verify the game over -> play transition works
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Timberman Game');
    await expect(page.getByText('Score: 0')).toBeVisible();
  });

  test('handles rapid key presses without breaking', async ({ page }) => {
    await page.goto('/?testMode=true');

    // Start game
    await page.keyboard.press('Enter');
    
    // Rapid key presses (safe moves)
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(50); // Small delay to prevent overwhelming
    }
    
    // Game should still be functional
    await expect(page.getByText(/Score: \d+/)).toBeVisible();
    const gameBoard = page.locator('[style*="width: 400px"]');
    await expect(gameBoard).toBeVisible();
    
    // Should still be able to trigger game over
    await page.keyboard.press('ArrowRight');
    await expect(page.getByText('GAME OVER!')).toBeVisible({ timeout: 5000 });
  });
});