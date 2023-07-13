const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

const headers = {
    ...(process.env.NODE_ENV === "development" && { "Access-Control-Allow-Origin": "http://localhost:3000" }),
    "Content-Type": "application/json",
};

const configuration = new Configuration({
    apiKey: process.env.GPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

// /api/generator/
router.post(
    "/",
    async (req, res) => {
        res.set(headers);
        try {
            const { keywords } = req.body;

            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `Generate a list of unique 30 domain names.\nTarget users are businesses and startups.\nInput : Keywords – ${keywords.join(", ")}; TLDs not needed; characters limit to 15 for each domain name; use full words\nOutput : Return generated list as Json array`,
                temperature: 1,
                max_tokens: 400,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });

            return res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ message: "что-то пошло не так попробуйте снова" });
        }
    }
);

module.exports = router;
