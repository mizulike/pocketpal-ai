const {device, expect, element, by, waitFor} = require('detox');

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

    // Wait for the main app to load - look for the header menu button
    await waitFor(element(by.id('header-menu-button')))
      .toBeVisible()
      .withTimeout(30000);

    console.log('✅ App loaded successfully');

    // Step 2: Test navigation to Models screen
    console.log('🗂️ Step 2: Testing navigation to Models screen...');

    // Open drawer navigation by tapping the menu button
    await element(by.id('header-menu-button')).tap();

    // Wait for drawer to open and Models item to be visible
    await waitFor(element(by.id('drawer-models-item')))
      .toBeVisible()
      .withTimeout(10000);

    // Tap on Models menu item
    await element(by.id('drawer-models-item')).tap();

    // Wait for Models screen to load
    await waitFor(element(by.id('flat-list')))
      .toBeVisible()
      .withTimeout(15000);

    console.log('✅ Successfully navigated to Models screen');

    // Step 3: Test FAB group functionality
    console.log('🔧 Step 3: Testing FAB group functionality...');

    // Check if FAB group is visible
    await waitFor(element(by.id('fab-group')))
      .toBeVisible()
      .withTimeout(10000);

    // Tap FAB group to open it
    await element(by.id('fab-group')).tap();

    // Wait for FAB actions to appear
    await waitFor(element(by.id('hf-fab')))
      .toBeVisible()
      .withTimeout(5000);

    console.log('✅ FAB group opened successfully');

    // Step 4: Test HF search modal opening
    console.log('🔍 Step 4: Testing HF search modal...');

    // Tap HF FAB to open search modal
    await element(by.id('hf-fab')).tap();

    // Wait for HF search modal to open
    await waitFor(element(by.id('hf-model-search-view')))
      .toBeVisible()
      .withTimeout(15000);

    console.log('✅ HF search modal opened successfully');

    // Step 5: Test search input
    console.log('🔎 Step 5: Testing search input...');

    // Find and interact with search input using the testID
    await waitFor(element(by.id('hf-search-input')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('hf-search-input')).tap();
    await element(by.id('hf-search-input')).typeText('smollm2 135m');

    console.log('✅ Search input working correctly');

    // Step 6: Close search modal and navigate to Chat
    console.log('💬 Step 6: Testing navigation to Chat screen...');

    // Close the search modal by swiping down or tapping outside
    await device.pressBack(); // For Android

    // Wait a moment for modal to close
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Open drawer and navigate to Chat
    await element(by.id('header-menu-button')).tap();
    await waitFor(element(by.id('drawer-chat-item')))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id('drawer-chat-item')).tap();

    // Wait for chat screen to load
    await waitFor(element(by.id('chat-text-input')))
      .toBeVisible()
      .withTimeout(15000);

    console.log('✅ Chat interface loaded');

    // Step 7: Test chat input
    console.log('📝 Step 7: Testing chat input...');

    await element(by.id('chat-text-input')).tap();
    await element(by.id('chat-text-input')).typeText(
      'Hello, this is a test message!',
    );

    // Check if send button becomes visible
    await waitFor(element(by.id('send-button')))
      .toBeVisible()
      .withTimeout(5000);

    console.log('✅ Chat input working correctly');

    console.log('🎉 Basic navigation test completed successfully!');
  });

  it('should handle app state changes gracefully', async () => {
    console.log('🔄 Testing app state changes...');

    // Test app backgrounding and foregrounding
    await device.sendToHome();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await device.launchApp({newInstance: false});

    // Verify app is still functional
    await waitFor(element(by.id('header-menu-button')))
      .toBeVisible()
      .withTimeout(10000);

    console.log('✅ App state changes handled correctly');
  });
});
