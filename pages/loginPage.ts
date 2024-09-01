import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailIdTextBox: Locator;
  readonly passwordTestBox: Locator;
  readonly signInButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailIdTextBox = page.locator("//input[@id='email']");
    this.passwordTestBox = page.locator("//input[@id='password']");
    this.signInButton = page.locator("//button[@type='submit']");
    this.logoutButton = page.locator("//a[contains(text(),'Logout')]");
  }

  async goto() {
    await this.page.goto('http://localhost:5173/');
  }

  async enterEmailId() {
    await this.emailIdTextBox.fill("example@example.com");
  }

  async enterPassword() {
    await this.passwordTestBox.fill("asdf");
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  async signIn() {
    await this.enterEmailId();
    await this.enterPassword();
    await this.clickSignIn();
  }
  async logout() {
    await this.logoutButton.click();
    await expect(this.emailIdTextBox.isVisible(), "Failed to Logout !").toBe(true);
  }


}