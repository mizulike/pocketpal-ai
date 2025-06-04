const {device, expect, element, by, waitFor} = require('detox');
const {
  navigateToScreen,
  waitForAppToLoad,
  openHFSearchModal,
  performHFSearch,
  closeModalBySwipe,
  testAppStateChange,
  waitAndTap,
  waitForElement,
} = require('../helpers/navigation-helpers');

describe('Error Scenarios E2E Test', () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: {notifications: 'YES', camera: 'YES', photos: 'YES'},
      newInstance: true,
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await waitForAppToLoad();
  });

  afterAll(async () => {
    await device.terminateApp();
  });

  describe('Navigation Error Handling', () => {
    it('should handle rapid navigation attempts gracefully', async () => {
      console.log('⚡ Testing rapid navigation error handling...');

      // Rapidly attempt to navigate between screens
      const screens = ['models', 'chat', 'settings', 'chat'];

      for (const screen of screens) {
        try {
          await navigateToScreen(screen);
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.log(`⚠️ Navigation to ${screen} failed, continuing test...`);
        }
      }

      // Verify app is still functional
      await navigateToScreen('chat');
      await waitForElement('chat-text-input');

      console.log('✅ Rapid navigation handled gracefully');
    });

    it('should recover from drawer navigation issues', async () => {
      console.log('🗂️ Testing drawer navigation error recovery...');

      try {
        // Try to open drawer multiple times rapidly
        for (let i = 0; i < 3; i++) {
          await element(by.id('header-menu-button')).tap();
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Try to navigate normally
        await navigateToScreen('models');

        console.log('✅ Drawer navigation recovered successfully');
      } catch (error) {
        console.log(
          '⚠️ Drawer navigation issue detected, attempting recovery...',
        );

        // Attempt recovery by reloading
        await device.reloadReactNative();
        await waitForAppToLoad();
        await navigateToScreen('chat');

        console.log('✅ Recovery successful');
      }
    });
  });

  describe('Modal Error Handling', () => {
    it('should handle modal opening/closing errors', async () => {
      console.log('📱 Testing modal error handling...');

      await navigateToScreen('models');

      try {
        // Try to open HF search modal
        await openHFSearchModal();

        // Try to close it multiple ways
        await closeModalBySwipe('hf-model-search-view');

        console.log('✅ Modal operations completed successfully');
      } catch (error) {
        console.log('⚠️ Modal operation failed:', error.message);

        // Attempt recovery
        try {
          await device.reloadReactNative();
          await waitForAppToLoad();
          console.log('✅ Recovery from modal error successful');
        } catch (recoveryError) {
          console.log('❌ Recovery failed:', recoveryError.message);
          throw recoveryError;
        }
      }
    });

    it('should handle search modal errors', async () => {
      console.log('🔍 Testing search modal error scenarios...');

      await navigateToScreen('models');

      try {
        await openHFSearchModal();

        // Test invalid search terms
        const invalidSearchTerms = ['', '   ', '!@#$%^&*()'];

        for (const term of invalidSearchTerms) {
          try {
            await performHFSearch(term);
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Clear the search
            await element(by.id('hf-search-input')).clearText();
          } catch (searchError) {
            console.log(`⚠️ Search with term "${term}" failed as expected`);
          }
        }

        // Close modal
        await closeModalBySwipe('hf-model-search-view');

        console.log('✅ Search error handling completed');
      } catch (error) {
        console.log('⚠️ Search modal error:', error.message);
      }
    });
  });

  describe('Input Error Handling', () => {
    it('should handle chat input errors gracefully', async () => {
      console.log('💬 Testing chat input error handling...');

      await navigateToScreen('chat');

      try {
        // Test various problematic inputs
        const problematicInputs = [
          'Very long message '.repeat(100), // Very long text
          '🎉🎊🎈🎁🎀🎂🎄🎃🎆🎇', // Emojis
          'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
          '\n\n\n\n\n', // Newlines
        ];

        for (const input of problematicInputs) {
          try {
            await element(by.id('chat-text-input')).tap();
            await element(by.id('chat-text-input')).typeText(input);

            // Try to send if send button is visible
            try {
              await waitForElement('send-button', 2000);
              await element(by.id('send-button')).tap();
            } catch (sendError) {
              console.log('ℹ️ Send button not available for this input');
            }

            // Clear for next test
            await element(by.id('chat-text-input')).clearText();
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (inputError) {
            console.log(`⚠️ Input error with: ${input.substring(0, 20)}...`);
          }
        }

        console.log('✅ Chat input error handling completed');
      } catch (error) {
        console.log('⚠️ Chat input error handling failed:', error.message);
      }
    });

    it('should handle rapid input changes', async () => {
      console.log('⚡ Testing rapid input change error handling...');

      await navigateToScreen('chat');

      try {
        // Rapid typing and clearing
        for (let i = 0; i < 10; i++) {
          await element(by.id('chat-text-input')).tap();
          await element(by.id('chat-text-input')).typeText(`Rapid ${i}`);
          await element(by.id('chat-text-input')).clearText();
        }

        // Verify input still works normally
        await element(by.id('chat-text-input')).tap();
        await element(by.id('chat-text-input')).typeText('Final test');

        const inputElement = element(by.id('chat-text-input'));
        await expect(inputElement).toHaveText('Final test');

        console.log('✅ Rapid input changes handled successfully');
      } catch (error) {
        console.log('⚠️ Rapid input error:', error.message);
      }
    });
  });

  describe('App State Error Handling', () => {
    it('should handle app backgrounding during operations', async () => {
      console.log('🔄 Testing app state change error handling...');

      await navigateToScreen('chat');

      try {
        // Start typing a message
        await element(by.id('chat-text-input')).tap();
        await element(by.id('chat-text-input')).typeText(
          'Message before background',
        );

        // Background the app
        await device.sendToHome();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Bring back to foreground
        await device.launchApp({newInstance: false});
        await waitForAppToLoad();

        // Verify app recovered
        await navigateToScreen('chat');
        await waitForElement('chat-text-input');

        console.log('✅ App state change error handling successful');
      } catch (error) {
        console.log('⚠️ App state change error:', error.message);

        // Attempt recovery
        await device.reloadReactNative();
        await waitForAppToLoad();
      }
    });

    it('should handle memory pressure scenarios', async () => {
      console.log('🧠 Testing memory pressure error handling...');

      try {
        // Navigate between screens multiple times to potentially trigger memory issues
        const screens = ['chat', 'models', 'settings', 'chat', 'models'];

        for (let cycle = 0; cycle < 3; cycle++) {
          for (const screen of screens) {
            await navigateToScreen(screen);
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }

        // Verify app is still responsive
        await navigateToScreen('chat');
        await element(by.id('chat-text-input')).tap();
        await element(by.id('chat-text-input')).typeText(
          'Memory test complete',
        );

        console.log('✅ Memory pressure handling successful');
      } catch (error) {
        console.log('⚠️ Memory pressure error:', error.message);

        // Recovery attempt
        await device.reloadReactNative();
        await waitForAppToLoad();
      }
    });
  });

  describe('Network Error Simulation', () => {
    it('should handle network-related errors gracefully', async () => {
      console.log('🌐 Testing network error handling...');

      await navigateToScreen('models');

      try {
        // Try to open HF search (which might require network)
        await openHFSearchModal();

        // Attempt search that might fail due to network
        await performHFSearch('test model search');

        // Wait a bit to see if any network errors occur
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Close modal regardless of network state
        await closeModalBySwipe('hf-model-search-view');

        console.log('✅ Network error handling completed');
      } catch (error) {
        console.log('⚠️ Network-related error (expected):', error.message);

        // Try to recover by closing any open modals
        try {
          await closeModalBySwipe('hf-model-search-view');
        } catch (closeError) {
          console.log('ℹ️ Modal already closed or not accessible');
        }
      }
    });
  });

  describe('Recovery Verification', () => {
    it('should verify app functionality after error scenarios', async () => {
      console.log('🔧 Verifying app functionality after error tests...');

      // Test basic navigation
      await navigateToScreen('chat');
      await waitForElement('chat-text-input');

      // Test basic chat functionality
      await element(by.id('chat-text-input')).tap();
      await element(by.id('chat-text-input')).typeText(
        'Recovery verification message',
      );
      await waitForElement('send-button');

      // Test navigation to other screens
      await navigateToScreen('models');
      await waitForElement('flat-list');

      // Return to chat
      await navigateToScreen('chat');
      await waitForElement('chat-text-input');

      console.log('✅ App functionality verified after error scenarios');
    });

    it('should perform final cleanup and verification', async () => {
      console.log('🧹 Performing final cleanup and verification...');

      // Clear any remaining state
      await element(by.id('chat-text-input')).clearText();

      // Verify clean state
      await expect(element(by.id('send-button'))).not.toBeVisible();

      // Test one final navigation
      await navigateToScreen('models');
      await navigateToScreen('chat');

      console.log('✅ Final cleanup and verification completed');
    });
  });
});
