import { test } from '@playwright/test';

for (let i = 1; i <= 4; i++) {
  test(`file1 - test ${i}`, async () => {
    console.log(`file6 - test ${i} → worker: ${test.info().workerIndex}, pid: ${process.pid}`);
    await new Promise(r => setTimeout(r, 1000));
  });
}