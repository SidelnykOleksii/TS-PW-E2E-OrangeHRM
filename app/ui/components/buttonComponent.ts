import { ComponentHolder } from "./abstractClasses";

export class ButtonComponent extends ComponentHolder {
  async clickButtonByText(buttonName: string) {
    return this.page.getByRole("button", { name: `${buttonName}` }).click();
  }
}
