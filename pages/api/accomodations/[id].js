import Accomodation from '../../../models/Ress';
import db from '../../../utils/db';

const handler = async (req, res) => {
  await db.connect();
  const accomodation = await Accomodation.findById(req.query.id);
  await db.disconnect();
  res.send(accomodation);
};

export default handler;
