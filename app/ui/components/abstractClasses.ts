import { Page } from "@playwright/test";

export abstract class ComponentHolder {
  constructor(protected page: Page) {}
}
