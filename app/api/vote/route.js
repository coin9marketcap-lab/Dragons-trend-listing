import { NextResponse } from "next/server";
import { getDb } from "../../../lib/utils";

function clientIp(req) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export default async function handler(req) {
  const db = await getDb();
  const votes = db.collection("votes");
  const projects = db.collection("projects");

  if (req.method !== "POST") return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  const { projectId } = await req.json();
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

  const ip = clientIp(req);
  const since = Date.now() - 24 * 3600 * 1000;
  const recent = await votes.findOne({ projectId, ip, createdAt: { $gte: since } });
  if (recent) {
    return NextResponse.json({ error: "Already voted in last 24 hours from this IP" }, { status: 429 });
  }

  await votes.insertOne({ projectId, ip, createdAt: Date.now() });
  await projects.updateOne({ _id: new (require("mongodb").ObjectId)(projectId) }, { $inc: { votes: 1 } });
  return NextResponse.json({ success: true });
}
