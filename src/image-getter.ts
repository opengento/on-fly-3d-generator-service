export const handler = async (
  event: any
): Promise<{ statusCode: number; body: string }> => {
  //body: process.env.API_KEY,
  try {
    // Call the external API using fetch
    const response = await fetch("https://api.example.com/data");

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
