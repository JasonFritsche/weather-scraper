import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const pathToData = path.join(__dirname, "weatherdata.json");

let data = null;
async function scrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    "https://www.weathertab.com/en/d/united-states/texas/austin/"
  );

  const weatherData = await page.evaluate(() =>
    Array.from(document.querySelectorAll("tr.fct_day"), (e) => ({
      date: e.querySelector("td > div.text-left > .fct-day-of-month").innerText,
      // highTemp: e.querySelector(".weather-10-day__temperature-high").innerText,
      // lowTemp: e.querySelector(".weather-10-day__temperature-low").innerText,
      // precipitationPercentage: e.querySelector(".weather-10-day__precipitation")
      //   .innerText,
    }))
  );

  await browser.close();
  return weatherData;
}

const scrapedData = await scrape();
console.log(scrapedData);

// execute and persist data
// scrape().then(() => {
//   console.log(data);
//   // persist data
//   // fs.writeFileSync(path.resolve(pathToData), JSON.stringify(data, null, 2));
// });
