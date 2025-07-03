import { test as base } from "./base.fixture";

export const test = base.extend<{
  createEmployeeByAPI: { empNumber: string; response: unknown };
}>({
  createEmployeeByAPI: async ({ apiClient }, use) => {
    const response = await apiClient.employeeController.createEmployee(
      null,
      "First",
      "Middle",
      "Last"
    );
    const data = await response.json();
    await use({ empNumber: data.data.empNumber, response });
  },
});
