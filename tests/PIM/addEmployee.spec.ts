import { expect } from "@playwright/test";
import { test } from "../../app/fixtures/base.fixture";

test.describe("Add Employee Functionality", () => {
  test("User can add a new employee via UI", async ({ pages, page }) => {
    await pages.addEmployeePage.goTo(`/pim/viewEmployeeList`);
    await pages.addEmployeePage.clickTopbarMenuTab("Add Employee");
    await pages.addEmployeePage.fillAddEmployeeForm("Samuel", "L", "Jackson");
    await pages.addEmployeePage.saveEmployee();

    await expect(page).toHaveURL(/viewPersonalDetails\/empNumber\/\d+$/);
    await expect(pages.employeeListPage.editEmployeeContent).toBeVisible();
  });
});
