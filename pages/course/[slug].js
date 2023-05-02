import Image from 'next/image';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import PostDetail from '../../components/PostDetail';
import Ads from '../../components/Ads';
import Loader from '../../components/Loader';
import Course from '../../models/Course';
import db from '../../utils/db';


export default function CourseScreen(props) {

  const { course, featuredCourses, categories, faculties } = props;
 
  const router = useRouter();

  if (router.isFallback) {
    return <Loader />;
  }

  if (!post) {
    return <Layout title="Post Not Found">Course Not Found</Layout>;
  }

  return (
    <Layout title={course.name}>
      <div className="py-2">
        <Link href="/courses">Back to Courses </Link>
      </div>
      <div className="container mx-auto px-10 py-12 my-12 mt-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="col-span-1 lg:col-span-8">
            <PostDetail post={course} />
            <div className="py-2">
               <Link href="/courses">BY ADMIN</Link>
           </div>
          </div>
          <div className="col-span-1 lg:col-span-4">
            <div className="relative lg:sticky top-8">
             <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
                 <h3 className="text-xl mb-8 font-semibold border-b pb-4">{ course.slug ? 'Related Posts' : 'Recent Posts'}</h3>
                   {featuredCourses.map((post, index) => (
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
                        <p className="text-gray-500 font-xs">{moment(course.createdAt).format('MMM DD, YYYY')}</p>
                           <Link href={`/courses/${course.slug}`} className="text-md" key={index}>{course.name}</Link>
                    </div>
                  </div>
                  ))}
               </div>
             <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
                 <h3 className="text-xl mb-8 font-semibold border-b pb-4">Categories</h3>
                   {categories.map((category, index) => (
                    <Link key={index} href={`/courses/${category.slug}`}>
                      <span className={`cursor-pointer block ${(index === categories.length - 1) ? 'border-b-0' : 'border-b'} pb-3 mb-3`}>{category}</span>
                    </Link>
                   ))}
               </div>
              <Ads />
              <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
                 <h3 className="text-xl mb-8 font-semibold border-b pb-4">Categories</h3>
                   {faculties.map((category, index) => (
                    <Link key={index} href={`/courses/${category.slug}`}>
                      <span className={`cursor-pointer block ${(index === categories.length - 1) ? 'border-b-0' : 'border-b'} pb-3 mb-3`}>{category}</span>
                    </Link>
                   ))}
               </div>
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
  const course = await Course.findOne({ slug }).lean();
  const featuredCourses = await Course.find({ isFeatured: true }).lean();
  const categories = await Course.find().distinct('category');
  const faculties = await Course.find().distinct('faculty');
 

  await db.disconnect();
  return {
    props: {
      course: course ? db.convertDocToObj(course) : null,
      featuredCourses, 
      categories,
      faculties
    },
  };
}
