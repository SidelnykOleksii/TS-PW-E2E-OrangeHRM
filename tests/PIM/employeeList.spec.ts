import { expect } from "@playwright/test";
import { test } from "../../app/fixtures/employeeApi.fixtures";

test.describe("Employee List Functionality", () => {
  test("The employee's full name can be edited", async ({
    pages,
    createEmployeeByAPI,
  }) => {
    await pages.employeeListPage.goTo(
      `pim/viewPersonalDetails/empNumber/${createEmployeeByAPI.empNumber}`
    );
    await pages.employeeListPage.editEmployeeFullName(
      "First Edited",
      "Middle Edited",
      "Last Edited"
    );
    await expect(pages.employeeListPage.editEmployeeFirstNameField).toHaveValue(
      "First Edited"
    );
    await expect(
      pages.employeeListPage.editEmployeeMiddleNameField
    ).toHaveValue("Middle Edited");
    await expect(pages.employeeListPage.editEmployeeLastNameField).toHaveValue(
      "Last Edited"
    );
  });
});
