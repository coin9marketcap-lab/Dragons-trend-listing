import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/utils";
import { verifyAdminToken } from "../../../../lib/utils";

export default async function handler(req, { params }) {
  const { id } = params;
  const db = await getDb();
  const collection = db.collection("projects");
  if (req.method === "GET") {
    const proj = await collection.findOne({ _id: new (require("mongodb").ObjectId)(id) });
    if (!proj) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, project: proj });
  }

  // Admin-only endpoints
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "");
  const verified = verifyAdminToken(token);
  if (!verified) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (req.method === "PUT") {
    // update fields (approve, reject, mark premium)
    const body = await req.json();
    const update = {};
    if (body.status) update.status = body.status;
    if (typeof body.premium !== "undefined") update.premium = !!body.premium;
    if (body.txid) update.txid = body.txid;
    await collection.updateOne({ _id: new (require("mongodb").ObjectId)(id) }, { $set: update });
    const proj = await collection.findOne({ _id: new (require("mongodb").ObjectId)(id) });
    return NextResponse.json({ success: true, project: proj });
  }

  if (req.method === "DELETE") {
    await collection.deleteOne({ _id: new (require("mongodb").ObjectId)(id) });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
      }
