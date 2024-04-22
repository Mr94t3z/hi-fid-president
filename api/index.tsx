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
  imageOptions: {
    /* Other default options */
    fonts: [
      {
        name: 'Space Mono',
        source: 'google',
      },
    ],    
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

  const fid = users[0].userId;
  const username = users[0].profileName;

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: '#472A91',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          color: 'white',
          fontFamily: 'Space Mono',
          fontSize: 35,
          fontStyle: 'normal',
          letterSpacing: '-0.025em',
          lineHeight: 1.4,
          marginTop: 0,
          padding: '0 120px',
          whiteSpace: 'pre-wrap',
        }}
      >
        <p>Hi-{fid} President </p>
        {/* <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={!users[0].profileImage ? '/images/no_avatar.png' : users[0].profileImage}
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
            }}
            width={200} 
            height={200} 
          />
          <span style={{ marginLeft: '25px' }}>Hi, @{username}</span>
        </div> */}
        {/* <p style={{ fontSize: 30 }}>Task 10 - 10 pt per tip 🎖️</p>
        <p style={{ margin : 0 }}>[ Tip - Casts made in /747air /higher /imagine /enjoy or /degen channels (up to 50 tip) ]</p>
        {totalPointsEarned > 0 ? (
          <p style={{ fontSize: 24 }}>Completed ✅</p>
        ) : (
          <p style={{ fontSize: 24 }}>Not qualified ❌</p>
        )} */}
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
