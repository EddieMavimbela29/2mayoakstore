import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import Post from '../../models/Post';
import db from '../../utils/db';
import { Store } from '../../utils/Store';
import ReactHtmlParser from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';


const htmlFrom = (htmlString) => {
  const cleanHtmlString = DOMPurify.sanitize(htmlString,
    { USE_PROFILES: { html: true } });
  const html = ReactHtmlParser(cleanHtmlString);
  return html;
}

export default function JobScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  if (!product) {
    return <Layout title="Course Not Found">Course Not Found</Layout>;
  }

  

  const body = product.description;

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/courses">Back to Courses</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category:{product.category}</li>
            <li>Description: { htmlFrom(body)}</li>
          </ul>
        </div>
      </div>
///

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
              <PostWidget />
              <Categories />
              <Ads />
            </div>
          </div>
        </div>
      </div>

//////

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
              <PostWidget />
              <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
                 <h3 className="text-xl mb-8 font-semibold border-b pb-4">{slug ? 'Related Posts' : 'Recent Posts'}</h3>
                   {relatedPosts.map((post, index) => (
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
              <Categories />
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
  const categories = await Post.find().distinct('category');
 
  await db.disconnect();
  return {
    props: {
      post: post ? db.convertDocToObj(post) : null,
    },
  };
}
