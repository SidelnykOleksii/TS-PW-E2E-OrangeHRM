import { Locator, Page } from "@playwright/test";
import { BasePimPage } from "./basePIMPage";
import { CommonTableComponent } from "../../ui/components/tableCommonComponent";
import { getElementByLabelText } from "../locatorsHelper";

export class PimEmployeeList extends BasePimPage {
  // edit employee
  readonly editEmployeeContent: Locator;
  readonly editEmployeeFirstNameField: Locator;
  readonly editEmployeeMiddleNameField: Locator;
  readonly editEmployeeLastNameField: Locator;
  readonly saveEditedEmployeeButton: Locator;

  // search employee
  readonly searchEmployeeNameField: Locator;
  readonly searchEmployeeButton: Locator;

  readonly table: CommonTableComponent;

  constructor(page: Page) {
    super(page);
    this.table = new CommonTableComponent(page);

    // edit employee
    this.editEmployeeContent = this.page.locator(
      ".orangehrm-edit-employee-content"
    );
    this.editEmployeeFirstNameField =
      this.editEmployeeContent.getByPlaceholder("First Name");
    this.editEmployeeMiddleNameField =
      this.editEmployeeContent.getByPlaceholder("Middle Name");
    this.editEmployeeLastNameField =
      this.editEmployeeContent.getByPlaceholder("Last Name");
    this.saveEditedEmployeeButton = this.page
      .locator("form")
      .filter({ hasText: "Employee Full Name" })
      .getByRole("button");

    // search employee
    this.searchEmployeeNameField = getElementByLabelText(page, "Employee Name");
    this.searchEmployeeButton = this.page.getByRole("button", {
      name: "Search",
    });
  }

  async editEmployeeFullName(
    firstName: string,
    middleName: string,
    lastName: string
  ) {
    // Temporary solution
    await this.page.waitForTimeout(2000);

    await this.editEmployeeFirstNameField.fill(firstName);
    await this.editEmployeeMiddleNameField.fill(middleName);
    await this.editEmployeeLastNameField.fill(lastName);
    await this.saveEditedEmployeeButton.click();
  }

  async deleteEmployeeByName(name: string) {
    await this.searchEmployeeByName(name);

    // Temporary solution
    await this.page.waitForTimeout(2000);

    await this.table.isRowByNameVisible(name);
    await this.table.deleteButton(name).click();
    await this.table.confirmDelete();
  }

  async searchEmployeeByName(name: string) {
    await this.searchEmployeeNameField.fill(name);
    await this.searchEmployeeButton.click();
  }
}
