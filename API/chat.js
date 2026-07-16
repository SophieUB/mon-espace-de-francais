export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Message manquant" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        instructions:
          "Tu es Sophie, tutrice de français pour le cours LAF3201. " +
          "Tu réponds en français clair, tu encourages l'étudiant, " +
          "tu corriges avec bienveillance et tu proposes de courtes activités.",
        input: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Erreur OpenAI"
      });
    }

    const reply =
      data.output_text ||
      "Je n’ai pas réussi à produire une réponse.";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({
      error: "Erreur du serveur"
    });
  }
}
