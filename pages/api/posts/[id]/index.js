import Post from '../../../../../models/[Post]';
import db from '../../../../../utils/db';

const handler = async (req, res) => {
  await db.connect();
  const post = await Post.findById(req.query.id);
  await db.disconnect();
  res.send(post);
};

export default handler;
