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

  test("The employee can be deleted", async ({ pages, page }) => {
    await pages.employeeListPage.goTo(`pim/viewEmployeeList`);

    await pages.addEmployeePage.clickTopbarMenuTab("Add Employee");
    await pages.addEmployeePage.fillAddEmployeeForm("Employee", "To", "Delete");
    await pages.addEmployeePage.saveEmployee();
    await expect(page).toHaveURL(/viewPersonalDetails\/empNumber\/\d+$/);
    await pages.employeeListPage.goTo(`pim/viewEmployeeList`);

    await pages.employeeListPage.deleteEmployeeByName("Employee To Delete");
    await expect(
      pages.employeeListPage.table.rowByName("Employee To Delete")
    ).toBeHidden();
  });
});
