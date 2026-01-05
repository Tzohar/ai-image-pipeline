⚠️ Status: Archived. This project was built in 2023 and is no longer actively maintained. 
# 🎨 AI Art Automation Pipeline

A robust Node.js bot that automates the creation, hosting, and delivery of AI-generated artwork. It leverages Bing Image Creator for generation, Cloudinary for persistent storage, and Discord Webhooks for real-time notifications.

## ✨ Features

* **Automated Generation:** Uses `bimg` to interface with Bing Image Creator.
* **Cloud Storage:** Automatically uploads base64 images to Cloudinary for permanent hosting.
* **Discord Integration:** Sends finished pieces directly to a specified Discord channel/thread.
* **Upscaling Capable:** Includes modules for upscaling via DeepAI or Replicate (configurable).
* **Error Handling:** Robust retry logic for failed generations or uploads.

## 🚀 Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
    cd YOUR_REPO_NAME
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Rename `.env.example` to `.env` and fill in your credentials:
    ```env
    BING_IMAGE_COOKIE=your_bing_cookie
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    DISCORD_WEBHOOK_URL=your_webhook_url
    ```

## 🛠️ Usage

To start the automation loop:

```bash
npm start

```

The bot will:

1. Generate a random prompt.
2. Create images using Bing.
3. Upload them to Cloudinary.
4. Post the links to your Discord channel.
5. Wait and repeat.

## 📦 Tech Stack

* **Runtime:** Node.js
* **Image Gen:** Bing Image Creator (unofficial API)
* **Storage:** Cloudinary
* **Notifications:** Discord.js Webhooks
* **Browser Automation:** Puppeteer (for upscaling)

## ⚠️ Disclaimer

This project is for educational purposes. Please respect the Terms of Service of all APIs used (Bing, Cloudinary, Discord, DeepAI).
