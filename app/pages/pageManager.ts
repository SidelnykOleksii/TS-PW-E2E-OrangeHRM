import { Page } from "@playwright/test";
import { LoginPage } from "./loginPage";
import { PimAddEmployee } from "./PIMPage/addEmployeePage";
import { PimEmployeeList } from "./PIMPage/employeeListPage";
import { AdminUserManagement } from "./AdminPage/userManagementPage";
import { CorporateBranding } from "./AdminPage/corporateBrandingPage";

export class PageManager {
  loginPage: LoginPage;
  addEmployeePage: PimAddEmployee;
  employeeListPage: PimEmployeeList;
  adminUserManagement: AdminUserManagement;
  corporateBranding: CorporateBranding;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
    this.addEmployeePage = new PimAddEmployee(page);
    this.employeeListPage = new PimEmployeeList(page);
    this.adminUserManagement = new AdminUserManagement(page);
    this.corporateBranding = new CorporateBranding(page);
  }
}
