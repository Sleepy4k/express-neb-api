/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

import datatableLang from "@lang/id/datatable.js";
import { parseHostname } from "@utils/parse.js";

/**
 * DataTable configuration controller to send json response
 *
 * @param {Request} req
 * @param {Response} res
 */
const configuration = (req: Request, res: Response) => {
  const baseUrl = parseHostname(`${req.protocol}://${req.get("host") ?? ""}`);
  res.json({
    code: 200,
    status: "success",
    message: "DataTable Configuration",
    data: {
      processing: true,
      responsive: true,
      rowReorder: true,
      layout: {
        top1Start: "buttons",
        bottomStart: "info",
        bottomEnd: "paging",
      },
      buttons: [
        {
          extend: "copy",
          text: '<i class="fas fa-copy"></i>',
          titleAttr: "Copy",
          className: "btn btn-secondary",
        },
        {
          extend: "print",
          text: '<i class="fas fa-print"></i>',
          titleAttr: "Print",
          className: "btn btn-secondary",
        },
        {
          extend: "csv",
          text: '<i class="fas fa-file-csv"></i>',
          titleAttr: "Export CSV",
          className: "btn btn-secondary",
        },
        {
          extend: "excel",
          text: '<i class="fas fa-file-excel"></i>',
          titleAttr: "Export Excel",
          className: "btn btn-secondary",
        },
        {
          extend: "pdf",
          text: '<i class="fas fa-file-pdf"></i>',
          titleAttr: "Export PDF",
          className: "btn btn-secondary",
        },
      ],
      order: [[0, "asc"]],
      pageLength: 10,
      lengthChange: true,
      searching: true,
      info: true,
      language: {
        url: `${baseUrl}/api/datatable/localisation`,
      },
    },
  });
};

/**
 * Localisation controller to send json response
 *
 * @param {Request} _req
 * @param {Response} res
 */
const localisation = (_req: Request, res: Response) => {
  res.json(datatableLang);
};

export { configuration, localisation };
