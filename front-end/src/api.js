// src/api.js

// Function to call your backend /search endpoint
export const fetchRelatedStories = async (userStory) => {
  const response = await fetch("/search", {
    // use relative URL; proxy handles the backend
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userStory }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch related stories");
  }

  return await response.json(); // backend should return an array of related stories
};
