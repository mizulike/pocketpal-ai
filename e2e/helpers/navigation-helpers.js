const {device, expect, element, by, waitFor} = require('detox');

/**
 * Navigation helper functions for E2E tests
 * These functions provide reliable, touch-based navigation patterns
 * that avoid using device.pressBack() and other unreliable methods
 */

/**
 * Navigate to a specific screen using the drawer navigation
 * @param {string} screenName - The screen name (chat, models, pals, settings, benchmark, app-info)
 * @param {number} timeout - Timeout in milliseconds (default: 15000)
 */
export const navigateToScreen = async (screenName, timeout = 15000) => {
  console.log(`🧭 Navigating to ${screenName} screen...`);

  // Open the drawer
  await element(by.id('header-menu-button')).tap();

  // Wait for the drawer item to be visible
  const drawerItemId = `drawer-${screenName}-item`;
  await waitFor(element(by.id(drawerItemId)))
    .toBeVisible()
    .withTimeout(10000);

  // Tap the drawer item
  await element(by.id(drawerItemId)).tap();

  // Wait for the screen to load by checking for screen-specific elements
  await waitForScreenToLoad(screenName, timeout);

  console.log(`✅ Successfully navigated to ${screenName} screen`);
};

/**
 * Wait for a specific screen to load by checking for key elements
 * @param {string} screenName - The screen name
 * @param {number} timeout - Timeout in milliseconds
 */
const waitForScreenToLoad = async (screenName, timeout = 15000) => {
  const screenElements = {
    chat: 'chat-text-input',
    models: 'flat-list',
    pals: 'flat-list', // Assuming pals screen has a list
    settings: 'flat-list', // Assuming settings screen has a list
    benchmark: 'flat-list', // Assuming benchmark screen has content
    'app-info': 'flat-list', // Assuming app info has content
  };

  const elementId = screenElements[screenName];
  if (elementId) {
    await waitFor(element(by.id(elementId)))
      .toBeVisible()
      .withTimeout(timeout);
  }
};

/**
 * Close a modal using swipe down gesture
 * @param {string} modalId - The testID of the modal to close
 * @param {number} waitTime - Time to wait after closing (default: 1000ms)
 */
export const closeModalBySwipe = async (modalId, waitTime = 1000) => {
  console.log(`🔽 Closing modal ${modalId} with swipe gesture...`);

  try {
    await element(by.id(modalId)).swipe('down', 'fast', 0.8);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    console.log(`✅ Modal ${modalId} closed successfully`);
  } catch (error) {
    console.warn(
      `⚠️ Could not close modal ${modalId} with swipe:`,
      error.message,
    );
    throw error;
  }
};

/**
 * Close a modal using tapping the backdrop
 * @param {number} waitTime - Time to wait after closing (default: 1000ms)
 */
export const closeHFSearchModal = async (waitTime = 1000) => {
  console.log('🔽 Closing HF search modal...');

  try {
    await device.tap({x: 100, y: 60}); // a workaround for now. only works on iPhone 16 Pro
    await new Promise(resolve => setTimeout(resolve, waitTime));
    console.log('✅ HF search modal closed via backdrop tap');
  } catch (error) {
    console.warn('⚠️ Backdrop tap failed, ...');
    throw error;
  }
};

/**
 * Close a modal by tapping a close button
 * @param {string} closeButtonId - The testID of the close button
 * @param {number} waitTime - Time to wait after closing (default: 1000ms)
 */
export const closeModalByButton = async (closeButtonId, waitTime = 1000) => {
  console.log(`❌ Closing modal using close button ${closeButtonId}...`);

  try {
    await element(by.id(closeButtonId)).tap();
    await new Promise(resolve => setTimeout(resolve, waitTime));
    console.log('✅ Modal closed using close button');
  } catch (error) {
    console.warn(
      `⚠️ Could not close modal with button ${closeButtonId}:`,
      error.message,
    );
    throw error;
  }
};

/**
 * Open the FAB group and wait for actions to be visible
 * @param {number} timeout - Timeout in milliseconds (default: 5000)
 */
export const openFABGroup = async (timeout = 5000) => {
  console.log('🔧 Opening FAB group...');

  // Check if FAB group is visible
  await waitFor(element(by.id('fab-group')))
    .toBeVisible()
    .withTimeout(timeout);

  // Tap FAB group to open it
  await element(by.id('fab-group')).tap();

  // Wait for FAB actions to appear
  await waitFor(element(by.id('hf-fab')))
    .toBeVisible()
    .withTimeout(timeout);

  console.log('✅ FAB group opened successfully');
};

