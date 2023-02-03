import puppeteer from "puppeteer";

async function scrape() {
  const browser = await puppeteer.launch({ dumpio: true });
  const page = await browser.newPage();

  await page.goto("https://weather.com/weather/tenday/l/Austin+TX");

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

const scrapedData = await scrape();
console.log(scrapedData);
