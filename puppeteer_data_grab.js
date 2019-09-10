const puppeteer = require('puppeteer');

function run() {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://u.gg/lol/tier-list?role=support");
      await page.click('#qcCmpButtons > button:nth-child(2)');
      await page.waitForSelector("strong.champion-name");
      let urls = await page.evaluate(() => {
        let results = [];
        let ranks = Array.prototype.slice.apply(document.querySelectorAll('div.rt-td.rank'));
        let roles = Array.prototype.slice.apply(document.querySelectorAll('img.tier-list-role'));
        let champions = Array.prototype.slice.apply(document.querySelectorAll('strong.champion-name'));
        let tiers = Array.prototype.slice.apply(document.querySelectorAll('div.rt-td.tier'));
        let winrates = Array.prototype.slice.apply(document.querySelectorAll('div.rt-td.winrate.highlight'));
        let pickrates = Array.prototype.slice.apply(document.querySelectorAll('div.rt-td.pickrate'));
        let banrates = Array.prototype.slice.apply(document.querySelectorAll('div.rt-td.banrate'));
        let matches_played = Array.prototype.slice.apply(document.querySelectorAll('div.rt-td.matches'));
        for(var i = 0; i < champions.length; i++) {
          results.push({
            rank: ranks[i].textContent,
            role: roles[i].getAttribute('alt'),
            champion: champions[i].textContent,
            tier: tiers[i].textContent,
            winrate: winrates[i].textContent,
            pickrate: pickrates[i].textContent,
            banrate: banrates[i].textContent,
            matches_played: matches_played[i].textContent
          });
        };
        return results;
      });
      browser.close();
      return resolve(urls);
    } catch (e) {
      return reject(e);
    }
  })
}

run().then(console.log).catch(console.error);