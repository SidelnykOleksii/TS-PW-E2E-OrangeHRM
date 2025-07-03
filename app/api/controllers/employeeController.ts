import { BaseApiContext } from "../baseApiContext";

export class EmployeeController extends BaseApiContext {
  apiEmployeeUrl =
    "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees";

  async createEmployee(
    empPicture: string | null = null,
    firstName: string,
    middleName: string,
    lastName: string
  ) {
    const sessionCookie = this.getSessionCookie();
    const headers = this.getHeaders(sessionCookie);
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
}
