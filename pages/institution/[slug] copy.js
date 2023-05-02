import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import Institution from '../../models/Institution';
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

export default function InstitutionScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  if (!product) {
    return <Layout title="Institution Not Found">Institution Not Found</Layout>;
  }

  

  const body = product.description;

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/institutions">Back to Institutions</Link>
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
            <li>Application Fee: R{product.price}</li>
            <li>province: {product.province}</li>
            <li>location: {product.location}</li>
            <li>Description: { htmlFrom(body)}</li>
          </ul>
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
  await db.disconnect();
  return {
    props: {
      course: institution ? db.convertDocToObj(institution) : null,
    },
  };
}
