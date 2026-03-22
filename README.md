# Playwright Mini Project

A Playwright automation project covering UI, API, and E2E testing concepts.

## Project Structure
```
testing101/
├── tests/
│   ├── ui.spec.js       # UI automation tests
│   ├── api.spec.js      # API automation tests
│   └── e2e.spec.js      # End-to-end tests
├── pages/
│   └── appPages.js      # Page Object Model
├── fixtures/
│   └── testSetup.js     # Reusable test setup
├── test-data/
│   └── data.json        # Test data
└── README.md
```

## Setup
```bash
npm install
npx playwright install
```

## Running Tests
```bash
# Run all tests
npx playwright test

# Run specific suite
npx playwright test tests/ui.spec.js
npx playwright test tests/api.spec.js
npx playwright test tests/e2e.spec.js

# Run with browser visible
npx playwright test --headed

# Run with Playwright UI
npx playwright test --ui
```

## Test Suites

### UI Tests (ui.spec.js) — 12 tests
| Test | What it validates |
|------|-------------------|
| Test 1: Page load validation | Page title and main heading visibility |
| Test 2: Locators validation | CSS, role, and text locator strategies |
| Test 3: User actions | Text input, button click, checkbox toggle |
| Test 4: Assertions | Visibility, text, URL change, attribute value |
| Test 5: Waits and dynamic content | Dynamic loading, auto-waiting without hard waits |
| Test 6: Login flow | Valid credentials, successful login |
| Test 7: Negative login | Invalid credentials, error message validation |
| Test 8: Complex UI handling | Alert popup, iframe interaction, new tab |
| Test 9: Data-driven UI test | Multiple users from data.json, valid and invalid |
| Test 10: Network validation | Request interception, response status validation |

### API Tests (api.spec.js) — 13 tests
| Test | What it validates |
|------|-------------------|
| Test 1: GET request | Status code, response structure |
| Test 2: POST request | Resource creation, response contains created data |
| Test 3: PUT/PATCH request | Resource update, updated fields validated |
| Test 4: DELETE request | Resource deletion, empty response |
| Test 5: Query params | Filtered response, all items match filter |
| Test 6: Response validation | Status, headers, JSON structure, data types |
| Test 7: Negative API test | Invalid endpoint 404, missing fields/forbidden access 400/403 |
| Test 8: API chaining | Get posts, extract userId, fetch matching user |
| Test 9: Data-driven API test | Multiple IDs from data.json, each validated |
| Test 10: Performance check | Response time under 2000ms threshold |

### E2E Tests (e2e.spec.js) — 2 tests
| Test | What it validates |
|------|-------------------|
| Test 1: Complete user flow | Login → add to cart → navigate to cart → validate |
| Test 2: Negative E2E flow | Locked user blocked, stays on login page |

## Key Concepts Demonstrated

- **Page Object Model** — reusable methods in `appPages.js`, no raw selectors in tests
- **Fixtures** — shared setup in `testSetup.js`, automatic navigation before each test
- **Data-driven testing** — all credentials and IDs read from `data.json`
- **Auto-waiting** — no hard waits, Playwright assertions retry automatically
- **API chaining** — output of one request used as input to next
- **Network interception** — validating requests triggered by UI actions
- **Negative testing** — invalid inputs, locked users, nonexistent endpoints
- **Performance testing** — response time validated against defined threshold