import { Locator, Page, expect } from "@playwright/test";

export class CommonTableComponent {
  private page: Page;

  readonly confirmDeleteButton: Locator;
  readonly tableHeaderCell: Locator;
  readonly tableRow: Locator;
  readonly tableCell: Locator;

  constructor(page: Page) {
    this.page = page;

    this.confirmDeleteButton = this.page.getByRole("button", {
      name: " Yes, Delete",
    });
    this.tableHeaderCell = this.page.getByRole("columnheader");
    this.tableRow = this.page.locator(".oxd-table-card").getByRole("row");
    this.tableCell = this.page.getByRole("cell");
  }

  deleteButton(name: string): Locator {
    const partialName = name;
    return this.page
      .getByRole("row", { name: new RegExp(partialName, "i") })
      .locator("//button/i[@class='oxd-icon bi-trash']");
  }

  rowByName(name: string): Locator {
    return this.page.getByRole("row", { name: `${name}` });
  }

  async confirmDelete() {
    await this.confirmDeleteButton.click();
  }

  async isRowByNameVisible(name: string) {
    await expect(this.rowByName(name)).toBeVisible();
  }

  async getColumnTitleTexts() {
    const columnTitles = await this.tableHeaderCell.allTextContents();
    return columnTitles
      .map((t) => t.replace(/AscendingDescending/g, "").trim())
      .filter((t) => t.length > 0 && t !== "");
  }

  async getTableRows() {
    const rowCount = await this.tableRow.count();
    const result: string[][] = [];
    for (let i = 0; i < rowCount; i++) {
      const cells = this.tableRow.locator(".oxd-table-cell").filter({
        hasNot: this.page.locator(".oxd-table-card-cell-checkbox"),
      });
      result.push(await cells.allTextContents());
    }
    return result;
  }

  async expectTableRowsMatch(
    actualRows: string[][],
    expectedRows: (string | null | undefined)[][]
  ) {
    expect(actualRows.length).toBe(expectedRows.length);
    for (let i = 0; i < expectedRows.length; i++) {
      expect(actualRows[i].length).toBe(expectedRows[i].length);
      for (let j = 0; j < expectedRows[i].length; j++) {
        const expected = expectedRows[i][j];
        if (expected === "ANY" || expected === null || expected === undefined) {
          continue;
        }
        expect(actualRows[i][j]).toBe(expected);
      }
    }
  }
}
