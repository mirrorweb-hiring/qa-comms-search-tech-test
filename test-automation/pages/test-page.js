import { expect } from '@playwright/test';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class TestPage {
  constructor(page) {
    this.page = page;
    
} 

static signInHeader = 'h2';
static emailSignInField = 'id=email';
static passwordSignInField = 'id=password';
static signInButton = 'button[type="submit"]';

// Xpath is ot the most ideal way of modelling elements. It is much better practice to use ID or class names. Although in this case I did not feel there were many unique identifiers to use.
static logoutBtn = 'xpath=/html/body/div/nav/div/div/div[2]/div/a'
static last30Days = 'text=Last 30 days';
static totalMessages = 'xpath=//html/body/div/div/main/div/div/div[1]/dl/div[1]/dt';
static totalActions = 'xpath=//html/body/div/div/main/div/div/div[1]/dl/div[2]/dt';
static totalMessagePercent = 'xpath=//html/body/div/div/main/div/div/div[1]/dl/div[1]/dd/div[2]/span[2]';
static totalActionsPercent = 'xpath=//html/body/div/div/main/div/div/div[1]/dl/div[2]/dd/div[2]/span[2]';

static mostRecentMessages = 'xpath=//html/body/div/div/main/div/div/div[2]/h3';
static messageOne = ':nth-match(li, 1)';
static messageFour = ':nth-match(li, 4)';
static messageSeven = ':nth-match(li, 7)';

static dashboardButtonHeader = '[href*="/dashboard"]';
static searchButtonHeader = '[href*="/search"]';
static searchField = 'id=query';
static searchButton = 'button[type="submit"]';
static searchResults = 'xpath=//html/body/div/div/main/div/div/div/div[1]/p/span';
static viewFirstResult = '[href*="/search/results/q5Y7jY_R_K66dcVLel2qf?q=test"]';
static firstResultEmail = 'xpath=//html/body/div/div/main/div/div/div/div[2]/div/div/div/div/div/div/p';



}

export { TestPage };