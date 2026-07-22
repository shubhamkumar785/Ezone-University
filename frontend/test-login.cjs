const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/login');
  
  // Select Teacher role
  await page.click('button:has-text("Teacher")');
  
  // Fill login
  await page.fill('input[placeholder*="ID"]', 'TCH2024015');
  
  // Submit
  await page.click('button:has-text("Send OTP")');
  
  // Wait for OTP field
  await page.waitForSelector('input[placeholder*="OTP"]', { timeout: 10000 });
  await page.fill('input[placeholder*="OTP"]', '123456');
  
  // Verify OTP
  await page.click('button:has-text("Verify OTP")');
  
  // Wait for navigation
  await page.waitForNavigation({ timeout: 15000 });
  
  console.log("Current URL after login:", page.url());
  
  // Save screenshot
  await page.screenshot({ path: 'screenshot.png' });
  
  // Check local storage
  const ls = await page.evaluate(() => localStorage.getItem('user'));
  console.log("Local Storage User:", ls);
  
  await browser.close();
})();
