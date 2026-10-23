import { test } from '@playwright/test';

for (let i = 1; i <= 6; i++) {
  test(`test-${i}`, async () => {
    console.log(`test-${i} → worker index: ${test.info().workerIndex}, pid: ${process.pid}`);
    await new Promise(r => setTimeout(r, 1500));
  });
}