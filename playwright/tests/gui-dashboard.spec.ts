import { test, expect, type Page } from '@playwright/test';
import { login, isValidTimestamp, isValidEmail } from '../utils/helpers';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.describe('dashboard', () => {
  test('Landing page loaded as expected', async ({ page }) => {
    // Validate header bar
    await page.getByRole('img', { name: 'Comms Search' }).click();
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Search' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
    // Validate Dashboard Page Structure
    await expect(page.getByRole('heading', { name: 'Last 30 days' })).toBeVisible();
    await page.getByText('Total Messages').click();
    await expect(page.getByText('Total Actions')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Most recent messages' })).toBeVisible();
  });

  test('Dashboard displays most recent messages with valid email addresses', async ({ page }) => {
    // Wait for the messages to load
    await page.waitForSelector('//ul[@role="list"]/li');

    // Locate all message items
    const messageItems = page.locator('//ul[@role="list"]/li');

    // Get the actual count of message items
    const messageCount = await messageItems.count();

    // Check if there are at least 10 message items
    expect(messageCount).toBeGreaterThanOrEqual(10);

    // Iterate through each message item and validate its content
    for (let i = 0; i < messageCount; i++) {
      const itemXPath = `(//ul[@role="list"]/li)[${i + 1}]`;

      // Check email
      const emailElement = page.locator(`${itemXPath}//p[contains(@class, "text-gray-900")]/div`);
      await expect(emailElement).toBeVisible();
      const emailText = await emailElement.innerText();
      expect(isValidEmail(emailText), `Email "${emailText}" is not valid`).toBeTruthy();

      // Check if subject exists and is not empty
      const subjectElement = page.locator(`${itemXPath}//p[contains(@class, "text-gray-500")]/span`);
      await expect(subjectElement).toBeVisible();
      const subjectText = await subjectElement.innerText();
      expect(subjectText.length).toBeGreaterThan(0);

      // Check if timestamp exists and is valid
      const timestampElement = page.locator(`${itemXPath}//div[@class="flex shrink-0 items-center gap-x-4"]/div/p`);
      await expect(timestampElement).toBeVisible();
      const timestampText = await timestampElement.innerText();
      expect(isValidTimestamp(timestampText), `Timestamp "${timestampText}" is not valid`).toBeTruthy();
    }
  });

  test('Dashboard displays messages in ascending order by creation date', async ({ page }) => {
    // Wait for the messages to load
    await page.waitForSelector('//ul[@role="list"]/li');
  
    // Locate all message items
    const messageItems = page.locator('//ul[@role="list"]/li');
  
    // Get the actual count of message items
    const messageCount = await messageItems.count();
  
    // Check if there are at least 2 message items to compare
    expect(messageCount).toBeGreaterThanOrEqual(2);
  
    let previousTimestamp = 0;
  
    // Iterate through each message item and validate the order
    for (let i = 0; i < messageCount; i++) {
      const itemXPath = `(//ul[@role="list"]/li)[${i + 1}]`;
  
      // Get the timestamp element
      const timestampElement = page.locator(`${itemXPath}//div[@class="flex shrink-0 items-center gap-x-4"]/div/p`);
      await expect(timestampElement).toBeVisible();
      const timestampText = await timestampElement.innerText();
  
      // Convert the timestamp text to a Date object
      const currentTimestamp = new Date(timestampText).getTime();
  
      if (i > 0) {
        // Compare the current timestamp with the previous one
        expect(currentTimestamp).toBeGreaterThanOrEqual(previousTimestamp);
      }
  
      previousTimestamp = currentTimestamp;
    }
  });

  test('Dashboard statistics layout and UX elements', async ({ page }) => {
    // 1. Verify the 2-column layout
    const statsContainer = page.locator('dl.grid.grid-cols-2');
    await expect(statsContainer).toBeVisible();
    const statCards = statsContainer.locator('> div');
    expect(await statCards.count()).toBe(2);
  
    // 2. Verify Total Messages stats card
    const messagesCard = statCards.nth(0);
    await expect(messagesCard.getByText('Total Messages')).toBeVisible();
    await expect(messagesCard.locator('div.text-2xl')).toBeVisible(); // Current month value
    await expect(messagesCard.locator('span.text-sm')).toBeVisible(); // Previous month reference
    const messagesChangeElement = messagesCard.locator('div.inline-flex');
    await expect(messagesChangeElement).toBeVisible(); // Percentage change
  
    // 3. Verify Total Actions stats card
    const actionsCard = statCards.nth(1);
    await expect(actionsCard.getByText('Total Actions')).toBeVisible();
    await expect(actionsCard.locator('div.text-2xl')).toBeVisible(); // Current month value
    await expect(actionsCard.locator('span.text-sm')).toBeVisible(); // Previous month reference
    const actionsChangeElement = actionsCard.locator('div.inline-flex');
    await expect(actionsChangeElement).toBeVisible(); // Percentage change
  
    // 4. Verify percentage format with regex
    const percentageRegex = /(Increased|Decreased) by\s+\d+(\.\d+)?%/;
    expect(await messagesChangeElement.innerText()).toMatch(percentageRegex);
    expect(await actionsChangeElement.innerText()).toMatch(percentageRegex);
  
    // 5. Verify color coding
    const messagesColorClass = await messagesChangeElement.getAttribute('class');
    const actionsColorClass = await actionsChangeElement.getAttribute('class');
  
    if (await messagesChangeElement.innerText().then(text => text.startsWith('Increased'))) {
      expect(messagesColorClass).toContain('text-green-400');
    } else {
      expect(messagesColorClass).toContain('text-red-400');
    }
  
    if (await actionsChangeElement.innerText().then(text => text.startsWith('Increased'))) {
      expect(actionsColorClass).toContain('text-green-400');
    } else {
      expect(actionsColorClass).toContain('text-red-400');
    }
  });

  test('Dashboard statistics percentage calculation', async ({ page }) => {
    const statsContainer = page.locator('dl.grid.grid-cols-2');
    const statCards = statsContainer.locator('> div');
  
    // Helper function to calculate percentage change
    const calculatePercentageChange = (current: number, previous: number) => {
      return ((current - previous) / previous) * 100;
    };
  
    // Helper function to validate percentage
    const validatePercentage = async (card: any, cardName: string) => {
      const statsText = await card.locator('div.flex.items-baseline').innerText();
      
      // Use regex to extract numbers from the text
      const numbers = statsText.match(/\d+/g);
      if (!numbers || numbers.length < 2) {
        throw new Error(`Unable to extract two numbers from ${cardName} stats text: ${statsText}`);
      }
  
      const currentValue = parseInt(numbers[0]);
      const previousValue = parseInt(numbers[1]);
  
      const displayedChangeText = await card.locator('div.inline-flex').innerText();
      
      const expectedPercentage = calculatePercentageChange(currentValue, previousValue);
      const displayedPercentage = parseFloat(displayedChangeText.match(/-?\d+(\.\d+)?/)[0]);
  
      expect(Math.abs(displayedPercentage - expectedPercentage)).toBeLessThan(0.1);
    };
  
    // Validate Total Messages percentage
    await validatePercentage(statCards.nth(0), 'Total Messages');
  
    // Validate Total Actions percentage
    await validatePercentage(statCards.nth(1), 'Total Actions');
  });
  
  test('Unauthenticated user is redirected to login when accessing dashboard directly', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
  });

  test('User with invalid session is redirected to login', async ({ page, context }) => {
    // Set an invalid session cookie
    await context.addCookies([
      { name: 'comms_auth', value: 'invalid_session_id', url: 'http://localhost:5173' }
    ]);

    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });
});