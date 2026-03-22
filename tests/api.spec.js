const { test, expect, request } = require("@playwright/test");
const data = require("../test-data/data.json");

let apiContext;

test.beforeAll(async () => {
  apiContext = await request.newContext({
    baseURL: data.baseURLs.jsonplaceholder,
  });
});

test.afterAll(async () => {
  await apiContext.dispose();
});

// TEST 1: GET REQUEST
test("Test 1: GET request", async () => {
  const response = await apiContext.get("/posts/1");

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body).toHaveProperty("id", 1);
  expect(body).toHaveProperty("title");
  expect(body).toHaveProperty("body");
  expect(body).toHaveProperty("userId");
});

// TEST 2: POST REQUEST
test("Test 2: POST request", async () => {
  const response = await apiContext.post("/posts", {
    data: {
      title: "Playwright Test Post",
      body: "This is a test post body",
      userId: 1,
    },
  });

  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body).toHaveProperty("id");
  expect(body.title).toBe("Playwright Test Post");
  expect(body.userId).toBe(1);
});

// TEST 3: PUT/PATCH REQUEST
test("Test 3: PUT/PATCH request", async () => {
  const response = await apiContext.patch("/posts/1", {
    data: {
      title: "Updated Title",
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.title).toBe("Updated Title");
});

// TEST 4: DELETE REQUEST
test("Test 4: DELETE request", async () => {
  const response = await apiContext.delete("/posts/1");

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body).toEqual({});
});

// TEST 5: QUERY PARAMS
test("Test 5: Query params", async () => {
  const response = await apiContext.get("/posts", {
    params: {
      userId: 1,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);
  body.forEach((post) => {
    expect(post.userId).toBe(1);
  });
});

// TEST 6: RESPONSE VALIDATION
test("Test 6: Response validation", async () => {
  const response = await apiContext.get("/posts/1");

  // Status
  expect(response.status()).toBe(200);

  // Headers
  const headers = response.headers();
  expect(headers["content-type"]).toContain("application/json");

  // JSON structure
  const body = await response.json();
  expect(body).toHaveProperty("id");
  expect(body).toHaveProperty("title");
  expect(body).toHaveProperty("body");
  expect(body).toHaveProperty("userId");

  // Data types
  expect(typeof body.id).toBe("number");
  expect(typeof body.title).toBe("string");
  expect(typeof body.body).toBe("string");
  expect(typeof body.userId).toBe("number");
});

// TEST 7: NEGATIVE API TEST
test("Test 7: Negative API test", async () => {
  // Invalid endpoint
  const notFoundResponse = await apiContext.get("/posts/99999");
  expect(notFoundResponse.status()).toBe(404);

  // Invalid data - POST with empty body
  const badResponse = await apiContext.post("/posts", {
    data: {},
  });
  expect(badResponse.status()).toBe(201);

  // Test against a different API that strictly validates
  const reqresContext = await request.newContext({
    baseURL: data.baseURLs.reqres,
  });
  const invalidLogin = await reqresContext.post("/api/login", {
    data: { email: "invalid@test.com" },
  });
  expect(invalidLogin.status()).toBe(403);
  const errorBody = await invalidLogin.text();
  expect(errorBody).toContain("error");
  await reqresContext.dispose();
});

// TEST 8: API CHAINING
test("Test 8: API chaining", async () => {
  // Step 1 — get list of posts
  const listResponse = await apiContext.get("/posts");
  expect(listResponse.status()).toBe(200);

  const posts = await listResponse.json();
  expect(posts.length).toBeGreaterThan(0);

  // Step 2 — take first post's userId
  const firstPost = posts[0];
  const userId = firstPost.userId;

  // Step 3 — use that userId to fetch that user
  const userResponse = await apiContext.get(`/users/${userId}`);
  expect(userResponse.status()).toBe(200);

  const user = await userResponse.json();
  expect(user.id).toBe(userId);
  expect(user).toHaveProperty("name");
  expect(user).toHaveProperty("email");
});

// TEST 9: DATA-DRIVEN API TEST
for (const id of data.apiIds) {
  test(`Test 9: Data-driven API test - post ID ${id}`, async () => {
    const response = await apiContext.get(`/posts/${id}`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(id);
    expect(body).toHaveProperty("title");
    expect(body).toHaveProperty("userId");
  });
}

// TEST 10: BASIC PERFORMANCE CHECK
test("Test 10: Basic performance check", async () => {
  const start = Date.now();
  const response = await apiContext.get("/posts");
  const end = Date.now();

  const responseTime = end - start;

  expect(response.status()).toBe(200);
  expect(responseTime).toBeLessThan(data.performance.maxResponseTimeMs);

  console.log(`Response time: ${responseTime}ms`);
});
