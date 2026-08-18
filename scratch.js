const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 400, height: 800 });
    await page.goto('http://localhost:8080/course-catalog.html?search=test', { waitUntil: 'networkidle0' });
    
    // Switch to list view
    await page.evaluate(() => {
        const btn = document.querySelector('.list-btn');
        if (btn) btn.click();
    });
    
    // Wait for a card to be visible
    await page.waitForSelector('.clean-course-card.card', { visible: true });

    // get bounding boxes
    const result = await page.evaluate(() => {
        const firstCard = document.querySelector('.clean-course-card.card');
        const content = firstCard.querySelector('.list-view-content');
        const actions = firstCard.querySelector('.list-col-actions');
        const btnVisit = firstCard.querySelector('.lv-btn-visit');
        const btnHeart = firstCard.querySelector('.row-action');
        
        return {
            rects: {
                card: firstCard?.getBoundingClientRect(),
                content: content?.getBoundingClientRect(),
                actions: actions?.getBoundingClientRect(),
                btnVisit: btnVisit?.getBoundingClientRect(),
                btnHeart: btnHeart?.getBoundingClientRect()
            },
            styles: {
                actions: actions ? {
                    display: window.getComputedStyle(actions).display,
                    gridColumn: window.getComputedStyle(actions).gridColumn
                } : null,
                btnVisit: btnVisit ? {
                    display: window.getComputedStyle(btnVisit).display,
                    gridColumn: window.getComputedStyle(btnVisit).gridColumn,
                    width: window.getComputedStyle(btnVisit).width,
                    flex: window.getComputedStyle(btnVisit).flex
                } : null
            },
            cardInnerHtml: firstCard.innerHTML.substring(0, 1000)
        };
    });
    console.log(JSON.stringify(result, null, 2));
    await browser.close();
})();
