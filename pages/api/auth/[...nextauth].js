import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token) {
    try{
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
        console.log("Refreshed Token is", refreshedToken);
        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000, //=1hr
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,//replace if new one came back
        }
    }catch(error){
        console.error(error);
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,

  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, account, user}){
        //initial sign in
        if(account && user){
            return {
                ...token,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                username: account.providerAccountId,
                accessTokenExpires: account.expires_at *1000, //handling in milliseconds
            }
        }

        //return the previous token if the access token has not expired
        if(Date.now() < token.accessTokenExpires){
            console.log("EXISTING TOKEN IS VALID");
            return token;
        }

        //access token expires try to refresh it
        console.log("ACCESS TOKEN EXPIRED, REFRESHING TOKEN");
        return await refreshAccessToken(token);
    },
    
    async session({ session, token}) {
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.username = token.username;

        return session;
    }
  }
}
export default NextAuth(authOptions)