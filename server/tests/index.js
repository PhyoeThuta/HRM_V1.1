import { printSummary } from './api_tester.js';
import { runHrmTests } from './hrm.test.js';
import { runCrmOpsTests } from './crm_ops.test.js';
import { runFailFastTests } from './fail_fast.test.js';

async function main() {
  console.log('\n🚀 STARTING SENIOR QA INTEGRATION TEST SUITE 🚀\n');
  
  await runHrmTests();
  await runCrmOpsTests();
  await runFailFastTests();
  
  printSummary();
}

main().catch(err => {
  console.error('\n💥 TEST SUITE CRASHED FATALLY:', err.message);
  process.exit(1);
});
