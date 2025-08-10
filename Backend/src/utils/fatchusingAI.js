import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Initialize Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // put your API key in .env

exports.getStateFromAddress=async(address)=>{
  const prompt = `
  You are an address parser.
  Given the following address and coordinates, return the city and state in JSON format.

  Address: "${address}"
  Latitude: ${location.lat}
  Longitude: ${location.lng}

  Respond ONLY in this JSON format:
  {
    "city": "<city name>",
    "state": "<state name>"
  }
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);

  // Try parsing the JSON safely
  try {
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Failed to parse Gemini response:", result.response.text());
    return null;
  }
}

