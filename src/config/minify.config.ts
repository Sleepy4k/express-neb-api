export const minifyConfig = {
  override: true,
  exceptionUrls: false,
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: false,
    removeEmptyAttributes: false,
  },
};
