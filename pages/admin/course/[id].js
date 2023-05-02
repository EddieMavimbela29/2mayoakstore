import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import { Controller ,useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../../../components/Layout';
import { getError } from '../../../utils/error';
import { Editor } from '@tinymce/tinymce-react';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };

    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}
export default function AdminCourseEditScreen() {
  const { query } = useRouter();
  const productId = query.id;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/courses/${productId}`);
        dispatch({ type: 'FETCH_SUCCESS' });
        setValue('name', data.name);
        setValue('slug', data.slug);
        setValue('price', data.price);
        setValue('image', data.image);
        setValue('english', data.english);
        setValue('accounting', data.accounting);
        setValue('economics', data.economics);
        setValue('businessStudies', data.businessStudies);
        setValue('agriculture', data.agriculture);
        setValue('physicalSciences', data.physicalSciences);
        setValue('maths', data.maths);
        setValue('mathsLit', data.mathsLit);
        setValue('university', data.university);
        setValue('province', data.province);
        setValue('faculty', data.faculty);
        setValue('apsscore', data.apsscore);
        setValue('description', data.description);
        setValue('location', data.location);
        setValue('closingDate', data.closingDate);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, [productId, setValue]);

  const router = useRouter();

  const uploadHandler = async (e, imageField = 'image') => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const {
        data: { signature, timestamp },
      } = await axios('/api/admin/cloudinary-sign');

      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      const { data } = await axios.post(url, formData);
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setValue(imageField, data.secure_url);
      toast.success('File uploaded successfully');
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  const submitHandler = async ({
    name,
    slug,
    price,
    province,
    english,
    accounting,
    economics,
    businessStudies,
    agriculture,
    physicalSciences,
    lifeSciences,
    image,
    maths,
    mathsLit,
    apsscore,
    university,
    faculty,
    description,
    location,
    closingDate
  }) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/admin/courses/${productId}`, {
        name,
        slug,
        price,
        province,
        english,
        accounting,
        economics,
        businessStudies,
        agriculture,
        physicalSciences,
        lifeSciences,
        image,
        maths,
        mathsLit,
        apsscore,
        university,
        faculty,
        description,
        location,
        closingDate,
      });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Course updated successfully');
      router.push('/admin/courses');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title={`Edit Course ${productId}`}>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/courses">
                <a className="font-bold">Courses</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/institutions">Institutions</Link>
            </li>
            <li>
              <Link href="/admin/jobs">Jobs</Link>
            </li>
            <li>
              <Link href="/admin/posts">Posts</Link>
            </li>
            <li>
              <Link href="/admin/products">Products</Link>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form
              className="mx-auto max-w-screen-md"
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-xl">{`Edit Course ${productId}`}</h1>
              <div className="mb-4">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="w-full"
                  id="name"
                  autoFocus
                  {...register('name', {
                    required: 'Please enter name',
                  })}
                />
                {errors.name && (
                  <div className="text-red-500">{errors.name.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="slug">Slug</label>
                <input
                  type="text"
                  className="w-full"
                  id="slug"
                  {...register('slug', {
                    required: 'Please enter slug',
                  })}
                />
                {errors.slug && (
                  <div className="text-red-500">{errors.slug.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">Fee</label>
                <input
                  type="text"
                  className="w-full"
                  id="price"
                  {...register('price', {
                    required: 'Please enter price',
                  })}
                />
                {errors.price && (
                  <div className="text-red-500">{errors.price.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">Location </label>
                <input
                  type="text"
                  className="w-full"
                  id="location"
                  {...register('location', {
                    required: 'Please enter location',
                  })}
                />
                {errors.location && (
                  <div className="text-red-500">{errors.location.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">closingDate</label>
                <input
                  type="text"
                  className="w-full"
                  id="closingDate"
                  {...register('closingDate', {
                    required: 'Please enter closingDate',
                  })}
                />
                {errors.closingDate && (
                  <div className="text-red-500">{errors.closingDate.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">English</label>
                <input
                  type="text"
                  className="w-full"
                  id="english"
                  {...register('english', {
                    required: 'Please enter English',
                  })}
                />
                {errors.english && (
                  <div className="text-red-500">{errors.english.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">agriculture</label>
                <input
                  type="text"
                  className="w-full"
                  id="agriculture"
                  {...register('agriculture', {
                    required: 'Please enter agriculture',
                  })}
                />
                {errors.agriculture && (
                  <div className="text-red-500">{errors.agriculture.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">businessStudies</label>
                <input
                  type="text"
                  className="w-full"
                  id="businessStudies"
                  {...register('businessStudies', {
                    required: 'Please enter businessStudies',
                  })}
                />
                {errors.businessStudies && (
                  <div className="text-red-500">{errors.businessStudies.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">economics</label>
                <input
                  type="text"
                  className="w-full"
                  id="economics"
                  {...register('economics', {
                    required: 'Please enter economics',
                  })}
                />
                {errors.economics && (
                  <div className="text-red-500">{errors.economics.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">accounting</label>
                <input
                  type="text"
                  className="w-full"
                  id="accounting"
                  {...register('accounting', {
                    required: 'Please enter accounting',
                  })}
                />
                {errors.accounting && (
                  <div className="text-red-500">{errors.accounting.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">Physical Sciences</label>
                <input
                  type="text"
                  className="w-full"
                  id="physicalSciences"
                  {...register('physicalSciences', {
                    required: 'Please enter physicalSciences',
                  })}
                />
                {errors.physicalSciences && (
                  <div className="text-red-500">{errors.physicalSciences.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">Life Sciences</label>
                <input
                  type="text"
                  className="w-full"
                  id="lifeSciences"
                  {...register('lifeSciences', {
                    required: 'Please enter lifeSciences',
                  })}
                />
                {errors.lifeSciences && (
                  <div className="text-red-500">{errors.lifeSciences.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">Maths</label>
                <input
                  type="text"
                  className="w-full"
                  id="maths"
                  {...register('maths', {
                    required: 'Please enter Maths',
                  })}
                />
                {errors.maths && (
                  <div className="text-red-500">{errors.maths.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">Maths Lit</label>
                <input
                  type="text"
                  className="w-full"
                  id="mathsLit"
                  {...register('mathsLit', {
                    required: 'Please enter mathsLit',
                  })}
                />
                {errors.mathsLit && (
                  <div className="text-red-500">{errors.mathsLit.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="image">image</label>
                <input
                  type="text"
                  className="w-full"
                  id="image"
                  {...register('image', {
                    required: 'Please enter image',
                  })}
                />
                {errors.image && (
                  <div className="text-red-500">{errors.image.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="imageFile">Upload image</label>
                <input
                  type="file"
                  className="w-full"
                  id="imageFile"
                  onChange={uploadHandler}
                />

                {loadingUpload && <div>Uploading....</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="category">University</label>
                <input
                  type="text"
                  className="w-full"
                  id="university"
                  {...register('university', {
                    required: 'Please enter University',
                  })}
                />
                {errors.category && (
                  <div className="text-red-500">{errors.university.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="price">Province</label>
                <input
                  type="text"
                  className="w-full"
                  id="Province"
                  {...register('province', {
                    required: 'Please enter Province',
                  })}
                />
                {errors.province && (
                  <div className="text-red-500">{errors.province.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="brand">Faculty</label>
                <input
                  type="text"
                  className="w-full"
                  id="faculty"
                  {...register('faculty', {
                    required: 'Please enter Faculty',
                  })}
                />
                {errors.faculty && (
                  <div className="text-red-500">{errors.faculty.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="apsscore">APS Score</label>
                <input
                  type="text"
                  className="w-full"
                  id="apsscore"
                  {...register('apsscore', {
                    required: 'Please enter APS Score',
                  })}
                />
                {errors.apsscore && (
                  <div className="text-red-500">
                    {errors.apsscore.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="countInStock">description</label>
               
               <Controller
                 name="description"
                 control={control}
                 defaultValue=" goes description"
                 render={() => (
                 <Editor 
                   id="description"
                   apiKey={process.env.apiKey}
                   textareaName="description"
                   cloudChannel="dev"
                   initialValue="write your content here" 
                   onEditorChange={(newText)=>{setValue('description', newText)}} 
                   init={{
                      height: 500,
                      plugins: 'advlist p h1 h2 h3 h4 h5 h6 toc autolink link image lists charmap print preview hr anchor pagebreak searchreplace wordcount visualblocks code fullscreen insertdatetime media nonbreaking table emoticons template paste help ',
                      toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
                          'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
                          'forecolor backcolor emoticons | help h1 h2 h3 h4 h5 h6 toc',
                      menu: {
                          favs: {
                              title: 'My Favorites',
                              items: 'code visualaid | searchreplace | emoticons',
                          },
                      },
                      menubar: 'favs file edit view insert format tools table help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    }}
                  />

                   )}
               />

                {errors.description && (
                  <div className="text-red-500">
                    {errors.description.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <button disabled={loadingUpdate} className="primary-button">
                  {loadingUpdate ? 'Loading' : 'Update'}
                </button>
              </div>
              <div className="mb-4">
                <Link href={`/admin/courses`}>Back</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminCourseEditScreen.auth = { adminOnly: true };
