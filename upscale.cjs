require('dotenv').config();
const puppeteer = require('puppeteer');

const launchOptions = {
  headless: "new", // Updated for newer Puppeteer versions
  defaultViewport: { width: 1920, height: 1440 },
  args: [`--window-size=1920,1440`],
};

let browser;

async function initBrowser() {
  if (!browser) {
    browser = await puppeteer.launch(launchOptions);
  }
}

(async () => { await initBrowser(); })();

const sessionid = process.env.DEEPAI_SESSION_ID;

const upscale = async (urls) => {
  if (!browser) await initBrowser();
  
  const page = await browser.newPage();
  // page.setDefaultTimeout(30000); // Optional: keep if site is slow

  await page.setCookie({
    'name': 'sessionid',
    'value': sessionid,
    'domain': '.deepai.org'
  });

  let fixedUrls = [];

  try {
    await page.goto('https://deepai.org/machine-learning-model/torch-srgan', { waitUntil: 'domcontentloaded' });
    console.log('Upscaler navigated');

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    await sleep(3000);

    const element = await page.$('.css-47sehv');
    if(element) await page.click('.css-47sehv');

    await page.waitForSelector('.switchToUrlUploadButton');  
    await page.click('.switchToUrlUploadButton');
  
    for(const urlText of urls) {
      await page.type('.model-input-url-input', urlText);
      await sleep(1000);
      await page.click('#modelSubmitButton');

      const initialSrc = await page.evaluate(() => {
        const img = document.querySelector('.try-it-result-area img');
        return img ? img.src : null;
      });

      let currentSrc = initialSrc;
      
      let attempts = 0;
      while(currentSrc === initialSrc && attempts < 60) { // Add safety break
        const result = await page.evaluate(() => {
           const img = document.querySelector('.try-it-result-area img');
           const modal = document.querySelector('#subscription-modal');
           const isVisible = modal && getComputedStyle(modal).display !== 'none';
           return { currentSrc1: img.src, isElementVisible: isVisible };
        });
        
        currentSrc = result.currentSrc1;

        if(result.isElementVisible) {
          await page.click('.info'); // Close modal if it appears
          await sleep(100);
          await page.click('#modelSubmitButton');
        }
        await sleep(300);
        attempts++;
      }

      const updatedImageUrl = await page.evaluate(() => {
        document.querySelector('.model-input-url-input').value = ''; // clear input
        return document.querySelector('.try-it-result-area img').src;
      });

      console.log('Upscaled URL:', updatedImageUrl);
      fixedUrls.push(updatedImageUrl);
    }
  } catch (error) {
    console.error('Upscale error:', error);
  } finally {
    await page.close();
    return fixedUrls;
  }
};

exports.upscale = upscale;