/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable perfectionist/sort-objects */
/* eslint-disable perfectionist/sort-interfaces */

interface UserAgentTemplate {
  platform: string;
  template: (data: Record<string, string>) => string;
  generators: Record<string, () => string>;
}

class UserAgentGenerator {
  /**
   * The last generated user agent string.
   */
  #lastGeneratedAgent: null | string = null;

  /**
   * The list of user agent templates.
   */
  #templates: UserAgentTemplate[];

  /**
   * UserAgentGenerator constructor.
   */
  public constructor() {
    this.#templates = [
      {
        platform: "windows",
        template: (data) =>
          `Mozilla/5.0 (Windows NT ${data.version}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${data.chromeVersion} Safari/537.36`,
        generators: {
          version: () => ["10.0", "11.0"][Math.floor(Math.random() * 2)],
          chromeVersion: () => `${Math.floor(Math.random() * 20) + 100}.0.${Math.floor(Math.random() * 10000)}.${Math.floor(Math.random() * 200)}`,
        },
      },
      {
        platform: "mac",
        template: (data) =>
          `Mozilla/5.0 (Macintosh; Intel Mac OS X ${data.version}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${data.chromeVersion} Safari/537.36`,
        generators: {
          version: () => `10_${Math.floor(Math.random() * 6) + 13}_${Math.floor(Math.random() * 10)}`,
          chromeVersion: () => `${Math.floor(Math.random() * 20) + 100}.0.${Math.floor(Math.random() * 10000)}.${Math.floor(Math.random() * 200)}`,
        },
      },
      {
        platform: "linux",
        template: (data) => `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${data.chromeVersion} Safari/537.36`,
        generators: {
          chromeVersion: () => `${Math.floor(Math.random() * 20) + 100}.0.${Math.floor(Math.random() * 10000)}.${Math.floor(Math.random() * 200)}`,
        },
      },
      {
        platform: "android",
        template: (data) =>
          `Mozilla/5.0 (Linux; Android ${data.version}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${data.chromeVersion} Mobile Safari/537.36`,
        generators: {
          version: () => `${Math.floor(Math.random() * 5) + 10}`,
          chromeVersion: () => `${Math.floor(Math.random() * 20) + 100}.0.${Math.floor(Math.random() * 10000)}.${Math.floor(Math.random() * 200)}`,
        },
      },
    ];
  }

  /**
   * Generates a random user agent string from templates.
   *
   * @returns {string|null} A random user agent string.
   */
  public generate(): null | string {
    if (this.#templates.length === 0) {
      return null;
    }

    let newAgent: string;

    do {
      const randomTemplate = this.#templates[Math.floor(Math.random() * this.#templates.length)];
      const data: Record<string, string> = {};

      for (const [key, generator] of Object.entries(randomTemplate.generators)) {
        data[key] = generator();
      }

      newAgent = randomTemplate.template(data);
    } while (newAgent === this.#lastGeneratedAgent && this.#templates.length > 1);

    this.#lastGeneratedAgent = newAgent;

    return newAgent;
  }
}

export default UserAgentGenerator;
