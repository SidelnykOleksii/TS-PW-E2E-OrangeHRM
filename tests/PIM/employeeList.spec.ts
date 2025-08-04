import { expect } from "@playwright/test";
import { test } from "../../app/fixtures/employeeApi.fixtures";
import {
  expectedColumnTitles,
  searchEmployeeByNameExpectedRows,
} from "../../test-data/pim/employeeTableTestData";
import { createCustomEmployee } from "../../app/api/controllers/employeeController";

test.describe("Employee List Functionality", () => {
  test("The employee's full name can be edited", async ({
    pages,
    apiClient,
  }) => {
    const { empNumber } = await createCustomEmployee(apiClient, {
      firstName: "Employee",
      middleName: "To",
      lastName: "Edit",
    });
    await pages.employeeListPage.goTo(
      `pim/viewPersonalDetails/empNumber/${empNumber}`
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
    await apiClient.employeeController.deleteEmployee(empNumber);
  });

  test("The employee can be deleted", async ({ pages, apiClient }) => {
    await createCustomEmployee(apiClient, {
      firstName: "Employee",
      middleName: "To",
      lastName: "Delete",
    });
    await pages.employeeListPage.goTo(`pim/viewEmployeeList`);

    await pages.employeeListPage.deleteEmployeeByName("Employee To Delete");
    await expect(
      pages.employeeListPage.table.rowByName("Employee To Delete")
    ).toBeHidden();
  });

  test("User can search employee by Employee Name", async ({
    pages,
    page,
    apiClient,
  }) => {
    const { empNumber } = await createCustomEmployee(apiClient, {
      firstName: "SearchFirst",
      middleName: "SearchMiddle",
      lastName: "SearchLast",
    });
    await pages.employeeListPage.goTo(`pim/viewEmployeeList`);
    await pages.employeeListPage.searchEmployeeByName(
      "SearchFirst SearchMiddle"
    );
    await page.waitForTimeout(2000);
    await pages.employeeListPage.table.isRowByNameVisible(
      "SearchFirst SearchMiddle"
    );

    const tableColumnTitles =
      await pages.employeeListPage.table.getColumnTitleTexts();
    expect(tableColumnTitles).toEqual(expectedColumnTitles);

    const actualTableRows = await pages.employeeListPage.table.getTableRows();
    await pages.employeeListPage.table.expectTableRowsMatch(
      actualTableRows,
      searchEmployeeByNameExpectedRows
    );
    await apiClient.employeeController.deleteEmployee(empNumber);
  });
});
