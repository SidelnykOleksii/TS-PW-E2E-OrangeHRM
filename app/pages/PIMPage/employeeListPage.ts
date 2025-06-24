import { Locator, Page } from "@playwright/test";
import { BasePimPage } from "./basePIMPage";

export class PimEmployeeList extends BasePimPage {
  readonly editEmployeeContent: Locator;
  readonly editEmployeeFirstNameField: Locator;
  readonly editEmployeeMiddleNameField: Locator;
  readonly editEmployeeLastNameField: Locator;
  readonly saveEditedEmployeeButton: Locator;

  constructor(page: Page) {
    super(page);

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
  }

  async editEmployeeFullName(
    firstName: string,
    middleName: string,
    lastName: string
  ) {
    // Temporary solution
    await this.page.waitForTimeout(3000);

    await this.editEmployeeFirstNameField.fill(firstName);
    await this.editEmployeeMiddleNameField.fill(middleName);
    await this.editEmployeeLastNameField.fill(lastName);
    await this.saveEditedEmployeeButton.click();
  }
}
