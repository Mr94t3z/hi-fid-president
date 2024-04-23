import { Button, Frog } from 'frog';
import { handle } from 'frog/vercel';
import { init, fetchQuery } from "@airstack/node";
import dotenv from 'dotenv';

// Uncomment this packages to tested on local server
import { devtools } from 'frog/dev';
import { serveStatic } from 'frog/serve-static';

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

// Load environment variables from .env file
dotenv.config();

// Initialize Airstack with your API key
init(process.env.AIRSTACK_API_KEY || '');

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api/frame',
  imageAspectRatio: '1:1',
  imageOptions: {
    /* Other default options */
    fonts: [
      {
        name: 'Space Mono',
        source: 'google',
        weight: 700,
      },
    ],

    height: 710,
    width: 710,
  },
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

app.frame('/', async (c) => {

  // Define your GraphQL query
  const query = `
    query MyQuery {
        Socials(
        input: {filter: {dappName: {_eq: farcaster}, profileName: {_nin: ""}}, blockchain: ethereum, order: {profileCreatedAtBlockTimestamp: DESC}, limit: 1}
        ) {
        Social {
            dappName
            userId
            profileName
            profileDisplayName
            profileImage
        }
        }
    }
    `;

  const { data } = await fetchQuery(query);

  const users = data.Socials.Social.map((user: { userId: any; profileName: any; profileDisplayName: any; profileImage: any; }) => ({
      userId: user.userId,
      profileName: user.profileName,
      profileDisplayName: user.profileDisplayName,
      profileImage: user.profileImage
  }));

  const username = users[0].profileName;

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          backgroundImage: 'url(https://raw.githubusercontent.com/Mr94t3z/hi-fid-president/master/public/images/bg.png)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          color: '#E1A411',
          fontStyle: 'normal',
          letterSpacing: '-0.025em',
          lineHeight: 1.4,
          marginTop: 0,
          padding: '0 120px',
          whiteSpace: 'pre-wrap',
        }}
      >
        <p style={{ fontSize : '36px', margin : '0', marginTop : '610', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}> Hi-FID President </p>
        <p style={{ fontSize : '24px', margin : '0', marginBottom : '15', color : 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}> @{username} </p>
      </div>
    ),
    intents: [
      <Button.Link href={`https://warpcast.com/${username}`}>See @{username}</Button.Link>,
      <Button action="/">⌁ Refresh</Button>,
      <Button.Link href="https://warpcast.com/~/channel/hi-fid-club">/hi-fid-club</Button.Link>,
    ],
  })
})

// Uncomment for local server testing
devtools(app, { serveStatic });

export const GET = handle(app)
export const POST = handle(app)
