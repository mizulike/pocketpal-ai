const {device} = require('detox');
const {
  navigateToScreen,
  waitForAppToLoad,
  openHFSearchModal,
  performHFSearch,
  sendChatMessage,
  testAppStateChange,
  closeHFSearchModal,
} = require('./helpers/navigation-helpers');

describe('Basic Navigation E2E Test', () => {
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
    await device.terminateApp();
  });

  it('should navigate through main screens successfully', async () => {
    console.log('🚀 Starting basic navigation test...');

    // Step 1: Wait for app to fully load
    console.log('📱 Step 1: Waiting for app to load...');
    await waitForAppToLoad();

    // Step 2: Test navigation to Models screen
    console.log('🗂️ Step 2: Testing navigation to Models screen...');
    await navigateToScreen('models');

    // Step 3: Test HF search modal functionality
    console.log('🔍 Step 3: Testing HF search modal...');
    await openHFSearchModal();

    // Step 4: Test search input
    console.log('🔎 Step 4: Testing search input...');
    await performHFSearch('smollm2 135m');

    // Step 5: Close search modal and navigate to Chat
    console.log('💬 Step 5: Testing navigation to Chat screen...');
    await closeHFSearchModal(); // a workaround for now. only works on iPhone 16 Pro

    // Step 6: Navigate to Chat screen
    console.log('📱 Step 6: Navigating to Chat screen...');
    await navigateToScreen('chat');

    // Step 7: Test chat input
    console.log('📝 Step 7: Testing chat input...');
    await sendChatMessage('Hello, this is a test message!');

    console.log('🎉 Basic navigation test completed successfully!');
  });

  it('should handle app state changes gracefully', async () => {
    console.log('🔄 Testing app state changes...');
    await testAppStateChange();
  });
});
