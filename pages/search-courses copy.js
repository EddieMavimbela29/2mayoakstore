import { useRouter } from 'next/router';
import { useContext } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { XCircleIcon } from '@heroicons/react/outline';
import PostItem from '../components/PostItem';
import Course from '../models/Course';
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

export default function SearchCourse(props) {
  const router = useRouter();

  const {
    query = 'all',
    price = 'all',
    province = 'all',
    english = 'all',
    accounting = 'all',
    rating = 'all',
    economics = 'all',
    businessStudies = 'all',
    agriculture = 'all',
    physicalSciences = 'all',
    lifeSciences = 'all',
    mathsLit = 'all',
    maths = 'all',
    apsscore = 'all',
    university = 'all',
    faculty = 'all',
    closingDate = 'all',
    sort = 'featured',
    page = 1,
  } = router.query;

  const { courses, countCourses, provinces, englishes, accountings, economicss, businessStudiess, physicalSciencess, mathss,facultys, closingDates, universitys, apsscores, mathsLits, lifeSciencess , agricultures, pages } = props;

  const filterSearch = ({
    page,
    province,
    english,
    accounting,
    economics,
    businessStudies,
    agriculture,
    physicalSciences,
    lifeSciences,
    maths,
    mathsLit,
    apsscore,
    university,
    faculty,
    closingDate,
    sort,
    min,
    max,
    searchQuery,
    rating,
  }) => {
    const { query } = router;
    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (province) query.province = province;
    if (english) query.english = english;
    if (accounting) query.accounting = accounting;
    if (economics) query.economics = economics;
    if (businessStudies) query.businessStudies = businessStudies;
    if (agriculture) query.agriculture = agriculture;
    if (physicalSciences) query.physicalSciences = physicalSciences;
    if (lifeSciences) query.lifeSciences = lifeSciences;
    if (maths) query.maths = maths;
    if (mathsLit) query.mathsLit = mathsLit;
    if (apsscore) query.apsscore = apsscore;
    if (university) query.university = university;
    if (faculty) query.faculty = faculty;
    if (closingDate) query.closingDate = closingDate;
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
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };
  const englishHandler = (e) => {
    filterSearch({ english: e.target.value });
  };
  const accountingHandler = (e) => {
    filterSearch({ accounting: e.target.value });
  };
  const economicsHandler = (e) => {
    filterSearch({ economics: e.target.value });
  };
  const businessStudiesHandler = (e) => {
    filterSearch({ businessStudies: e.target.value });
  };
  const agricultureHandler = (e) => {
    filterSearch({ agriculture: e.target.value });
  };
  const ratingHandler = (e) => {
    filterSearch({ rating: e.target.value });
  };

  const physicalSciencesHandler = (e) => {
    filterSearch({ physicalSciences: e.target.value });
  };
  const lifeSciencesStudiesHandler = (e) => {
    filterSearch({ lifeSciences: e.target.value });
  };
  const mathsHandler = (e) => {
    filterSearch({ maths: e.target.value });
  };

  const mathsLitHandler = (e) => {
    filterSearch({ mathsLit: e.target.value });
  };

  const apsscoreHandler = (e) => {
    filterSearch({ apsscore: e.target.value });
  };
  const universityHandler = (e) => {
    filterSearch({ university: e.target.value });
  };
  const facultyHandler = (e) => {
    filterSearch({ faculty: e.target.value });
  };

  const closingDateHandler = (e) => {
    filterSearch({ closingDate: e.target.value });
  };

  return (
    <Layout title="SA Course Search">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <div className="my-3">
            <h2>Province</h2>
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
            <h2>English</h2>
            <select className="w-full" value={english} onChange={englishHandler}>
              <option value="all">All</option>
              {englishes &&
                englishes.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
            </select>
          </div>

          <div className="my-3">
            <h2>Economics</h2>
            <select
              className="w-full"
              value={economics}
              onChange={economicsHandler}
            >
              <option value="all">All</option>
              {economicss &&
                economicss.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-3">
            <h2>Accounting</h2>
            <select className="w-full" value={accounting} onChange={accountingHandler}>
              <option value="all">All</option>
              {accountings &&
                accountings.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
            </select>
          </div>

          <div className="my-3">
            <h2>Business Studies</h2>
            <select
              className="w-full"
              value={businessStudies}
              onChange={businessStudiesHandler}
            >
              <option value="all">All</option>
              {businessStudiess &&
                businessStudiess.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <h2>Agriculture</h2>
            <select className="w-full" value={agriculture} onChange={agricultureHandler}>
              <option value="all">All</option>
              {agricultures &&
                agricultures.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
            </select>
          </div>

          <div className="my-3">
            <h2>Physical Sciences</h2>
            <select
              className="w-full"
              value={physicalSciences}
              onChange={physicalSciencesHandler}
            >
              <option value="all">All</option>
              {physicalSciencess &&
                physicalSciencess.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <h2>Life Sciences</h2>
            <select className="w-full" value={lifeSciences} onChange={lifeSciencesStudiesHandler}>
              <option value="all">All</option>
              {lifeSciencess &&
                lifeSciencess.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
            </select>
          </div>
          
          <div className="my-3">
            <h2>Pure Maths</h2>
            <select
              className="w-full"
              value={maths}
              onChange={mathsHandler}
            >
              <option value="all">All</option>
              {mathss &&
                mathss.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-3">
            <h2>Maths Lit</h2>
            <select className="w-full" value={mathsLit} onChange={mathsLitHandler}>
              <option value="all">All</option>
              {mathsLits &&
                mathsLits.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-3">
            <h2>Institutions</h2>
            <select className="w-full" value={university} onChange={universityHandler}>
              <option value="all">All</option>
              {universitys &&
                universitys.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
            </select>
          </div>
          <div className="my-3">
            <h2>Faculties</h2>
            <select
              className="w-full"
              value={faculty}
              onChange={facultyHandler}
            >
              <option value="all">All</option>
              {facultys &&
                facultys.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <h2>Closing Date</h2>
            <select className="w-full" value={closingDate} onChange={closingDateHandler}>
              <option value="all">All</option>
              {closingDates &&
                closingDates.map((closingDate) => (
                  <option key={closingDate} value={closingDate}>
                    {closingDate}
                  </option>
                ))}
            </select>
          </div>


          <div className="mb-3">
            <h2> Course Fees</h2>
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
            <h2> APS Score </h2>
            <select className="w-full" value={apsscore} onChange={apsscoreHandler}>
              <option value="all">All</option>
              {apsscores &&
                apsscores.map((price) => (
                  <option key={price.value} value={price.value}>
                    {price.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-3">
            <h2>Ratings</h2>
            <select className="w-full" value={ratings} onChange={ratingHandler}>
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
              {courses.length === 0 ? 'No' : countCourses} Results
              {query !== 'all' && query !== '' && ' : ' + query}
              {category !== 'all' && ' : ' + category}
              {brand !== 'all' && ' : ' + brand}
              {price !== 'all' && ' : Price ' + price}
              {rating !== 'all' && ' : Rating ' + rating + ' & up'}
              &nbsp;
              {(query !== 'all' && query !== '') ||
              category !== 'all' ||
              brand !== 'all' ||
              rating !== 'all' ||
              price !== 'all' ? (
                <button onClick={() => router.push('/search-courses')}>
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
                <option value="toprated">Customer Reviews</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3  ">
              {courses.map((product) => (
                <PostItem
                  key={product._id}
                  post={product}
                />
              ))}
            </div>
            <ul className="flex">
              {courses.length > 0 &&
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
  const price = query.price || '';
  const province = query.province || '';
  const english = query.english || '';
  const accounting = query.accounting || '';
  const economics = query.economics || '';
  const businessStudies = query.businessStudies || '';

  const agriculture = query.agriculture || '';
  const physicalSciences = query.physicalSciences || '';
  const lifeSciences = query.lifeSciences || '';
  const maths = query.maths || '';
  const mathsLit = query.mathsLit || '';

  const apsscore = query.apsscore || '';
  const university = query.university || '';
  const faculty = query.faculty || '';
  const closingDate = query.closingDate || '';
  const rating = query.rating || '';
  const sort = query.sort || '';

  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};
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

      const provinceFilter = province && province !== 'all' ? { province } : {};
      const englishFilter = english && english !== 'all' ? { english } : {};
      const accountingFilter = accounting && accounting !== 'all' ? { accounting } : {};
      const economicsFilter = economics && economics !== 'all' ? { economics } : {};
      const businessStudiesFilter = businessStudies && businessStudies !== 'all' ? { businessStudies } : {};
      const agricultureFilter = agriculture && agriculture !== 'all' ? { agriculture } : {};
      const physicalSciencesFilter = physicalSciences && physicalSciences !== 'all' ? { lifeSciences } : {};
      const mathsFilter = maths && maths !== 'all' ? { maths } : {};
      const mathsLitFilter = mathsLit && mathsLit !== 'all' ? { mathsLit } : {};
      const apsscoreFilter = apsscore && apsscore !== 'all' ? { apsscore } : {};
      const universityFilter = university && university !== 'all' ? { university } : {};
      const facultyFilter = faculty && faculty !== 'all' ? { faculty } : {};
      const closingDateFilter = closingDate && closingDate !== 'all' ? { closingDate } : {};
                         

  await db.connect();
  const prices = await Course.find().distinct('price');
  const provinces = await Course.find().distinct('province');
  const englishes = await Course.find().distinct('english');
  const accountings = await Course.find().distinct('accounting');
  const economicss = await Course.find().distinct('economics');
  const businessStudiess = await Course.find().distinct('businessStudies');
  const agricultures = await Course.find().distinct('agriculture');
  const physicalSciencess = await Course.find().distinct('physicalSciences');
  const lifeSciencess = await Course.find().distinct('lifeSciences');
  const mathss = await Course.find().distinct('maths');
  const mathsLits = await Course.find().distinct('mathsLit');
  const apsscores = await Course.find().distinct('apsscore');
  const universitys = await Course.find().distinct('university');
  const facultys = await Course.find().distinct('faculty');
  const closingDates = await Course.find().distinct('closingDate');
  
  const courseDocs = await Course.find(
    {
      ...queryFilter,
      ...provinceFilter,
      ...priceFilter,
      ...englishFilter,
      ...accountingFilter,
      ...economicsFilter,
      ...businessStudiesFilter,
      ...agricultureFilter,
      ...physicalSciencesFilter,
      ...mathsFilter,
      ...mathsLitFilter,
      ...apsscoreFilter,
      ...universityFilter,
      ...facultyFilter,
      ...closingDateFilter,
      ...ratingFilter,
    },
    '-reviews'
  )
    .sort(order)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  const countCourses = await Course.countDocuments({
      ...queryFilter,
      ...provinceFilter,
      ...priceFilter,
      ...englishFilter,
      ...accountingFilter,
      ...economicsFilter,
      ...businessStudiesFilter,
      ...agricultureFilter,
      ...physicalSciencesFilter,
      ...mathsFilter,
      ...mathsLitFilter,
      ...apsscoreFilter,
      ...universityFilter,
      ...facultyFilter,
      ...closingDateFilter,
      ...ratingFilter,
  });

  await db.disconnect();
  const courses = courseDocs.map(db.convertDocToObj);

  return {
    props: {
      courses,
      countCourses,
      page,
      prices,
      provinces,
      englishes,
      accountings,
      economicss,
      businessStudiess,
      agricultures,
      physicalSciencess,
      lifeSciencess,
      mathss,
      mathsLits,
      apsscores,
      universitys,
      facultys,
      closingDates,
      pages: Math.ceil(countCourses / pageSize),
      
    },
  };
}
