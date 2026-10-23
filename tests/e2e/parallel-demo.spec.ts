import { test } from '@playwright/test';

for (let i = 1; i <= 6; i++) {
  test(`test ${i}`, async () => {
    console.log(`Test ${i} running on worker index: ${test.info().workerIndex}`);
  });
}