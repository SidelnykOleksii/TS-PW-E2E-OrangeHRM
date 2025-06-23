import { APIRequestContext } from "@playwright/test";
import { EmployeeController } from "./employeeController";

export class ControllersManager {
  employeeController: EmployeeController;

  constructor(request: APIRequestContext) {
    this.employeeController = new EmployeeController(request);
  }
}
