import React from 'react';

import {render} from '../../../../jest/test-utils';

import {PalsScreen} from '../PalsScreen';

import {authService, syncService} from '../../../services';

// Mock theme hook
jest.mock('../../../hooks', () => ({
  useTheme: () => ({
    colors: {
      background: '#ffffff',
      surface: '#f5f5f5',
      outline: '#e0e0e0',
      primary: '#007AFF',
      onSurfaceVariant: '#666666',
      primaryContainer: '#E3F2FD',
    },
  }),
}));

describe('PalsScreen', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Reset the mock services to default state
    // const {authService, syncService} = require('../../services');
    authService.isAuthenticated = false;
    (syncService.needsSync as jest.Mock).mockResolvedValue(false);
    (syncService.syncAll as jest.Mock).mockResolvedValue(undefined);
  });

  it('should render without crashing', () => {
    render(<PalsScreen />, {
      withNavigation: true,
      withSafeArea: true,
      withBottomSheetProvider: true,
    });
    // Basic render test - the component should mount successfully
    expect(true).toBe(true); // Placeholder assertion
  });

  // Migration tests removed - migration is now handled by PalStore

  it('should sync data on mount if user is authenticated and sync is needed', async () => {
    // const {authService, syncService} = require('../../services');

    // Set up the mock before rendering
    authService.isAuthenticated = true;
    (syncService.needsSync as jest.Mock).mockResolvedValue(true);

    render(<PalsScreen />, {
      withNavigation: true,
      withSafeArea: true,
      withBottomSheetProvider: true,
    });

    // Wait for useEffect to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(syncService.needsSync).toHaveBeenCalled();
    expect(syncService.syncAll).toHaveBeenCalled();
  });

  it('should not sync if user is not authenticated', async () => {
    // const {authService, syncService} = require('../../services');

    // Set up the mock before rendering
    authService.isAuthenticated = false;

    render(<PalsScreen />, {
      withNavigation: true,
      withSafeArea: true,
      withBottomSheetProvider: true,
    });

    // Wait for useEffect to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(syncService.syncAll).not.toHaveBeenCalled();
  });

  // Migration error handling tests removed - migration is now handled by PalStore

  it('should handle sync errors gracefully', async () => {
    // const {authService, syncService} = require('../../services');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Set up the mock before rendering
    authService.isAuthenticated = true;
    (syncService.needsSync as jest.Mock).mockResolvedValue(true);
    (syncService.syncAll as jest.Mock).mockRejectedValue(
      new Error('Sync failed'),
    );

    render(<PalsScreen />, {
      withNavigation: true,
      withSafeArea: true,
      withBottomSheetProvider: true,
    });

    // Wait for useEffect to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error during initial setup:',
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
