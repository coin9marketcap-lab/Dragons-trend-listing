import clientPromise from '../../../../lib/db';
import { verifyAdminToken } from '../../../../lib/utils';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const admin = verifyAdminToken(req);
  if (!admin) return res.status(401).json({ message: 'Unauthorized' });

  const { delta } = req.body;
  const { id } = req.query;

  if (typeof delta !== 'number') return res.status(400).json({ message: 'Invalid delta' });

  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection('projects').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $inc: { votes: delta } },
    { returnDocument: 'after' }
  );

  if (result.value) res.status(200).json({ votes: result.value.votes });
  else res.status(400).json({ message: 'Failed to update votes' });
}
