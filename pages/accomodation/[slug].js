import Image from 'next/image';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import PostDetail from '../../components/PostDetail';
import Ads from '../../components/Ads';
import Loader from '../../components/Loader';
import Accomodation from '../../models/Ress';
import db from '../../utils/db';


export default function AccomodationScreen(props) {

  const { accomodation, featuredAccomodations, universities, provinces } = props;
 
  const router = useRouter();

  if (router.isFallback) {
    return <Loader />;
  }

  if (!accomodation) {
    return <Layout title="Accomodation Not Found">Accomodation Not Found</Layout>;
  }

  return (
    <Layout title={accomodation.name}>
      <div className="py-2">
        <Link href="/accomodations">Back to Accomodations </Link>
      </div>
      <div className="container mx-auto px-10 py-12 my-12 mt-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="col-span-1 lg:col-span-8">
            <PostDetail post={accomodation} />
            <div className="py-2">
               <Link href="/accomodations">BY ADMIN</Link>
           </div>
          </div>
          <div className="col-span-1 lg:col-span-4">
            <div className="relative lg:sticky top-8">
             <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
                 <h3 className="text-xl mb-8 font-semibold border-b pb-4">{ accomodation.slug ? 'Related Posts' : 'Recent Posts'}</h3>
                   {featuredAccomodations.map((post, index) => (
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
                        <p className="text-gray-500 font-xs">{moment(accomodation.createdAt).format('MMM DD, YYYY')}</p>
                           <Link href={`/accomodations/${accomodation.slug}`} className="text-md" key={index}>{job.name}</Link>
                    </div>
                  </div>
                  ))}
               </div>
             <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
                 <h3 className="text-xl mb-8 font-semibold border-b pb-4"> Provinces</h3>
                   {provinces.map((category, index) => (
                    <Link key={index} href={`/accomodations/${category.slug}`} passHref >
                      <span className={`cursor-pointer block ${(index === provinces.length - 1) ? 'border-b-0' : 'border-b'} pb-3 mb-3`}>{category}</span>
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
  const accomodation = await Accomodation.findOne({ slug }).lean();
  const featuredAccomodations = await Accomodation.find({ isFeatured: true }).lean();
  const provinces = await Accomodation.find().distinct('province');

  await db.disconnect();
  return {
    props: {
      accomodation: accomodation ? db.convertDocToObj(accomodation) : null,
      featuredAccomodations,
      provinces
    },
  };
}
