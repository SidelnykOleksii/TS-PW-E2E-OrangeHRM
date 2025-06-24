import { Locator, Page } from "@playwright/test";
import { BasePimPage } from "./basePIMPage";

export class PimAddEmployee extends BasePimPage {
  readonly employeeFirstNameField: Locator;
  readonly employeeMiddleNameField: Locator;
  readonly employeeLastNameField: Locator;
  readonly employeeIdField: Locator;
  readonly saveEmployeeButton: Locator;

  constructor(page: Page) {
    super(page);

    this.employeeFirstNameField = this.page.getByPlaceholder("First Name");
    this.employeeMiddleNameField = this.page.getByPlaceholder("Middle Name");
    this.employeeLastNameField = this.page.getByPlaceholder("Last Name");
    this.employeeIdField = this.page.locator(
      "//label[text()='Employee Id']/ancestor::div[contains(@class, 'input-field-bottom-space')]//input"
    );
    this.saveEmployeeButton = this.page.getByRole("button", { name: "Save" });
  }

  async fillAddEmployeeForm(
    firstName: string,
    middleName: string,
    lastName: string,
    employeeId?: string
  ) {
    await this.employeeFirstNameField.fill(firstName);
    await this.employeeMiddleNameField.fill(middleName);
    await this.employeeLastNameField.fill(lastName);
    await this.employeeIdField.clear();
    if (employeeId) {
      await this.employeeIdField.fill(employeeId);
    }
  }

  async saveEmployee() {
    await this.saveEmployeeButton.click();
  }
}
