import { test, expect } from "@playwright/test";
import { PimAddEmployee } from "../../app/pages/PIMPage/addEmployeePage";
import { BASE_URL } from "../../utils/config";

test.describe("Add Employee Functionality", () => {
  let pimAddEmployeePage: PimAddEmployee;

  test.beforeEach(async ({ page }) => {
    pimAddEmployeePage = new PimAddEmployee(page);

    await page.goto(`${BASE_URL}/pim/viewEmployeeList`)
    await pimAddEmployeePage.clickTopbarMenuTab("Add Employee");
  });

  test("User can add a new employee", async ({ page }) => {
    await pimAddEmployeePage.fillEmployeeForm("Samuel", "L", "Jackson");
    await pimAddEmployeePage.saveEmployee();

    await expect(page).toHaveURL(/viewPersonalDetails\/empNumber\/\d+$/);
  });
});
