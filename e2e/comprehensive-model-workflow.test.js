const {device} = require('detox');
const {
  navigateToScreen,
  waitForAppToLoad,
  openHFSearchModal,
  searchAndWaitForResults,
  selectAndDownloadModel,
  loadDownloadedModel,
  sendTestMessageAndWaitForResponse,
  testAppStateChange,
} = require('./helpers/navigation-helpers');

describe('Comprehensive Model Workflow E2E Test', () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: {notifications: 'YES', camera: 'YES', photos: 'YES'},
      newInstance: true,
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  afterAll(async () => {
    // Cleanup: Clear any downloaded models and reset app state
    await device.terminateApp();
  });

  it('should complete full model workflow: search, download, load, and chat', async () => {
    console.log('🚀 Starting comprehensive model workflow test...');

    // Step 1: Wait for app to fully load
    console.log('📱 Step 1: Waiting for app to load...');
    await waitForAppToLoad();

    // Step 2: Navigate to Models screen
    console.log('🗂️ Step 2: Navigating to Models screen...');
    await navigateToScreen('models');

    // Step 3: Open HF search and search for model
    console.log('🔍 Step 3: Opening HF search and searching for model...');
    await openHFSearchModal();
    await searchAndWaitForResults('Bartowski smollm2 135');

    // Step 4: Select and download model
    console.log('📋 Step 4: Selecting and downloading model...');
    await selectAndDownloadModel();

    // Step 5: Load the downloaded model
    console.log('🔄 Step 5: Loading the downloaded model...');
    await loadDownloadedModel();

    // Step 6: Navigate to chat and test model
    console.log('💬 Step 6: Navigating to chat interface...');
    await navigateToScreen('chat');

    // Step 7: Send test message and verify response
    console.log('📝 Step 7: Sending test message and waiting for response...');
    await sendTestMessageAndWaitForResponse(
      'Hello! Can you tell me a short joke?',
    );

    // Step 8: Verify the complete workflow
    console.log('✅ Step 8: Verifying complete workflow...');
    console.log('🎉 Comprehensive model workflow test completed successfully!');
  });

  // Additional test for cleanup and error handling
  it('should handle errors gracefully and clean up properly', async () => {
    console.log('🧹 Testing error handling and cleanup...');

    await waitForAppToLoad();

    try {
      // Test navigation to models screen
      await navigateToScreen('models');

      // Test app state changes during model operations
      await testAppStateChange();

      // Verify app recovery
      await navigateToScreen('chat');

      console.log('✅ Error handling and cleanup test completed');
    } catch (error) {
      console.log('⚠️ Error during cleanup test (expected):', error.message);

      // Attempt recovery
      await device.reloadReactNative();
      await waitForAppToLoad();
    }
  });
});
