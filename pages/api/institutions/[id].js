import Institution from '../../../models/Institution';
import db from '../../../utils/db';

const handler = async (req, res) => {
  await db.connect();
  const institution = await Institution.findById(req.query.id);
  await db.disconnect();
  res.send(institution);
};

export default handler;
