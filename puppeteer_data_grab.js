const puppeteer = require('puppeteer');

function run() {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://u.gg/lol/tier-list?role=support");
      await page.click('#qcCmpButtons > button:nth-child(2)');
      let urls = await page.evaluate(() => {
        let body_html = new XMLSerializer().serializeToString(document.doctype) + document.documentElement.outerHTML;
        console.log(body_html);
      });
      browser.close();
      return resolve(urls);
    } catch (e) {
      return reject(e);
    }
  })

}

run().then(console.log).catch(console.error);