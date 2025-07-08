import { BaseApiContext } from "../baseApiContext";

export class EmployeeController extends BaseApiContext {
  apiEmployeeUrl =
    "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees";

  private getAuthHeaders() {
    const sessionCookie = this.getSessionCookie();
    return this.getHeaders(sessionCookie);
  }

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

    return response;
  }

  async deleteEmployee(employeeId: string) {
    const headers = this.getAuthHeaders();
    const payload = { ids: [employeeId] };
    const response = await this.request.delete(this.apiEmployeeUrl, {
      data: payload,
      headers,
    });

    return response;
  }
}
