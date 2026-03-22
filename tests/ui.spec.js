const { expect } = require("@playwright/test");
const { test, data } = require("../fixtures/testSetup");
const { LoginPage, TodoPage } = require("../pages/appPages");

// TEST 1: PAGE LOAD VALIDATION
test("Test 1: Page load validation", async ({ saucePage }) => {
  await expect(saucePage).toHaveTitle(/Swag Labs/);
  await expect(saucePage.locator(".login_logo")).toBeVisible();
});

// TEST 2: LOCATORS VALIDATION
test("Test 2: Locators validation", async ({ saucePage }) => {
  // By CSS
  const usernameField = saucePage.locator("#user-name");
  await expect(usernameField).toBeVisible();

  // By role
  const loginButton = saucePage.getByRole("button", { name: "Login" });
  await expect(loginButton).toBeVisible();

  // By text
  const logo = saucePage.getByText("Swag Labs");
  await expect(logo).toBeVisible();
});

// TEST 3: USER ACTIONS
test("Test 3: User actions", async ({ todoPage }) => {
  const todo = new TodoPage(todoPage);

  // Enter text and submit
  await todo.addTodo("Buy groceries");
  await todo.expectTodoVisible("Buy groceries");

  // Add another
  await todo.addTodo("Write tests");
  await todo.expectTodoVisible("Write tests");

  // Toggle checkbox
  const firstTodo = todoPage.locator(".todo-list li").first();
  await firstTodo.locator(".toggle").click();
  await expect(firstTodo).toHaveClass(/completed/);
});

// TEST 4: ASSERTIONS
test("Test 4: Assertions", async ({ saucePage }) => {
  const loginPage = new LoginPage(saucePage);

  // Validate element is visible
  await expect(saucePage.locator("#user-name")).toBeVisible();

  // Validate attribute value
  await expect(saucePage.locator("#user-name")).toHaveAttribute(
    "placeholder",
    "Username",
  );

  // Validate URL change after login
  await loginPage.login(data.users.valid.username, data.users.valid.password);
  await expect(saucePage).toHaveURL(/inventory/);

  // Validate text content
  await expect(saucePage.locator(".title")).toHaveText("Products");
});

// TEST 5: WAITS AND DYNAMIC CONTENT
test("Test 5: Waits and dynamic content", async ({ internetPage }) => {
  // Navigate to dynamic loading example
  await internetPage.goto(
    "https://the-internet.herokuapp.com/dynamic_loading/1",
  );

  // Click start button
  await internetPage.locator("#start button").click();

  // Wait for loading to finish and content to appear
  await expect(internetPage.locator("#finish")).toBeVisible({ timeout: 10000 });
  await expect(internetPage.locator("#finish h4")).toHaveText("Hello World!");
});

// TEST 6: LOGIN FLOW
test("Test 6: Login flow", async ({ saucePage }) => {
  const loginPage = new LoginPage(saucePage);

  await loginPage.login(data.users.valid.username, data.users.valid.password);
  await loginPage.expectLoginSuccess();
});

// TEST 7: NEGATIVE LOGIN
test("Test 7: Negative login", async ({ saucePage }) => {
  const loginPage = new LoginPage(saucePage);

  await loginPage.login(
    data.users.invalid.username,
    data.users.invalid.password,
  );
  await loginPage.expectLoginError("Username and password do not match");
});

// TEST 8: COMPLEX UI HANDLING
test("Test 8: Complex UI handling", async ({ internetPage, context }) => {
  // PART 1: Alert handling
  await internetPage.goto(
    "https://the-internet.herokuapp.com/javascript_alerts",
  );

  internetPage.once("dialog", async (dialog) => {
    await expect(dialog.message()).toBe("I am a JS Alert");
    await dialog.accept();
  });
  await internetPage
    .locator("button", { hasText: "Click for JS Alert" })
    .click();
  await expect(internetPage.locator("#result")).toHaveText(
    "You successfully clicked an alert",
  );

  // PART 2: Iframe interaction
  await internetPage.goto("https://the-internet.herokuapp.com/iframe");
  // Close the popup if it appears
  const closeButton = internetPage.locator(".tox-notification__dismiss");
  if (await closeButton.isVisible({ timeout: 3000 })) {
    await closeButton.click();
  }
  const frame = internetPage.frameLocator("#mce_0_ifr");
  await frame.locator("#tinymce").click();
  await frame.locator("#tinymce").press("Control+a");
  await frame.locator("#tinymce").press("Delete");
  await frame.locator("#tinymce").type("Playwright iframe test");
  await expect(frame.locator("#tinymce")).toHaveText("Your content goes here.");

  // PART 3: New tab handling
  await internetPage.goto("https://the-internet.herokuapp.com/windows");
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    internetPage.locator("a", { hasText: "Click Here" }).click(),
  ]);
  await newPage.waitForLoadState();
  await expect(newPage).toHaveTitle("New Window");
});

// TEST 9: DATA-DRIVEN UI TEST
const users = [
  { ...require("../test-data/data.json").users.valid, expected: "success" },
  { ...require("../test-data/data.json").users.invalid, expected: "failure" },
  { ...require("../test-data/data.json").users.locked, expected: "failure" },
];

for (const user of users) {
  test(`Test 9: Data-driven login - ${user.username}`, async ({
    saucePage,
  }) => {
    const loginPage = new LoginPage(saucePage);
    await loginPage.login(user.username, user.password);

    if (user.expected === "success") {
      await loginPage.expectLoginSuccess();
    } else {
      await expect(saucePage.locator('[data-test="error"]')).toBeVisible();
    }
  });
}

// TEST 10: NETWORK VALIDATION
test("Test 10: Network validation", async ({ saucePage }) => {
  // Listen for the API request before triggering it
  const requestPromise = saucePage.waitForRequest(
    (req) => req.url().includes("saucedemo.com") && req.method() === "GET",
  );

  await saucePage.reload();
  const request = await requestPromise;

  expect(request.method()).toBe("GET");

  // Validate response
  const response = await request.response();
  expect(response.status()).toBe(200);
});
