import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send(
    `<h1>Working pretty fine, click <a href=${process.env.FRONTEND_URL}>here</a> to visit front-end.</h1>`
  );
});

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
    ],
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        ...data,
        messages: [...data.messages, ...messages],
      }),
    });
    const json = await response.json();
    res.json({ question: messages, answer: json.choices });
    console.log(json);
  } catch (error) {
    console.log(error, "error");
  }
});