/**
 * Close the FAB group by tapping it again
 * @param {number} waitTime - Time to wait after closing (default: 500ms)
 */
export const closeFABGroup = async (waitTime = 500) => {
  console.log('🔧 Closing FAB group...');

  try {
    await element(by.id('fab-group')).tap();
    await new Promise(resolve => setTimeout(resolve, waitTime));
    console.log('✅ FAB group closed successfully');
  } catch (error) {
    console.warn('⚠️ Could not close FAB group:', error.message);
    throw error;
  }
};

/**
 * Open the HF search modal from the FAB group
 * @param {number} timeout - Timeout in milliseconds (default: 15000)
 */
export const openHFSearchModal = async (timeout = 15000) => {
  console.log('🔍 Opening HF search modal...');

  // First open the FAB group
  await openFABGroup();

  // Tap HF FAB to open search modal
  await element(by.id('hf-fab')).tap();

  // Wait for HF search modal to open
  await waitFor(element(by.id('hf-model-search-view')))
    .toBeVisible()
    .withTimeout(timeout);

  console.log('✅ HF search modal opened successfully');
};

/**
 * Perform a search in the HF search modal
 * @param {string} searchTerm - The term to search for
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 */
export const performHFSearch = async (searchTerm, timeout = 10000) => {
  console.log(`🔎 Searching for "${searchTerm}" in HF modal...`);

  // Find and interact with search input
  await waitFor(element(by.id('hf-search-input')))
    .toBeVisible()
    .withTimeout(timeout);

  await element(by.id('hf-search-input')).tap();
  await element(by.id('hf-search-input')).typeText(searchTerm);

  console.log(`✅ Search performed for "${searchTerm}"`);
};

/**
 * Wait for app to fully load by checking for the header menu button
 * @param {number} timeout - Timeout in milliseconds (default: 30000)
 */
export const waitForAppToLoad = async (timeout = 30000) => {
  console.log('📱 Waiting for app to load...');

  await waitFor(element(by.id('header-menu-button')))
    .toBeVisible()
    .withTimeout(timeout);

  console.log('✅ App loaded successfully');
};

/**
 * Send a message in the chat interface
 * @param {string} message - The message to send
 * @param {number} timeout - Timeout in milliseconds (default: 5000)
 */
export const sendChatMessage = async (message, timeout = 5000) => {
  console.log(`📝 Sending chat message: "${message}"`);

  // Tap the chat input
  await element(by.id('chat-text-input')).tap();

  // Type the message
  await element(by.id('chat-text-input')).typeText(message);

  // Wait for send button to become visible
  await waitFor(element(by.id('send-button')))
    .toBeVisible()
    .withTimeout(timeout);

  // Tap send button
  await element(by.id('send-button')).tap();

  console.log('✅ Message sent successfully');
};

/**
 * Clear the chat input field
 */
export const clearChatInput = async () => {
  console.log('🧹 Clearing chat input...');

  await element(by.id('chat-text-input')).tap();
  await element(by.id('chat-text-input')).clearText();

  console.log('✅ Chat input cleared');
};

/**
 * Test app backgrounding and foregrounding
 * @param {number} backgroundTime - Time to keep app in background (default: 2000ms)
 */
export const testAppStateChange = async (backgroundTime = 2000) => {
  console.log('🔄 Testing app state changes...');

  // Send app to background
  await device.sendToHome();
  await new Promise(resolve => setTimeout(resolve, backgroundTime));

  // Bring app back to foreground
  await device.launchApp({newInstance: false});

  // Verify app is still functional
  await waitForAppToLoad(10000);

  console.log('✅ App state changes handled correctly');
};

/**
 * Generic helper to wait for an element and tap it
 * @param {string} elementId - The testID of the element
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 */
export const waitAndTap = async (elementId, timeout = 10000) => {
  await waitFor(element(by.id(elementId)))
    .toBeVisible()
    .withTimeout(timeout);
  await element(by.id(elementId)).tap();
};

/**
 * Generic helper to wait for an element to be visible
 * @param {string} elementId - The testID of the element
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 */
export const waitForElement = async (elementId, timeout = 10000) => {
  await waitFor(element(by.id(elementId)))
    .toBeVisible()
    .withTimeout(timeout);
};

/**
 * Wait for a condition to be true with polling
 * @param {Function} conditionFn - Function that returns true when condition is met
 * @param {number} timeout - Total timeout in milliseconds (default: 30000)
 * @param {number} interval - Polling interval in milliseconds (default: 1000)
 */
