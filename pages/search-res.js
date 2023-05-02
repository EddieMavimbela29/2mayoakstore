import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../components/Layout';
import { XCircleIcon } from '@heroicons/react/outline';
import PostItem from '../components/PostItem';
import Accomodation from '../models/Ress';
import db from '../utils/db';

const PAGE_SIZE = 2;

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
];

const ratings = [1, 2, 3, 4, 5];

export default function AccomodationSearch(props) {
  const router = useRouter();

  const {
    query = 'all',
    province = 'all',
    type = 'all',
    location = 'all',
    price = 'all',
    rating = 'all',
    sort = 'featured',
    page = 1,
  } = router.query;

  const { accomodations, countAccomodations, locations, universities, provinces, pages } = props;

  const filterSearch = ({
    page,
    university,
    province,
    location,
    sort,
    min,
    max,
    searchQuery,
    price,
    rating,
  }) => {
    const { query } = router;
    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (university) query.university = university;
    if (province) query.province = province;
    if (location) query.location = location;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;

    router.push({
      pathname: router.pathname,
      query: query,
    });
  };
  const provinceHandler = (e) => {
    filterSearch({ province: e.target.value });
  };
  const pageHandler = (page) => {
    filterSearch({ page });
  };
  const locationHandler = (e) => {
    filterSearch({ location: e.target.value });
  };
  const universityHandler = (e) => {
    filterSearch({ type: e.target.value });
  };
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };
  const ratingHandler = (e) => {
    filterSearch({ rating: e.target.value });
  };

  return (
    <Layout title="Search Student Accomodation">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <div className="my-3">
            <h2>Provinces</h2>
            <select
              className="w-full"
              value={province}
              onChange={provinceHandler}
            >
              <option value="all">All</option>
              {provinces &&
                provinces.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <h2>College/University</h2>
            <select className="w-full" value={type} onChange={universityHandler}>
              <option value="all">All</option>
              {universities &&
                universities.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <h2>City</h2>
            <select className="w-full" value={location} onChange={locationHandler}>
              <option value="all">All</option>
              {locations &&
                locations.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <h2>Fees</h2>
            <select className="w-full" value={price} onChange={priceHandler}>
              <option value="all">All</option>
              {prices &&
                prices.map((price) => (
                  <option key={price.value} value={price.value}>
                    {price.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <h2>Ratings</h2>
            <select className="w-full" value={rating} onChange={ratingHandler}>
              <option value="all">All</option>
              {ratings &&
                ratings.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} star{rating > 1 && 's'} & up
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="mb-2 flex items-center justify-between border-b-2 pb-2">
            <div className="flex items-center">
              {accomodations.length === 0 ? 'No' : countAccomodations} Results
              {query !== 'all' && query !== '' && ' : ' + query}
              {province !== 'all' && ' : ' + province}
              {universities !== 'all' && ' : ' + universities}
              {location !== 'all' && ' : ' + location}
              {price !== 'all' && ' : Price ' + price}
              {rating !== 'all' && ' : Rating ' + rating + ' & up'}
              &nbsp;
              {(query !== 'all' && query !== '') ||
              type !== 'all' ||
              location !== 'all' ||
              province !== 'all' ||
              rating !== 'all' ||
              price !== 'all' ? (
                <button onClick={() => router.push('/search-res')}>
                  <XCircleIcon className="h-5 w-5" />
                </button>
              ) : null}
            </div>
            <div>
              Sort by{' '}
              <select value={sort} onChange={sortHandler}>
                <option value="featured">Featured</option>
                <option value="lowest">Price: Low to High</option>
                <option value="highest">Price: High to Low</option>
                <option value="toprated">Student Reviews</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3  ">
              {accomodations.map((product) => (
                <PostItem
                  key={product._id}
                  post={product}
                />
              ))}
            </div>
            <ul className="flex">
              {accomodations.length > 0 &&
                [...Array(pages).keys()].map((pageNumber) => (
                  <li key={pageNumber}>
                    <button
                      className={`default-button m-2 ${
                        page == pageNumber + 1 ? 'font-bold' : ''
                      } `}
                      onClick={() => pageHandler(pageNumber + 1)}
                    >
                      {pageNumber + 1}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const province = query.province || '';
  const university = query.university || '';
  const location = query.location || '';
  const price = query.price || '';
  const rating = query.rating || '';
  const sort = query.sort || '';
  const searchQuery = query.query || '';

  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};
  const provinceFilter = province && province !== 'all' ? { province } : {};
  const universityFilter = university && university !== 'all' ? { university } : {};
  const locationFilter = location && location !== 'all' ? { location } : {};

  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};
  // 10-50
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};
  const order =
    sort === 'featured'
      ? { isFeatured: -1 }
      : sort === 'lowest'
      ? { price: 1 }
      : sort === 'highest'
      ? { price: -1 }
      : sort === 'toprated'
      ? { rating: -1 }
      : sort === 'newest'
      ? { createdAt: -1 }
      : { _id: -1 };

  await db.connect();
  const provinces = await Accomodation.find().distinct('province');
  const locations = await Accomodation.find().distinct('location');
  const universities = await Accomodation.find().distinct('type');

  const accomodationDocs = await Accomodation.find(
    {
    ...queryFilter,
    ...provinceFilter,
    ...priceFilter,
    ...universityFilter,
    ...locationFilter,
    ...ratingFilter
    },
    '-reviews'
  )
    .sort(order)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  const countAccomodations = await Accomodation.countDocuments({
    ...queryFilter,
    ...provinceFilter,
    ...priceFilter,
    ...universityFilter,
    ...locationFilter,
    ...ratingFilter
  });

  await db.disconnect();
  const accomodations = accomodationDocs.map(db.convertDocToObj);

  return {
    props: {
      accomodations,
      countAccomodations,
      page,
      pages: Math.ceil(countAccomodations / pageSize),
      provinces,
      locations,
      universities
    },
  };
}
