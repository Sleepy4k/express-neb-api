import fs from 'node:fs';
import SebFile from '@modules/seb.js';
import { serviceConfig } from '@config';
import type { Request, Response } from 'express';
import RedeemModel from '@models/redeem.model.js';
import { defaultEncoder } from '@constants/encoder.js';
import generateUserAgent from '@utils/generate-agent.js';
import type { IResData } from '@interfaces/responseField.js';
import {
  REFERER,
  USER_AGENT_HEADER_NAME,
  SEB_RH_HTTP_HEADER_NAME,
  SEB_CKH_HTTP_HEADER_NAME
} from '@constants/header.js';

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
  res.render('pages/service');
}

/**
 * The missing URL controller for the service controller
 *
 * @param {Request} _req - The request
 * @param {Response} res - The response
 */
const missUrl = (_req: Request, res: Response) => {
  res.status(404).send({
    status: 'error',
    message: 'Please provide a redeem code (e.g. /bypass/123) and a SEB file to perform the bypass',
    data: [],
  });
}

/**
 * The bypass controller for the service controller
 *
 * @param {Request} req - The request
 * @param {Response} res - The response
 */
const bypass = async (req: Request, res: Response) => {
  const redeemCode = req.params.redeemCode;

  if (!redeemCode || typeof redeemCode !== 'string') {
    res.status(400).send({
      status: 'error',
      message: 'Please provide a redeem code',
      data: [],
    });
    return;
  }

  const redeem = redeemModel.find(redeemCode);

  if (!redeem) {
    res.status(400).send({
      status: 'error',
      message: 'Invalid redeem code',
      data: [],
    });
    return;
  }

  // Check if redeem code is already redeemed
  if (redeem.redeemedAt !== null) {
    res.status(400).send({
      status: 'error',
      message: 'Redeem code already used',
      data: [],
    });
    return;
  }

  try {
    const file = req.file;

    if (!file) {
      res.status(400).send({
        status: 'error',
        message: 'File not found or invalid file type',
        data: [],
      });
      return;
    }

    fs.readFile(file.path, defaultEncoder, async (err, data) => {
      if (err) {
        console.log(err);

        res.status(400).send({
          status: 'error',
          message: 'Error reading file',
          data: [],
        });
        return;
      }

      const sebFile = await SebFile.createInstance(data);
      if (!sebFile) {
        res.status(400).send({
          status: 'error',
          message: 'Error parsing SEB file',
          data: [],
        });
        return;
      }

      if (!sebFile.StartUrl || sebFile.StartUrl === '') {
        res.status(400).send({
          status: 'error',
          message: 'Start URL not found in SEB file',
          data: [],
        });
        return;
      }

      const resData: IResData = {
        status: 'success',
        message: 'SEB configuration file successfully bypassed',
        data: [],
      };

      // Append SEB file data to response
      const responseFields = [
        { condition: serviceConfig.response.showStartUrl, name: REFERER, value: sebFile.StartUrl },
        { condition: serviceConfig.response.showUserAgent, name: USER_AGENT_HEADER_NAME, value: generateUserAgent() },
        { condition: serviceConfig.response.showRequestHash, name: SEB_RH_HTTP_HEADER_NAME, value: sebFile.RequestHash },
        { condition: serviceConfig.response.showConfigHash, name: SEB_CKH_HTTP_HEADER_NAME, value: sebFile.getConfigKey(sebFile.StartUrl || '') },
        { condition: serviceConfig.response.showSerializedJson, name: 'Serialized', value: sebFile.SerializedJson },
        { condition: serviceConfig.response.showDictionnary, name: 'Dictionary', value: JSON.stringify(sebFile.Dictionnary) }
      ];

      responseFields.forEach(field => {
        if (field.condition) {
          resData.data?.push({ name: field.name, value: field.value });
        }
      });

      res.status(200).send(resData);

      redeemModel.redeem(redeemCode);

      if (serviceConfig.file.deleteAfterParse) {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.log(`Error deleting file: ${err}`);
          }
        });
      }
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      status: 'error',
      message: 'An error occurred',
      data: [],
    });
  }
}

export {
  form,
  missUrl,
  bypass,
};
