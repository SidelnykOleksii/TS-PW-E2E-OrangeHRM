import { expect } from "@playwright/test";
import { BasePimPage } from "./basePIMPage";
import { CommonTableComponent } from "../../ui/components/tableCommonComponent";
import { ButtonComponent } from "../../ui/components/buttonComponent";
import { AutocompleteComponent } from "../../ui/components/autocompleteComponent";

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

  readonly table = new CommonTableComponent(this.page);
  readonly button = new ButtonComponent(this.page);
  readonly autocomplete = new AutocompleteComponent(this.page);

  async editEmployeeFullName(
    firstName: string,
    middleName: string,
    lastName: string
  ) {
    // The form starts empty and is populated by an async fetch of the
    // employee's current data; filling before that fetch resolves gets
    // silently clobbered once it lands (even after Save). Wait for it first.
    await expect(this.editEmployeeFirstNameField).not.toHaveValue("");

    await this.editEmployeeFirstNameField.fill(firstName);
    await this.editEmployeeMiddleNameField.fill(middleName);
    await this.editEmployeeLastNameField.fill(lastName);
    await this.saveEditedEmployeeButton.click();
  }

  async deleteEmployeeByName(name: string) {
    await this.searchEmployeeByName(name);

    await this.table.isRowByNameVisible(name);
    await this.table.deleteButton(name).click();
    await this.table.confirmDelete();
  }

  async searchEmployeeByName(name: string) {
    // Employee Name is an autocomplete: the search filter is driven by the
    // selected suggestion, not the raw typed text, so a plain fill() here
    // leaves the filter unapplied and the Search click returns every row.
    await this.autocomplete.typeText("Employee Name", name);
    await this.autocomplete.selectOption(name);
    await this.button.clickButtonByText("Search");
  }
}
