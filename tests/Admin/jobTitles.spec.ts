import { expect } from "@playwright/test";
import { test } from "../../app/fixtures/base.fixture";
import { uniqueName } from "../../utils/unique";

test.describe("Admin/Job Titles", () => {
  test("User can add a new job title", async ({ pages, page }) => {
    const jobTitle = uniqueName("QA Automation Title ");
    const description = "Created by automated test";

    try {
      await test.step("Add job title", async () => {
        await pages.adminJobTitles.goTo("/admin/viewJobTitleList");
        await pages.adminJobTitles.clickAddButton();
        await pages.adminJobTitles.fillJobTitleForm({ jobTitle, description });
        await pages.adminJobTitles.clickSaveButton();

        await expect(page).toHaveURL(/viewJobTitleList/);
        await expect(pages.adminJobTitles.table.rowByName(jobTitle)).toBeVisible();
      });
    } finally {
      await test.step("Clean up created job title", async () => {
        await pages.adminJobTitles.goTo("/admin/viewJobTitleList");
        // Guarded: if the "Add job title" step above failed, there is
        // nothing to delete — don't let that hang/timeout mask the real error.
        const row = pages.adminJobTitles.table.rowByName(jobTitle);
        const rowExists = await row
          .waitFor({ state: "visible", timeout: 5000 })
          .then(() => true)
          .catch(() => false);
        // eslint-disable-next-line playwright/no-conditional-in-test
        if (rowExists) {
          await pages.adminJobTitles.deleteJobTitleByName(jobTitle);
        }
      });
    }
  });

  test("User can cancel adding a new job title", async ({ pages, page }) => {
    const jobTitle = uniqueName("QA Cancelled Title ");

    await pages.adminJobTitles.goTo("/admin/viewJobTitleList");
    await pages.adminJobTitles.clickAddButton();
    await pages.adminJobTitles.fillJobTitleForm({ jobTitle });
    await pages.adminJobTitles.clickCancelButton();

    await expect(page).toHaveURL(/viewJobTitleList/);
    await expect(pages.adminJobTitles.table.rowByName(jobTitle)).toBeHidden();
  });

  test("Job Title is required when adding a job title", async ({
    pages,
    page,
  }) => {
    await pages.adminJobTitles.goTo("/admin/viewJobTitleList");
    await pages.adminJobTitles.clickAddButton();
    await pages.adminJobTitles.clickSaveButton();

    await expect(pages.adminJobTitles.jobTitleRequiredError).toBeVisible();
    await expect(pages.adminJobTitles.jobTitleRequiredError).toHaveText(
      "Required"
    );
    // Validation blocks the submit - still on the add form.
    await expect(page).toHaveURL(/saveJobTitle/);
  });
});
