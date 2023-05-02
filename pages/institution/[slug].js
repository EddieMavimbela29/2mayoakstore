import Image from 'next/image';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import PostDetail from '../../components/PostDetail';
import Ads from '../../components/Ads';
import Loader from '../../components/Loader';
import db from '../../utils/db';
import Institution from '../../models/Institution';


export default function InstitutionScreen(props) {

  const { institution, featuredInstitutions, types, provinces } = props;
 
  const router = useRouter();

  if (router.isFallback) {
    return <Loader />;
  }

  if (!institution) {
    return <Layout title="Institution Not Found">Institution Not Found</Layout>;
  }

  return (
    <Layout title={institution.name}>
      <div className="py-2">
        <Link href="/institutions">Back to Institutions </Link>
      </div>
      <div className="container mx-auto px-10 py-12 my-12 mt-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="col-span-1 lg:col-span-8">
            <PostDetail post={institution} />
            <div className="py-2">
               <Link href="/institutions">BY ADMIN</Link>
           </div>
          </div>
          <div className="col-span-1 lg:col-span-4">
            <div className="relative lg:sticky top-8">
             <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
                 <h3 className="text-xl mb-8 font-semibold border-b pb-4">{ institution.slug ? 'Related Institutions' : 'Recent Institutions'}</h3>
                   {featuredInstitutions.map((post, index) => (
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
                        <p className="text-gray-500 font-xs">{moment(institution.createdAt).format('MMM DD, YYYY')}</p>
                           <Link href={`/institutions/${institution.slug}`} className="text-md" key={index}>{institution.name}</Link>
                    </div>
                  </div>
                  ))}
               </div>
             <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
                 <h3 className="text-xl mb-8 font-semibold border-b pb-4"> Institution Categories</h3>
                   {types.map((category, index) => (
                    <Link key={index} href={`/institutions/${category.slug}`} passHref >
                      <span className={`cursor-pointer block ${(index === types.length - 1) ? 'border-b-0' : 'border-b'} pb-3 mb-3`}>{category}</span>
                    </Link>
                   ))}
               </div>
              <Ads />
              <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
                 <h3 className="text-xl mb-8 font-semibold border-b pb-4">Provices</h3>
                   {provinces.map((category, index) => (
                    <Link key={index} href={`/institutions/${category.slug}`} passHref >
                      <span className={`cursor-pointer block ${(index === provinces.length - 1) ? 'border-b-0' : 'border-b'} pb-3 mb-3`}>{category}</span>
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
  const institution = await Institution.findOne({ slug }).lean();
  const featuredInstitutions = await Institution.find({ isFeatured: true }).lean();
  const types = await Institution.find().distinct('type');
  const provinces = await Institution.find().distinct('province');

  await db.disconnect();
  return {
    props: {
      institution: institution ? db.convertDocToObj(institution) : null,
      featuredInstitutions,
      types,
      provinces
    },
  };
}
