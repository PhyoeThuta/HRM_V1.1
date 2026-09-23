import { printSummary } from './api_tester.js';
import { runHrmTests } from './hrm.test.js';
import { runCrmOpsTests } from './crm_ops.test.js';
import { runFailFastTests } from './fail_fast.test.js';
import { runAuthTests } from './auth.test.js';
import { runOperationsTests } from './operations.test.js';
import { runZernioTests } from './zernio.test.js';
import { runPayrollTests } from './payroll.test.js';

async function main() {
  console.log('\n🚀 STARTING SENIOR QA INTEGRATION TEST SUITE 🚀\n');
  
  await runAuthTests();
  await runHrmTests();
  await runCrmOpsTests();
  await runFailFastTests();
  await runOperationsTests();
  await runZernioTests();
  await runPayrollTests();
  
  printSummary();
}

main().catch(err => {
  console.error('\n💥 TEST SUITE CRASHED FATALLY:', err.message);
  process.exit(1);
});
