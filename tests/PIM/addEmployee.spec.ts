import { expect } from "@playwright/test";
import { test } from "../../app/fixtures/base.fixture";

test.describe("Add Employee Functionality", () => {
  const imageFormats = [
    { format: "png", path: "test-data/uploads/pimUploads/200x200.png" },
    { format: "jpeg", path: "test-data/uploads/pimUploads/200x200.jpeg" },
    { format: "gif", path: "test-data/uploads/pimUploads/200x200.gif" },
  ];

  test("User can add a new employee via UI", async ({ pages, page }) => {
    await pages.addEmployeePage.goTo(`/pim/viewEmployeeList`);
    await pages.addEmployeePage.clickTopbarMenuTab("Add Employee");
    await pages.addEmployeePage.fillAddEmployeeForm("Samuel", "L", "Jackson");
    await pages.addEmployeePage.saveEmployee();

    await expect(page).toHaveURL(/viewPersonalDetails\/empNumber\/\d+$/);
    await expect(pages.employeeListPage.editEmployeeContent).toBeVisible();

    await pages.employeeListPage.goTo(`pim/viewEmployeeList`);
    await pages.employeeListPage.deleteEmployeeByName("Samuel L Jackson");
  });

  imageFormats.forEach(({ format, path }) => {
    test(`User can upload image with ${format} during employee creation`, async ({
      pages, page
    }) => {
      await pages.addEmployeePage.goTo(`/pim/viewEmployeeList`);
      await pages.addEmployeePage.clickTopbarMenuTab("Add Employee");
      await pages.addEmployeePage.fillAddEmployeeForm(
        "Employee",
        `${format}`,
        "Image"
      );

      await pages.addEmployeePage.uploadEmployeeImage(path);
      await pages.addEmployeePage.uploadedImageIsVisibleDuringCreation();
      await pages.addEmployeePage.saveEmployee();
      
      await expect(page).toHaveURL(/viewPersonalDetails\/empNumber\/\d+$/);
      await expect(pages.employeeListPage.editEmployeeContent).toBeVisible();
      await pages.addEmployeePage.uploadedImageIsVisibleAfterCreation();

      await pages.employeeListPage.goTo(`pim/viewEmployeeList`);
      await pages.employeeListPage.deleteEmployeeByName(
        `Employee ${format} Image`
      );
    });
  });
});
