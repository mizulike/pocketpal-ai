export const pick = jest.fn(() =>
  Promise.resolve([
    {
      uri: 'dummy-uri',
      type: 'dummy-type',
      name: 'dummy-name',
      size: 1234,
    },
  ]),
);

export const pickDirectory = jest.fn(() =>
  Promise.resolve({
    uri: 'dummy-directory-uri',
  }),
);

export const types = {
  allFiles: 'public.all-files',
  images: 'public.images',
  plainText: 'public.plain-text',
  audio: 'public.audio',
  video: 'public.video',
  pdf: 'com.adobe.pdf',
  zip: 'public.zip-archive',
  csv: 'public.comma-separated-values-text',
  doc: 'com.microsoft.word.doc',
  docx: 'org.openxmlformats.wordprocessingml.document',
  ppt: 'com.microsoft.powerpoint.ppt',
  pptx: 'org.openxmlformats.presentationml.presentation',
  xls: 'com.microsoft.excel.xls',
  xlsx: 'org.openxmlformats.spreadsheetml.sheet',
};

export const errorCodes = {
  OPERATION_CANCELED: 'OPERATION_CANCELED',
  IN_PROGRESS: 'ASYNC_OP_IN_PROGRESS',
  UNABLE_TO_OPEN_FILE_TYPE: 'UNABLE_TO_OPEN_FILE_TYPE',
};

export const isErrorWithCode = jest.fn(error => {
  return error && typeof error.code === 'string';
});

// For backward compatibility with tests that might still use default export
export default {
  pick,
  pickDirectory,
  types,
  errorCodes,
  isErrorWithCode,
};
