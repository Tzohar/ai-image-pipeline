require('dotenv').config();
const { WebhookClient, AttachmentBuilder } = require('discord.js');

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
const GROUP = false;

const sendImageToWebhook = async (imageUrls) => {
    if (!webhookUrl) {
        console.error("Error: DISCORD_WEBHOOK_URL is missing in .env");
        return;
    }

    const currentWebhookClient = new WebhookClient({ url: webhookUrl });

    try {
        if (GROUP === true) {
            let currentFiles = imageUrls.map(url => new AttachmentBuilder(url));
            await currentWebhookClient.send({
                content: '',
                username: 'Art Bot',
                avatarURL: 'https://i.imgur.com/AfFp7pu.png',
                files: currentFiles
            });
        } else {
            for (const url of imageUrls) {
                await currentWebhookClient.send({
                    content: '',
                    username: 'Art Bot',
                    avatarURL: 'https://i.imgur.com/AfFp7pu.png',
                    files: [new AttachmentBuilder(url)]
                });     
            }
        }
    } catch (err) {
        console.error("Webhook Error:", err);
    }
};

exports.sendImageToWebhook = sendImageToWebhook;