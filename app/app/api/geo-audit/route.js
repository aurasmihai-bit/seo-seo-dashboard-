import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const GEO_AUDIT_SYSTEM = `You are a world-class GEO (Generative Engine Optimization) + SEO analyst. 
Your job is to analyze a website URL and return a comprehensive GEO/SEO audit in JSON format.

ALWAYS respond ONLY with a valid JSON object. No markdown, no explanations, no backticks.

The JSON must have this exact structure:
{
  "domain": "example.com",
  "auditDate": "2026-04-19",
  "geoScore": 72,
  "seoScore": 65,
  "overallScore": 68,
  "summary": "Brief 2-3 sentence executive summary of the site's AI search readiness.",
  "categories": {
    "aiCitability": {
      "score": 70,
      "label": "AI Citability",
      "description": "How likely AI models will cite this content",
      "issues": ["Issue 1", "Issue 2"],
      "recommendations": ["Recommendation 1", "Recommendation 2"]
    },
    "brandAuthority": {
      "score": 60,
      "label": "Brand Authority",
      "description": "Brand presence across AI-referenced platforms",
      "issues": ["Issue 1"],
      "recommendations": ["Recommendation 1", "Recommendation 2"]
    },
    "contentQuality": {
      "score": 75,
      "label": "Content Quality & E-E-A-T",
      "description": "Content depth, expertise, and trustworthiness signals",
      "issues": ["Issue 1"],
      "recommendations": ["Recommendation 1"]
    },
    "technicalSEO": {
      "score": 80,
      "label": "Technical SEO",
      "description": "Core Web Vitals, structured data, crawlability",
      "issues": ["Issue 1"],
      "recommendations": ["Recommendation 1"]
    },
    "aiCrawlers": {
      "score": 55,
      "label": "AI Crawler Access",
      "description": "robots.txt configuration for GPTBot, ClaudeBot, PerplexityBot",
      "issues": ["Issue 1"],
      "recommendations": ["Recommendation 1"]
    },
    "platformOptimization": {
      "score": 50,
      "label": "Platform Optimization",
      "description": "Readiness for ChatGPT, Perplexity, Google AI Overviews",
      "issues": ["Issue 1"],
      "recommendations": ["Recommendation 1"]
    }
  },
  "quickWins": [
    {
      "priority": "HIGH",
      "action": "Add llms.txt file to root domain",
      "impact": "Immediate AI crawler guidance",
      "effort": "Low"
    },
    {
      "priority": "MEDIUM",
      "action": "Add FAQ schema markup to key pages",
      "impact": "Better AI citation chances",
      "effort": "Medium"
    }
  ],
  "llmsTxtPresent": false,
  "robotsTxtAiCrawlers": "UNKNOWN",
  "schemaMarkupDetected": false,
  "estimatedMonthlyTraffic": "Unknown"
}

Be realistic and specific to the actual domain provided. Research what you know about the domain.
All scores are 0-100. Be honest and critical.`;

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: GEO_AUDIT_SYSTEM,
      messages: [
        {
          role: "user",
          content: `Perform a comprehensive GEO + SEO audit for: ${normalizedUrl}
          
Analyze everything you know about this domain/website. Be specific, realistic, and actionable.
Return ONLY the JSON object, nothing else.`,
        },
      ],
    });

    const rawText = message.content[0].text.trim();
    const jsonText = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
    const auditData = JSON.parse(jsonText);

    return Response.json(auditData);
  } catch (error) {
    console.error("GEO Audit error:", error);
    return Response.json(
      { error: error.message || "Audit failed" },
      { status: 500 }
    );
  }
}