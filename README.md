# LOL Data Scraper

This is a web scraper that will scrape data from the analytics site [*u.gg*](https://u.gg).

## Getting started

To get started with the app, you will need Node.js installed on your machine with npm as the package manager, then clone the repo onto a UNIX OS (dependent modules require Mac or Linux as of 9/10/2019) and then install the needed dependencies:

```
$ npm install
```
Upon installation of dependancies using npm installer you should be set to go! Run the single patch with a subpatch as the main argument or the historical with the latest patch as the argument to grab five patches worth of data! For your convenience the json files are included in this repo under tier_lists for the time being, but you are welcome to run them again to test them out

```

$ node u_gg_single_patch 17 --> this will return the tier lists for all positions for patch 9.17

```

$ node u_gg_historical 17 --> this will return the tier lists for all positions for every patch dating back to 9.13

```
