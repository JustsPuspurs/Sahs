// tests/MoveList.test.jsx
import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import MoveList from '../resources/js/Pages/MoveList';

test.describe('MoveList Component', () => {
  test('renders move list correctly based on move history', async ({ mount }) => {
    // Define a sample move history data
    const movePairs = [
      { white: 'e4', black: 'e5' },
      { white: 'Nf3', black: 'Nc6' },
      { white: 'Bb5', black: 'a6' },
    ];

    // Mount the component in a browser context
    const component = await mount(<MoveList movePairs={movePairs} />);

    // Verify that table headers are visible
    await expect(component.locator('text=White')).toBeVisible();
    await expect(component.locator('text=Black')).toBeVisible();

    // Verify that each move appears
    for (const pair of movePairs) {
      await expect(component.locator(`text=${pair.white}`)).toBeVisible();
      await expect(component.locator(`text=${pair.black}`)).toBeVisible();
    }

    // Optionally, verify that the total number of rows equals the header row + one per move pair
    const rowCount = await component.locator('role=row').count();
    expect(rowCount).toBe(movePairs.length + 1);
  });
});