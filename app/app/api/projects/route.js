import formidable from "formidable";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/utils";
import fs from "fs";

// ⛔ REMOVE THIS (deprecated in app router)
// export const config = { api: { bodyParser: false } };

// ✅ NEW WAY in Next.js Route Handlers:
export const runtime = "nodejs"; 
export const dynamic = "force-dynamic"; 
export const maxDuration = 60; // allow longer form uploads

// NEW Next.js wrapper for formidable
async function parseForm(request) {
  const form = formidable({
    multiples: false,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });

  return new Promise((resolve, reject) => {
    form.parse(request, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// =============================
// GET — Fetch All Projects
// =============================
export async function GET() {
  const db = await getDb();
  const collection = db.collection("projects");

  const projects = await collection
    .find({})
    .sort({ premium: -1, createdAt: -1 })
    .toArray();

  return NextResponse.json({ success: true, projects });
}

// =============================
// POST — Add New Project
// =============================
export async function POST(request) {
  try {
    const { fields, files } = await parseForm(request);

    const { name, symbol, chain, contract, description, website, type } = fields;

    if (!name || !symbol)
      return NextResponse.json(
        { error: "name and symbol required" },
        { status: 400 }
      );

    // handle logo
    let logoBase64 = fields.logoBase64 || "";
    if (!logoBase64 && files?.logo) {
      const file = files.logo;
      const buf = fs.readFileSync(file.filepath);
      logoBase64 = `data:${file.mimetype};base64,` + buf.toString("base64");
    }

    if (!logoBase64)
      return NextResponse.json(
        { error: "Logo upload is required" },
        { status: 400 }
      );

    const db = await getDb();
    const collection = db.collection("projects");

    const newProject = {
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
      txid: fields.txid || null,
    };

    const insert = await collection.insertOne(newProject);
    newProject._id = insert.insertedId;

    return NextResponse.json({
      success: true,
      project: newProject,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || String(err) },
      { status: 500 }
    );
  }
    }
