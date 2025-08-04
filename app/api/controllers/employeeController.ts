import { BaseApiContext } from "../baseApiContext";
import { ControllersManager } from "./controllersManager";

export class EmployeeController extends BaseApiContext {
  apiEmployeeUrl =
    "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees";

  async createEmployee(
    empPicture: string | null = null,
    firstName: string,
    middleName: string,
    lastName: string
  ) {
    const headers = this.getAuthHeaders();
    const payload = {
      firstName,
      middleName,
      lastName,
      empPicture: empPicture,
      employeeId: "",
    };

    const response = await this.request.post(this.apiEmployeeUrl, {
      data: payload,
      headers,
    });
    if (response.status() !== 200) {
      console.error(
        "Error creating employee:",
        response.status(),
        response.statusText()
      );
    }

    return response;
  }

  async deleteEmployee(employeeId: string) {
    const headers = this.getAuthHeaders();
    const payload = { ids: [employeeId] };
    const response = await this.request.delete(this.apiEmployeeUrl, {
      data: payload,
      headers,
    });

    if (response.status() !== 200) {
      console.error(
        "Error deleting employee:",
        response.status(),
        response.statusText()
      );
    }

    return response;
  }
}

export async function createCustomEmployee(apiClient: ControllersManager, params: { firstName: string; middleName?: string; lastName: string; employeeId?: string; }) {
    const response = await apiClient.employeeController.createEmployee(
      params.employeeId ?? null,
      params.firstName,
      params.middleName ?? "",
      params.lastName
    );
    if (!response.ok()) {
      throw new Error(`Failed to create employee: ${response.status()} ${response.statusText()}`);
    }
    const data = await response.json();
    const empNumber = data.data.empNumber;
    return {empNumber, response};
  }