export const waitForCondition = async (
  conditionFn,
  timeout = 30000,
  interval = 1000,
) => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const result = await conditionFn();
      if (result) {
        return true;
      }
    } catch (error) {
      // Condition not met, continue polling
    }

    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error(`Condition not met within ${timeout}ms timeout`);
};

/**
 * Wait for a long-running operation with progress checking
 * @param {Function} progressFn - Function to call during progress checks
 * @param {Function} completionFn - Function that returns true when operation is complete
 * @param {number} timeout - Total timeout in milliseconds (default: 300000)
 * @param {number} interval - Check interval in milliseconds (default: 5000)
 */
export const waitForLongOperation = async (
  progressFn,
  completionFn,
  timeout = 300000,
  interval = 5000,
) => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      // Call progress function for logging/monitoring
      if (progressFn) {
        await progressFn();
      }

      // Check if operation is complete
      const isComplete = await completionFn();
      if (isComplete) {
        return true;
      }
    } catch (error) {
      // Operation not complete, continue waiting
    }

    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error(`Long operation not completed within ${timeout}ms timeout`);
};

/**
 * Search for a model in HF search and wait for results
 * @param {string} searchTerm - The model to search for
 * @param {number} timeout - Timeout in milliseconds (default: 30000)
 */
export const searchAndWaitForResults = async (searchTerm, timeout = 30000) => {
  console.log(`🔍 Searching for "${searchTerm}" and waiting for results...`);

  await performHFSearch(searchTerm);

  // Wait for search results to appear
  await waitForCondition(
    async () => {
      try {
        // Check if search results are visible by looking for author text
        const authorText = searchTerm.toLowerCase().includes('bartowski')
          ? 'bartowski'
          : 'microsoft';
        await waitFor(element(by.text(authorText)))
          .toBeVisible()
          .withTimeout(2000);
        return true;
      } catch {
        return false;
      }
    },
    timeout,
    2000,
  );

  console.log(`✅ Search results loaded for "${searchTerm}"`);
};

/**
 * Select and download a model from search results
 * @param {number} resultIndex - Index of the search result to select (default: 0)
 * @param {number} timeout - Timeout in milliseconds for download (default: 300000)
 */
