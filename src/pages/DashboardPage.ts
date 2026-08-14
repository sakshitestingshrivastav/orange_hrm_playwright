import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly pageHeading: Locator;
  readonly recruitment: Locator;
  readonly myInfo: Locator;
  readonly performance: Locator;
  readonly upgradeButton: Locator;

  constructor(page: Page) {
    super(page);
    // Top bar page title on OrangeHRM dashboard
    this.pageHeading = page.locator('.oxd-topbar-header-breadcrumb-module');
    // Left sidebar menu items
    this.recruitment = page.locator('nav').getByRole('link', { name: 'Recruitment' });
    this.myInfo = page.locator('nav').getByRole('link', { name: 'My Info' });
    this.performance = page.locator('nav').getByRole('link', { name: 'Performance' });
    // Header Upgrade CTA
    this.upgradeButton = page.getByRole('button', { name: /Upgrade/i });
  }

  async expectDashboardUrl(): Promise<void> {
    await this.page.waitForURL(/dashboard/i, { timeout: 30_000 });
  }
}
