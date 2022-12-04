import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import spotifyApi from '../lib/spotify';

function useSpotify() {
    const { data: session } = useSession();
    useEffect(() => {
        if(session){
            //If refresh access token fails direct the user to a login
            if(session.error === 'RefreshAccessTokenError') {
                signIn();
            }

            spotifyApi.setAccessToken(session.user.accessToken);
        }
    }, [session]);
  return spotifyApi;
}

export default useSpotify