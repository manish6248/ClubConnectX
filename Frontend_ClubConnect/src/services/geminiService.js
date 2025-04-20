import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const apikey = 'AIzaSyBiFSh1arfGoP6S0F6pYZRZJIacBWme4vM';
const genAI = new GoogleGenerativeAI(apikey);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch all events without filtering
export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/events/all/top-events`);
    console.log("Fetched Data:", response.data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch events');
  }
}

// Generate response using all events
export const generateResponse = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const events = await fetchEvents();  // Get all events
    
    const instruction = `
      You are a university event assistant. Follow these rules:
      1. Use the provided event data and query related to event management and club management.
      2. Answer the user query using the event data.
      2. Be concise and factual
      3. Format lists with bullet points, remove astriks instead do bold or listing
      4. Highlight free events
      5. If uncessary data is provided apart from event and club related, ask to query data related to Event
      6. In addition to providing event-related data, if a user inquires about how to organize an event, respond with a clear and concise step-by-step guide outlining the proper flow for planning and executing the event.
    
      
      Event Data: ${JSON.stringify(events)}
      
      User Query: ${prompt}`;

    const result = await model.generateContent(instruction);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("AI response generation failed.");
  }
};