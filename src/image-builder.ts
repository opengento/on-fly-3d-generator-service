import { APIGatewayProxyResult, APIGatewayEvent, Handler } from "aws-lambda";

export const sendImage: Handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  let imageUrl = "";
  if (event.body) {
    imageUrl = JSON.parse(event.body).image_url;
  }
  try {
    // Call the external API using fetch
    const response = await fetch("https://api.meshy.ai/v1/image-to-3d", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + process.env.API_KEY,
      },
      body: JSON.stringify({
        image_url: imageUrl,
        enable_pbr: true,
        surface_mode: "hard",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the data from the API call
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    // Handle any errors that occur during the API call
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error fetching data from API",
        error: (error as Error).message,
      }),
    };
  }
};
