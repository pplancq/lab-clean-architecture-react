import { expect } from '@playwright/test';
import { describe, it } from './fixture/playwright.fixture';

describe('Add Game page', () => {
  it('should display the form with all required fields', async ({ page }) => {
    await page.goto('/add-game');

    await expect(page.getByRole('form', { name: 'Add game form' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /game title/i })).toBeVisible();
    await expect(page.getByRole('combobox', { name: /platform/i })).toBeVisible();
    await expect(page.getByRole('radiogroup', { name: /format/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /description/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /add game/i })).toBeVisible();
  });

  it('should have Physical as the default format', async ({ page }) => {
    await page.goto('/add-game');

    await expect(page.getByRole('radio', { name: 'Physical' })).toBeChecked();
    await expect(page.getByRole('radio', { name: 'Digital' })).not.toBeChecked();
  });

  it('should show validation errors when submitting without required fields', async ({ page }) => {
    await page.goto('/add-game');

    await page.getByRole('button', { name: /add game/i }).click();

    await expect(page.getByText('Game title cannot be empty')).toBeVisible();
    await expect(page.getByText('Platform name is required')).toBeVisible();
  });

  it('should clear validation error when the field is filled', async ({ page }) => {
    await page.goto('/add-game');

    await page.getByRole('button', { name: /add game/i }).click();
    await expect(page.getByText('Game title cannot be empty')).toBeVisible();

    await page.getByRole('textbox', { name: /game title/i }).fill('The Last of Us Part I');
    await page.getByRole('button', { name: /add game/i }).click();

    await expect(page.getByText('Game title cannot be empty')).toBeHidden();
  });

  it('should add a game successfully and show success message', async ({ page }) => {
    await page.goto('/add-game');

    await page.getByRole('textbox', { name: /game title/i }).fill('The Last of Us Part I');
    await page.getByRole('combobox', { name: /platform/i }).selectOption('PlayStation 5');

    await page.getByRole('button', { name: /add game/i }).click();

    await expect(page.getByText('Game added successfully')).toBeVisible();
  });

  it('should reset the form after successful submission', async ({ page }) => {
    await page.goto('/add-game');

    await page.getByRole('textbox', { name: /game title/i }).fill('God of War Ragnarök');
    await page.getByRole('combobox', { name: /platform/i }).selectOption('PlayStation 5');
    await page.getByRole('radio', { name: 'Digital' }).check();
    await page.getByRole('textbox', { name: /description/i }).fill('Epic sequel.');

    await page.getByRole('button', { name: /add game/i }).click();

    await expect(page.getByText('Game added successfully')).toBeVisible();
    await expect(page.getByRole('textbox', { name: /game title/i })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: /description/i })).toHaveValue('');
    await expect(page.getByRole('radio', { name: 'Physical' })).toBeChecked();
  });

  it('should allow closing the success message', async ({ page }) => {
    await page.goto('/add-game');

    await page.getByRole('textbox', { name: /game title/i }).fill('Horizon Forbidden West');
    await page.getByRole('combobox', { name: /platform/i }).selectOption('PlayStation 5');
    await page.getByRole('button', { name: /add game/i }).click();

    await expect(page.getByText('Game added successfully')).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByText('Game added successfully')).toBeHidden();
  });
});
