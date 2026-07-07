import {
  generatePhotoService,
  scoreCvService,
  parseUploadedCvService,
} from "../services/cv.service.js";

export const generatePhoto = async (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ message: "No image provided" });

  try {
    const resultImage = await generatePhotoService(image);
    return res.status(200).json({ image: resultImage });
  } catch (error) {
    console.error("Generation Failed:", error);

    // Give the frontend a clear, actionable message instead of a
    // generic 500 when the real cause was hitting rate limits/quota
    // on every configured provider.
    if (error.bothRateLimited) {
      return res.status(429).json({
        message:
          "Photo generation is temporarily unavailable — all providers have hit their usage limits. Please try again later.",
      });
    }

    return res.status(500).json({ message: "Generation failed", error: error.message });
  }
};

export const scoreCv = async (req, res) => {
  const { cvData } = req.body;
  if (!cvData) return res.status(400).json({ message: "No cvData provided" });

  try {
    const parsed = await scoreCvService(cvData);
    return res.status(200).json(parsed);
  } catch (error) {
    if (error.badFormat) {
      return res.status(502).json({ message: "Scoring service returned incomplete data" });
    }
    if (error instanceof SyntaxError) {
      console.error("Gemini returned non-JSON while scoring");
      return res.status(502).json({ message: "Scoring service returned an unexpected format" });
    }
    console.error("Scoring Failed:", error);
    return res.status(500).json({ message: "Scoring failed", error: error.message });
  }
};

export const parseUploadedCv = async (req, res) => {
  const { file } = req.body;
  if (!file) return res.status(400).json({ message: "No file provided" });

  try {
    const parsed = await parseUploadedCvService(file);
    return res.status(200).json(parsed);
  } catch (error) {
    if (error.unreadable) {
      return res.status(422).json({ message: error.message });
    }
    if (error instanceof SyntaxError) {
      console.error("Gemini returned non-JSON while parsing upload");
      return res.status(502).json({ message: "Could not process this CV. Please try again." });
    }
    console.error("CV parse failed:", error);
    return res.status(500).json({ message: "Failed to parse CV", error: error.message });
  }
};
