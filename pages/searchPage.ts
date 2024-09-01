import { expect, Locator, Page } from '@playwright/test';

export class SearchPage {
    readonly page: Page;
    readonly searchPage: Locator;
    readonly searchBox: Locator;
    readonly searchButton: Locator;
    readonly viewButton: Locator;
    //readonly messageBox: Locator;
    readonly messageBoxEmailId: Locator;
    readonly messageBoxTitle: Locator;
    readonly messageBoxDescription: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchPage = page.locator("//a[contains(text(),'Search')]");
        this.searchBox = page.locator("//*[@id='query']");
        this.searchButton = page.locator("//*[@type='submit']");
        this.viewButton = page.locator("//ul[@role='list']/li//a[text()='View']");
        this.messageBoxDescription = page.locator("//*[contains(@class,'h-full')]/*[@class='space-y-1']/following-sibling::p");
        this.messageBoxEmailId = page.locator("//*[contains(@class,'h-full')]/*[@class='space-y-1']/p");
        this.messageBoxTitle = page.locator("//*[contains(@class,'h-full')]/*[@class='space-y-1']/h2")
    }

    async refresh() {
        await this.page.goto("http://localhost:5173/search");
    }

    async navigateToSearchPage() {
        await this.searchPage.click();
    }

    async searchMessage(searchText: any) {
        await this.searchBox.fill(searchText);
        await this.searchButton.click();
    }

    async isSubstringPresent(target: string, list: string[]): Promise<boolean> {
        return await list.some(item => item.includes(target));
    }

    async verifySearchResults(searchText: any) {
        const textArray: any[] = [];
        await expect(await this.viewButton.first().isVisible(), "Searched string ["+searchText+"] did not return any message ").toBe(true);
        await this.viewButton.first().click({ timeout: 5000 });
        textArray.push(await this.messageBoxTitle.textContent());
        textArray.push(await this.messageBoxEmailId.textContent());
        textArray.push(await this.messageBoxDescription.textContent());
        expect(await this.isSubstringPresent(searchText, textArray), "Search String not found in Search result").toBeTruthy();

    }

}