import { test as base } from "./base.fixture";

export const test = base.extend<{
  createEmployeeByAPI: { empNumber: string; response: unknown };
  deleteEmployeeByAPI: (empNumber: string) => Promise<void>;
}>({
  createEmployeeByAPI: async ({ apiClient }, use) => {
    const response = await apiClient.employeeController.createEmployee(
      null,
      "First",
      "Middle",
      "Last"
    );
    const data = await response.json();
    const empNumber = data.data.empNumber;
    await use({ empNumber, response });

    // Cleanup - delete employee after text execution
    await apiClient.employeeController.deleteEmployee(empNumber);
  },

  // Used if employee created via UI
  deleteEmployeeByAPI: async ({ apiClient }, use) => {
    let empNumberToDelete: string | undefined;
    await use(async (empNumber: string) => {
      empNumberToDelete = empNumber;
    });
    if (empNumberToDelete) {
      await apiClient.employeeController.deleteEmployee(empNumberToDelete);
    }
  },
});
