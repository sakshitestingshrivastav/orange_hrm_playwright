import { test, expect } from '@playwright/test';

test.use({storageState: {
    cookies:[],
    origins:[]
}})

test.beforeEach(async({page})=>{
    await page.goto('/web/index.php/auth/login');
})

test("my first login page", async({page})=>{
const username = page.getByPlaceholder("Username")
await expect(username).toBeVisible()
await username.fill("Admin")
const password = page.getByPlaceholder("Password")
await expect(password).toBeVisible()
await password.fill("admin123")
await page.getByRole("button", {name : 'Login'}).click();
await page.waitForLoadState('networkidle');
await expect(page).toHaveURL(/dashboard/);
await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
})

test("my second login page", async({page})=>{    
const username = page.getByPlaceholder("Username")
await expect(username).toBeVisible()
await username.fill("Admin")
const password = page.getByPlaceholder("Password")
await expect(password).toBeVisible()
await password.fill("wrongPassword")
await page.getByRole("button", {name : 'Login'}).click();
await page.waitForLoadState('networkidle');
await expect(page).not.toHaveURL(/dashboard/);
await expect(page.getByText('Invalid credentials')).toBeVisible()
})