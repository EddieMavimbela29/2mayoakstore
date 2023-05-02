import { getSession } from 'next-auth/react';
import Accomodation from '../../../../../models/Ress';
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
  const accomodation = await Accomodation.findById(req.query.id);
  await db.disconnect();
  res.send(accomodation);
};
const putHandler = async (req, res) => {
  await db.connect();
  const accomodation = await Accomodation.findById(req.query.id);
  if (accomodation) {
    accomodation.name = req.body.name;
    accomodation.slug = req.body.slug;
    accomodation.price = req.body.price;
    accomodation.province = req.body.province;
    accomodation.image = req.body.image;
    accomodation.description = req.body.description;
    accomodation.location = req.body.location;
    accomodation.category = req.body.category;
    await accomodation.save();
    await db.disconnect();
    res.send({ message: 'Accomodation updated successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Accomodation not found' });
  }
};
const deleteHandler = async (req, res) => {
  await db.connect();
  const accomodation = await Accomodation.findById(req.query.id);
  if (accomodation) {
    await accomodation.remove();
    await db.disconnect();
    res.send({ message: 'Accomodation deleted successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Accomodation not found' });
  }
};
export default handler;
