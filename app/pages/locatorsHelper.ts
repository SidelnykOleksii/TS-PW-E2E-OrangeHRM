import { Page } from "@playwright/test";

export function getElementByLabelText(
  page: Page,
  labelText: string,
  elementSelector = "input"
) {
  return page.locator(
    `.oxd-input-group:has(label:has-text("${labelText}")) ${elementSelector}`
  );
}
