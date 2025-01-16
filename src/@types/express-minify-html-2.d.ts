declare module 'express-minify-html-2' {
  import { RequestHandler } from 'express';

  interface MinifyOptions {
    override: boolean;
    exceptionUrls: boolean;
    htmlMinifier: {
      removeComments: boolean;
      collapseWhitespace: boolean;
      collapseBooleanAttributes: boolean;
      removeAttributeQuotes: boolean;
      removeEmptyAttributes: boolean;
    };
  }

  function minifyHTML(options: MinifyOptions): RequestHandler;

  export = minifyHTML;
}