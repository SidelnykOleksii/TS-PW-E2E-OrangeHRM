import { test } from "../../app/fixtures/employeeApi.fixtures";
import { expect } from "@playwright/test";
import { ADMIN_DEFAULT_PASS } from "../../utils/credentials";
import { uniqueName } from "../../utils/unique";

test.describe("Admin/User Management", () => {
  test("Create new system user", async ({
    pages,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createEmployeeByAPI,
  }) => {
    const username = uniqueName("New Admin ");
    try {
      await test.step("Create system user", async () => {
        await pages.adminUserManagement.goTo("/admin/viewSystemUsers");
        await pages.adminUserManagement.clickAddButton();
        await pages.adminUserManagement.fillAddUserForm(
          "Admin",
          "First Middle Last",
          "Enabled",
          username,
          ADMIN_DEFAULT_PASS,
          ADMIN_DEFAULT_PASS
        );
        await pages.adminUserManagement.clickSaveButton();
        await expect(pages.adminUserManagement.table.table()).toBeVisible({ timeout: 8000 });
      });

      await test.step("Find user via search", async () => {
        await pages.adminUserManagement.goTo("/admin/viewSystemUsers");
        await pages.adminUserManagement.fillSearchSystemUserForm({
          username,
          employeeName: "First Middle Last",
        });
        await expect(pages.adminUserManagement.table.rowByName(username)).toBeVisible();

        const actualTableRows =
          await pages.adminUserManagement.table.getTableRows();
        await pages.adminUserManagement.table.expectTableRowsMatch(
          actualTableRows,
          [[username, "Admin", "First Last", "Enabled", null]]
        );
      });
    } finally {
      await test.step("Clean up created user", async () => {
        await pages.adminUserManagement.goTo("/admin/viewSystemUsers");
        await pages.adminUserManagement.fillSearchSystemUserForm({ username });
        // Guarded: if the "Create system user" step above failed, there is
        // nothing to delete — don't let that hang/timeout mask the real error.
        const row = pages.adminUserManagement.table.rowByName(username);
        const rowExists = await row
          .waitFor({ state: "visible", timeout: 5000 })
          .then(() => true)
          .catch(() => false);
        // eslint-disable-next-line playwright/no-conditional-in-test
        if (rowExists) {
          await pages.adminUserManagement.table.deleteButton(username).click();
          await pages.adminUserManagement.table.confirmDelete();
        }
      });
    }
  });
});
