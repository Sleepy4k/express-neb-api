declare module "express-minify-html-2" {
  import { RequestHandler } from "express";

  interface MinifyOptions {
    exceptionUrls: boolean;
    htmlMinifier: {
      collapseBooleanAttributes: boolean;
      collapseWhitespace: boolean;
      removeAttributeQuotes: boolean;
      removeComments: boolean;
      removeEmptyAttributes: boolean;
    };
    override: boolean;
  }

  function minifyHTML(options: MinifyOptions): RequestHandler;

  export = minifyHTML;
}
