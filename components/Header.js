import { supabase } from '@/utils/supabaseClient';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import { ButtonRotate, ButtonBlue } from './atoms';

const websiteName = process.env.NEXT_PUBLIC_WEBSITE_NAME;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookmark,
  faFile,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const Header = ({ user }) => {
  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  return (
    <Disclosure
      as="nav"
      className="bg-gradient-to-r from-sky-500 to-indigo-500">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              {/* <div className="absolute inset-y-0 left-0 flex items-center sm:hidden"> */}
              {/* Mobile menu button*/}
              {/* <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div> */}
              <div className="flex-1 flex items-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <Link
                    href="/"
                    passHref
                    className="flex items-center py-4 px-2">
                    {/* <img src="logo.png" alt="Logo" className="h-8 w-8 mr-2" /> */}
                    <span className="font-semibold tracking-wider text-yellow-500 text-5xl font-heading cursor-pointer">
                      {websiteName}
                    </span>
                  </Link>
                  {/* <img
                    className="block lg:hidden h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                    alt="Workflow"
                  />
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                    alt="Workflow"
                  /> */}
                </div>
                {/* <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}>
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div> */}
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* <button
                  type="button"
                  className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button> */}

                {user && (
                  <>
                    <Link href="/create-bookmark" passHref>
                      <ButtonRotate tooltip="create bookmark">
                        <FontAwesomeIcon icon={faBookmark} />
                      </ButtonRotate>
                    </Link>
                    <div className="w-2" />
                    <Link href="/create-post" passHref>
                      <ButtonRotate tooltip="create post">
                        <FontAwesomeIcon icon={faFile} />
                      </ButtonRotate>
                    </Link>
                    <div className="w-4" />
                    <ButtonBlue onClick={signOut} tooltip="sign out">
                      <FontAwesomeIcon icon={faSignOutAlt} />
                    </ButtonBlue>
                  </>
                )}

                {!user && (
                  <Link href="/auth" passHref>
                    <a className="px-8 py-2 text-xl font-semibold text-center text-white transition duration-300 rounded-lg hover:from-purple-600 hover:to-pink-600 ease bg-gradient-to-br from-purple-500 to-pink-500 md:w-auto">
                      Signin/up
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}>
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel> */}
        </>
      )}
    </Disclosure>
  );
};
