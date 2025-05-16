/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

import DeviceModel from "@models/device.model.js";
import { sha256 } from "@utils/encryption.js";

interface IRegisterExtensionData {
  device_key: string;
  type: string;
}

/**
 * The redeem model instance for the dashboard controller
 *
 * @type {DeviceModel}
 */
const deviceModel: DeviceModel = new DeviceModel();

/**
 * Saweria controller to handle the webhook request
 *
 * @param {Request} req
 * @param {Response} res
 */
const handler = async (req: Request<object, object, IRegisterExtensionData>, res: Response) => {
  const { type, device_key } = req.body;

  if (!type || !device_key) {
    res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid request",
      data: {
        type: !type ? "type is required" : undefined,
        device_key: !device_key ? "device_key is required" : undefined,
      },
    });
    return;
  }

  if (type !== sha256("extension")) {
    res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid request",
      data: {
        type: "type must be extension",
      },
    });
    return;
  }

  try {
    const device = await deviceModel.find(device_key);
    if (device) {
      res.status(400).json({
        code: 400,
        status: "error",
        message: "Invalid request",
        data: {
          device_key: "device_key already registered",
        },
      });
      return;
    }

    await deviceModel.create(device_key);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Device key registered successfully",
      data: {
        device_key,
      },
    });
  } catch (error: unknown) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
      data: {
        error: (error as Error).message,
      },
    });
  }
};

export default handler;
