/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';
import moment from 'moment';
import Ads from './Ads';


export default function PostItem({ post }) {
  return (
<div>
  {
     post.postIsAds && (
       <Ads />
     )
  }

    <div className="card">
      <Link href={`/post/${post.slug}`}>
        <a>
          <img
            src={post.image}
            alt={post.name}
            className="rounded shadow object-cover h-64 w-full"
          />
        </a>
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/post/${post.slug}`}>
          <a>
            <h2 className="text-lg">{post.name}</h2>
          </a>
        </Link>
        <div className="font-medium text-gray-700">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>
           <span className="align-middle">{moment(post.createdAt).format('MMM DD, YYYY')}</span>
        </div>
        <p className="text-center text-lg text-gray-700 font-normal px-4 lg:px-20 mb-8">
           {post.excerpt}
        </p>
        <button
          className="primary-button"
          type="button"
        >
          <Link href={`/post/${post.slug}`}> View</Link>
        </button>
      </div>
    </div>
  </div>
  );
}
