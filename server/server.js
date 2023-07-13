const express = require("express");
const path = require("path");
const https = require("https");
require("dotenv").config();
const cors = require("cors");
const { response } = require("express");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/generator", require("./routes/generator.routes"));
app.use("/api/availability", require("./routes/availability.routes"));

// if (process.env.NODE_ENV === "production") {
//     app.use("/", express.static(path.join(__dirname, "client", "build")));
//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//     });
// }

const PORT = process.env.PORT || 8000;

async function start() {
    app.listen(PORT, () => {
        console.log("server running at " + PORT);
    });
    // try {
    //     const server = https.createServer(app)
    //         .listen(PORT, () => {
    //             console.log("server running at " + PORT);
    //         });
    // } catch (error) {
    //     console.log("Server error", error.message);
    //     process.exit(1);
    // }
}

start();
