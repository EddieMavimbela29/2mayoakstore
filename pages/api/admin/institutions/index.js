import { getSession } from 'next-auth/react';
import Institution from '../../../../models/Institution';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send('admin signin required');
  }
  // const { user } = session;
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'POST') {
    return postHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};
const postHandler = async (req, res) => {
  await db.connect();
  const newInstitution = new Institution({
    name: 'sample name',
    slug: 'sample-name-' + Math.random(),
    image: '/images/shirt1.jpg',
    price: 0,
    province: 'sample province',
    description: 'sample description',
    type: 'sample faculty',
    location: 'sample brand',
    rating: 0,
    numReviews: 0,
  });

  const institution = await newInstitution.save();
  await db.disconnect();
  res.send({ message: 'Institution created successfully', institution });
};
const getHandler = async (req, res) => {
  await db.connect();
  const institutions = await Institution.find({});
  await db.disconnect();
  res.send(institutions);
};
export default handler;
