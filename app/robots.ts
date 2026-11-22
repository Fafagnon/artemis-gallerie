import type { MetadataRoute } from "next";

// Robots des IA génératives : explicitement autorisés, comme tout le monde.
// La règle "*" les autorise déjà, ces lignes documentent l'intention
// et protègent le cas où la règle générale changerait un jour.
const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: "/" })),
    ],
    sitemap: "https://www.gallerie-artemis.com/sitemap.xml",
  };
}
