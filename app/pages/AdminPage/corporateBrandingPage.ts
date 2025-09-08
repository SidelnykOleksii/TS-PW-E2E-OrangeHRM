import { expect, Locator } from "@playwright/test";
import { BasePage } from "../basePage";
import { ButtonComponent } from "../../ui/components/buttonComponent";
import { defaultColors } from "./helpers";

export class CorporateBranding extends BasePage {
    private colorPicker = this.page.getByRole('alert');
    private colorHexInput = this.page.getByRole('alert').getByRole('textbox');

    сolorInput(colorType: string): Locator  {
        return this.page.locator(`//label[text()="${colorType}"]/following-sibling::div`);
    }

    readonly button = new ButtonComponent(this.page);

    async selectColorInput(colorType: string, inputColorHex: string) {
        const input = this.сolorInput(colorType);
        await input.click();
        await this.colorPicker.waitFor({state: 'visible'});
        await this.colorHexInput.fill(inputColorHex);
        await this.page.keyboard.press('Enter');
    }

    async getCssVariableValue(cssVar: string): Promise<string> {
        return await this.page.evaluate((variable) => 
            getComputedStyle(document.documentElement).getPropertyValue(variable).trim(), cssVar
        );
    }

    async verifySingleColor(cssVar: string, expectedValue: string) {
        const actualValue = await this.getCssVariableValue(cssVar);
        expect(actualValue.toLowerCase()).toBe(expectedValue.toLowerCase());
    }

    async verifyDefaultColors() {
        for (const [cssVar, expectedValue] of Object.entries(defaultColors)) {
            await this.verifySingleColor(cssVar, expectedValue);
        }
    }
}