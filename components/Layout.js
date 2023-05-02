import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Cookies from 'js-cookie';
import {ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  DotsVerticalIcon,
  XCircleIcon,
  MenuIcon,
  SearchIcon,
} from '@heroicons/react/outline';
import Head from 'next/head';
import { Store } from '../utils/Store';
import { Menu } from '@headlessui/react';
import DropdownLink from './DropdownLink';
import { useRouter } from 'next/router';

export default function Layout({ children, title }) {
  const router = useRouter();
  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [isOpen, setIsOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const hideMenu = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', hideMenu);
    return () => {
      window.removeEventListener('resize', hideMenu);
    };
  }, [isOpen]);

 
  const [query, setQuery] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };


  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };
  const navMenu = () => {
    return (
      <>
        <form
          onSubmit={submitHandler}
          className="mx-auto mr-3 mt-1 flex w-full justify-center md:hidden"
        >
          <input
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            className="rounded-tr-none rounded-br-none p-1 text-sm"
            placeholder="Search products"
          />
          <button
            className="rounded rounded-tl-none rounded-bl-none bg-amber-300 p-1 text-sm dark:text-black"
            type="submit"
            id="button-addon2"
          >
            <SearchIcon className="h-5 w-5"></SearchIcon>
          </button>
        </form>

        {status === 'loading' ? (
          'Loading'
        ) : session?.user ? (
          <Menu as="div" className="relative inline-block">
            <Menu.Button className="text-blue-600">
              {session.user.name}
            </Menu.Button>
            <Menu.Items className="absolute right-0 w-56 origin-top-right   bg-white shadow-lg   dark:bg-black dark:shadow-gray-700">
              <Menu.Item>
                <DropdownLink className="dropdown-link" href="/profile">
                  Profile
                </DropdownLink>
              </Menu.Item>
              <Menu.Item>
                <DropdownLink className="dropdown-link" href="/order-history">
                  Order History
                </DropdownLink>
              </Menu.Item>
              <Menu.Item>
                <DropdownLink className="dropdown-link" href="/admin/dashboard">
                  Admin Dashboard
                </DropdownLink>
              </Menu.Item>

              <Menu.Item>
                <a
                  className="dropdown-link"
                  href="#"
                  onClick={logoutClickHandler}
                >
                  Logout
                </a>
              </Menu.Item>
            </Menu.Items>
          </Menu>
        ) : (
          <Link href="/login">
            <a className="p-2">Login</a>
          </Link>
        )}

        <div className="mx-auto p-2">
          <Link href="/cart">
            <a className="flex items-center p-2">
              Cart{' '}
              {cart.cartItems.length > 0 && (
                <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </span>
              )}
            </a>
          </Link>
        </div>
      </>
    );
  };
  return (
    <>
      <Head>
        <title>{title ? title : 'StudentGroove'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between bg-white text-black transition-all  dark:bg-black dark:text-white">
        <div>
          <nav
            className="relative flex h-12 items-center  justify-between shadow-md dark:shadow-gray-700 "
            role="navigation"
          >
            <div className="flex items-center">
              <div
                className="cursor-pointer px-4  "
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <MenuIcon className="h-5 w-5 text-blue-500"></MenuIcon>
              </div>
              <Link href="/">
                <a className="text-lg font-bold text-black dark:text-white">
                  StudentGroove.
                </a>
              </Link>
            </div>
            <form
              onSubmit={submitHandler}
              className="mx-auto   hidden w-full justify-center md:flex "
            >
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                className="rounded-tr-none rounded-br-none p-1 text-sm   focus:ring-0"
                placeholder="Search products"
              />
              <button
                className="rounded rounded-tl-none rounded-bl-none bg-amber-300 p-1 text-sm dark:text-black"
                type="submit"
                id="button-addon2"
              >
                <SearchIcon className="h-5 w-5"></SearchIcon>
              </button>
            </form>
            <div className="cursor-pointer px-4 md:hidden" onClick={toggle}>
              <DotsVerticalIcon className="h-5 w-5 text-blue-500"></DotsVerticalIcon>
            </div>
            <div className="hidden items-center md:flex">{navMenu()}</div>
          </nav>
          <div
            className={
              isOpen ? 'grid grid-rows-2 items-center text-center' : 'hidden'
            }
            onClick={toggle}
          >
            {navMenu()}
          </div>
          <div
            className={`fixed top-0 left-0 z-40 h-full w-[20rem] bg-gray-300 p-10 duration-300  ease-in-out dark:bg-gray-800 ${
              showSidebar ? 'translate-x-0' : 'translate-x-[-20rem]'
            }`}
          >
            <div className="mb-2 flex justify-between">
              <h2>Boost Student Life</h2>
              <button onClick={() => setShowSidebar(!showSidebar)}>
                <XCircleIcon className="h-5 w-5  "></XCircleIcon>
              </button>
            </div>
            <ul>
            <li onClick={() => setShowSidebar(false)}>
                <Link href={`/search-institutions`}>SA Institutions</Link>
            </li>
            <li onClick={() => setShowSidebar(false)}>
                <Link href={`/search-posts`}>Student Passing Hacks</Link>
            </li>
            <li onClick={() => setShowSidebar(false)}>
                <Link href={`/search-jobs`}>Apply for SA Jobs</Link>
            </li>
            <li onClick={() => setShowSidebar(false)}>
                <Link href={`/search`}>Student Shop</Link>
            </li>
            </ul>
          </div>
        </div>
        <div className="container m-auto mt-4 px-4">{children}</div>
        <div className="flex h-10 items-center justify-center shadow-inner dark:shadow-gray-700">
          <p>Copyright © 2023 StudentGroove</p>
        </div>
      </div>
    </>
  );
}
