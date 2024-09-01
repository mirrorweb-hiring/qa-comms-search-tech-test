import { test, expect, Page, Locator } from '@playwright/test';
export class DashboardPage {
    readonly page: Page
    readonly recentMessageList: Locator
    readonly recentMessageEmailIdList: Locator
    readonly recentMessageDescriptionList: Locator
    readonly actualTotalMessage: Locator
    readonly lastTotalMessage: Locator
    readonly totalMessagePercentage: Locator


    constructor(page: Page) {
        this.page = page
        this.recentMessageEmailIdList = page.locator("//ul[@role='list']/li//p[contains(@class,'text-sm')]/div");
        this.recentMessageList = page.locator("//ul[@role='list']/li");
        this.recentMessageDescriptionList = page.locator("//ul[@role='list']/li//p[contains(@class,'mt-1')]/span");
        this.actualTotalMessage = page.locator("(//dd[contains(@class,'mt-1')]/div)[1]")
        this.lastTotalMessage = page.locator("(//dd[contains(@class,'mt-1')]/div)[1]/span");
        this.totalMessagePercentage = page.locator("(//dd[contains(@class,'mt-1')]/div)[2]/span[2]");
    }

    async waitForRecentMessageToBeVisible() {
        await this.recentMessageList.first().waitFor({state:"visible"});
    }

    async verifyRecentMessagesList() {
        await this.waitForRecentMessageToBeVisible();
        var recentMessagesEmail:String[] = await this.recentMessageEmailIdList.allTextContents()
        for (let index = 1; index < recentMessagesEmail.length; index++) {
            console.log(await recentMessagesEmail[index]);
            await expect(recentMessagesEmail[index].trim()).not.toBe(" ");
        }
    }

    async getLatestEmailId() {
        return await this.recentMessageEmailIdList.first().textContent();
    }

    async getLatestMessageDescription() {
        return await this.recentMessageDescriptionList.first().textContent();
    }

    async verifyTotalMessagePercentage() {
        await this.waitForRecentMessageToBeVisible();
        var latestCount: any = await this.actualTotalMessage.textContent();
        latestCount = latestCount.slice(0,2);
        var lastCount: any = await this.lastTotalMessage.textContent();
        lastCount = lastCount.trim().slice(-2);
        var actualPercentage: any = await this.totalMessagePercentage.textContent();
        var expectedPercentage: number = ((latestCount/lastCount)-1)*100;
        expect(String(actualPercentage).includes(String(expectedPercentage+"%")), "Incorrect Total Message %. Expected ["+expectedPercentage+"%] and Actual percentage is ["+actualPercentage+"]").toBe(true)
    }



}


