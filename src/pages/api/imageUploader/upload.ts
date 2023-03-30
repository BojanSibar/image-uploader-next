// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import mime from "mime";
import { CreateImageDB, usersRepo } from "@/helpers/image-repo";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

type Data = {
  data: CreateImageDB | null;
  error?: string;
};

function uploadDir() {
  return path.join(process.cwd() + "/public", "/images");
}

function prepareFolder() {
  const uploadDirectory = uploadDir();
  try {
    fs.readdirSync(uploadDirectory);
  } catch (error) {
    fs.mkdirSync(uploadDirectory);
  }
}

async function prepareFile(
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const uploadDirectory = uploadDir();
  return await new Promise(async (resolve, reject) => {
    const form = formidable({
      maxFiles: 1,
      maxFileSize: 1024 * 1024 * 10, // 10mb
      uploadDir: uploadDirectory,
      filename: (_name, _ext, part) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${part.name || "unknown"}-${uniqueSuffix}.${
          mime.getExtension(part.mimetype || "") || "unknown"
        }`;
        return filename;
      },
      filter: (part) => {
        return (
          part.name === "media" && (part.mimetype?.includes("image") || false)
        );
      },
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      if (!files || !files["media"]) {
        reject(
          new formidable.errors.FormidableError(
            "incorrect file type",
            formidable.errors.missingContentType
          )
        );
      } else resolve({ fields, files });
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    try {
      prepareFolder();
      const { files } = await prepareFile(req);
      const file = files["media"] as formidable.File;
      const createImage = {
        name: file.originalFilename || "",
        path: "/images/" + file.newFilename,
      };
      usersRepo.create(createImage);
      res.status(200).json({
        data: createImage,
      });
    } catch (error) {
      if (error instanceof formidable.errors.FormidableError) {
        res.status(400).json({ data: null, error: error.message });
      } else {
        console.error(error);
        res.status(500).json({ data: null, error: "Internal Server Error" });
      }
    }
    return;
  }
  res.setHeader("Allow", "POST");
  res.status(405).json({
    data: null,
    error: "Method Not Allowed",
  });
  return;
}
