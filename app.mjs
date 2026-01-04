import 'dotenv/config'; 
import { generateImageFiles } from "bimg"; 
import Replicate from "replicate";
import cloudinary from 'cloudinary';
import { sendImageToWebhook } from './webhook.cjs';
// import { upscale } from './upscale.cjs';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

function generateString() {
    return "Random artistic prompt " + Math.random();
}

async function begin() {
  const prompt = generateString();
  console.log(`Generating for: ${prompt}`);
  const nick = "" + Math.floor(Math.random() * 10000); 

  let imageFiles;
  try {
    imageFiles = await generateImageFiles(prompt, nick); 
  } catch (error) {
    console.error("Generation error:", error);
    delayAndExecute(begin);
    return;
  }

  let urls = [];
  
  const uploadPromises = imageFiles.map(async (element) => {
      const base64Image = element.data;
      try {
        const result = await cloudinary.v2.uploader.upload(`data:image/jpeg;base64,${base64Image}`);
        console.log('Upload successful:', result.url);
        urls.push(result.url);
      } catch (error) {
        console.error('Upload error:', error);
      }
  });

  await Promise.all(uploadPromises);

  await new Promise(resolve => setTimeout(resolve, 2000));

  // const upscaledUrls = await upscale(urls);
  if (urls.length > 0) {
      await sendImageToWebhook(urls);
  }
  
  begin();
}

async function fix(link) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  let output;
  let hasError = true;

  while (hasError) {
    try {
      output = await replicate.run(
        "tencentarc/gfpgan:928361Z9KBnTLR-apB84J5h-dWxcPmoddCRLn6yfnNNsUUrHyAIsHtOfc4Rcu_iKqeNVVj4c0eL2S0nCunsy1odLfIFdfNmv0rsEHNC2-CdAceQ3G_wTlJif2iT49Z7rvzmNIvM-qZ0Hql5F2b18ivWZw7zBNTLLpXhPKGGfVn0L3c7ZXDUmSbQW0PGWhQzfssZDZpQkTnu8e37swIieQfIj8pSXF2YrFj4KSfMXT1DFGWqZIAbsLfkAD4lVytWUcW2xIe08cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
        { input: { img: link, scale: 10 } }
      );
      hasError = false;
    } catch (error) {
      console.error(error);
      await new Promise(r => setTimeout(r, 1000)); // Prevent instant loop on error
    }
  }

  console.log(output);
  sendImageToWebhook(output);
}

function delayAndExecute(func) {
  setTimeout(func, 5000);
}

await begin();