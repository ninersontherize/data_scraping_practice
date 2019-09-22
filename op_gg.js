const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://na.op.gg/summoner/userName=';
const USERNAME = process.argv[2];
if (!USERNAME) {
    throw "Please provide a URL as the first argument";
}

(async () => {

  /* Send the request to the user page and get the results */
  let response = await request(`${BASE_URL}${USERNAME}`);

  /* Start processing the response */
  let $ = cheerio.load(response);

  //summoner info
  let summoner = $('span.Name').text();
  let summoner_level = parseInt($('span.Level.tip').text());
  let tierRank = $('div.TierRank').text();
  
  //overall wr + games played
  let wins = $('span.wins').text().split('W')[0];
  let losses = $('span.losses').text().split('L')[0];
  let total_games = parseInt(wins) + parseInt(losses);
  let winratio = parseInt($('span.winratio').text().substr(10, 2));

  //champion specific info - to be defined by interating through champion box
  let champ_info = [];

  $($('div.MostChampionContent').children()).each((i, elm) => {
    champion = $(elm).find('div.ChampionName').attr('title');

    //for some reason first champion is duplicated -> skip over first and read the rest
    if(i > 0) {    
        if(typeof champion !== 'undefined' ) {
            champ_info[i - 1] = {
                champion: champion,
                cspm: parseFloat($(elm).find('div.ChampionMinionKill').text().split('(')[1].split(')')[0]),
                kda: parseFloat($(elm).find('span.KDA').text().split(':')[0]),
                win_ratio: parseInt($(elm).find('div.WinRatio').text().replace(/\s+/g, "").split('%')[0]),
                games_played: parseInt($(elm).find('div.Title').text().split(" ")[0])
            }
        }
    }
  });

  summoner_info = [{ summoner, summoner_level, tierRank, winratio, total_games, champ_info}]

  fs.writeFile(`./exports/summoner_info_${USERNAME}.json`,
                JSON.stringify(summoner_info, null, 4),
                (err) => console.log('File successfully written!'))

})();