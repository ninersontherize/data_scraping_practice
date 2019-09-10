const puppeteer = require('puppeteer');
const fs = require('fs');

function run() {
  return new Promise(async (resolve, reject) => {
    var patch_number = process.argv[2];
    var role_played = ['all_roles', 'top', 'jungle', 'middle', 'adc', 'support'];
    if (!patch_number) {
      throw "Please provide a patch number as the first argument";
    }
    for(var j = 0; j < 6; j++) {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        var url = "https://u.gg/lol/tier-list?role=" + role_played[j] + "&patch=9_" + patch_number
        var filename = "tier_lists/" + role_played[j] + "/tierlist_9_" + patch_number + ".json"
        await page.goto(url);
        await page.click('#qcCmpButtons > button:nth-child(2)');
        await page.waitForSelector("strong.champion-name");
        let tierlist = await page.evaluate(() => {
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
        fs.writeFile(filename, JSON.stringify(tierlist), function(e) {
          if (e) throw e;
          console.log("Saved!");
        });
        console.log("Browser Closed");
      } catch (e) {
        return reject(e);
      }
    } 
  })
}

run();