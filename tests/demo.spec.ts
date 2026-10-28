import { expect, test } from "@playwright/test";

const demoTimeout = 45_000;

test("landing CTA opens the demo cabinet", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Попробовать демо" }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText("Д-р Искакова А.")).toBeVisible();
  await expect(page.getByText("Готовы начать демонстрационный приём?")).toBeVisible();
});

test("demo plays recording, processing pipeline, and SOAP draft", async ({ page }) => {
  test.setTimeout(demoTimeout);
  await page.goto("/demo");

  await expect(page.getByText("Синтетический пример. Нет микрофона, сервера или реального обмена с МИС.")).toBeVisible();
  await page.getByRole("button", { name: "Начать демо-запись" }).click();

  await expect(page.getByText("Сәлеметсіз бе! Проходите.")).toBeVisible({ timeout: 3_000 });
  await expect(page.getByText("из 01:32 · ускорение ×5")).toBeVisible();

  await page.getByRole("button", { name: /Протокол приёма/ }).click();
  await expect(page.getByText("Пайплайн обработки")).toBeVisible({ timeout: 25_000 });
  await expect(page.getByText("Распознавание речи")).toBeVisible();
  await expect(page.getByText("Деидентификация", { exact: true })).toBeVisible();
  await expect(page.getByText("Структурирование", { exact: true })).toBeVisible();
  await expect(page.getByText("Проверка полноты", { exact: true })).toBeVisible();

  await expect(page.getByText("Черновик готов — врач проверяет и подписывает")).toBeVisible({ timeout: 8_000 });
  await expect(page.getByText("Головокружение, преимущественно утром, ~3 недели")).toBeVisible();
  await expect(page.getByText("Клиническая проверка полноты")).toBeVisible();
});

test("MIS integration fills mapped fields only after the draft is ready", async ({ page }) => {
  test.setTimeout(demoTimeout);
  await page.goto("/demo");
  await page.getByRole("button", { name: /Запись приёма/ }).click();
  await page.getByRole("button", { name: /Протокол приёма/ }).click();
  await expect(page.getByText("Черновик готов — врач проверяет и подписывает")).toBeVisible({ timeout: 35_000 });

  await page.getByRole("button", { name: "МИС (EHR Push)" }).click();
  await expect(page.getByText("Поддерживаемые медицинские системы Казахстана")).toBeVisible();
  const pushButton = page.getByRole("button", { name: /Перенести все поля в DamuMed/ });
  await expect(pushButton).toBeEnabled();
  await pushButton.click();
  await expect(page.getByText("Данные протокола успешно переданы в МИС")).toBeVisible();
  await expect(page.getByText("Жалобы пациента").locator(".."))
    .toContainText("✓ Заполнено");
});

test("demo never requests microphone or external medical services", async ({ page }) => {
  const forbiddenHosts = ["damumed", "egov", "103.kz"];
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/demo");

  const mediaDevices = await page.evaluate(() => Boolean(navigator.mediaDevices?.getUserMedia));
  expect(mediaDevices).toBeTruthy();
  expect(requests.some((url) => forbiddenHosts.some((host) => url.includes(host)))).toBeFalsy();
  await expect(page.getByText("Нет микрофона, сервера или реального обмена с МИС.")).toBeVisible();
});
