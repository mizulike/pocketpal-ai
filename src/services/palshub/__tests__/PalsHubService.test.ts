import {PalsHubError} from '../PalsHubService';

// Create a simple integration test that verifies the service can be instantiated
// and basic error handling works without complex mocking

describe('PalsHubService', () => {
  describe('PalsHubError', () => {
    it('should create error with message and details', () => {
      const error = new PalsHubError('Test error', {code: 'TEST'});

      expect(error.name).toBe('PalsHubError');
      expect(error.message).toBe('Test error');
      expect(error.details).toEqual({code: 'TEST'});
    });

    it('should create error with just message', () => {
      const error = new PalsHubError('Simple error');

      expect(error.name).toBe('PalsHubError');
      expect(error.message).toBe('Simple error');
      expect(error.details).toBeUndefined();
    });
  });

  describe('Service instantiation', () => {
    it('should be able to import and instantiate the service', () => {
      // This test verifies that the service can be imported and instantiated
      // without throwing errors during module loading
      const {palsHubService} = require('../PalsHubService');
      expect(palsHubService).toBeDefined();
      expect(typeof palsHubService.getPals).toBe('function');
      expect(typeof palsHubService.getLibrary).toBe('function');
      expect(typeof palsHubService.getMyPals).toBe('function');
      expect(typeof palsHubService.getCategories).toBe('function');
      expect(typeof palsHubService.getTags).toBe('function');
      expect(typeof palsHubService.checkPalOwnership).toBe('function');
    });
  });
});
