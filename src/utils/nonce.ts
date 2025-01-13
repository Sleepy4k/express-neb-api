import { appConfig } from "src/config";

function generateNonce() {
  return appConfig.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export default generateNonce;