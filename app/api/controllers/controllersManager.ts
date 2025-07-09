import { APIRequestContext } from "@playwright/test";
import { EmployeeController } from "./employeeController";
import { LeaveController } from "./leaveController";

export class ControllersManager {
  employeeController: EmployeeController;
  leaveController: LeaveController;

  constructor(request: APIRequestContext) {
    this.employeeController = new EmployeeController(request);
    this.leaveController = new LeaveController(request);
  }
}
