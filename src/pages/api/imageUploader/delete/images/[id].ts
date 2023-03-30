// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import { usersRepo } from "@/helpers/image-repo";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import isValidQuery from "@/helpers/validQuuery";

export const config = {
  api: {
    bodyParser: false,
  },
};

type RequestBody = {
  id: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    if (isValidQuery<RequestBody>(req.query, ["id"])) {
      const pathWithPrefix = "/images/" + req.query.id;
      const imageData = usersRepo.getByPath(pathWithPrefix);
      if (!imageData) {
        res.status(402).send("Data not found");
        return;
      }
      const filePath = path.join(process.cwd() + "/public", imageData.path);
      console.log(filePath);
      try {
        fs.unlinkSync(filePath);
        usersRepo.delete(imageData.path);
      } catch (error) {
        console.log(error);
        res.status(405).send("Data not found");
        return;
      }

      res.status(200).json({});
      return;
    }
    res.status(402).send("Method not allowed1");
    return;
  }
  res.setHeader("Allow", "DELETE");
  res.status(405).send("Method not allowed1");
  return;
}
