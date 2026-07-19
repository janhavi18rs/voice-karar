/**
 * test/fixtures/testData.js
 * 
 * Common test data and fixtures for Keploy API testing.
 * Use these to maintain consistency across test cases.
 */

export const testUsers = {
  buyer: {
    email: 'buyer@test.com',
    password: 'SecurePass123!',
    name: 'Test Buyer',
    businessName: 'Buyer Corp',
  },
  seller: {
    email: 'seller@test.com',
    password: 'SecurePass123!',
    name: 'Test Seller',
    businessName: 'Seller Corp',
  },
  admin: {
    email: 'admin@test.com',
    password: 'AdminPass123!',
    name: 'Admin User',
    businessName: 'Admin Corp',
  },
};

export const testAgreements = {
  sample1: {
    title: '500 shirts order',
    description: 'Purchase order for 500 cotton shirts',
    terms: {
      item: '500 shirts',
      unitPrice: 120,
      quantity: 500,
      totalAmount: 60000,
      currency: 'INR',
      paymentTerms: 'Net 30',
      deliveryDate: '2024-08-15',
    },
    parties: [
      {
        name: 'Test Buyer',
        email: 'buyer@test.com',
        role: 'buyer',
      },
      {
        name: 'Test Seller',
        email: 'seller@test.com',
        role: 'seller',
      },
    ],
  },
  sample2: {
    title: 'Consulting Services Agreement',
    description: 'Monthly consulting services for business development',
    terms: {
      service: 'Consulting Services',
      monthlyRate: 50000,
      currency: 'INR',
      startDate: '2024-07-01',
      endDate: '2024-12-31',
      paymentTerms: 'Monthly advance',
    },
    parties: [
      {
        name: 'Client Name',
        email: 'client@test.com',
        role: 'buyer',
      },
      {
        name: 'Consultant Name',
        email: 'consultant@test.com',
        role: 'seller',
      },
    ],
  },
};

export const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

export const defaultHeaders = {
  'Content-Type': 'application/json',
};

/**
 * Generate a unique email for testing
 * @param {string} prefix
 * @returns {string}
 */
export const generateTestEmail = (prefix = 'test') => {
  return `${prefix}-${Date.now()}@test.com`;
};

/**
 * Generate test data for signup
 * @returns {object}
 */
export const generateSignupPayload = () => ({
  name: `Test User ${Date.now()}`,
  email: generateTestEmail('user'),
  password: 'TestPass123!',
  businessName: `Business ${Date.now()}`,
});

/**
 * Generate test data for login
 * @param {string} email
 * @param {string} password
 * @returns {object}
 */
export const generateLoginPayload = (email, password) => ({
  email,
  password,
});

/**
 * Generate agreement payload
 * @returns {object}
 */
export const generateAgreementPayload = () => ({
  title: `Test Agreement ${Date.now()}`,
  description: 'Auto-generated test agreement',
  terms: {
    item: 'Sample Item',
    quantity: 100,
    unitPrice: 1000,
    totalAmount: 100000,
    currency: 'INR',
    paymentTerms: 'Net 30',
    deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  parties: [
    {
      name: 'Party One',
      email: generateTestEmail('party1'),
      role: 'buyer',
    },
    {
      name: 'Party Two',
      email: generateTestEmail('party2'),
      role: 'seller',
    },
  ],
});

export default {
  testUsers,
  testAgreements,
  authHeaders,
  defaultHeaders,
  generateTestEmail,
  generateSignupPayload,
  generateLoginPayload,
  generateAgreementPayload,
};
