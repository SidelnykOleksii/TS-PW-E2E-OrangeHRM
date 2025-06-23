import { Page } from "@playwright/test";
import { LoginPage } from "./loginPage";
import { PimAddEmployee } from "./PIMPage/addEmployeePage";

export class PageManager {
  loginPage: LoginPage;
  addEmployeePage: PimAddEmployee;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
    this.addEmployeePage = new PimAddEmployee(page);
  }
}
