import { test } from "../../app/fixtures/base.fixture";

test.describe("Corporate Branding", () => {
  test("Validate default corporate branding colors", async ({ pages }) => {
    await pages.corporateBranding.goTo("/admin/addTheme");
    await pages.corporateBranding.button.clickButtonByText("Reset to Default");

    await pages.corporateBranding.verifyDefaultColors();
  });
});
