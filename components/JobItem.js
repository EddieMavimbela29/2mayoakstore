/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';

export default function JobItem({ job }) {
  return (
    <div className="card">
      <Link href={`/job/${job.slug}`}>
        <a>
          <img
            src={job.image}
            alt={job.name}
            className="rounded shadow object-cover h-64 w-full"
          />
        </a>
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/job/${job.slug}`}>
          <a>
            <h2 className="text-lg">{job.name}</h2>
          </a>
        </Link>
        <p className="mb-2">{job.location}</p>
        <p>${job.price}</p>
        <button
          className="primary-button"
          type="button"
        >
          <Link href={`/job/${job.slug}`}> Apply Now</Link>
        </button>
      </div>
    </div>
  );
}
