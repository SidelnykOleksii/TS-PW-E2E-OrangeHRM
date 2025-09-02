import { test } from "../../app/fixtures/employeeApi.fixtures";
import { expect } from "@playwright/test";
import { ADMIN_DEFAULT_PASS } from "../../utils/credentials";

test.describe("Admin/User Management", () => {
  test("Create new system user", async ({
    pages,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createEmployeeByAPI,
  }) => {
    await pages.adminUserManagement.goTo("/admin/viewSystemUsers");
    await pages.adminUserManagement.clickAddButton();
    await pages.adminUserManagement.fillAddUserForm(
      "Admin",
      "First Middle Last",
      "Enabled",
      "New Admin",
      ADMIN_DEFAULT_PASS,
      ADMIN_DEFAULT_PASS
    );
    await pages.adminUserManagement.clickSaveButton();
    await expect(pages.adminUserManagement.table.table()).toBeVisible({ timeout: 8000 });

    await pages.adminUserManagement.goTo("/admin/viewSystemUsers");
    await pages.adminUserManagement.fillSearchSystemUserForm({
      username: "New Admin",
      employeeName: "First Middle Last",
    });
    await expect(pages.adminUserManagement.table.rowByName("New Admin")).toBeVisible();

    const actualTableRows =
      await pages.adminUserManagement.table.getTableRows();
    await pages.adminUserManagement.table.expectTableRowsMatch(
      actualTableRows,
      [["New Admin", "Admin", "First Last", "Enabled", null]]
    );
  });
});
