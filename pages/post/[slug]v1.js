import Image from 'next/image';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import PostDetail from '../../components/PostDetail';
import Ads from '../../components/Ads';
import Loader from '../../components/Loader';
import Post from '../../models/Post';
import db from '../../utils/db';


export default function PostScreen(props) {

  const { post, featuredPosts, categories } = props;
 
  const router = useRouter();

  if (router.isFallback) {
    return <Loader />;
  }

  if (!post) {
    return <Layout title="Post Not Found">Post Not Found</Layout>;
  }

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/posts">Back to Posts</Link>
      </div>
      <div className="container mx-auto px-10 py-12 my-12 mt-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="col-span-1 lg:col-span-8">
            <PostDetail post={post} />
            <div className="py-2">
               <Link href="/courses">BY ADMIN</Link>
           </div>
          </div>
          <div className="col-span-1 lg:col-span-4">
            <div className="relative lg:sticky top-8">
             <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
                 <h3 className="text-xl mb-8 font-semibold border-b pb-4">{slug ? 'Related Posts' : 'Recent Posts'}</h3>
                   {featuredPosts.map((post, index) => (
                     <div key={index} className="flex items-center w-full mb-4">
                        <div className="w-16 flex-none">
                           <Image
                             alt={post.name}
                             height="60px"
                             width="60px"
                             unoptimized
                             className="align-middle rounded-full"
                             src={post.image}
                           />
                    </div>
                     <div className="flex-grow ml-4">
                        <p className="text-gray-500 font-xs">{moment(post.createdAt).format('MMM DD, YYYY')}</p>
                           <Link href={`/post/${post.slug}`} className="text-md" key={index}>{post.name}</Link>
                    </div>
                  </div>
                  ))}
               </div>
             <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
                 <h3 className="text-xl mb-8 font-semibold border-b pb-4">Categories</h3>
                   {categories.map((category, index) => (
                    <Link key={index} href={`/post/${category.slug}`}>
                      <span className={`cursor-pointer block ${(index === categories.length - 1) ? 'border-b-0' : 'border-b'} pb-3 mb-3`}>{category.name}</span>
                    </Link>
                   ))}
               </div>
              <Ads />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const post = await Post.findOne({ slug }).lean();
  const featuredPosts = await Post.find({ isFeatured: true }).lean();
  const categories = await Post.find().distinct('category');
 
  await db.disconnect();
  return {
    props: {
      post: post ? db.convertDocToObj(post) : null,
      featuredPosts: featuredPosts.map(db.convertDocToObj), 
      categories: categories.map(db.convertDocToObj), 
    },
  };
}
