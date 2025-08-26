import {
    CalendarIcon,
    ChartPieIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    PlusCircleIcon,
    PencilSquareIcon
  } from '@heroicons/react/24/outline'
import { Outlet,useNavigate } from 'react-router-dom'
import { supabase } from '../../utils/supabaseClient'
import { useState,useEffect } from 'react'
import { Link, useParams } from "react-router-dom";

  
  const navigation = [
    { name: 'New Chat', href: '#', icon: PlusCircleIcon, count: '4 left', current: true },
    { name: 'Friends', href: '#', icon: UsersIcon, current: false },
    { name: 'Archive', href: '#', icon: FolderIcon, count: '12', current: false },
    { name: 'Calendar', href: '#', icon: CalendarIcon, count: '20+', current: false },
   
  
  ]
  let chats = [
  ]
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
const AI = ({ token }) => {
  let navigate = useNavigate();

  // You can add a loading state to track whether data is being fetched
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);

  async function getchats() {
      if (!token || !token.user) {
          console.log('Waiting for token...');
          return; // Return early if token is not available
      }

      try {
          console.log(token.user.id);

          const { data, error } = await supabase
              .from('AI_Chat')
              .select('Chat_name,Chat_ID,User_id')
              .eq('User_id', token.user.id);


            if (error) {
                console.error('Error fetching data:', error);
            } else if (data) {
                console.log('Initial data:', data);
            } else {
                console.log('Data is null, waiting to log again...');
                setTimeout(() => {
                    console.log('Re-checking data after delay:', data);
                }, 1000); // 1000ms = 1 second
            }
              
          if (error) {
            console.log("eror was before");
            console.log(error);
            
              throw error;

          }

          console.log(data);

          const chatList = data.map((item) => ({
              id: item.Chat_ID,
              name: item.Chat_name || `Chat ${item.Chat_ID}`, // Default name if no `name` field exists
              href: `/Learn/AI/${item.Chat_ID}`, // Generating href dynamically
              initial: item.Chat_name?.charAt(0).toUpperCase() || 'C', // Use first letter of name, default 'C'
              current: false // Default `current` state
          }));

          setChats(chatList);
          setLoading(false); // Set loading to false after data is fetched

      } catch (error) {
          console.error('Error fetching chats:', error);
          setLoading(false);
      }
  }

  // Use useEffect to call getchats as soon as the token is available
  useEffect(() => {
      if (token && token.user) {
          getchats(); // Call getchats only when token is available
      }
  }, [token]);    
      
    return (
     <>
      <div className='flex '>

     
      <div className=" w-[400px] h-[90vh] flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <a onClick={getchats}
                      href={`/AI/${item.href}`}
                      className={classNames(
                        item.current
                          ? 'bg-gray-50 text-indigo-600'
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                          'h-6 w-6 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                      {item.count ? (
                        <span
                          className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-gray-600 ring-1 ring-inset ring-gray-200"
                          aria-hidden="true"
                        >
                          {item.count}
                        </span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">Your Chats</div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {chats.map((team) => (
                  <li key={team.name}>
                    <a
                      href={team.href}
                      onClick={getchats}
                      className={classNames(
                        team.current
                          ? 'bg-gray-50 text-indigo-600'
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                      )}
                    >
                      <span
                        className={classNames(
                          team.current
                            ? 'text-indigo-600 border-indigo-600'
                            : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                        )}
                      >
                        {team.initial}
                      </span>
                      <span className="truncate">{team.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
            <li className="-mx-6 mt-auto">
              <a
                href="#"
                className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
              >
                
              </a>
            </li>
          </ul>
        </nav>
      </div>
       <div className=" w-fit "></div>
       <div className=" relative w-full right-0 top-0">
          <Outlet/>
       </div>
       </div>
      </>
    )
}
  export default AI
  