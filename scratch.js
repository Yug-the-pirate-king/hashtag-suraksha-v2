const puppeteer = require('puppeteer');

(async () => {
  // Launch a new browser instance and create a fresh page.
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set a mobile-like viewport before navigation so layout matches expectations.
  await page.setViewport({ width: 400, height: 800 });

  try {
    // Navigate to the course catalog and wait until the network is idle.
    await page.goto('http://localhost:8080/course-catalog.html?search=test', {
      waitUntil: 'networkidle0',
    });

    // Switch the catalog to list view if the list button is present.
    await page.evaluate(() => {
      document.querySelector('.list-btn')?.click();
    });

    // Wait until at least one course card is rendered and visible.
    await page.waitForSelector('.clean-course-card.card', { visible: true });

    // Collect bounding boxes and computed styles for the first card.
    // Doing everything in a single page.evaluate() keeps browser/server round-trips low.
    const result = await page.evaluate(() => {
      const firstCard = document.querySelector('.clean-course-card.card');
      if (!firstCard) return null;

      // Cache reused DOM lookups to avoid redundant selector traversals.
      const content = firstCard.querySelector('.list-view-content');
      const actions = firstCard.querySelector('.list-col-actions');
      const btnVisit = firstCard.querySelector('.lv-btn-visit');
      const btnHeart = firstCard.querySelector('.row-action');

      // Helper: safely read a bounding rectangle.
      const getRect = (el) => el?.getBoundingClientRect() ?? null;

      // Helper: pluck only the requested computed-style properties.
      const getStyle = (el, props) => {
        if (!el) return null;
        const computed = window.getComputedStyle(el);
        const style = {};
        for (const prop of props) {
          style[prop] = computed[prop];
        }
        return style;
      };

      return {
        rects: {
          card: getRect(firstCard),
          content: getRect(content),
          actions: getRect(actions),
          btnVisit: getRect(btnVisit),
          btnHeart: getRect(btnHeart),
        },
        styles: {
          actions: getStyle(actions, ['display', 'gridColumn']),
          btnVisit: getStyle(btnVisit, ['display', 'gridColumn', 'width', 'flex']),
        },
        // Capture only the first 1000 characters of the card HTML to keep output small.
        cardInnerHtml: firstCard.innerHTML.slice(0, 1000),
      };
    });

    console.log(JSON.stringify(result, null, 2));
  } finally {
    // Always close the browser, even if an error occurs.
    await browser.close();
  }
})();