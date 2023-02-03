import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const pathToData = path.join(__dirname, "weatherdata.json");

let data = null;
async function scrape() {
  const browser = await puppeteer.launch({ dumpio: true });
  const page = await browser.newPage();

  await page.goto(
    "https://weather.com/weather/tenday/l/Austin+TX?canonicalCityId=14bfa21beb1bfe8c8d8dbc074f27e187616b7c9ecab43c6e42238e2ed1a5be47"
  );

  const weatherData = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(".DaypartDetails--DayPartDetail--2XOOV"),
      (e) => ({
        date: e.querySelector("h3").innerText,
        highTemp: e.querySelector(".DetailsSummary--highTempValue--3PjlX")
          .innerText,
        lowTemp: e.querySelector(".DetailsSummary--lowTempValue--2tesQ")
          .innerText,
        precipitationPercentage: e.querySelector(
          ".DetailsSummary--precip--1a98O"
        ).innerText,
      })
    )
  );

  await browser.close();
  return weatherData;
}

// execute and persist data
scrape().then(() => {
  // persist data
  fs.writeFileSync(path.resolve(pathToData), JSON.stringify(data, null, 2));
});
