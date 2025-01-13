declare module 'ejs-mate' {
  class Block {
    constructor();
    toString(): string;
    append(str: string): void;
    prepend(str: string): void;
    replace(str: string): void;
  }

  function lookup(root: string, partials: string, options: object): string;
  function partial(view: string): string;
  function layout(view: string): void;
  function block(name: string, html: string): Block;
  function compile(file: string, options: object, cb: (e: any, rendered?: string | undefined) => void): void;
  function renderFile(file: string, options: object, fn: (e: any, rendered?: string | undefined) => void): void;

  export = renderFile;
}