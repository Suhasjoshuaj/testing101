const { expect } = require('@playwright/test');
const { test, data } = require('../fixtures/testSetup');
const { LoginPage, TodoPage } = require('../pages/appPages');

// TEST 1: COMPLETE USER FLOW
test('Test 1: Complete user flow', async ({ saucePage }) => {
  const loginPage = new LoginPage(saucePage);

  // Login
  await loginPage.login(data.users.valid.username, data.users.valid.password);
  await loginPage.expectLoginSuccess();

  // Add item to cart
  await saucePage.locator('.inventory_item').first().locator('button').click();

  // Validate cart badge updates
  await expect(saucePage.locator('.shopping_cart_badge')).toHaveText('1');

  // Go to cart
  await saucePage.locator('.shopping_cart_link').click();
  await expect(saucePage).toHaveURL(/cart/);

  // Validate item is in cart
  await expect(saucePage.locator('.cart_item')).toBeVisible();
});

// TEST 2: NEGATIVE END-TO-END FLOW
test('Test 2: Negative end-to-end flow', async ({ saucePage }) => {
  const loginPage = new LoginPage(saucePage);

  // Login with locked out user
  await loginPage.login(data.users.locked.username, data.users.locked.password);

  // Validate system blocks the user
  await loginPage.expectLoginError('Sorry, this user has been locked out');

  // Validate user stays on login page
  await expect(saucePage).toHaveURL(/saucedemo/);
  await expect(saucePage.locator('#login-button')).toBeVisible();
});