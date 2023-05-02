import { getSession } from 'next-auth/react';
import Course from '../../../../../models/Course';
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
  const course = await Course.findById(req.query.id);
  await db.disconnect();
  res.send(course);
};
const putHandler = async (req, res) => {
  await db.connect();
  const course = await Course.findById(req.query.id);
  if (course) {
    course.name = req.body.name;
    course.slug = req.body.slug;
    course.price = req.body.price;
    course.province = req.body.province;
    course.image = req.body.image;
    course.english = req.body.english;
    course.accounting = req.body.accounting;
    course.economics = req.body.economics;
    course.businessStudies = req.body.businessStudies;
    course.agriculture = req.body.agriculture;
    course.physicalSciences = req.body.physicalSciences;
    course.lifeSciences = req.body.lifeSciences;
    course.description = req.body.description;
    course.maths = req.body.maths;
    course.mathsLit = req.body.mathsLit;
    course.apsscore = req.body.apsscore;
    course.university = req.body.university;
    course.faculty = req.body.faculty;
    course.location = req.body.location;
    course.closingDate = req.body.closingDate;
    await course.save();
    await db.disconnect();
    res.send({ message: 'course updated successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product not found' });
  }
};
const deleteHandler = async (req, res) => {
  await db.connect();
  const course = await Course.findById(req.query.id);
  if (course) {
    await course.remove();
    await db.disconnect();
    res.send({ message: 'Product deleted successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product not found' });
  }
};
export default handler;
