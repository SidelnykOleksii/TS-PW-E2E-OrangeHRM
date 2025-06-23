import { BaseApiContext } from "../baseApiContext";

export class EmployeeController extends BaseApiContext {
  apiEmployeeUrl =
    "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees";

  async createEmployee(empPicture: string | null = null) {
    const sessionCookie = this.getSessionCookie();
    const headers = this.getHeaders(sessionCookie);
    const payload = {
      firstName: "First",
      middleName: "Middle",
      lastName: "Last",
      empPicture: empPicture,
      employeeId: "",
    };

    const response = await this.request.post(this.apiEmployeeUrl, {
      data: payload,
      headers,
    });

    return response;
  }
}
