import { getSession } from 'next-auth/react';
import Institution from '../../../../../models/Institution';
import db from '../../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send('signin required');
  }

  const { user } = session;
  if (req.method === 'GET') {
    return getHandler(req, res, user);
  } else if (req.method === 'PUT') {
    return putHandler(req, res, user);
  } else if (req.method === 'DELETE') {
    return deleteHandler(req, res, user);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};
const getHandler = async (req, res) => {
  await db.connect();
  const institution = await Institution.findById(req.query.id);
  await db.disconnect();
  res.send(institution);
};
const putHandler = async (req, res) => {
  await db.connect();
  const institution = await Institution.findById(req.query.id);
  if (institution) {
    institution.name = req.body.name;
    institution.slug = req.body.slug;
    institution.price = req.body.price;
    institution.province = req.body.province;
    institution.image = req.body.image;
    institution.description = req.body.description;
    institution.location = req.body.location;
    institution.type = req.body.type;
    await institution.save();
    await db.disconnect();
    res.send({ message: 'Institution updated successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Institution not found' });
  }
};
const deleteHandler = async (req, res) => {
  await db.connect();
  const institution = await Institution.findById(req.query.id);
  if (institution) {
    await institution.remove();
    await db.disconnect();
    res.send({ message: 'institution deleted successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product not found' });
  }
};
export default handler;
