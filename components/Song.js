import React from 'react';
import useSpotify from '../hooks/useSpotify';
import Image from 'next/image';
import { millisToMinutes } from '../lib/time';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';

function Song({order, track}) {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const playSong = () => {
        setCurrentTrackId(track.track.id);
        setIsPlaying(true);
        spotifyApi.play({
            uris: [track.track.uri],
        });
    };
    console.log(track.track.uri);
  return (
    <div className='grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-md cursor-pointer' 
    onClick={playSong}>
        <div className='flex items-center space-x-4'>
            <p>{order+1}</p>
            <Image alt='' src={track.track.album.images[0].url} height={40} width={40} />
            <div>
                <p className='w-36 lg:w-64 truncate text-white'>{track.track.name}</p>
                <p className='w-40'>{track.track.artists[0].name}</p>
            </div>
        </div>
        <div className='flex items-center justify-between ml-auto md:ml-0'>
            <p className='hidden md:inline w-40'>{track.track.album.name}</p>
            <p>{millisToMinutes(track.track.duration_ms)}</p>
        </div>
    </div>
  )
}

export default Song