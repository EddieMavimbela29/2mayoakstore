import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
export default function AdminAccomodationEditScreen() {
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
        const { data } = await axios.get(`/api/admin/accomodations/${productId}`);
        dispatch({ type: 'FETCH_SUCCESS' });
        setValue('name', data.name);
        setValue('slug', data.slug);
        setValue('price', data.price);
        setValue('image', data.image);
        setValue('category', data.category);
        setValue('province', data.province);
        setValue('location', data.location);
        setValue('description', data.description);
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
    category,
    location,
    image,
    description,
  }) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/admin/accomodations/${productId}`, {
        name,
        slug,
        price,
        province,
        location,
        category,
        image,
        description,
      });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Product updated successfully');
      router.push('/admin/accomodations');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title={`Edit Accomodation ${productId}`}>
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
              <Link href="/admin/products">Products</Link>
            </li>
            <li>
              <Link href="/admin/courses">Courses</Link>
            </li>
            <li>
              <Link href="/admin/institutions">Institutions</Link>
            </li>
            <li>
              <Link href="/admin/accomodations">
                <a className="font-bold">Accomodations</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/jobs">Jobs</Link>
            </li>
            <li>
              <Link href="/admin/posts">Posts</Link>
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
              <h1 className="mb-4 text-xl">{`Edit Accomodation ${productId}`}</h1>
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
                <label htmlFor="price">Ress Price</label>
                <input
                  type="text"
                  className="w-full"
                  id="price"
                  {...register('price', {
                    required: 'Please enter Application Price',
                  })}
                />
                {errors.price && (
                  <div className="text-red-500">{errors.price.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">Location</label>
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
                <label htmlFor="price">Category</label>
                <input
                  type="text"
                  className="w-full"
                  id="type"
                  {...register('category', {
                    required: 'Please enter Category',
                  })}
                />
                {errors.type && (
                  <div className="text-red-500">{errors.category.message}</div>
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
                <Link href={`/admin/accomodations`}>Back</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminAccomodationEditScreen.auth = { adminOnly: true };
