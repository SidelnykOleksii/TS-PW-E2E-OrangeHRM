import { test as base } from "@playwright/test";
import { PageManager } from "../pages/pageManager";
import { ControllersManager } from "../api/controllers/controllersManager";

type MyPages = {
  pages: PageManager;
  apiClient: ControllersManager;
};

export const test = base.extend<MyPages>({
  pages: ({ page }, use) => {
    const pages = new PageManager(page);
    use(pages);
  },
  apiClient: ({ request }, use) => {
    const apiClient = new ControllersManager(request);
    use(apiClient);
  },
});
