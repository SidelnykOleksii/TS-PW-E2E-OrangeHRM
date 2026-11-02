import { test as base } from "./base.fixture";
import { uniqueName } from "../../utils/unique";

export const test = base.extend<{
  createEmployeeByAPI: {
    empNumber: string;
    response: unknown;
    firstName: string;
    middleName: string;
    lastName: string;
    fullName: string;
    displayName: string;
  };
  deleteEmployeeByAPI: (empNumber: string) => Promise<void>;
}>({
  createEmployeeByAPI: async ({ apiClient }, use) => {
    // Names are made unique per run - the shared public demo instance
    // accumulates identically-named "First Middle Last" employees from other
    // test runs, so a fixed name causes autocomplete lookups to match more
    // than one employee.
    const firstName = "First";
    const middleName = "Middle";
    const lastName = uniqueName("Last");
    const fullName = `${firstName} ${middleName} ${lastName}`;
    const displayName = `${firstName} ${lastName}`;

    const response = await apiClient.employeeController.createEmployee(
      null,
      firstName,
      middleName,
      lastName
    );
    const data = await response.json();
    const empNumber = data.data.empNumber;
    await use({ empNumber, response, firstName, middleName, lastName, fullName, displayName });

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
