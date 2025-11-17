import clientPromise from '../../../../lib/db';
import { verifyAdminToken } from '../../../../lib/utils';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const admin = verifyAdminToken(req);
  if (!admin) return res.status(401).json({ message: 'Unauthorized' });

  const { txid } = req.body;
  const { id } = req.query;

  if (!txid) return res.status(400).json({ message: 'TXID required' });

  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('projects').updateOne(
    { _id: new ObjectId(id) },
    { $set: { premium: true, txid } }
  );

  if (result.modifiedCount === 1) res.status(200).json({ message: 'Project approved' });
  else res.status(400).json({ message: 'Failed to approve project' });
    }
