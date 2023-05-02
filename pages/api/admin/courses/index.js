import { getSession } from 'next-auth/react';
import Course from '../../../../models/Course';
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
  const newCourse = new Course({
    name: 'sample name',
    slug: 'sample-name-' + Math.random(),
    image: '/images/shirt1.jpg',
    price: 0,
    category: 'sample category',
    description: 'sample description',
    province: 'sample category',
    english: 0,
    accounting: 0,
    economics: 0,
    businessStudies:0,
    agriculture: 0,
    physicalSciences: 0,
    lifeSciences: 0,
    maths: 0,
    mathsLit: 0,
    apsscore: 0,
    description: 'sample description',
    faculty: 'sample faculty',
    university: 'sample category',
    location: 'sample brand',
    closingDate: 'sample brand',
    rating: 0,
    numReviews: 0,
  });

  const course = await newCourse.save();
  await db.disconnect();
  res.send({ message: 'Course created successfully', course });
};
const getHandler = async (req, res) => {
  await db.connect();
  const courses = await Course.find({});
  await db.disconnect();
  res.send(courses);
};
export default handler;
