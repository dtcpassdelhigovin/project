const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const TelegramBot = require("node-telegram-bot-api");
const ejs = require("ejs");

const app = express();
const bot = new TelegramBot("6212164299:AAG6ILbIVBaUtnXaM0Hqt-mrJzBo0bfI0KA", { polling: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// Bot command to start the conversation
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Welcome! Use /create to generate a tracking link.");
});

// Command to create a new tracking link
bot.onText(/\/create/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Please provide the URL you want to track:");
});

// Handling messages to create the tracking link
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (msg.text.startsWith("http")) {
    // Process the URL and generate tracking links
    const cloudflareLink = `https://your-vercel-app-url.com/c/${encodeURIComponent(msg.text)}`;
    const webViewLink = `https://your-vercel-app-url.com/w/${encodeURIComponent(msg.text)}`;

    // Sending back the generated links to the user
    bot.sendMessage(chatId, `Cloudflare Link: ${cloudflareLink}`);
    bot.sendMessage(chatId, `WebView Link: ${webViewLink}`);
  } else {
    bot.sendMessage(chatId, "Invalid URL. Please provide a valid URL.");
  }
});

// Handling Cloudflare Link Request
app.get("/c/:uri", (req, res) => {
  const uri = req.params.uri;
  res.render("cloudflare", { url: decodeURIComponent(uri) });
});

// Handling WebView Link Request
app.get("/w/:uri", (req, res) => {
  const uri = req.params.uri;
  res.render("webview", { url: decodeURIComponent(uri) });
});

// Render cloudflare.ejs template
app.set("views", "./");
app.engine("ejs", ejs.renderFile);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
