// src/utils/nameGenerator.js

/**
 * Fetches a random name from the randomuser.me API.
 * This function does NOT interact with the database.
 * @returns {Promise<string|null>} A promise that resolves with a unique name like "VividWolf73", or null if the API fails.
 */
export const generateAnonymousName = async () => {
  try {
    // 1. Call the external API to get random user data
    const response = await fetch("https://randomuser.me/api/?inc=name");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    // 2. Extract the first and last name from the API response
    const firstName = data.results[0].name.first;
    const lastName = data.results[0].name.last;
    const number = Math.floor(Math.random() * 100);

    // 3. Capitalize the first letter of each name for consistent formatting
    const formattedFirstName =
      firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const formattedLastName =
      lastName.charAt(0).toUpperCase() + lastName.slice(1);

    // 4. Combine them into the final anonymous name
    return `${formattedFirstName}${formattedLastName}${number}`;
  } catch (error) {
    console.error("Failed to fetch random name from API:", error);
    // Provide a simple fallback name if the API call fails
    return `User${Date.now()}`;
  }
};
