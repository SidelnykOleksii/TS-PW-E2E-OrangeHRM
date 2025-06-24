import { Page } from "@playwright/test";
import { LoginPage } from "./loginPage";
import { PimAddEmployee } from "./PIMPage/addEmployeePage";
import { PimEmployeeList } from "./PIMPage/employeeListPage";

export class PageManager {
  loginPage: LoginPage;
  addEmployeePage: PimAddEmployee;
  employeeListPage: PimEmployeeList;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
    this.addEmployeePage = new PimAddEmployee(page);
    this.employeeListPage = new PimEmployeeList(page);
  }
}
