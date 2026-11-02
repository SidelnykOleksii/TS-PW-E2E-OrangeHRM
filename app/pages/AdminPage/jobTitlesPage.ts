import { BasePage } from "../basePage";
import { ButtonComponent } from "../../ui/components/buttonComponent";
import { CommonTableComponent } from "../../ui/components/tableCommonComponent";
import { getElementByLabelText } from "../locatorsHelper";

export class AdminJobTitles extends BasePage {
  private jobTitleField = getElementByLabelText(this.page, "Job Title");
  private jobDescriptionField = getElementByLabelText(
    this.page,
    "Job Description",
    "textarea"
  );
  private noteField = getElementByLabelText(this.page, "Note", "textarea");

  readonly jobTitleRequiredError = this.page.locator(
    '.oxd-input-group:has(label:text-is("Job Title")) .oxd-input-field-error-message'
  );

  readonly button = new ButtonComponent(this.page);
  readonly table = new CommonTableComponent(this.page);

  async clickAddButton() {
    await this.button.clickButtonByText("Add");
  }

  async fillJobTitleForm({
    jobTitle,
    description,
    note,
  }: {
    jobTitle?: string;
    description?: string;
    note?: string;
  }) {
    if (jobTitle !== undefined) {
      await this.jobTitleField.fill(jobTitle);
    }
    if (description !== undefined) {
      await this.jobDescriptionField.fill(description);
    }
    if (note !== undefined) {
      await this.noteField.fill(note);
    }
  }

  async clickSaveButton() {
    await this.button.clickButtonByText("Save");
  }

  async clickCancelButton() {
    await this.button.clickButtonByText("Cancel");
  }

  async deleteJobTitleByName(name: string) {
    await this.table.isRowByNameVisible(name);
    await this.table.deleteButton(name).click();
    await this.table.confirmDelete();
  }
}
