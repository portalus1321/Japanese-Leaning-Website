import { Outlet } from "react-router-dom";
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Link, Navigate,useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import { fetchUserId } from '../../utils/supabaseClient';   
import { supabase } from "../utils/supabaseClient";

import {
  ArchiveBoxIcon,
  ArrowRightCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  HeartIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
  BoltIcon,
  SquaresPlusIcon,
  ArrowPathIcon,
} from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function buildPeople(data) {
  return data.map(item => ({
    name: item.profiles?.full_name || 'Unknown',
    email: '', // You can add email if you have it later
    role: item.profiles?.title || 'Player', // Default to 'Player' if no title
    imageUrl: item.profiles?.avatar_url || 'https://iimyvjgihsdkdklepmns.supabase.co/storage/v1/object/public/Images//blue.jpg', // Default image if no avatar
    href: '#', // You can customize this if you want
    lastSeen: item.profiles?.last_seen ? formatTimeAgo(item.profiles.last_seen) : '',
    lastSeenDateTime: item.profiles?.last_seen || '',
  }));
}
function formatTimeAgo(dateString) {
  const now = new Date();
  const lastSeen = new Date(dateString);
  const diffInMs = now - lastSeen;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
}


export default function Leaderboard() {
const [people, setPeople] = useState([]);
const [userData, setUserData] = useState([]); // set it as empty array, not null



async function GetTopPlayers(type) {
  console.log("clicked gettopplayers");

  try {
    const { data, error } = await supabase
      .from("UData")
      .select(`
        id,
        data_type,
        value,
        profiles (
          country,
          full_name,
          avatar_url,
          last_seen,
          title
        )
      `)
      .eq('data_type', type) 
      .order('value', { ascending: false }) 
      .limit(100);

    if (error) {
      throw error;
    }

    const players = buildPeople(data);
    setPeople(players);

    console.log("Fetched top players data:", data);
    setUserData(data); // Update state
  } catch (error) {
    console.error("Error fetching top players:", error);
    alert("Failed to load top players. Please try again later.");
  }
}

useEffect(() => {
  GetTopPlayers(1); // or whatever game type you want
}, []);
  return (
    <>
      <div className="mx-auto  h-5/6 py-[20px] max-w-7xl px-4 sm:px-6 lg:px-8 ">
        { }
        <div className="mx-auto max-w-3xl h-5/6">{
          <div className="relative h-max">
            <div className=" relative overflow-y-scroll h-[85vh]">
              <ul
                role="list"
                className="divide-y divide-gray-100 overflow-hidden  bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
              >
                {people.map((person, index) => {
                  // set color based on index
                  let bgColor = "";
                  let bghColor = "";
                  if (index === 0) bgColor = "bg-yellow-400"; // gold
                  else if (index === 1) bgColor = "bg-gray-400"; // silver
                  else if (index === 2) bgColor = "bg-orange-400"; // bronze
                  else bgColor = "bg-white";
                  if (index === 0) bghColor = "hover:bg-yellow-300"; // gold
                  else if (index === 1) bghColor = "hover:bg-gray-300"; // silver
                  else if (index === 2) bghColor = "hover:bg-orange-300"; // bronze
                  else bghColor = "hover:bg-white";
                  return (
                    <li
                      
                      className={`relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-100 sm:px-6 bg-gray-200`}
                    >
                      <div className="flex min-w-0 gap-x-4 w-[200px]">
                        <div className="h-12 px-1 py-1 w-12 flex items-center justify-center rounded-full bg-black">
                        <img
                          className="h-10 w-10 flex-none rounded-full bg-white"
                          src={person.imageUrl}
                          alt=""
                        />
                        </div>
                        <div className="relative min-w-0 flex-auto flex items-center">
                          <p className="relative flex text-sm items-center font-semibold leading-6 text-gray-900">
                            <a href={person.href} className="mr-1 relative left-">
                            
                              {person.name}
                            </a>
                          </p>
                          <p className="mt-1 flex text-xs leading-5 text-gray-500">
                            
                          </p>
                        </div>
                      </div>
                      <div className="flex mr-[50px] shrink-0 items-center gap-x-4">
                        <div className="hidden sm:flex sm:flex-col sm:items-end">
                          <p className="text-sm leading-6 text-gray-900">{person.role}</p>
                          {person.lastSeen ? (
                            <p className="mt-1 text-xs leading-5 text-gray-500">
                              Last seen{" "}
                              <time dateTime={person.lastSeenDateTime}>
                                {person.lastSeen}
                              </time>
                            </p>
                          ) : (
                            <div className="mt-1 flex items-center gap-x-1.5">
                              <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              </div>
                              <p className="text-xs leading-5 text-gray-500">Online</p>
                            </div>
                          )}
                        </div>
                        <ChevronRightIcon
                          className="h-5 w-5 flex-none text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="w-[50px] absolute right-[15px] h-full  top-0 flex items-center justify-center" ><a className={`relative leading-[25px] text-center ${bgColor} rounded-full w-[25px] h-[25px]`}>{index + 1}</a></div>
                    </li>
                  );
                })}
              </ul>

            </div>

            <div className="w-[50px] h-[20px] absolute top-0 right-[-60px]" >

              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Filter
                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">

                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={() => GetTopPlayers(1)}
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'group flex items-center px-4 py-2 text-sm'
                            )}
                          >
                            <SquaresPlusIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-purple-500" aria-hidden="true" />
                            Card
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'group flex items-center px-4 py-2 text-sm'
                            )}
                          >
                            <BoltIcon
                              className="mr-3 h-5 w-5 text-gray-400 group-hover:text-yellow-500"
                              aria-hidden="true"
                            />
                            WPM
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'group flex items-center px-4 py-2 text-sm'
                            )}
                          >
                            <UserPlusIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" aria-hidden="true" />
                            Share
                          </a>
                        )}
                      </Menu.Item>

                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'group flex items-center px-4 py-2 text-sm'
                            )}
                          >
                            <ArrowPathIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-500" aria-hidden="true" />
                            Refresh
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        }</div>
      </div>
    </>


  )
}