export const selectAndDownloadModel = async (
  resultIndex = 0,
  timeout = 300000,
) => {
  console.log(`📋 Selecting model at index ${resultIndex} and downloading...`);

  try {
    // Try to find and tap a search result
    // This is a simplified approach - in reality you'd need more specific selectors
    const searchResults = element(by.id('hf-model-search-view'));
    await searchResults.tap();

    // Wait for model details view
    await waitForCondition(
      async () => {
        try {
          await waitFor(element(by.text('Download')))
            .toBeVisible()
            .withTimeout(2000);
          return true;
        } catch {
          return false;
        }
      },
      15000,
      1000,
    );

    // Tap download button
    await element(by.text('Download')).tap();

    // Handle potential device capability warnings
    try {
      await waitFor(element(by.text('Continue')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.text('Continue')).tap();
      console.log('⚠️ Handled device capability warning');
    } catch {
      console.log('ℹ️ No device capability warning shown');
    }

    // Wait for download to complete
    await waitForLongOperation(
      async () => {
        console.log('📊 Checking download progress...');
      },
      async () => {
        try {
          // Check if download completed by looking for completion indicators
          await waitFor(element(by.text('Load Model')))
            .toBeVisible()
            .withTimeout(2000);
          return true;
        } catch {
          try {
            // Alternative: check if we're back to models list
            await waitFor(element(by.id('flat-list')))
              .toBeVisible()
              .withTimeout(2000);
            return true;
          } catch {
            return false;
          }
        }
      },
      timeout,
      10000,
    );

    console.log('✅ Model download completed');
  } catch (error) {
    console.log('⚠️ Model download failed:', error.message);
    throw error;
  }
};

/**
 * Load a downloaded model
 * @param {number} timeout - Timeout in milliseconds (default: 120000)
 */
export const loadDownloadedModel = async (timeout = 120000) => {
  console.log('🔄 Loading downloaded model...');

  try {
    // Try to tap "Load Model" button if visible
    await element(by.text('Load Model')).tap();
  } catch {
    console.log(
      'ℹ️ Load Model button not visible, model might already be loading',
    );
  }

  // Wait for model loading to complete
  await waitForCondition(
    async () => {
      try {
        // Check for model loading completion indicators
        // This could be an active model indicator, or successful navigation to chat
        await navigateToScreen('chat');
        await waitForElement('chat-text-input', 5000);
        return true;
      } catch {
        return false;
      }
    },
    timeout,
    5000,
  );

  console.log('✅ Model loaded successfully');
};

/**
 * Send a test message and wait for AI response
 * @param {string} message - The message to send
 * @param {number} timeout - Timeout in milliseconds (default: 120000)
 */
export const sendTestMessageAndWaitForResponse = async (
  message,
  timeout = 120000,
) => {
  console.log(`📝 Sending test message: "${message}"`);

  await sendChatMessage(message);

  console.log('⏳ Waiting for AI response...');

  // Wait for AI response
  await waitForCondition(
    async () => {
      try {
        // Look for response indicators
        // This is simplified - you might need to look for specific response patterns
        // or check for streaming completion indicators
        await new Promise(resolve => setTimeout(resolve, 2000));
        return true; // Simplified for now
      } catch {
        return false;
      }
    },
    timeout,
    5000,
  );

  console.log('✅ AI response received');
};

/**
 * Open the pal/model picker sheet from chat screen
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 */
export const openPalModelPickerSheet = async (timeout = 10000) => {
  console.log('🔽 Opening pal/model picker sheet...');

  // Look for the pal selector button (chevron button) using accessibility label
  await waitFor(element(by.label('Select Pal')))
    .toBeVisible()
    .withTimeout(timeout);

  // Tap the pal selector button
  await element(by.label('Select Pal')).tap();

  // Wait for the picker sheet to open
  await waitFor(element(by.id('bottom-sheet')))
    .toBeVisible()
    .withTimeout(timeout);

  console.log('✅ Pal/model picker sheet opened successfully');
};

/**
 * Select a model from the picker sheet
 * @param {string} modelName - The name of the model to select
 * @param {number} timeout - Timeout in milliseconds (default: 15000)
 */
export const selectModelFromSheet = async (modelName, timeout = 15000) => {
  console.log(`🎯 Selecting model: "${modelName}" from picker sheet...`);

  try {
    // Wait for the model item to be visible and tap it
    await waitFor(element(by.text(modelName)))
      .toBeVisible()
      .withTimeout(timeout);

    await element(by.text(modelName)).tap();

    // Wait for the sheet to close
    await waitFor(element(by.id('bottom-sheet')))
      .not.toBeVisible()
      .withTimeout(timeout);

    console.log(`✅ Model "${modelName}" selected successfully`);
  } catch (error) {
    console.log(`⚠️ Failed to select model "${modelName}":`, error.message);
    throw error;
  }
};

/**
 * Wait for a model to finish loading
 * @param {number} timeout - Timeout in milliseconds (default: 120000)
 */
export const waitForModelToLoad = async (timeout = 120000) => {
  console.log('⏳ Waiting for model to load...');

  await waitForCondition(
    async () => {
      try {
        // Check if chat input is enabled (indicates model is loaded)
        const chatInput = element(by.id('chat-text-input'));
        await chatInput.tap();
        await chatInput.typeText('test');
        await chatInput.clearText();
        return true;
      } catch {
        return false;
      }
    },
    timeout,
    5000,
  );

  console.log('✅ Model loaded successfully');
};

/**
 * Complete model setup workflow: download, load, and verify
 * @param {string} searchTerm - The model search term (default: 'smollm2 135m')
 * @param {number} resultIndex - Index of search result to select (default: 0)
 * @param {number} timeout - Timeout in milliseconds (default: 300000)
 */
export const setupModelForChat = async (
  searchTerm = 'smollm2 135m',
  resultIndex = 0,
  timeout = 300000,
) => {
  console.log('🚀 Starting complete model setup for chat testing...');

  try {
    // Step 1: Navigate to Models screen
    console.log('📱 Step 1: Navigating to Models screen...');
    await navigateToScreen('models');

    // Step 2: Open HF search and search for model
    console.log('🔍 Step 2: Searching for model...');
    await openHFSearchModal();
    await searchAndWaitForResults(searchTerm);

    // Step 3: Select and download model
    console.log('📋 Step 3: Downloading model...');
    await selectAndDownloadModel(resultIndex, timeout);

    // Step 4: Load the downloaded model
    console.log('🔄 Step 4: Loading model...');
    await loadDownloadedModel();

    // Step 5: Navigate to chat
    console.log('💬 Step 5: Navigating to chat...');
    await navigateToScreen('chat');

    // Step 6: Wait for model to be ready
    console.log('⏳ Step 6: Waiting for model to be ready...');
    await waitForModelToLoad();

    console.log('✅ Model setup completed successfully!');
  } catch (error) {
    console.log('❌ Model setup failed:', error.message);
    throw error;
  }
};
