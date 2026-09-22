import * as crmService from './service/index.js';

// CRM Public Interface
// These capabilities are the ONLY permitted ways for external modules
// to read or mutate CRM data.
export const crmModule = {
  
  // 1. Operations Delivery Planning
  async getCustomerDeliveryInfo(customerIds) {
    return crmService.getCustomerDeliveryInfo(customerIds);
  },

  // 2. Operations Delivery Proof Update
  async updateDeliveryProof(customerId, proofUrl) {
    return crmService.updateDeliveryProof(customerId, proofUrl);
  },

  // 3. Complete Onboarding Workflow
  async completeOnboarding(token, enrollmentData) {
    return crmService.completeOnboarding(token, enrollmentData);
  },

  // 4. Log Customer Weight (Health update)
  async logCustomerWeight(customerId, currentWeight) {
    return crmService.logCustomerWeight(customerId, currentWeight);
  },

  // 5. Find Inquiries By Name (Prospect Matching)
  async findInquiriesByName(customerId, facebookName) {
    return crmService.findInquiriesByName(customerId, facebookName);
  },

  // 6. Get Active Customer Package (Telegram)
  async getActiveCustomerPackage(customerId) {
    return crmService.getActiveCustomerPackage(customerId);
  }


,  // 7. Telegram Delivery Generation
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

