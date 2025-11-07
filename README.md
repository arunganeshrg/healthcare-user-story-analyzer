# Vector DB Search Backend (Node.js)

This Express API receives a user story, generates embeddings using MistralAI, queries MongoDB Atlas for similar stories, and returns the results.

## Setup

1. Add your MongoDB Atlas URI and MistralAI API key to `.env`:
   - `MONGODB_URI=...`
   - `MISTRAL_API_KEY=...`
2. Run the server:
   ```powershell
   node index.js
   ```

## API Usage

- **POST /search**
  - Body: `{ "userStory": "<your user story text>" }`
  - Response: `{ "relatedStories": [ ... ] }`

## Files

- `index.js`: Main Express server and API logic
- `.env`: Environment variables

---

Empowering Communication, Enabling Opportunities.
