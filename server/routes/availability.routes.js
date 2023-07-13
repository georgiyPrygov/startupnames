const express = require("express");
const router = express.Router();
const axios = require("axios");

// /api/availability/
router.post(
    "/",
    async (req, res) => {
        const { keywords } = req.body;
        const apiUrl = "https://api.godaddy.com/v1/domains/available?checkType=FULL";
        try {
            const response = await axios.post(apiUrl, keywords, {
                headers: {
                    "Authorization": `sso-key ${process.env.GODADDY_API_KEY}:${process.env.GODADDY_API_SECRET}`
                }
            });

            res.status(200).json(response.data);


        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
);

module.exports = router;
