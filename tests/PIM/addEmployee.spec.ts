import { test, expect } from "@playwright/test";
import { LoginPage } from "../../app/pages/loginPage";
import { PimAddEmployee } from "../../app/pages/PIMPage/addEmployeePage";
import { LeftSideMenuComponent } from "../../app/ui/components/leftSideMenuComponents";

test.describe("Add Employee Functionality", () => {
  let loginPage: LoginPage;
  let pimAddEmployeePage: PimAddEmployee;
  let leftSideMenuComponent: LeftSideMenuComponent;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    pimAddEmployeePage = new PimAddEmployee(page);
    leftSideMenuComponent = new LeftSideMenuComponent(page);

    await loginPage.goto("/auth/login");
    await loginPage.login("admin", "admin123");

    await leftSideMenuComponent.clickLeftSideMenuItem("PIM");
    await pimAddEmployeePage.clickTopbarMenuTab("Add Employee");
  });

  test("User can add a new employee", async ({ page }) => {
    await pimAddEmployeePage.fillEmployeeForm("Samuel", "L", "Jackson");
    await pimAddEmployeePage.saveEmployee();

    await expect(page).toHaveURL(/viewPersonalDetails\/empNumber\/\d+$/);
  });
});
