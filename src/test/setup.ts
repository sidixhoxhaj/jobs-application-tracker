// Test setup file for Vitest
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.clearAllMocks();
});

// Mock matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(),
    getSession: vi.fn(),
    signInWithOtp: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => ({
          data: null,
          error: null,
        })),
        single: vi.fn(() => ({
          data: null,
          error: null,
        })),
      })),
      in: vi.fn(() => ({
        order: vi.fn(() => ({
          data: null,
          error: null,
        })),
      })),
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => ({
          data: null,
          error: null,
        })),
      })),
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: null,
              error: null,
            })),
          })),
        })),
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: null,
            error: null,
          })),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: null,
          error: null,
        })),
      })),
    })),
    upsert: vi.fn(() => ({
      data: null,
      error: null,
    })),
  })),
};

// Mock the supabase module
vi.mock('../lib/supabase', () => ({
  supabase: mockSupabaseClient,
  isSupabaseAvailable: true,
}));

// Export for use in tests
export { mockSupabaseClient };
