import { BasePage } from "../basePage";
import { DropdownComponent } from "../../ui/components/dropdownComponent";
import { ButtonComponent } from "../../ui/components/buttonComponent";
import { CommonTableComponent } from "../../ui/components/tableCommonComponent";
import { getElementByLabelText } from "../locatorsHelper";
import { AutocompleteComponent } from "../../ui/components/autocompleteComponent";

export class AdminUserManagement extends BasePage {
  private usernameField = getElementByLabelText(this.page, "Username");
  private passwordField = getElementByLabelText(this.page, "Password");
  private confirmPasswordField = getElementByLabelText(
    this.page,
    "Confirm Password"
  );

  readonly dropdown = new DropdownComponent(this.page);
  readonly button = new ButtonComponent(this.page);
  readonly table = new CommonTableComponent(this.page);
  readonly autocomplete = new AutocompleteComponent(this.page);

  async fillAddUserForm(
    userRoleOption: string,
    employeeName: string,
    statusOption: string,
    username: string,
    password: string,
    confirmPassword: string
  ) {
    await this.page.waitForTimeout(2000);
    await this.dropdown.selectDropdownOption("User Role", userRoleOption);
    await this.autocomplete.fillAutocompleteField(
      "Employee Name",
      employeeName
    );
    await this.dropdown.selectDropdownOption("Status", statusOption);
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.confirmPasswordField.fill(confirmPassword);
  }

  async fillSearchSystemUserForm({
    username,
    userRole,
    employeeName,
    status,
  }: {
    username?: string;
    userRole?: string;
    employeeName?: string;
    status?: string;
  }) {
    if (username !== undefined) {
      await this.usernameField.fill(username);
    }
    if (userRole !== undefined) {
      await this.dropdown.selectDropdownOption("User Role", userRole);
    }
    if (employeeName !== undefined) {
      await this.autocomplete.fillAutocompleteField(
        "Employee Name",
        employeeName
      );
    }
    if (status !== undefined) {
      await this.dropdown.selectDropdownOption("Status", status);
    }
    await this.clickSearchButton();
  }

  async clickAddButton() {
    await this.button.clickButtonByText("Add");
  }

  async clickSaveButton() {
    await this.button.clickButtonByText("Save");
  }

  async clickSearchButton() {
    await this.button.clickButtonByText("Search");
  }
}
