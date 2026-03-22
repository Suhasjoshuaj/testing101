const { test: base } = require("@playwright/test");
const data = require("../test-data/data.json");

const test = base.extend({
  saucePage: async ({ page }, use) => {
    await page.goto(data.baseURLs.ui);
    await use(page);
  },

  todoPage: async ({ page }, use) => {
    await page.goto(data.baseURLs.todo);
    await use(page);
  },

  internetPage: async ({ page }, use) => {
    await page.goto(data.baseURLs.internet);
    await use(page);
  },
});

module.exports = { test, data };
