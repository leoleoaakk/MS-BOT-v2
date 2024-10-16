import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { setTimeout } from "node:timers/promises";
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

async function getWebsiteData(page) {
    const browser = await puppeteer.launch({ headless: true });
    const pageInstance = await browser.newPage();
    try {
        await pageInstance.goto(`https://tw-event.beanfun.com/MapleStory/eventad/EventAD.aspx?EventADID=${page}`);
        //await pageInstance.waitForTimeout(10000); // 等待網頁加載完成
        await setTimeout(10000);

        //const pageContent = await pageInstance.content();
        //const eventTimeText = pageContent;
        const eventTimeText = await pageInstance.evaluate(() => document.body.innerText);

        const regex = /(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2})\s*~\s*(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2})/;
        const match = eventTimeText.match(regex);
        //console.log(match);

        let eventStartTime = '2000/01/01 00:00';
        let eventEndTime = '2999/12/31 23:59';
        if (match) {
            [eventStartTime, eventEndTime] = match.slice(1);
        }

        // 檢查是否包含錯誤消息
        if (eventTimeText.includes('抱歉') || eventTimeText.includes('Error')) {
            throw new Error('Page not found or error occurred.');
        }

        const tableData = await pageInstance.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('table tr'));
            return rows.map(row => {
                const cells = Array.from(row.querySelectorAll('td'));
                return cells.map(cell => cell.innerText.trim());
            });
        });

        // 檢查 tableData 是否有效
        if (tableData.length === 0 || !tableData[0] || tableData[0][0] !== '道具名稱') {
            throw new Error('Invalid table data.');
        }

        //console.log(tableData);

        await browser.close();
        return { eventStartTime, eventEndTime, tableData };
    } catch (error) {
        console.error(`Error while fetching data for page ${page}:`, error);
        return { eventStartTime:'2000/01/01 00:00' , eventEndTime:'2999/12/31 23:59', tableData: [] }; // 返回空數據
    } finally {
        await browser.close();
    }
}

async function getGoldAppleData() {
    const page = 8369;
    const { eventStartTime, eventEndTime, tableData } = await getWebsiteData(page);

    //console.log(tableData);
    const appleDataJson = {};
    const boxDataJson = {};
    let isAppleTable = true;

    if (!eventStartTime || !eventEndTime || tableData.length === 0) {
        console.warn('沒有抓到data，跳過Gold Apple');
        return { eventStartTime, eventEndTime, appleDataJson, boxDataJson };
    }

    for (const table of tableData) {
        const prize = table[0].trim();
        const chanceStr = table[1].trim();

        // 忽略標題行和空項目
        if (prize === '道具名稱' || chanceStr === '') continue;

        const chance = parseFloat(chanceStr.replace('%', '')) / 100 || 0;

        if (isAppleTable) {
            if (prize === '漆黑的BOSS飾品碎片') {
                isAppleTable = false; // 停止抓取 apple table，切換到 box table
                continue; // 繼續抓取下一個項目
            }
            if (prize && !isNaN(chance)) {
                appleDataJson[prize] = parseFloat(chance.toFixed(5));
            }
        } else if (appleDataJson[prize] !== undefined) {
            if (prize && !isNaN(chance)) {
                boxDataJson[prize] = parseFloat(chance.toFixed(5));
            }
        }
    }
    //console.log(appleDataJson);
    //console.log(boxDataJson);
    return { eventStartTime, eventEndTime, appleDataJson, boxDataJson };
}

async function getFashionBoxData() {
    const page = 8373;
    const { eventStartTime, eventEndTime, tableData } = await getWebsiteData(page);

    const dataDict = {};
    if (!eventStartTime || !eventEndTime || tableData.length === 0) {
        console.warn('沒有抓到data，跳過Fashion Box');
        return { eventStartTime, eventEndTime, dataDict };
    }
    let lastChance = null;
    //console.log(tableData);
    for (const table of tableData) {
        const prize = table[0].trim();
        const chanceStr = table[1] !== undefined ? table[1].trim() : undefined; // 確保機率存在
        if (prize === '道具名稱' || chanceStr === '') continue;

        // 如果機率格是空的，使用上一次的機率
        let chance = chanceStr ? parseFloat(chanceStr.replace('%', '')) / 100 : lastChance;

        // 更新上一次的機率
        if (chanceStr) {
            lastChance = chance;
        }
        if (prize === '普通彩色稜鏡') break;
        //const chance = parseFloat(table[1].replace('%', '')) / 100 || 0;
        dataDict[prize] = parseFloat(chance.toFixed(5));

    }

    return { eventStartTime, eventEndTime, dataDict };
}

export async function formatFashionBoxPrizeData() {
    const { eventStartTime, eventEndTime, dataDict } = await getFashionBoxData();
    const dateKey = eventStartTime.replace(/\//g, '').split(' ')[0];

    const formattedData = {
        [dateKey]: {
            starttime: eventStartTime,
            endtime: eventEndTime,
            table: dataDict
        }
    };

    console.log(JSON.stringify(formattedData, null, 2));
    return formattedData;
}

export async function formatApplePrizeData() {
    const { eventStartTime, eventEndTime, appleDataJson, boxDataJson } = await getGoldAppleData();
    const dateKey = eventStartTime.replace(/\//g, '').split(' ')[0];

    const formattedData = {
        [dateKey]: {
            starttime: eventStartTime,
            endtime: eventEndTime,
            appletable: appleDataJson,
            boxtable: boxDataJson
        }
    };

    console.log(JSON.stringify(formattedData, null, 2));
    return formattedData;
}

async function saveJsonFile(formattedData, filename) {
    let existingData = {};
    const filePath = path.join(dirname, '..', 'json', filename);

    if (fs.existsSync(filePath)) {
        existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const dateKey = Object.keys(formattedData)[0];
        if (existingData[dateKey]) {
            console.log('Data already exists in the file.');
            //return 'Data already exists in the file.';
            return false; //沒有更新
        }
        Object.assign(existingData, formattedData);
    } else {
        existingData = formattedData;
    }

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf-8');
    console.log('Data saved to the file.');
    //return 'Data saved to the file.';
    return true; //有更新
}

export async function saveAppleJsonFile() {
    const formattedData = await formatApplePrizeData();
    return await saveJsonFile(formattedData, 'GoldAppleProbabilityTable.json');
}

export async function saveFashionBoxJsonFile() {
    const formattedData = await formatFashionBoxPrizeData();
    return await saveJsonFile(formattedData, 'FashionBoxProbabilityTable.json');
}

