import { test, expect } from '@playwright/test';

const PLANT = {
  name: 'Delete Test Plant',
  description: 'A plant to be deleted by an end-to-end test.',
  watering: 'Once a week',
  light: 'Indirect sunlight',
};

test('Add and then delete a plant', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Add a plant
  await page.getByRole('button', { name: /add new plant/i }).click();
  await page.getByPlaceholder('Name').fill(PLANT.name);
  await page.getByPlaceholder('Description').fill(PLANT.description);
  await page.getByPlaceholder('Watering instructions').fill(PLANT.watering);
  await page.getByPlaceholder('Light requirements').fill(PLANT.light);
  await page.getByRole('button', { name: /add plant/i }).click();
  const cardHeadings = await page.getByRole('heading', { name: PLANT.name }).all();
  await expect(cardHeadings[0]).toBeVisible({ timeout: 5000 });
  await cardHeadings[0].click();

  // Delete the plant
  await page.getByRole('button', { name: /remove plant/i }).click();

  // Wait for the modal to close (the Remove Plant button to be detached)
  await expect(page.getByRole('button', { name: /remove plant/i })).toBeHidden({ timeout: 5000 });

  // Now check that there are no visible headings with the plant name (card is gone)
  const headings = await page.getByRole('heading', { name: PLANT.name }).all();
  for (const heading of headings) {
    await expect(heading).not.toBeVisible();
  }
});
