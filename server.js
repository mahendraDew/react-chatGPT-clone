const PORT = 8080;
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const API_key = process.env.OPENAI_API_KEY;

app.post('/completions', async (req, res) => {
    console.log(req.body.message);
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_key}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: req.body.message}],
            max_tokens: 100,
        })
    };
    try {
       const response = await fetch('https://api.openai.com/v1/chat/completions', options)
       const data = await response.json();
       res.send(data); 
       console.log(data);
    } catch (error) {
        console.log(error);
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));