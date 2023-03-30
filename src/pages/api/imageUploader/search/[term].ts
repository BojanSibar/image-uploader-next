// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import { ImageDB, usersRepo } from "@/helpers/image-repo";
import type { NextApiRequest, NextApiResponse } from "next";
import isValidQuery from "@/helpers/validQuuery";

export const config = {
  api: {
    bodyParser: false,
  },
};

type RequestBody = {
  term: string;
};

type Data = {
  data: ImageDB[] | null;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    if (isValidQuery<RequestBody>(req.query, ["term"])) {
      const imageData = usersRepo.search(req.query.term);
      res.status(200).json({
        data: imageData,
      });
      return;
    }
    res.status(402).json({
      data: null,
      error: "Term Not Found",
    });
    return;
  }
  res.setHeader("Allow", "GET");
  res.status(405).json({
    data: null,
    error: "Method Not Allowed",
  });
  return;
}
