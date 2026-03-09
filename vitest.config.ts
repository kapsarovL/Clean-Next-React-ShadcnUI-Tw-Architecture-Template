import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Make describe/it/expect/vi available globally without explicit imports
    globals: true,

    // Use jsdom to simulate browser environment for React components
    environment: 'jsdom',

    // Run this setup file before each test — imports jest-dom matchers
    setupFiles: ['./src/__test__/setup.ts'],

    // Include test files matching these patterns
    include: ['src/**/*.{test,spec}.{ts,tsx}'],

    // Exclude these from test discovery
    exclude: ['node_modules', '.next', 'dist'],

    // Show individual test names in output
    reporters: ['verbose'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',

      // Files to measure coverage on (not just tested files)
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.stories.{ts,tsx}',
        'src/test/**',
        'src/types/**',
        'src/app/**/layout.tsx',  // Next.js layouts — hard to unit test
        'src/app/**/page.tsx',    // Next.js pages — use integration tests instead
      ],

      // Minimum coverage thresholds — CI will fail below these
      thresholds: {
        statements: 20,  // Start at 20%, raise to 60% over time
        branches: 20,
        functions: 20,
        lines: 20,
      },
    },
  },

  // Resolve path aliases to match tsconfig
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});