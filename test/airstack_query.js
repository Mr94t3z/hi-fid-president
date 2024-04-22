import { init, fetchQuery } from "@airstack/node";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
// Initialize Airstack with your API key
init(process.env.AIRSTACK_API_KEY);

// Define your GraphQL query
const query = `
    query MyQuery {
        Socials(
        input: {filter: {dappName: {_eq: farcaster}, followingCount: {_gte: 1}}, blockchain: ethereum, order: {profileCreatedAtBlockTimestamp: DESC}, limit: 1}
        ) {
        Social {
            dappName
            userId
            profileName
            profileDisplayName
            profileImage
            followerCount
            followingCount
        }
        }
    }
    `;

    const { data } = await fetchQuery(query);

    const users = data.Socials.Social.map(user => ({
        userId: user.userId,
        profileName: user.profileName,
        profileDisplayName: user.profileDisplayName,
        profileImage: user.profileImage
    }));
    
    console.log(users);
    console.log(users[0].userId);
    
    
     
