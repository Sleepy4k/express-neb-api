import type { IResData } from "@interfaces/responseField.js";
import type { Request, Response } from "express";

import { serviceConfig } from "@config";
import { defaultEncoder } from "@constants/encoder.js";
import { REFERER, SEB_CKH_HTTP_HEADER_NAME, SEB_RH_HTTP_HEADER_NAME, USER_AGENT_HEADER_NAME } from "@constants/header.js";
import RedeemModel from "@models/redeem.model.js";
import SebFile from "@modules/seb.js";
import generateUserAgent from "@utils/generate-agent.js";
import fs from "node:fs";

/**
 * The redeem model instance for the service controller
 *
 * @type {RedeemModel}
 */
const redeemModel: RedeemModel = new RedeemModel();

/**
 * The form controller for the service controller
 *
 * @param {Request} _req - The request
 * @param {Response} res - The response
 */
const form = (_req: Request, res: Response) => {
  res.render("pages/service");
};

/**
 * The missing URL controller for the service controller
 *
 * @param {Request} _req - The request
 * @param {Response} res - The response
 */
const missUrl = (_req: Request, res: Response) => {
  res.status(404).send({
    data: [],
    message: "Please provide a redeem code (e.g. /bypass/123) and a SEB file to perform the bypass",
    status: "error",
  });
};

/**
 * The bypass controller for the service controller
 *
 * @param {Request} req - The request
 * @param {Response} res - The response
 */
const bypass = async (req: Request, res: Response) => {
  const redeemCode = req.params.redeemCode;

  if (!redeemCode || typeof redeemCode !== "string") {
    res.status(400).send({
      data: [],
      message: "Please provide a redeem code",
      status: "error",
    });
    return;
  }

  const redeem = redeemModel.find(redeemCode);

  if (!redeem) {
    res.status(400).send({
      data: [],
      message: "Invalid redeem code",
      status: "error",
    });
    return;
  }

  // Check if redeem code is already redeemed
  if (redeem.redeemedAt !== null) {
    res.status(400).send({
      data: [],
      message: "Redeem code already used",
      status: "error",
    });
    return;
  }

  try {
    const file = req.file;

    if (!file) {
      res.status(400).send({
        data: [],
        message: "File not found or invalid file type",
        status: "error",
      });
      return;
    }

    const readFileAsync = (path: string, encoding: BufferEncoding): Promise<string> => {
      return new Promise((resolve, reject) => {
        fs.readFile(path, encoding, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    };

    try {
      const data = await readFileAsync(file.path, defaultEncoder);
      const sebFile = SebFile.createInstance(data);

      if (!sebFile) {
        res.status(400).send({
          data: [],
          message: "Error parsing SEB file",
          status: "error",
        });
        return;
      }

      if (!sebFile.StartUrl || sebFile.StartUrl === "") {
        res.status(400).send({
          data: [],
          message: "Start URL not found in SEB file",
          status: "error",
        });
        return;
      }

      const resData: IResData = {
        data: [],
        message: "SEB configuration file successfully bypassed",
        status: "success",
      };

      // Append SEB file data to response
      const responseFields = [
        { condition: serviceConfig.response.showStartUrl, name: REFERER, value: sebFile.StartUrl },
        { condition: serviceConfig.response.showUserAgent, name: USER_AGENT_HEADER_NAME, value: generateUserAgent() },
        { condition: serviceConfig.response.showRequestHash, name: SEB_RH_HTTP_HEADER_NAME, value: sebFile.RequestHash },
        { condition: serviceConfig.response.showConfigHash, name: SEB_CKH_HTTP_HEADER_NAME, value: sebFile.getConfigKey(sebFile.StartUrl || "") },
        { condition: serviceConfig.response.showSerializedJson, name: "Serialized", value: sebFile.SerializedJson },
        { condition: serviceConfig.response.showDictionnary, name: "Dictionary", value: JSON.stringify(sebFile.Dictionnary) },
      ];

      responseFields.forEach((field) => {
        if (field.condition) {
          resData.data?.push({ name: field.name, value: field.value });
        }
      });

      res.status(200).send(resData);

      redeemModel.redeem(redeemCode);

      if (serviceConfig.file.deleteAfterParse) {
        fs.unlink(file.path, (err: NodeJS.ErrnoException | null) => {
          if (err) {
            console.log(`Error deleting file: ${err.message}`);
          }
        });
      }

      return;
    } catch (err) {
      console.log(err);

      res.status(400).send({
        data: [],
        message: "Error reading file",
        status: "error",
      });
    }
  } catch (error) {
    console.log(error);

    res.status(500).send({
      data: [],
      message: "An error occurred",
      status: "error",
    });
  }
};

export { bypass, form, missUrl };
