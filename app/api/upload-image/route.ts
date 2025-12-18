import { cloudinary } from "@/lib/cloudinary";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // disable Next.js default body parser
  },
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const form = new formidable.IncomingForm();

    const data = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
      (resolve, reject) => {
        form.parse(req as any, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      }
    );

    const file = data.files.image as File;
    if (!file) return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });

    const result = await cloudinary.uploader.upload(file.filepath);

    return new Response(JSON.stringify({ url: result.secure_url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 });
  }
}
