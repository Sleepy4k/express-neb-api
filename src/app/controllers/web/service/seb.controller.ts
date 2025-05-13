import type { Request, Response } from "express";

import { serviceConfig } from "@config/service.config.js";
import { defaultEncoder } from "@constants/encoder.js";
import { REFERER, SEB_CKH_HTTP_HEADER_NAME, SEB_RH_HTTP_HEADER_NAME, USER_AGENT_HEADER_NAME } from "@constants/header.js";
import { type IResData } from "@interfaces/responseField.js";
import RedeemModel from "@models/redeem.model.js";
import Sanitation from "@modules/sanitation.js";
import SebFile from "@modules/seb.js";
import UserAgentGenerator from "@modules/userAgent.js";
import { type ParamsDictionary } from "express-serve-static-core";
import fs from "node:fs/promises";

/**
 * The interface for the request body
 * @interface IBypassBody
 */
interface IBypassBody {
  file_name: string;
  redeem_code: string;
}

/**
 * The interface for the request parameters
 * @interface IBypassParams
 * @extends ParamsDictionary
 */
interface IBypassParams extends ParamsDictionary {
  redeemCode: string;
}

/**
 * The redeem model instance for the service controller
 *
 * @type {RedeemModel}
 */
const redeemModel: RedeemModel = new RedeemModel();

/**
 * The user agent generator instance for the service controller
 *
 * @type {UserAgentGenerator}
 */
const userAgentGenerator: UserAgentGenerator = new UserAgentGenerator();

/**
 * The form controller for the service controller
 *
 * @param {Request} _req - The request
 * @param {Response} res - The response
 */
const form = (_req: Request, res: Response) => {
  res.render("pages/service/seb");
};

/**
 * The missing URL controller for the service controller
 *
 * @param {Request} _req - The request
 * @param {Response} res - The response
 */
const missUrl = (_req: Request, res: Response) => {
  res.status(404).json({
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
const bypass = async (req: Request<IBypassParams, object, IBypassBody>, res: Response) => {
  const redeemCode = req.params.redeemCode;

  if (!redeemCode || typeof redeemCode !== "string") {
    res.status(400).send({
      data: [],
      message: "Please provide a redeem code",
      status: "error",
    });
    return;
  }

  const { redeem_code } = req.body;

  if (!redeem_code || redeem_code !== "") {
    res.status(400).json({
      data: [],
      message: "Unauthorized bypass attempt, please contact the administrator if you think this is a mistake",
      status: "error",
    });
    return;
  }

  if (redeemCode !== redeem_code) {
    res.status(400).json({
      data: [],
      message: "Redeem code does not match the redeem code in the body",
      status: "error",
    });
    return;
  }

  const sanitazedRedeemCode = Sanitation.sanitizeRedeemCode(redeemCode);
  const redeem = await redeemModel.find(sanitazedRedeemCode);

  if (!redeem) {
    res.status(400).json({
      data: [],
      message: "Invalid redeem code",
      status: "error",
    });
    return;
  }

  if (redeem.redeemedAt !== null) {
    res.status(400).json({
      data: [],
      message: "Redeem code already used",
      status: "error",
    });
    return;
  }

  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({
        data: [],
        message: "File not found or invalid file type",
        status: "error",
      });
      return;
    }

    const readFileAsync = async (path: string, encoding: BufferEncoding): Promise<string> => {
      return await fs.readFile(path, { encoding });
    };

    try {
      const data = await readFileAsync(file.path, defaultEncoder);
      const sebFile = SebFile.createInstance(data);

      if (!sebFile) {
        res.status(400).json({
          data: [],
          message: "Error parsing SEB file",
          status: "error",
        });
        return;
      }

      if (!sebFile.StartUrl || sebFile.StartUrl === "") {
        res.status(400).json({
          data: [],
          message: "Start URL not found in SEB file",
          status: "error",
        });
        return;
      }

      const { file_name } = req.body;
      const resData: IResData = {
        data: [],
        message: "SEB configuration file successfully bypassed",
        status: "success",
      };

      const responseFields = [
        { condition: serviceConfig.response.showStartUrl, name: REFERER, value: sebFile.StartUrl },
        {
          condition: serviceConfig.response.showUserAgent,
          name: USER_AGENT_HEADER_NAME,
          value: userAgentGenerator.generate() ?? "default-user-agent",
        },
        { condition: serviceConfig.response.showRequestHash, name: SEB_RH_HTTP_HEADER_NAME, value: sebFile.RequestHash },
        { condition: serviceConfig.response.showConfigHash, name: SEB_CKH_HTTP_HEADER_NAME, value: sebFile.getConfigKey(sebFile.StartUrl || "") },
        { condition: true, name: "File-Name", value: file_name || "Naka Exam Bypasser" },
        { condition: serviceConfig.response.showSerializedJson, name: "Serialized", value: sebFile.SerializedJson },
        { condition: serviceConfig.response.showDictionnary, name: "Dictionary", value: JSON.stringify(sebFile.Dictionnary) },
      ];

      resData.data = responseFields.filter((field) => field.condition).map(({ name, value }) => ({ name, value }));

      res.status(200).json(resData);

      await redeemModel.redeem(sanitazedRedeemCode);

      if (serviceConfig.file.deleteAfterParse) {
        await fs.unlink(file.path).catch((err: unknown) => {
          console.log(`Error deleting file: ${err as Error}`);
        });
      }
    } catch (err) {
      console.log(err);

      res.status(400).json({
        data: [],
        message: "Error reading file",
        status: "error",
      });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      data: [],
      message: "An error occurred",
      status: "error",
    });
  }
};

export { bypass, form, missUrl };
