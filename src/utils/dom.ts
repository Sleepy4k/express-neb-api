import { DOMWindow } from "jsdom";
import { JSDOM } from "jsdom";

/**
 * Node class from JSDOM to get the window object.
 *
 * @type {DOMWindow["Node"]}
 */
const Node: DOMWindow["Node"] = new JSDOM().window.Node;

export { Node };
