import { NextResponse } from 'next/server';
import { weatherApi } from '@/lib/weather-api';

// Types for the request body
interface PredictCropRequest {
  lat?: number;
  lon?: number;
  soilData?: {
    N?: number;
    P?: number;
    K?: number;
    PH?: number;
    TEMP?: number;
    RAINFALL?: number;
  };
}

// Types for the response
interface PredictCropResponse {
  predictedCrop: string;
  explanation: string;
  soilData: {
    N: number;
    P: number;
    K: number;
    TEMP: number;
    PH: number;
    RAINFALL: number;
  };
  imageUrl: string;
}

// Helper to generate random number in range
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(1));

// Helper to get crop image URL
const getCropImageUrl = (crop: string): string => {
  const cropImages: Record<string, string> = {
    'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1000&auto=format&fit=crop',
    'maize': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1000&auto=format&fit=crop',
    'chickpea': 'https://images.unsplash.com/photo-1515543904379-3d757afe72e3?q=80&w=1000&auto=format&fit=crop',
    'kidneybeans': 'https://images.unsplash.com/photo-1542442750-79a95221081f?q=80&w=1000&auto=format&fit=crop',
    'pigeonpeas': 'https://images.unsplash.com/photo-1599579086776-857508977178?q=80&w=1000&auto=format&fit=crop',
    'mothbeans': 'https://images.unsplash.com/photo-1591465001581-d4220715e7b6?q=80&w=1000&auto=format&fit=crop',
    'mungbean': 'https://images.unsplash.com/photo-1626074216672-46337852f864?q=80&w=1000&auto=format&fit=crop',
    'blackgram': 'https://images.unsplash.com/photo-1515543904379-3d757afe72e3?q=80&w=1000&auto=format&fit=crop',
    'lentil': 'https://images.unsplash.com/photo-1515543904379-3d757afe72e3?q=80&w=1000&auto=format&fit=crop',
    'pomegranate': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000&auto=format&fit=crop',
    'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=1000&auto=format&fit=crop',
    'mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=1000&auto=format&fit=crop',
    'grapes': 'https://images.unsplash.com/photo-1537640538965-1756fb179c26?q=80&w=1000&auto=format&fit=crop',
    'watermelon': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=1000&auto=format&fit=crop',
    'muskmelon': 'https://images.unsplash.com/photo-1598025362874-49480f0448c4?q=80&w=1000&auto=format&fit=crop',
    'apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=1000&auto=format&fit=crop',
    'orange': 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=1000&auto=format&fit=crop',
    'papaya': 'https://images.unsplash.com/photo-1617112848923-cc94e0b96984?q=80&w=1000&auto=format&fit=crop',
    'coconut': 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?q=80&w=1000&auto=format&fit=crop',
    'cotton': 'https://images.unsplash.com/photo-1594300963363-228784d9f676?q=80&w=1000&auto=format&fit=crop',
    'jute': 'https://images.unsplash.com/photo-1599629964232-28c0353846c9?q=80&w=1000&auto=format&fit=crop',
    'coffee': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop'
  };

  const normalizedCrop = crop.toLowerCase().replace(/\s+/g, '');
  return cropImages[normalizedCrop] || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1000&auto=format&fit=crop';
};

export async function POST(request: Request) {
  try {
    const body: PredictCropRequest = await request.json();
    const { lat, lon, soilData } = body;

    // 1. Prepare Soil Data (Autofill if missing)
    let finalSoilData = {
      N: soilData?.N ?? random(0, 140),
      P: soilData?.P ?? random(5, 145),
      K: soilData?.K ?? random(5, 205),
      PH: soilData?.PH ?? randomFloat(3.5, 9.9),
      TEMP: soilData?.TEMP ?? 0,
      RAINFALL: soilData?.RAINFALL ?? random(20, 298)
    };

    // 2. Fetch Weather Data if TEMP is missing
    if (!soilData?.TEMP) {
      try {
        if (lat && lon) {
          const weather = await weatherApi.getWeatherData(lat, lon);
          if (weather) {
            finalSoilData.TEMP = weather.current.temperature;
          } else {
            finalSoilData.TEMP = random(15, 40); // Fallback
          }
        } else {
           finalSoilData.TEMP = random(15, 40); // Fallback if no location
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
        finalSoilData.TEMP = random(15, 40); // Fallback
      }
    }

    // 3. Call Crop Prediction API
    const modelApiUrl = process.env.MODEL_API_URL;
    if (!modelApiUrl) {
      throw new Error("MODEL_API_URL is not configured");
    }

    // The model expects: { N, P, K, TEMP, PH, RAINFALL }
    // Ensure keys match exactly what the model expects (case sensitivity)
    const modelPayload = {
      N: finalSoilData.N,
      P: finalSoilData.P,
      K: finalSoilData.K,
      TEMP: finalSoilData.TEMP,
      PH: finalSoilData.PH,
      RAINFALL: finalSoilData.RAINFALL
    };

    let predictedCrop = "Rice"; // Default fallback
    try {
      const modelResponse = await fetch(modelApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modelPayload),
      });

      if (!modelResponse.ok) {
        throw new Error(`Model API error: ${modelResponse.statusText}`);
      }

      const modelResult = await modelResponse.json();
      predictedCrop = modelResult.predicted_crop;
    } catch (error) {
      console.error("Error calling prediction model:", error);
      console.error("Failed URL:", modelApiUrl);
      console.error("Payload:", JSON.stringify(modelPayload));
      
      // Fallback to a random crop if API fails
      const crops = ["Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Potato", "Tomato"];
      predictedCrop = crops[Math.floor(Math.random() * crops.length)];
      console.warn(`⚠️ Using fallback crop: ${predictedCrop}`);
    }

    // 4. Call Ollama for Explanation
    const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const ollamaModel = process.env.OLLAMA_MODEL || 'llama3';

    let explanation = `The predicted crop is ${predictedCrop}. It is suitable for your soil conditions.`;

    try {
      const prompt = `You are an agricultural expert. The predicted crop for a farm with the following conditions is ${predictedCrop}.
      Conditions:
      - Nitrogen (N): ${finalSoilData.N}
      - Phosphorus (P): ${finalSoilData.P}
      - Potassium (K): ${finalSoilData.K}
      - Temperature: ${finalSoilData.TEMP}°C
      - pH: ${finalSoilData.PH}
      - Rainfall: ${finalSoilData.RAINFALL}mm

      Please provide a short, encouraging note (max 3-4 sentences) for the farmer about growing ${predictedCrop} under these conditions. Include a brief tip. Do not include any other things like here is the summary or any other text than the actual asked response.`;

      const ollamaResponse = await fetch(`${ollamaBaseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: ollamaModel,
          prompt: prompt,
          stream: false
        }),
      });

      if (ollamaResponse.ok) {
        const ollamaResult = await ollamaResponse.json();
        explanation = ollamaResult.response;
      } else {
        console.warn("Ollama API failed:", ollamaResponse.statusText);
        explanation += " (AI explanation unavailable)";
      }
    } catch (error) {
      console.error("Error calling Ollama:", error);
      explanation += " (AI explanation unavailable)";
    }

    // 5. Return Response
    return NextResponse.json({
      predictedCrop,
      explanation,
      soilData: finalSoilData,
      imageUrl: getCropImageUrl(predictedCrop)
    });

  } catch (error) {
    console.error("Crop prediction error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
