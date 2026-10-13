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
  },

  // 7. Telegram Delivery Generation
  async getCustomersWithHealthAndLifestyle(customerIds) {
    return crmService.getCustomersWithHealthAndLifestyle(customerIds);
  },
  async getActivePackagesForCustomers(customerIds) {
    return crmService.getActivePackagesForCustomers(customerIds);
  },
  async deductPackageMealCount(packageId, currentCount) {
    return crmService.deductPackageMealCount(packageId, currentCount);
  },

  // 8. Operations Menu Planning
  async getActivePackagesForDate(targetDate) {
    return crmService.getActivePackagesForDate(targetDate);
  },
  async getChefMessengerConversationIds() {
    return crmService.getChefMessengerConversationIds();
  },

  // 9. Public Customer Portal
  async getCustomerWelcomeDossier(customerId) {
    return crmService.getCustomerWelcomeDossier(customerId);
  },
  async getCustomerMonthlyReview(customerId) {
    return crmService.getCustomerMonthlyReview(customerId);
  },
  async submitCustomerMonthlyReview(customerId, reviewData) {
    return crmService.submitCustomerMonthlyReview(customerId, reviewData);
  },
  async enrollPublicCustomer(formData) {
    return crmService.enrollPublicCustomer(formData);
  },

  // 10. Automated Lifecycles
  async markInactiveProspectsAsLost(daysInactive) {
    return crmService.markInactiveProspectsAsLost(daysInactive);
  },
  async getFormReminderCandidates(hours) {
    return crmService.getFormReminderCandidates(hours);
  },
  async logFormReminderAttempt(inquiryId, messageText) {
    return crmService.logFormReminderAttempt(inquiryId, messageText);
  },
  async markFormReminderCooldown(inquiryId) {
    return crmService.markFormReminderCooldown(inquiryId);
  },
  
  // 11. Customer Enrollment UI Context
  async getEnrollmentFormContext(token) {
    return crmService.getEnrollmentFormContext(token);
  },
  async getCustomerAddressProfile(customerIdOrCode) {
    return crmService.getCustomerAddressProfile(customerIdOrCode);
  },
  async updateCustomerAddressProfile(customerIdOrCode, payload) {
    return crmService.updateCustomerAddressProfile(customerIdOrCode, payload);
  },

  // 12. Public Form Submissions
  async submitChurnExit(payload) {
    return crmService.submitChurnExit(payload);
  },
  async submitReferral(payload) {
    return crmService.submitReferral(payload);
  },
  async submitPublicFeedback(payload) {
    return crmService.submitPublicFeedback(payload);
  },
  async submitMenuFeedback(payload) {
    return crmService.submitMenuFeedback(payload);
  }
};

