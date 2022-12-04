import { ChevronDownIcon } from '@heroicons/react/solid';
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { shuffle } from 'lodash';
import { useRecoilValue, useRecoilState } from 'recoil';
import { playlistState, playlistIdState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import { ViewListIcon } from '@heroicons/react/solid';
import img from '/public/home.png';
import Songs from './Songs';
import { signOut } from 'next-auth/react';

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
];

function Center() {
    const spotifyApi = useSpotify();
    const { data: session } = useSession();
    const [color, setColor] = useState(null);
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);
    const [check, setCheck] = useState('');
    useEffect(() => {
        setColor(shuffle(colors).pop());
    }, [playlistId]);
    useEffect(() => {
        spotifyApi.getPlaylist(playlistId).then((data) => {
            setPlaylist(data.body);
            setCheck('');
        }).catch((err) => {
            setCheck('hidden');
            console.log("Something went wrong!", err);
        });
    }, [spotifyApi, playlistId]);
    console.log(check);
  return (
    <div className='flex-grow text-white h-screen overflow-y-scroll scrollbar-hide'>
        <header className='absolute top-5 right-8'>
            <div className='flex items-center bg-black space-x-3 opacity-90 
            hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white' 
            onClick={signOut}>
                <Image className='rounded-full object-cover' width={45} height={45} src={session?.user?.image} alt='' />
                <h2>{session?.user?.name}</h2>
                <ChevronDownIcon className='h-5 w-5' />
            </div>
        </header>
        <section className={`flex items-end space-x-7 
        bg-gradient-to-b to-black ${color} h-80 p-8`}>
            <div className={`${check.includes('hidden')?'flex flex-col space-y-5':'hidden'}`}>
                <Image className='mb-3 object-contain' width={500} height={400} src={img} alt='' />
                <div className='flex space-x-5 pl-5'>
                    <ViewListIcon className='h-10 w-10 text-white/80' />
                    <h1 className='text-4xl text-gray-400'>Choose a playlist...</h1>
                </div>
            </div>
            <Image src={playlist?.images?.[0]?.url} height={176} width={176} className={`shadow-2xl ${check}`} alt='' />
            <div className={`${check}`}>
                <p>PLAYLIST</p>
                <h1 className='text-2xl md:text-3xl xl:text-5xl font-semibold'>{playlist?.name}</h1>
            </div>
        </section>
        <div className={`${check}`}>
            <Songs />
        </div>
    </div>
  )
}

export default Center