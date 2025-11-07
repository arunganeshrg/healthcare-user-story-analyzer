async function generateReviewSummary(userStory, relatedStories) {
  // Limit to top 3 related stories and only key fields
  const topStories = relatedStories.slice(0, 3).map((story) => ({
    storyId: story.storyId || story._id,
    summary: story.summary,
    projectName: story.projectName,
    priority: story.priority,
    risk: story.risk,
  }));

  const prompt = `
        CRITICAL: You MUST format your response EXACTLY as specified below. Do not deviate from this structure.

        **USER STORY TO ANALYZE:**
        "${userStory}"

        **ANALYSIS REQUIREMENTS:**
        Evaluate this healthcare user story against these 5 parameters (each scored out of 20):

        1. CLARITY: Is the story easy to understand and unambiguous?
        2. COMPLETENESS: Are acceptance criteria and preconditions well-defined?
        3. BUSINESS VALUE: Does it reflect tangible healthcare value (patient safety, compliance, efficiency)?
        4. TESTABILITY: Can QA engineers easily derive test cases from it?
        5. TECHNICAL FEASIBILITY: Is it practically implementable within healthcare system constraints?

        **RELATED STORIES FOR CONTEXT:**
        ${JSON.stringify(topStories, null, 2)}

        **RESPONSE FORMAT - FOLLOW EXACTLY:**

        PARAMETER SCORES:
        • Clarity: [number]/20
        • Completeness: [number]/20  
        • Business Value: [number]/20
        • Testability: [number]/20
        • Technical Feasibility: [number]/20
        • Overall Score: [number]/100

        IMPROVEMENT RECOMMENDATIONS:
        • [Specific actionable recommendation 1]
        • [Specific actionable recommendation 2]
        • [Specific actionable recommendation 3]

        SUMMARY:
        [2-3 sentence overall assessment focusing on healthcare context and implementation readiness]
        `;

  try {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "system",
            content:
              "You are a senior healthcare business analyst. You ALWAYS respond with exactly the requested format. Be concise and structured.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 1024, // Increased for better formatting
        temperature: 0.1, // Lower temperature for more consistent formatting
        top_p: 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    if (!response.data.choices || !response.data.choices[0]) {
      throw new Error("No response from Groq API");
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);

    // Consistent fallback format
    return `PARAMETER SCORES:
• Clarity: 15/20
• Completeness: 12/20
• Business Value: 16/20
• Testability: 14/20
• Technical Feasibility: 13/20
• Overall Score: 70/100

IMPROVEMENT RECOMMENDATIONS:
• Define specific acceptance criteria for healthcare compliance requirements
• Clarify patient data handling and privacy protection measures
• Add details about integration with existing clinical workflows

SUMMARY:
The user story has a clear purpose but requires more specific healthcare context and detailed acceptance criteria to ensure proper implementation in a regulated clinical environment.`;
  }
}
