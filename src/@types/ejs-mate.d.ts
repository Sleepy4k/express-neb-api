declare module "ejs-mate" {
  class Block {
    constructor();
    append(str: string): void;
    prepend(str: string): void;
    replace(str: string): void;
    toString(): string;
  }

  function lookup(root: string, partials: string, options: object): string;
  function partial(view: string): string;
  function layout(view: string): void;
  function block(name: string, html: string): Block;
  function compile(file: string, options: object, cb: (e: Error | null, rendered?: string) => void): void;
  function renderFile(file: string, options: object, fn: (e: Error | null, rendered?: string) => void): void;

  renderFile.compile = compile;
  renderFile.lookup = lookup;
  renderFile.partial = partial;
  renderFile.layout = layout;
  renderFile.block = block;

  export = renderFile;
}
