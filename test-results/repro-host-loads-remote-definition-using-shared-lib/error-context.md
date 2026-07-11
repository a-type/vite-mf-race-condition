# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: repro.spec.ts >> host loads remote definition using shared lib
- Location: tests/repro.spec.ts:3:1

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "ERR:"
Received string:    "OK:method-ok"
```

# Page snapshot

```yaml
- main [ref=e2]:
  - heading "MF Race Repro" [level=1] [ref=e3]
  - generic [ref=e4]: OK:method-ok
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  | 
  3  | test('host loads remote definition using shared lib', async ({ page }) => {
  4  | 	await page.goto('/');
  5  | 
  6  | 	await expect(page.locator('#status')).toBeVisible();
  7  | 
  8  | 	// In broken state this ends with ERR:...exportedThing...method...
  9  | 	// In healthy state this becomes OK:method-ok
  10 | 	await expect(page.locator('#status')).toHaveText(/^(OK:method-ok|ERR:)/, {
  11 | 		timeout: 15000,
  12 | 	});
  13 | 
  14 | 	const finalText = (await page.locator('#status').textContent()) ?? '';
  15 | 
  16 | 	// This assertion documents expected bug reproduction state.
  17 | 	// If upstream fixes it, flip to expecting OK:method-ok.
> 18 | 	expect(finalText).toContain('ERR:');
     |                    ^ Error: expect(received).toContain(expected) // indexOf
  19 | 	expect(finalText).toMatch(/method|exportedThing|undefined/i);
  20 | });
  21 | 
```