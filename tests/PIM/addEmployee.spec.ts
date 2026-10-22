import { expect } from "@playwright/test";
import { test } from "../../app/fixtures/employeeApi.fixtures";
import { uniqueName } from "../../utils/unique";

test.describe("Add Employee Functionality", () => {
  const validImageFormats = [
    { format: "png", path: "test-data/uploads/pimUploads/200x200.png" },
    { format: "jpeg", path: "test-data/uploads/pimUploads/200x200.jpeg" },
    { format: "gif", path: "test-data/uploads/pimUploads/200x200.gif" },
  ];

  const invalidImageFormats = [
    { format: "txt", path: "test-data/uploads/pimUploads/200x200.txt" },
    { format: "xls", path: "test-data/uploads/pimUploads/200x200.xls" },
  ];

  test("User can add a new employee via UI", async ({
    pages,
    page,
    apiClient,
  }) => {
    const lastName = uniqueName("Jackson");
    let empNumber = "";
    try {
      await pages.addEmployeePage.goTo(`/pim/viewEmployeeList`);
      await pages.addEmployeePage.clickTopbarMenuTab("Add Employee");
      await pages.addEmployeePage.fillAddEmployeeForm("Samuel", "L", lastName);
      await pages.addEmployeePage.saveEmployee();

      await expect(page).toHaveURL(/viewPersonalDetails\/empNumber\/\d+$/);
      await expect(pages.employeeListPage.editEmployeeContent).toBeVisible();
      empNumber = await pages.addEmployeePage.extractEmpNumberFromUrl(
        page.url()
      );
    } finally {
      // Only cleans up if creation actually succeeded; skip otherwise.
      // eslint-disable-next-line playwright/no-conditional-in-test
      if (empNumber) {
        await apiClient.employeeController.deleteEmployee(empNumber);
      }
    }
  });

  validImageFormats.forEach(({ format, path }) => {
    test(`User can upload image with ${format} format during employee creation`, async ({
      pages,
      page,
      deleteEmployeeByAPI,
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

      await expect(pages.employeeListPage.editEmployeeContent).toBeVisible({
        timeout: 7000,
      });
      await pages.addEmployeePage.uploadedImageIsVisibleAfterCreation();

      const empNumber = await pages.addEmployeePage.extractEmpNumberFromUrl(
        page.url()
      );
      await deleteEmployeeByAPI(empNumber);
    });
  });

  invalidImageFormats.forEach(({ format, path }) => {
    test(`Image with ${format} format can't be uploaded`, async ({ pages }) => {
      await pages.addEmployeePage.goTo(`/pim/viewEmployeeList`);
      await pages.addEmployeePage.clickTopbarMenuTab("Add Employee");
      await pages.addEmployeePage.fillAddEmployeeForm(
        "Employee",
        `${format}`,
        "Image"
      );
      await pages.addEmployeePage.uploadEmployeeImage(path);
      await expect(
        pages.addEmployeePage.employeeUploadImageErrorMessage
      ).toBeVisible();
    });
  });
});
