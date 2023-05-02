import { getSession } from 'next-auth/react';
import Post from '../../../../models/Post';
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
  const newPost = new Post({
    name: 'sample name',
    slug: 'sample-name-' + Math.random(),
    image: '/images/shirt1.jpg',
    category: 'sample category',
    description: 'sample description',
    rating: 0,
    numReviews: 0,
  });

  const post = await newPost.save();
  await db.disconnect();
  res.send({ message: 'Post created successfully', post });
};
const getHandler = async (req, res) => {
  await db.connect();
  const posts = await Post.find({});
  await db.disconnect();
  res.send(posts);
};
export default handler;
