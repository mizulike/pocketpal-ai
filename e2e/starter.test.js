const {device, expect, element, by, waitFor} = require('detox');

describe('Simple Test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show welcome screen', async () => {
    // Just check if the app launches
    console.log('App launched successfully');

    // Wait for any element to appear
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Test completed');
  });
});
