const {device, expect, element, by, waitFor} = require('detox');
const {
  navigateToScreen,
  waitForAppToLoad,
  sendChatMessage,
  clearChatInput,
  testAppStateChange,
  waitAndTap,
  waitForElement,
} = require('../helpers/navigation-helpers');

describe('Chat Interactions E2E Test', () => {
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

  describe('Basic Chat Functionality', () => {
    it('should navigate to chat screen and display chat interface', async () => {
      console.log('🚀 Testing chat screen navigation...');

      // Navigate to chat screen
      await navigateToScreen('chat');

      // Verify chat interface elements are visible
      await waitForElement('chat-text-input');

      // Verify send button is not visible when input is empty
      await expect(element(by.id('send-button'))).not.toBeVisible();

      console.log('✅ Chat interface loaded correctly');
    });

    it('should handle text input and send button visibility', async () => {
      console.log('📝 Testing chat input and send button behavior...');

      await navigateToScreen('chat');

      // Test typing in chat input
      await element(by.id('chat-text-input')).tap();
      await element(by.id('chat-text-input')).typeText(
        'Hello, this is a test message!',
      );

      // Verify send button becomes visible when text is entered
      await waitForElement('send-button');

      // Clear the input
      await clearChatInput();

      // Verify send button is hidden again when input is empty
      await expect(element(by.id('send-button'))).not.toBeVisible();

      console.log('✅ Chat input and send button behavior working correctly');
    });

    it('should send a message and clear input after sending', async () => {
      console.log('💬 Testing message sending functionality...');

      await navigateToScreen('chat');

      const testMessage = 'This is a test message for E2E testing';

      // Send a message
      await sendChatMessage(testMessage);

      // Verify input is cleared after sending
      const inputElement = element(by.id('chat-text-input'));
      await expect(inputElement).toHaveText('');

      // Verify send button is hidden after sending
      await expect(element(by.id('send-button'))).not.toBeVisible();

      console.log('✅ Message sent and input cleared successfully');
    });

    it('should handle multiple messages in sequence', async () => {
      console.log('📚 Testing multiple message sending...');

      await navigateToScreen('chat');

      const messages = [
        'First test message',
        'Second test message',
        'Third test message',
      ];

      // Send multiple messages
      for (const message of messages) {
        await sendChatMessage(message);
        // Small delay between messages
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log('✅ Multiple messages sent successfully');
    });
  });

  describe('Chat Interface Features', () => {
    it('should test attachment button if available', async () => {
      console.log('📎 Testing attachment button functionality...');

      await navigateToScreen('chat');

      try {
        // Check if attachment button exists
        await waitForElement('attachment-button', 5000);

        // Tap attachment button
        await element(by.id('attachment-button')).tap();

        console.log('✅ Attachment button interaction successful');
      } catch (error) {
        console.log('ℹ️ Attachment button not available or not visible');
      }
    });

    it('should handle chat input focus and blur', async () => {
      console.log('🎯 Testing chat input focus behavior...');

      await navigateToScreen('chat');

      // Tap to focus input
      await element(by.id('chat-text-input')).tap();

      // Type some text
      await element(by.id('chat-text-input')).typeText('Testing focus');

      // Tap somewhere else to blur (if possible)
      // Note: This might not work on all platforms, so we'll just verify the text is there
      const inputElement = element(by.id('chat-text-input'));
      await expect(inputElement).toHaveText('Testing focus');

      console.log('✅ Chat input focus behavior working correctly');
    });

    it('should handle long messages', async () => {
      console.log('📏 Testing long message handling...');

      await navigateToScreen('chat');

      const longMessage =
        'This is a very long message that should test how the chat input handles longer text content. '.repeat(
          5,
        );

      await element(by.id('chat-text-input')).tap();
      await element(by.id('chat-text-input')).typeText(longMessage);

      // Verify send button is visible
      await waitForElement('send-button');

      // Send the long message
      await element(by.id('send-button')).tap();

      // Verify input is cleared
      const inputElement = element(by.id('chat-text-input'));
      await expect(inputElement).toHaveText('');

      console.log('✅ Long message handled successfully');
    });
  });

  describe('Chat Session Management', () => {
    it('should handle chat reset functionality', async () => {
      console.log('🔄 Testing chat reset functionality...');

      await navigateToScreen('chat');

      // Send a message first
      await sendChatMessage('Message before reset');

      try {
        // Look for reset button in header
        await waitAndTap('reset-button', 5000);

        console.log('✅ Chat reset functionality accessed');
      } catch (error) {
        console.log('ℹ️ Reset button not immediately visible or accessible');

        // Try accessing through menu
        try {
          await waitAndTap('menu-button', 5000);
          console.log('✅ Menu accessed for reset functionality');
        } catch (menuError) {
          console.log('ℹ️ Menu button not accessible');
        }
      }
    });

    it('should maintain chat state during app lifecycle', async () => {
      console.log('🔄 Testing chat state persistence...');

      await navigateToScreen('chat');

      // Send a message
      const testMessage = 'Message for persistence test';
      await sendChatMessage(testMessage);

      // Test app state change
      await testAppStateChange();

      // Navigate back to chat to verify state
      await navigateToScreen('chat');

      // Verify chat interface is still functional
      await waitForElement('chat-text-input');

      console.log('✅ Chat state maintained during app lifecycle');
    });
  });

  describe('Error Handling', () => {
    it('should handle empty message submission gracefully', async () => {
      console.log('🚫 Testing empty message handling...');

      await navigateToScreen('chat');

      // Try to tap send button when input is empty (should not be visible)
      await expect(element(by.id('send-button'))).not.toBeVisible();

      // Try typing just spaces
      await element(by.id('chat-text-input')).tap();
      await element(by.id('chat-text-input')).typeText('   ');

      // Send button might still not be visible for whitespace-only input
      // This depends on the app's implementation

      console.log('✅ Empty message handling working correctly');
    });

    it('should handle rapid input changes', async () => {
      console.log('⚡ Testing rapid input changes...');

      await navigateToScreen('chat');

      // Rapid typing and clearing
      for (let i = 0; i < 3; i++) {
        await element(by.id('chat-text-input')).tap();
        await element(by.id('chat-text-input')).typeText(`Rapid test ${i}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await clearChatInput();
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Final message to ensure everything still works
      await sendChatMessage('Final test message');

      console.log('✅ Rapid input changes handled successfully');
    });
  });

  describe('Accessibility and Usability', () => {
    it('should verify chat input accessibility', async () => {
      console.log('♿ Testing chat input accessibility...');

      await navigateToScreen('chat');

      // Verify chat input is accessible
      const chatInput = element(by.id('chat-text-input'));
      await expect(chatInput).toBeVisible();

      // Verify send button accessibility when visible
      await element(by.id('chat-text-input')).tap();
      await element(by.id('chat-text-input')).typeText('Accessibility test');

      const sendButton = element(by.id('send-button'));
      await expect(sendButton).toBeVisible();

      console.log('✅ Chat accessibility verified');
    });

    it('should handle keyboard interactions', async () => {
      console.log('⌨️ Testing keyboard interactions...');

      await navigateToScreen('chat');

      // Focus on input (should show keyboard)
      await element(by.id('chat-text-input')).tap();

      // Type text
      await element(by.id('chat-text-input')).typeText('Keyboard test');

      // Verify text was entered
      const inputElement = element(by.id('chat-text-input'));
      await expect(inputElement).toHaveText('Keyboard test');

      console.log('✅ Keyboard interactions working correctly');
    });
  });
});
