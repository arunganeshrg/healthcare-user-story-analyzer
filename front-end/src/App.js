import React, { useState } from "react";
import { fetchRelatedStories } from "./api";

function App() {
  const [userStory, setUserStory] = useState("");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    if (!userStory.trim()) return;

    setLoading(true);
    setError(null);
    setReview(null);

    try {
      const result = await fetchRelatedStories(userStory);
      setReview(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Healthcare User Story Analysis</h1>

      <textarea
        rows={6}
        cols={80}
        placeholder="Enter your user story here..."
        value={userStory}
        onChange={(e) => setUserStory(e.target.value)}
        style={{
          width: "100%",
          padding: "1rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginTop: "1rem",
        }}
      />

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <button
          onClick={handleFetch}
          disabled={loading || !userStory}
          style={{
            padding: "0.8rem 2rem",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {loading ? "Fetching..." : "Analyze User Story"}
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginTop: "1rem", textAlign: "center" }}>
          Error: {error}
        </div>
      )}

      {review && (
        <div style={{ marginTop: "2rem" }}>
          {/* Review Summary Card */}
          {review.reviewSummary && (
            <div
              style={{
                background: "#f9f9f9",
                padding: "1.5rem",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                marginBottom: "2rem",
              }}
            >
              <h2 style={{ marginBottom: "1rem" }}>Review Summary</h2>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
                }}
              >
                {review.reviewSummary}
              </pre>
            </div>
          )}

          {/* Related Stories Table */}
          {review.relatedStories && review.relatedStories.length > 0 && (
            <div>
              <h2 style={{ marginBottom: "1rem" }}>Related Stories</h2>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}>
                <thead>
                  <tr style={{ backgroundColor: "#007bff", color: "#fff", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>ID</th>
                    <th style={{ padding: "10px" }}>Summary</th>
                    <th style={{ padding: "10px" }}>Project Name</th>
                    <th style={{ padding: "10px" }}>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {review.relatedStories.map((story) => (
                    <tr key={story.storyId} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "10px" }}>{story.storyId}</td>
                      <td style={{ padding: "10px" }}>{story.summary}</td>
                      <td style={{ padding: "10px" }}>{story.projectName}</td>
                      <td style={{ padding: "10px" }}>{story.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
