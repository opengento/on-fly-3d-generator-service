interface ModelInterface {
  obj: string;
  fbx: string;
  glb: string;
  usdz: string;
}

interface MeshyImage {
  id: string;
  status: string;
  model_urls: ModelInterface;
}

import { APIGatewayProxyResult, APIGatewayEvent, Handler } from "aws-lambda";

export const getImage: Handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  // Get the image ID from the query string
  const imageId = event.queryStringParameters?.image_id;
  const STATUS_CODES = {
    processing: "PROCESSING",
    success: "SUCCEEDED",
  };
  try {
    // Call the external API using fetch
    const response = await fetch(
      "https://api.meshy.ai/v1/image-to-3d/" + imageId,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + process.env.API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data: MeshyImage = (await response.json()) as MeshyImage;
    if (data.status === STATUS_CODES.processing) {
      return {
        statusCode: 204,
        body: JSON.stringify({
          message: "Image is still processing",
          data: data,
        }),
      };
    }

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
