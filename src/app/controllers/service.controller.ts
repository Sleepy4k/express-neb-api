/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

import serviceList from "@constants/service-list.js";
import SebFile from "@modules/seb.js";
import SebService from "@services/seb.service.js";
import { parseXMLString, toSlug } from "@utils/parse.js";
import fs from "fs/promises";

const ServiceController = {
  /**
   * Service controller to send json response
   *
   * @param {Request} _req
   * @param {Response} res
   */
  index(_req: Request, res: Response) {
    res.json({
      code: 200,
      status: "success",
      message: "List of available services",
      data: serviceList.map((service) => ({
        ...service,
        slug: toSlug(service.name),
        description: !service.enabled
          ? service.description.default
          : Object.fromEntries(Object.entries(service.description).filter(([key]) => key !== "default")),
      })),
    });
  },

  /**
   * Service controller to handle store request for seb
   *
   * @param {Request} _req
   * @param {Response} res
   */
  store(_req: Request, res: Response) {
    res.status(400).json({
      code: 400,
      status: "error",
      message: "Please provide a service slug in the URL!",
    });
  },

  /**
   * Service controller to handle store request for seb
   *
   * @param {Request} req
   * @param {Response} res
   */
  async seb(req: Request<object, object, { file_name: string }>, res: Response) {
    const { file } = req;

    if (!file) {
      res.status(400).json({
        code: 400,
        status: "error",
        message: "File not found or invalid file type",
      });
      return;
    }

    try {
      const data = await SebService.validateAndReadFile(file.path);
      const parsedData = parseXMLString(data);

      if (!parsedData) {
        res.status(400).json({
          code: 400,
          status: "error",
          message: "Failed to parse the uploaded SEB file",
        });
        return;
      }

      const stats = await fs.stat(file.path);
      const uniqueHash = SebService.generateFileHash(parsedData, stats.size);
      const resultFilePath = SebService.getResultFilePath(req, uniqueHash);

      const cachedResponse = await SebService.getCachedSebFile(resultFilePath, file.path);
      if (cachedResponse) {
        res.status(200).json(cachedResponse);
        return;
      }

      const sebFile = SebFile.createInstance(parsedData);
      if (!sebFile?.StartUrl?.trim()) {
        res.status(400).json({
          code: 400,
          status: "error",
          message: "The SEB file does not contain a valid StartUrl",
        });
        return;
      }

      await SebService.cacheResult(resultFilePath, sebFile);

      res.status(200).json({
        code: 200,
        status: "success",
        message: "SEB file processed successfully",
        data: SebService.buildResponseFields(sebFile, req.body.file_name),
      });
    } catch (error: unknown) {
      console.error(error);

      res.status(500).json({
        code: 500,
        status: "error",
        message: `An error occurred while processing the SEB file: ${(error as Error).message}`,
      });
    }
  },

  /**
   * Service controller to handle kahoot request
   *
   * @param {Request} _req
   * @param {Response} res
   */
  kahoot(_req: Request, res: Response) {
    res.status(501).json({
      code: 501,
      status: "error",
      message: "Kahoot service is not implemented yet",
    });
  },

  /**
   * Service controller to handle quizizz request
   *
   * @param {Request} _req
   * @param {Response} res
   */
  quizizz(_req: Request, res: Response) {
    res.status(501).json({
      code: 501,
      status: "error",
      message: "Quizizz service is not implemented yet",
    });
  },
};

export default ServiceController;
