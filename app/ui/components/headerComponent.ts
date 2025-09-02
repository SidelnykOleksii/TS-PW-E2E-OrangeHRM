import { ComponentHolder } from "./abstractClasses";

export class HeaderComponent extends ComponentHolder {
  private settingsDropdown = this.page.locator(".oxd-userdropdown-icon");
  private upgradeButton = this.page.getByRole("button", { name: "Upgrade" });
  private logoutLink = this.page.getByRole("menuitem", { name: "Logout" });
}
