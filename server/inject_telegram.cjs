const fs = require('fs');

// 1. Append to repository
const repoAppend = fs.readFileSync('modules/crm/repository/api_repo_telegram.js', 'utf8');
let repoContent = fs.readFileSync('modules/crm/repository/index.js', 'utf8');
repoContent += '\n' + repoAppend.replace('import { supabaseAdmin } from \'../../../supabaseClient.js\';', '');
fs.writeFileSync('modules/crm/repository/index.js', repoContent);
fs.unlinkSync('modules/crm/repository/api_repo_telegram.js');

// 2. Append to service
const serviceAppend = `
export async function getCustomersWithHealthAndLifestyle(customerIds) {
  return crmRepo.getCustomersWithHealthAndLifestyle(customerIds);
}

export async function getActivePackagesForCustomers(customerIds) {
  return crmRepo.getActivePackagesForCustomers(customerIds);
}

export async function deductPackageMealCount(packageId, currentCount) {
  return crmRepo.deductPackageMealCount(packageId, currentCount);
}
`;
fs.appendFileSync('modules/crm/service/index.js', serviceAppend);

// 3. Append to index.js exports
let indexContent = fs.readFileSync('modules/crm/index.js', 'utf8');
indexContent = indexContent.replace(
  '};',
  `
  // 7. Telegram Delivery Generation
  async getCustomersWithHealthAndLifestyle(customerIds) {
    return crmService.getCustomersWithHealthAndLifestyle(customerIds);
  },
  async getActivePackagesForCustomers(customerIds) {
    return crmService.getActivePackagesForCustomers(customerIds);
  },
  async deductPackageMealCount(packageId, currentCount) {
    return crmService.deductPackageMealCount(packageId, currentCount);
  }
};
`
);
fs.writeFileSync('modules/crm/index.js', indexContent);
