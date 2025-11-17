import clientPromise from '../../../lib/db';
import { verifyAdminToken } from '../../../lib/utils';

export default async function handler(req, res) {
  const admin = verifyAdminToken(req);
  if (!admin) return res.status(401).json({ message: 'Unauthorized' });

  const client = await clientPromise;
  const db = client.db();
  const projects = await db.collection('projects').find({}).toArray();
  res.status(200).json(projects);
}
