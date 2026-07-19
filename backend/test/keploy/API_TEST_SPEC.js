/**
 * API Endpoint Test Specification
 * Voice Karar Backend - Keploy Integration
 * 
 * This document outlines all endpoints that require Keploy test coverage,
 * including request/response contracts and critical scenarios.
 */

module.exports = {
  // ═══════════════════════════════════════════════════════════════════════════
  // AUTHENTICATION ENDPOINTS
  // ═══════════════════════════════════════════════════════════════════════════
  
  auth: {
    register: {
      method: 'POST',
      path: '/api/v1/auth/register',
      auth: false,
      description: 'Register new user',
      request: {
        body: {
          name: { type: 'string', required: true, minLength: 2 },
          email: { type: 'string', required: true, format: 'email' },
          password: { type: 'string', required: true, minLength: 8 },
          businessName: { type: 'string', required: true, minLength: 2 },
        },
      },
      response: {
        statusCode: 201,
        body: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: {
            userId: { type: 'string', format: 'mongodb-objectid' },
            email: { type: 'string' },
            token: { type: 'string', format: 'jwt' },
          },
        },
      },
      testScenarios: [
        {
          name: 'Register with valid data',
          expectedStatus: 201,
        },
        {
          name: 'Register with duplicate email',
          expectedStatus: 400,
        },
        {
          name: 'Register with weak password',
          expectedStatus: 400,
        },
        {
          name: 'Register with missing fields',
          expectedStatus: 400,
        },
      ],
      critical: true,
    },
    
    login: {
      method: 'POST',
      path: '/api/v1/auth/login',
      auth: false,
      description: 'Login user',
      request: {
        body: {
          email: { type: 'string', required: true, format: 'email' },
          password: { type: 'string', required: true },
        },
      },
      response: {
        statusCode: 200,
        body: {
          success: { type: 'boolean' },
          data: {
            userId: { type: 'string' },
            email: { type: 'string' },
            token: { type: 'string', format: 'jwt' },
            expiresIn: { type: 'number' },
          },
        },
      },
      testScenarios: [
        {
          name: 'Login with valid credentials',
          expectedStatus: 200,
        },
        {
          name: 'Login with invalid email',
          expectedStatus: 401,
        },
        {
          name: 'Login with wrong password',
          expectedStatus: 401,
        },
      ],
      critical: true,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DASHBOARD ENDPOINTS
  // ═══════════════════════════════════════════════════════════════════════════

  dashboard: {
    get: {
      method: 'GET',
      path: '/api/v1/dashboard',
      auth: true,
      description: 'Get dashboard data for authenticated user',
      request: {
        headers: {
          'Authorization': { type: 'string', pattern: 'Bearer .+' },
          'Content-Type': { type: 'string', value: 'application/json' },
        },
      },
      response: {
        statusCode: 200,
        body: {
          success: { type: 'boolean' },
          data: {
            agreementStats: {
              total: { type: 'number' },
              pending: { type: 'number' },
              confirmed: { type: 'number' },
              cancelled: { type: 'number' },
            },
            recentAgreements: { type: 'array' },
            userProfile: {
              name: { type: 'string' },
              email: { type: 'string' },
              businessName: { type: 'string' },
            },
          },
        },
      },
      testScenarios: [
        {
          name: 'Get dashboard with valid token',
          expectedStatus: 200,
        },
        {
          name: 'Get dashboard without auth',
          expectedStatus: 401,
        },
        {
          name: 'Get dashboard with expired token',
          expectedStatus: 401,
        },
      ],
      critical: true,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AGREEMENT ENDPOINTS
  // ═══════════════════════════════════════════════════════════════════════════

  agreements: {
    create: {
      method: 'POST',
      path: '/api/v1/agreements',
      auth: true,
      description: 'Create new agreement',
      request: {
        body: {
          title: { type: 'string', required: true, minLength: 3 },
          description: { type: 'string', required: false },
          terms: {
            item: { type: 'string', required: true },
            quantity: { type: 'number', required: true },
            unitPrice: { type: 'number', required: true },
            totalAmount: { type: 'number', required: true },
            currency: { type: 'string', enum: ['INR', 'USD', 'EUR'] },
            paymentTerms: { type: 'string' },
            deliveryDate: { type: 'string', format: 'date' },
          },
          parties: {
            type: 'array',
            items: {
              name: { type: 'string' },
              email: { type: 'string', format: 'email' },
              role: { type: 'string', enum: ['buyer', 'seller'] },
            },
          },
        },
      },
      response: {
        statusCode: 201,
        body: {
          success: { type: 'boolean' },
          data: {
            agreementId: { type: 'string' },
            title: { type: 'string' },
            status: { type: 'string', enum: ['draft', 'pending', 'confirmed', 'cancelled'] },
            shareToken: { type: 'string' },
            createdAt: { type: 'string', format: 'iso-datetime' },
          },
        },
      },
      testScenarios: [
        {
          name: 'Create agreement with valid data',
          expectedStatus: 201,
        },
        {
          name: 'Create agreement without auth',
          expectedStatus: 401,
        },
        {
          name: 'Create agreement with invalid parties',
          expectedStatus: 400,
        },
      ],
      critical: true,
    },

    list: {
      method: 'GET',
      path: '/api/v1/agreements',
      auth: true,
      description: 'List user agreements with optional filters',
      request: {
        query: {
          status: { type: 'string', enum: ['draft', 'pending', 'confirmed', 'cancelled'], required: false },
          skip: { type: 'number', required: false, default: 0 },
          limit: { type: 'number', required: false, default: 10 },
        },
      },
      response: {
        statusCode: 200,
        body: {
          success: { type: 'boolean' },
          data: { type: 'array' },
          pagination: {
            total: { type: 'number' },
            skip: { type: 'number' },
            limit: { type: 'number' },
          },
        },
      },
      testScenarios: [
        {
          name: 'List all agreements',
          expectedStatus: 200,
        },
        {
          name: 'List agreements with status filter',
          expectedStatus: 200,
        },
        {
          name: 'List agreements with pagination',
          expectedStatus: 200,
        },
      ],
      critical: true,
    },

    getById: {
      method: 'GET',
      path: '/api/v1/agreements/:id',
      auth: true,
      description: 'Get agreement by ID',
      request: {
        params: {
          id: { type: 'string', format: 'mongodb-objectid', required: true },
        },
      },
      response: {
        statusCode: 200,
        body: {
          success: { type: 'boolean' },
          data: { type: 'object' },
        },
      },
      testScenarios: [
        {
          name: 'Get existing agreement',
          expectedStatus: 200,
        },
        {
          name: 'Get non-existent agreement',
          expectedStatus: 404,
        },
      ],
    },

    getByShareId: {
      method: 'GET',
      path: '/api/v1/agreements/share/:token',
      auth: false,
      description: 'Get agreement by share token (public access)',
      request: {
        params: {
          token: { type: 'string', required: true },
        },
      },
      response: {
        statusCode: 200,
        body: {
          success: { type: 'boolean' },
          data: { type: 'object' },
        },
      },
      testScenarios: [
        {
          name: 'Get shared agreement with valid token',
          expectedStatus: 200,
        },
        {
          name: 'Get shared agreement with invalid token',
          expectedStatus: 404,
        },
      ],
    },

    update: {
      method: 'PATCH',
      path: '/api/v1/agreements/:id',
      auth: true,
      description: 'Update agreement (title, terms)',
      request: {
        params: {
          id: { type: 'string', required: true },
        },
        body: {
          title: { type: 'string', required: false },
          description: { type: 'string', required: false },
          terms: { type: 'object', required: false },
        },
      },
      response: {
        statusCode: 200,
        body: {
          success: { type: 'boolean' },
          data: { type: 'object' },
        },
      },
      testScenarios: [
        {
          name: 'Update agreement title',
          expectedStatus: 200,
        },
        {
          name: 'Update agreement terms',
          expectedStatus: 200,
        },
      ],
      critical: true,
    },

    cancel: {
      method: 'PATCH',
      path: '/api/v1/agreements/:id/cancel',
      auth: true,
      description: 'Cancel agreement',
      request: {
        params: {
          id: { type: 'string', required: true },
        },
      },
      response: {
        statusCode: 200,
        body: {
          success: { type: 'boolean' },
          data: { type: 'object' },
        },
      },
    },

    delete: {
      method: 'DELETE',
      path: '/api/v1/agreements/:id',
      auth: true,
      description: 'Delete agreement (draft only)',
      request: {
        params: {
          id: { type: 'string', required: true },
        },
      },
      response: {
        statusCode: 200,
        body: {
          success: { type: 'boolean' },
          message: { type: 'string' },
        },
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONFIRMATION ENDPOINTS
  // ═══════════════════════════════════════════════════════════════════════════

  confirmations: {
    get: {
      method: 'GET',
      path: '/api/v1/confirmations/:shareToken',
      auth: false,
      description: 'Get confirmation details for shared agreement',
      request: {
        params: {
          shareToken: { type: 'string', required: true },
        },
      },
      response: {
        statusCode: 200,
        body: {
          success: { type: 'boolean' },
          data: {
            agreementId: { type: 'string' },
            title: { type: 'string' },
            terms: { type: 'object' },
            confirmationStatus: { type: 'string', enum: ['pending', 'confirmed', 'rejected'] },
          },
        },
      },
      testScenarios: [
        {
          name: 'Get confirmation with valid share token',
          expectedStatus: 200,
        },
        {
          name: 'Get confirmation with invalid token',
          expectedStatus: 404,
        },
      ],
    },

    submit: {
      method: 'POST',
      path: '/api/v1/confirmations/:shareToken',
      auth: false,
      description: 'Submit buyer confirmation for agreement',
      request: {
        params: {
          shareToken: { type: 'string', required: true },
        },
        body: {
          buyerName: { type: 'string', required: true },
          buyerEmail: { type: 'string', required: true, format: 'email' },
          confirmed: { type: 'boolean', required: true },
          notes: { type: 'string', required: false },
        },
      },
      response: {
        statusCode: 200,
        body: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: {
            confirmationId: { type: 'string' },
            status: { type: 'string' },
          },
        },
      },
      testScenarios: [
        {
          name: 'Submit confirmation - approved',
          expectedStatus: 200,
        },
        {
          name: 'Submit confirmation - rejected',
          expectedStatus: 200,
        },
        {
          name: 'Submit confirmation with invalid token',
          expectedStatus: 404,
        },
      ],
      critical: true,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HEALTH CHECK ENDPOINT
  // ═══════════════════════════════════════════════════════════════════════════

  health: {
    check: {
      method: 'GET',
      path: '/api/health',
      auth: false,
      description: 'Health check endpoint',
      response: {
        statusCode: 200,
        body: {
          status: { type: 'string', enum: ['UP', 'DOWN'] },
          timestamp: { type: 'string', format: 'iso-datetime' },
          uptime: { type: 'number' },
        },
      },
    },
  },
};
