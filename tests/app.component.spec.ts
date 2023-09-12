import { test, expect } from '@playwright/test';

const URL = 'http://localhost:4200/';

test.describe('app loaded', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle('weather-app: Retrieve a weekly forecast!');
  });

  test('loads forecast if geolocation given', async ({ page }) => {
    // Page loads => reads geolocation => displays loading splash => displays forecast
    await expect(page.getByText('Loading')).toBeVisible();
  });

  test('loads location prompt if geolocation not given', async ({
    page,
    context,
  }) => {
    // Page loads => no geolocation => displays location prompt
    await page.goto(URL);
    await context.clearPermissions();
    await expect(page.getByText('Unable')).toBeVisible();
  });
});
