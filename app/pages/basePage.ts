import { Page } from "@playwright/test";
import { BASE_URL } from "../../utils/config";

export abstract class BasePage {
  constructor(protected page: Page) {}

  async goTo(path: string) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    await this.page.goto(`${BASE_URL}${normalizedPath}`);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("load");
  }
}
