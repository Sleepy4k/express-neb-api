import { JSDOM } from 'jsdom';

/**
 * Node class from JSDOM to get the window object.
 */
const Node = new JSDOM().window.Node;

export {
  Node,
};
