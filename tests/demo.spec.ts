import { expect, test } from "@playwright/test";

const demoTimeout = 60_000;

test("landing CTA opens the demo cabinet", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Попробовать демо" }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText("Д-р Искакова А.")).toBeVisible();
  await expect(page.getByText("Шаг 1 из")).toBeVisible();
});

test("tour steps are shown and can be skipped", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByText("Нажмите «Новый приём»")).toBeVisible();
  await page.getByRole("button", { name: "Далее" }).click();
  await expect(page.getByText("Шаг 2 из")).toBeVisible();
  await page.getByRole("button", { name: "Пропустить" }).click();
  await expect(page.getByText("Шаг 1 из")).not.toBeVisible();
  await expect(page.getByText("Готовы начать демонстрационный приём?")).toBeVisible();
});

test("new visit form starts recording after entering patient name", async ({ page }) => {
  test.setTimeout(demoTimeout);
  await page.goto("/demo");
  // пропускаем тур
  await page.getByRole("button", { name: "Пропустить" }).click();

  await page.getByRole("button", { name: "Новый приём" }).click();
  await expect(page.getByText("Как вас зовут?")).toBeVisible();
  // пустое имя — кнопка неактивна
  await expect(page.getByRole("button", { name: "Начать приём" })).toBeDisabled();

  await page.getByPlaceholder("Например: Айгерим Ибрагимова").fill("Айгерим Ибрагимова");
  await page.getByRole("button", { name: "Начать приём" }).click();

  // визит создан и запись идёт автоматически
  await expect(page.getByText("Сәлеметсіз бе! Проходите.")).toBeVisible({ timeout: 5_000 });
  await expect(page.getByText("из 01:32 · ускорение ×5")).toBeVisible();
  await expect(page.getByText("Ожидает запись")).not.toBeVisible();
});

test("demo plays recording, processing pipeline, and SOAP draft", async ({ page }) => {
  test.setTimeout(demoTimeout);
  await page.goto("/demo");

  await expect(page.getByText("Синтетический пример. Нет микрофона, сервера или реального обмена с МИС.")).toBeVisible();
  await page.getByRole("button", { name: "Пропустить" }).click();
  await page.getByRole("button", { name: "Начать демо-запись" }).click();

  await expect(page.getByText("Сәлеметсіз бе! Проходите.")).toBeVisible({ timeout: 3_000 });
  await expect(page.getByText("из 01:32 · ускорение ×5")).toBeVisible();

  await page.getByRole("tab", { name: /Протокол приёма/ }).click();
  await expect(page.getByText("Пайплайн обработки")).toBeVisible({ timeout: 25_000 });
  await expect(page.getByText("Деидентификация", { exact: true })).toBeVisible();
  await expect(page.getByText("Структурирование", { exact: true })).toBeVisible();
  await expect(page.getByText("Проверка полноты", { exact: true })).toBeVisible();

  await expect(page.getByText("Черновик готов — врач проверяет и подписывает")).toBeVisible({ timeout: 8_000 });
  await expect(page.getByText("Головокружение, преимущественно утром, ~3 недели")).toBeVisible();
  await expect(page.getByText("Клиническая проверка полноты")).toBeVisible();

  // Финал сценария: подписать документы → праздник с рекомендациями
  await page.getByRole("button", { name: "Подписать документы" }).click();
  await expect(page.getByText("Документы подписаны и отправлены в МИС")).toBeVisible();
  await expect(page.getByRole("button", { name: /Подписано/ })).toBeDisabled();

  await expect(page.getByText("Вот что можно попробовать дальше:")).toBeVisible({ timeout: 5_000 });
  await page.getByRole("button", { name: "Завершить тур" }).click();
  await expect(page.getByText("Вот что можно попробовать дальше:")).not.toBeVisible();
});

test("chat panel collapses and expands with hints", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: "Пропустить" }).click();

  // Подсказка над чатом видна и закрывается
  await expect(page.getByText("Также у вас есть ассистент")).toBeVisible();
  await page.getByRole("button", { name: "Понятно" }).last().click();
  await expect(page.getByText("Также у вас есть ассистент")).not.toBeVisible();

  // Сворачиваем панель вправо
  await page.getByRole("button", { name: "Скрыть ассистента" }).click();
  await expect(page.getByRole("button", { name: "Показать ассистента" })).toBeVisible();

  // Возвращаем язычком
  await page.getByRole("button", { name: "Показать ассистента" }).click();
  await expect(page.getByRole("button", { name: "Скрыть ассистента" })).toBeVisible();
  await expect(page.getByPlaceholder("Здесь вы можете спросить ассистента о чём угодно...")).toBeVisible();
});

test("MIS integration fills mapped fields only after the draft is ready", async ({ page }) => {
  test.setTimeout(demoTimeout);
  await page.goto("/demo");
  await page.getByRole("button", { name: "Пропустить" }).click();
  await page.getByRole("button", { name: /Запись приёма/ }).click();
  await page.getByRole("tab", { name: /Протокол приёма/ }).click();
  await expect(page.getByText("Черновик готов — врач проверяет и подписывает")).toBeVisible({ timeout: 35_000 });

  await page.getByRole("button", { name: "МИС (EHR Push)" }).click();
  await expect(page.getByText("Поддерживаемые медицинские системы Казахстана")).toBeVisible();
  const pushButton = page.getByRole("button", { name: /Перенести все поля в DamuMed/ });
  await expect(pushButton).toBeEnabled();
  await pushButton.click();
  await expect(page.getByText("Данные протокола успешно переданы в МИС")).toBeVisible();
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
