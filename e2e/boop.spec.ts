import { test, expect } from '@playwright/test';

test('Place kittens and restart', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Expect a title "to contain" a substring.
  await expect(page.getByTestId("p0-kitten-count")).toHaveText("8");
  await expect(page.getByTestId("p1-kitten-count")).toHaveText("8");
  await page.getByTestId("1-1-square").click({timeout:10000});
  await page.getByTestId("place-kitten-button").click({timeout:10000});
  await expect(page.getByTestId("1-1-p0-kitten")).toBeTruthy()
  await expect(page.getByTestId("active-player")).toHaveText("Player:1")
  await expect(page.getByTestId("p0-kitten-count")).toHaveText("7");
  await expect(page.getByTestId("p1-kitten-count")).toHaveText("8");

  await page.getByTestId("Restart-button").click();
  await expect(page.getByTestId("p0-kitten-count")).toHaveText("8");
  await expect(page.getByTestId("p1-kitten-count")).toHaveText("8");
  await expect(page.getByTestId("active-player")).toHaveText("Player:0")
  
});

test('complete game', async ({page}) => {
  await page.goto('http://localhost:3000');
  await page.getByTestId("1-1-square").click({timeout:1000});
  await page.getByTestId("place-kitten-button").click({timeout:1000});

  await page.getByTestId("0-1-square").click({timeout:1000});
  await page.getByTestId("place-kitten-button").click({timeout:1000});

  await page.getByTestId("3-1-square").click({timeout:1000});
  await page.getByTestId("place-kitten-button").click({timeout:1000});

  await page.getByTestId("4-1-square").click({timeout:1000});
  await page.getByTestId("place-kitten-button").click({timeout:1000});

  await page.getByTestId("3-1-square").click({timeout:1000});
  await page.getByTestId("place-kitten-button").click({timeout:1000});

  await page.getByTestId("choose-to-age-button").click({timeout:1000});

  await page.getByTestId("age-button").click({timeout:1000});

  await page.getByTestId("3-1-square").click({timeout:1000});
  await page.getByTestId("place-kitten-button").click({timeout:1000});

  await page.getByTestId("3-3-square").click({timeout:1000});
  await page.getByTestId("place-cat-button").click({timeout:1000});
  await page.getByTestId("3-4-square").click({timeout:1000});
  await page.getByTestId("place-kitten-button").click({timeout:1000});
  await page.getByTestId("3-2-square").click({timeout:1000});
  await page.getByTestId("place-cat-button").click({timeout:1000});
  await page.getByTestId("0-0-square").click({timeout:1000});
  await page.getByTestId("place-kitten-button").click({timeout:1000});
  await page.getByTestId("3-1-square").click({timeout:1000});
  await page.getByTestId("place-cat-button").click({timeout:1000});

  await page.getByTestId("Play Again-button").click()
});
