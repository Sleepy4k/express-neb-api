/* eslint-disable perfectionist/sort-objects */
export const minifyConfig = {
  exceptionUrls: false,
  htmlMinifier: {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    removeAttributeQuotes: false,
    removeComments: true,
    removeEmptyAttributes: false,
    minifyCSS: true,
    minifyJS: true,
  },
  override: true,
};
