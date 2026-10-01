import { middleware, messagingApi } from '@line/bot-sdk';
import dotenv from 'dotenv';
import { linkLineAccount } from '../service/lineService.js';
dotenv.config();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

export const lineMiddleware = middleware(config);

const client = new messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

export async function handleLineEvent(event) {
  // We only care about message events for now
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userId = event.source.userId;
  const text = event.message.text.trim();

  // Basic Echo Bot for testing the connection
  if (text.startsWith('Hello') || text.startsWith('Hi')) {
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [{
        type: 'text',
        text: `Hello Rider! Your LINE ID is: ${userId}\nTo link your account, type: LINK-YOURCODE`
      }]
    });
  }
  
  if (text.startsWith('LINK-')) {
    // Extract the code (e.g. from "LINK-A7X9B2" -> "A7X9B2")
    const code = text.replace('LINK-', '').trim().toUpperCase();
    
    // Call the database service to bind the user
    const result = await linkLineAccount(code, userId);

    if (result.success) {
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{
          type: 'text',
          text: `✅ Account successfully linked! Welcome, ${result.user.full_name}. You will now receive order notifications here.`
        }]
      });
    } else {
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{
          type: 'text',
          text: `❌ Invalid or expired code. Please check your Dashboard and try again.`
        }]
      });
    }
  }

  // Fallback
  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [{
      type: 'text',
      text: 'Sorry, I did not understand that command. Try "Hi".'
    }]
  });
}
