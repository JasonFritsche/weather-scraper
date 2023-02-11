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
      dayOfMonth: e.querySelector("td > div.text-left > .fct-day-of-month")
        .innerText,
      dayName: e.querySelector("td > div.text-left > .fct-day-of-week")
        .innerText,
      weatherIcon: e.querySelector("td.text-center > .fct_daily_icon")
        .classList[1],
      weatherIconPercent: e
        .querySelector("td.text-center")
        .getElementsByTagName("div")[1].innerText,
      highTempRange: e.querySelector(
        "td.text-center > .F > div > .label-danger"
      ).innerText,
      lowTempRange: e
        .querySelector("td.text-center > .F")
        .getElementsByTagName("div")[1].innerText,
    }))
  );

  await browser.close();
  return weatherData;
}

// execute and persist data
scrape().then(() => {
  // persist data
  fs.writeFileSync(path.resolve(pathToData), JSON.stringify(data, null, 2));
});
