import {expect, test} from "@playwright/test";

import {ITEMNAV_CLOSE_BUTTON, ITEMNAV_OPEN_BUTTON} from "../DesktopConstants.js";


test("Basic Switch/LED Test", async ({ page }, testInfo) => {
    // Remove OS extension from snapshot file name
    testInfo.snapshotSuffix = "";

    // await page.goto("http://opencircuits.io/");
    await page.goto("http://localhost:3000/");

    const main = page.locator("main");
    await expect(main).toBeVisible();

    // Open itemnav
    await main.click({
        position: ITEMNAV_OPEN_BUTTON,
    });
    // toHaveScreenshot skips the css opening animation
    await expect(main).toHaveScreenshot("itemnavOpen.png");

    // TODO: Figure out why drag and drop doesn't work
    // await page.dragAndDrop("nav >> text=Button >> button", "main", {
    //     targetPosition: {
    //         x: 400,
    //         y: 100,
    //     },
    // });
    await page.locator("nav >> text=Switch >> button").click();
    await main.click({
        position: {
            x: 400,
            y: 200,
        },
    });
    await expect(main).toHaveScreenshot("switchPlaced.png");

    await page.locator("nav >> text=LED >> button").click();
    await main.click({
        position: {
            x: 600,
            y: 200,
        },
    });
    await expect(main).toHaveScreenshot("ledPlaced.png");

    // Close itemnav
    await main.click({
        position: ITEMNAV_CLOSE_BUTTON,
    });
    await expect(main).toHaveScreenshot("itemnavClosed.png");

    // Connect components
    await main.click({
        position: {
            x: 465,
            y: 200,
        },
    });
    await main.click({
        position: {
            x: 600,
            y: 300,
        },
    });
    await expect(main).toHaveScreenshot("connectedOff.png");

    // Toggle on and off
    await main.click({
        position: {
            x: 400,
            y: 200,
        },
    });
    await expect(main).toHaveScreenshot("connectedOn.png");
    await main.click({
        position: {
            x: 400,
            y: 200,
        },
    });
    await expect(main).toHaveScreenshot("connectedOff.png");
});
