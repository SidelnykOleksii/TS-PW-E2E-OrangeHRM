import { expect, Locator, Page } from "@playwright/test";
import { BasePimPage } from "./basePIMPage";
import { getElementByLabelText } from "../locatorsHelper";

export class PimAddEmployee extends BasePimPage {
  // create employee
  readonly employeeFirstNameField: Locator;
  readonly employeeMiddleNameField: Locator;
  readonly employeeLastNameField: Locator;
  readonly employeeIdField: Locator;
  readonly employeeUploadImageElement: Locator;
  readonly employeeUploadImageFileInput: Locator;
  readonly saveEmployeeButton: Locator;

  // edit employee
  readonly editEmployeeImage: Locator;

  constructor(page: Page) {
    super(page);

    // create employee
    this.employeeFirstNameField = this.page.getByPlaceholder("First Name");
    this.employeeMiddleNameField = this.page.getByPlaceholder("Middle Name");
    this.employeeLastNameField = this.page.getByPlaceholder("Last Name");
    this.employeeIdField = getElementByLabelText(page, "Employee Id");
    this.employeeUploadImageElement = this.page
      .locator("form")
      .getByRole("img", { name: "profile picture" });
    this.employeeUploadImageFileInput = this.page.locator(
      '//input[@class="oxd-file-input"]'
    );
    this.saveEmployeeButton = this.page.getByRole("button", { name: "Save" });

    // edit employee
    this.editEmployeeImage = this.page
      .locator(".orangehrm-edit-employee-image")
      .getByRole("img", { name: "profile picture" });
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

  async uploadEmployeeImage(imagePath: string) {
    const fileInput = this.employeeUploadImageFileInput;

    await this.employeeUploadImageElement.click();
    await fileInput.setInputFiles(imagePath);
  }

  async uploadedImageIsVisibleDuringCreation() {
    await expect(this.employeeUploadImageElement).toBeVisible();
    await expect(this.employeeUploadImageElement).toHaveAttribute(
      "src",
      /data:image\//
    );
  }

  async uploadedImageIsVisibleAfterCreation() {
    const url = this.page.url();
    const match = url.match(/empNumber\/(\d+)/);
    expect(match).not.toBeNull();
    const empNumber = match ? match[1] : "";

    await expect(this.editEmployeeImage).toBeVisible();
    await expect(this.editEmployeeImage).toHaveAttribute(
      "src",
      `/web/index.php/pim/viewPhoto/empNumber/${empNumber}`
    );
  }
}
