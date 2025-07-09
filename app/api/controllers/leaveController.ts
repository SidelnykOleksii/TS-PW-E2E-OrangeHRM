import { BaseApiContext } from "../baseApiContext";

export class LeaveController extends BaseApiContext {
  apiLeaveUrl =
    "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/leave-requests";

  async createLeave(body: {
    leaveTypeId: number;
    fromDate: string;
    toDate: string;
    comment: string | null;
    duration: { type: string };
  }) {
    const headers = this.getAuthHeaders();

    const response = await this.request.post(this.apiLeaveUrl, {
      data: body,
      headers,
    });

    return response;
  }
}
