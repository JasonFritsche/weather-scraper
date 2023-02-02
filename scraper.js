async function scrape() {
  const browser = await puppeteer.launch({ dumpio: true });
  const page = await browser.newPage();

  await page.goto("https://weather.com/weather/tenday/l/Austin+TX");

  const weatherData = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(".DaypartDetails--DayPartDetail--2XOOV"),
      (e) => ({
        date: e.querySelector("h3").innerText,
      })
    )
  );

  await browser.close();
  return weatherData;
}

const scrapedData = await scrape();
console.log(scrapedData);
