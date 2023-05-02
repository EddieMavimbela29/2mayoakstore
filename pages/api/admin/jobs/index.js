import { getSession } from 'next-auth/react';
import Job from '../../../../models/Job';
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
  const newJob = new Job({
    name: 'sample name',
    slug: 'sample-name-' + Math.random(),
    image: '/images/shirt1.jpg',
    price: 0,
    category: 'sample category',
    closingDate: 'sample brand',
    faculty: 'sample brand',
    company: 'sample brand',
    province: 'sample brand',
    location: 'sample brand',
    description: 'sample description',
    rating: 0,
    numReviews: 0,
  });

  const job = await newJob.save();
  await db.disconnect();
  res.send({ message: 'Job created successfully', job });
};
const getHandler = async (req, res) => {
  await db.connect();
  const jobs = await Job.find({});
  await db.disconnect();
  res.send(jobs);
};
export default handler;
