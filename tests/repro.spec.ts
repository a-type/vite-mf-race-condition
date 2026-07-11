import { expect, test } from '@playwright/test';

test('host loads remote definition using shared lib', async ({ page }) => {
	await page.goto('/');

	await expect(page.locator('#status')).toBeVisible();

	// In broken state this ends with ERR:...exportedThing...method...
	// In healthy state this becomes OK:method-ok
	await expect(page.locator('#status')).toHaveText(/^(OK:method-ok|ERR:)/, {
		timeout: 15000,
	});

	const finalText = (await page.locator('#status').textContent()) ?? '';

	// This assertion documents expected bug reproduction state.
	// If upstream fixes it, flip to expecting OK:method-ok.
	expect(finalText).toContain('ERR:');
	expect(finalText).toMatch(/method|exportedThing|undefined/i);
});
