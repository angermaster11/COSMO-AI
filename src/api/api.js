import axios from 'axios';

const BASE_URL = 'http://localhost:8000/';

export const sendToBot = async (userMessage) => {
  try {
    const response = await axios.post(BASE_URL, { data: userMessage });
    return response.data?.bot_response?.content || 'No response from bot';
  } catch (error) {
    console.error('API Error:', error.message);
    return 'Something went wrong while contacting the bot.';
  }
};