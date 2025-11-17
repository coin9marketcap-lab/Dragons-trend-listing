import formidable from "formidable";
import { NextResponse } from "next/server";
import { getDb } from "../../../lib/utils";

export const config = {
  api: { bodyParser: false }
};

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false, maxFileSize: 5 * 1024 * 1024 }); // 5MB
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export default async function handler(req) {
  const db = await getDb();
  const collection = db.collection("projects");

  if (req.method === "GET") {
    // return all approved first, premium highlighted
    const projects = await collection.find({}).sort({ premium: -1, createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, projects });
  }

  if (req.method === "POST") {
    // handle multipart form: fields + logo file
    try {
      const { fields, files } = await parseForm(req);
      // required fields
      const { name, symbol, chain, contract, description, website, type } = fields;
      if (!name || !symbol) return NextResponse.json({ error: "name and symbol required" }, { status: 400 });

      // process logo file (clients must upload file)
      let logoBase64 = fields.logoBase64 || "";
      if (!logoBase64 && files?.logo) {
        // read file buffer and convert to base64
        const file = files.logo;
        const fs = require("fs");
        const buf = fs.readFileSync(file.filepath);
        logoBase64 = `data:${file.mimetype};base64,` + buf.toString("base64");
      }
      if (!logoBase64) return NextResponse.json({ error: "Logo upload is required" }, { status: 400 });

      const created = {
        name,
        symbol,
        chain: chain || "SOL",
        contract: contract || "",
        description: description || "",
        website: website || "",
        socialLinks: JSON.parse(fields.socialLinks || "{}"),
        createdAt: Date.now(),
        status: type === "premium" ? "pending_payment" : "pending_admin",
        premium: type === "premium",
        logoBase64,
        votes: 0,
        txid: fields.txid || null
      };

      const insert = await collection.insertOne(created);
      created._id = insert.insertedId;
      return NextResponse.json({ success: true, project: created });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
        }
