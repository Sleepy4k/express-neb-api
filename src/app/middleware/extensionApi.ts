/* eslint-disable perfectionist/sort-objects */
import type { NextFunction, Request, Response } from "express";

import { EXTENSION_HEADER } from "@constants/auth-payload.js";
import DeviceModel from "@models/device.model.js";
import { sha256 } from "@utils/encryption.js";

/**
 * The redeem model instance for the dashboard controller
 *
 * @type {DeviceModel}
 */
const deviceModel: DeviceModel = new DeviceModel();

/**
 * Extension api middleware to check if the extension signature is valid
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @returns {void}
 */
const telegramApi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.headers["neb-extension-signature"] || req.headers["neb-extension-signature"] !== EXTENSION_HEADER) {
    res.status(401).json({
      code: 401,
      status: "error",
      message: "Unauthorized request",
      data: {
        credential: "Extension signature is required and must be valid",
      },
    });
    return;
  }

  if (req.path === "/api/extension/register") {
    next();
    return;
  }

  const { deviceKey } = req.params;
  if (!deviceKey) {
    res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid request",
      data: {
        deviceKey: "deviceKey is required",
      },
    });
    return;
  }

  if ((req.query.verificator ?? "") !== sha256(deviceKey)) {
    res.status(401).json({
      code: 401,
      status: "error",
      message: "Unauthorized request",
      data: {
        verificator: "Verificator is required and must be valid",
      },
    });
    return;
  }

  const device = await deviceModel.find(deviceKey);
  if (!device) {
    res.status(401).json({
      code: 401,
      status: "error",
      message: "Unauthorized request",
      data: {
        deviceKey: "deviceKey is not registered",
      },
    });
    return;
  }

  next();
};

export default telegramApi;
