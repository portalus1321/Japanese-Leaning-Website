
import { Fragment } from 'react'
import { Menu, Popover, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useState, useEffect } from 'react'
import RadarChart from '../../Charts/Radar'
import Curves from '../../Charts/Curves'
import MapChartComponent from '../../Charts/Map'
import { supabase } from '../../utils/supabaseClient'


const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
    { name: 'Home', href: '#', current: true },
    { name: 'Profile', href: '#', current: false },
    { name: 'Resources', href: '#', current: false },
    { name: 'Company Directory', href: '#', current: false },
    { name: 'Openings', href: '#', current: false },
]
const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Dashboard({ token }) {
    const [userData, setUserData] = useState(null); // State to store fetched data

    async function getchats() {
        if (!token || !token.user) {
            console.log("Waiting for token...");
            return;
        }
        console.log(token.user.id, "this is token");

        try {
            const { data, error } = await supabase
                .from("UData")
                .select("id,data_best,data_current,value")
                .eq("id", token.user.id)
                .single(); // Assuming one user entry

            if (error) {
                throw error;
            }

            console.log(data);
            setUserData(data); // Store the fetched data in state
            console.log(userData, "this is it")
        } catch (error) {
            console.error("Error fetching chats:", error);
            alert("Failed to load chats. Please try again later.");
        }
    }

    useEffect(() => {
        if (token && token.user) {
            getchats(); // Call getchats only when token is available
        }
    }, [token]);

    return (
        <>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
            <div className="min-h-full">

                <main className="-mt-24 pb-8">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                        <h1 className="sr-only">Page title</h1>
                        { }
                        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-1 lg:gap-8 mt-[10vh]">

                            <div className="grid grid-cols-1 gap-4 w-full">
                                <section aria-labelledby="section-2-title ">
                                    <div className="overflow-hidden relative rounded-lg bg-gray-500 shadow">
                                        <div className="p-6 w-full">
                                            <div className="rounded-lg overflow-hidden">
                                                <RadarChart userData={[100, 6, 5, 8, userData ? userData.value / 4 : 0]}
                                                    averageData={[700, 200, 100, 5, 5]}
                                                    categories={['Typing', 'Talking', 'Memory', 'Consistency', 'Listening']}
                                                    scale={250}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                        </div>

                    </div>
                </main>

            </div>
        </>
    )
}
