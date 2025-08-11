import { BasePimPage } from "./basePIMPage";
import { CommonTableComponent } from "../../ui/components/tableCommonComponent";
import { ButtonComponent } from "../../ui/components/buttonComponent";
import { getElementByLabelText } from "../locatorsHelper";

export class PimEmployeeList extends BasePimPage {
  // edit employee
  readonly editEmployeeContent = this.page.locator(
    ".orangehrm-edit-employee-content"
  );
  readonly editEmployeeFirstNameField =
    this.editEmployeeContent.getByPlaceholder("First Name");
  readonly editEmployeeMiddleNameField =
    this.editEmployeeContent.getByPlaceholder("Middle Name");
  readonly editEmployeeLastNameField =
    this.editEmployeeContent.getByPlaceholder("Last Name");
  private saveEditedEmployeeButton = this.page
    .locator("form")
    .filter({ hasText: "Employee Full Name" })
    .getByRole("button");

  // search employee
  private searchEmployeeNameField = getElementByLabelText(
    this.page,
    "Employee Name"
  );

  readonly table = new CommonTableComponent(this.page);
  readonly button = new ButtonComponent(this.page);

  async editEmployeeFullName(
    firstName: string,
    middleName: string,
    lastName: string
  ) {
    // Temporary solution
    await this.page.waitForTimeout(5000);

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
    await this.button.clickButtonByText("Search");
  }
}
