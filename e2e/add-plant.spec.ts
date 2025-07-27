import { test, expect } from '@playwright/test';

const PLANT = {
  name: 'Test Plant',
  description: 'A plant added by an end-to-end test.',
  watering: 'Once a week',
  light: 'Indirect sunlight',
};

test('Add a plant and check it appears', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Open the add plant modal
  await page.getByRole('button', { name: /add new plant/i }).click();

  // Fill out the form
  await page.getByPlaceholder('Name').fill(PLANT.name);
  await page.getByPlaceholder('Description').fill(PLANT.description);
  await page.getByPlaceholder('Watering instructions').fill(PLANT.watering);
  await page.getByPlaceholder('Light requirements').fill(PLANT.light);

  // Submit the form
  await page.getByRole('button', { name: /add plant/i }).click();

  // Wait for modal to close and plant name to appear in the list

  // Find all headings with the plant name and click the first one (the card)
  const cardHeadings = await page.getByRole('heading', { name: PLANT.name }).all();
  await expect(cardHeadings[0]).toBeVisible({ timeout: 5000 });
  await cardHeadings[0].click();

  // Check that the modal shows the description and other details
  await expect(page.getByText(PLANT.description)).toBeVisible();
  await expect(page.getByText(PLANT.watering)).toBeVisible();
  await expect(page.getByText(PLANT.light)).toBeVisible();
});
