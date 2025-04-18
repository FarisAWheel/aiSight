import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY, // Add this to your .env file
  dangerouslyAllowBrowser: true // Only for development, consider using a backend for production
});

// Function to generate description based on detected objects
export const generateDescription = async (detections: any[], imageBase64?: string) => {
  try {
    // Create a prompt based on the detected objects
    const detectedObjectsText = detections
      .map(d => `${d.className} (${(d.confidence * 100).toFixed(1)}%)`)
      .join(', ');
    
    let messages = [];
    
    if (imageBase64) {
      // If image is provided, use vision capabilities
      messages = [
        {
          role: 'system',
          content: 'You are a helpful assistant that analyzes images and provides detailed descriptions about the objects detected in them.'
        },
        {
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: `I've detected the following objects: ${detectedObjectsText}. Please provide a brief description of what you see in this image.` 
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ];
    } else {
      // Text-only prompt
      messages = [
        {
          role: 'system',
          content: 'You are a helpful assistant that provides information about objects.'
        },
        {
          role: 'user',
          content: `I've detected the following objects: ${detectedObjectsText}. Please provide a brief description about these objects and how they might relate to each other.`
        }
      ];
    }
    
    const response = await openai.chat.completions.create({
      model: imageBase64 ? 'gpt-4-vision-preview' : 'gpt-4-turbo',
      messages: messages,
      max_tokens: 300,
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate description');
  }
};