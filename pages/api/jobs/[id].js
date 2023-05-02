import Job from '../../../models/Job';
import db from '../../../utils/db';

const handler = async (req, res) => {
  await db.connect();
  const job = await Job.findById(req.query.id);
  await db.disconnect();
  res.send(job);
};

export default handler;
