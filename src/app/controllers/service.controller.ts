import fs from 'node:fs';
import { serviceConfig } from '@config';
import { Request, Response } from 'express';
import { SebFile } from '@utils/seb-tools.js';
import generateUserAgent from '@utils/generate-agent.js';
import type { IResData } from '@interfaces/responseField.js';
import {
  USER_AGENT_HEADER_NAME,
  SEB_CKH_HTTP_HEADER_NAME
} from '@constants/header.js';

const form = (_req: Request, res: Response) => {
  res.render('pages/service');
}

const bypass = async (req: Request, res: Response) => {
  const redeemCode = req.params.redeemCode;

  if (redeemCode === '123') {
    res.status(400).send({
      status: 'error',
      message: 'Invalid redeem code',
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

    fs.readFile(file.path, 'utf8', async (err, data) => {
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
      if (serviceConfig.response.showStartUrl) {
        resData.data?.push({
          name: 'Referer',
          value: sebFile.StartUrl
        });
      }

      if (serviceConfig.response.showUserAgent) {
        resData.data?.push({
          name: USER_AGENT_HEADER_NAME,
          value: generateUserAgent()
        });
      }

      if (serviceConfig.response.showConfigHash) {
        resData.data?.push({
          name: SEB_CKH_HTTP_HEADER_NAME,
          value: sebFile.getConfigKey(sebFile.StartUrl || '')
        });
      }

      if (serviceConfig.response.showSerializedJson) {
        resData.data?.push({
          name: 'Serialized',
          value: sebFile.SerializedJson
        });
      }

      if (serviceConfig.response.showDictionnary) {
        resData.data?.push({
          name: 'Dictionary',
          value: JSON.stringify(sebFile.Dictionnary)
        });
      }

      res.status(200).send(resData);

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
  bypass,
};
