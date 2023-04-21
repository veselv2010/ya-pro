import { YaProScraper } from "./YaProScraper";

import * as fs from "fs";
import * as csv from "json-2-csv";

const city = process.argv[2];
const scraper = new YaProScraper(city);

const main = async () => {
  const res = await scraper.load();
  console.log(res);

  const table = await csv.json2csv(res);
  await fs.writeFile("./" + city + ".json", JSON.stringify(res), (err) => {});
  await fs.writeFile("./" + city + ".csv", table, (err) => {});
};

main();
