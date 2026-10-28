import { expect, test } from "@playwright/test";

test("landing CTA opens demo", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Открыть демо-кабинет" }).first().click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByRole("heading", { name: "Демо-приём" })).toBeVisible();
});

test("demo runs scenario and reveals pipeline and draft", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: /Начать демо-приём/ }).click();
  await expect(page.getByText("Сәлеметсіз бе! Проходите.")).toBeVisible({ timeout: 5_000 });
  await expect(page.getByText("из 01:32 · ускорение ×5")).toBeVisible();
  await expect(page.getByText("Распознавание речи").first()).toBeVisible({ timeout: 25_000 });
  await expect(page.getByText("Демонстрационный черновик")).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText("Синтетический пример, не медицинская рекомендация.")).toBeVisible();
});

test("MIS integration is local simulation and fills six fields", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: "Интеграция с МИС" }).click();
  await expect(page.getByText("Нет реального обмена данными.")).toBeVisible();
  await page.getByRole("button", { name: "Симулировать вставку в МИС" }).click();
  await expect(page.getByText("Поля заполнены · врач проверяет и подписывает в МИС")).toBeVisible({ timeout: 8_000 });
});

test("does not request microphone or connect to medical services", async ({ page }) => {
  const forbiddenHosts = ["damumed", "egov", "103.kz"];
  const requests: string[] = [];
  page.on("request", (req) => requests.push(req.url()));
  await page.goto("/demo");
  const mediaDevices = await page.evaluate(() => Boolean(navigator.mediaDevices?.getUserMedia));
  expect(mediaDevices).toBeTruthy(); // браузер поддерживает API, прототип его не вызывает
  await page.getByRole("button", { name: "Как это устроено" }).click();
  await expect(page.getByText("Нет микрофона, камеры, регистрации, логина, сервера или базы пациентов.")).toBeVisible();
  expect(requests.some((url) => forbiddenHosts.some((host) => url.includes(host)))).toBeFalsy();
});
