import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { setTimeout } from "node:timers/promises";
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

async function getWebsiteData(page) {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const pageInstance = await browser.newPage();
    
    try {
        // 設置較長的超時時間
        await pageInstance.setDefaultNavigationTimeout(60000); // 60 秒
        
        await pageInstance.setViewport({ width: 1366, height: 768 });
        
        console.log('開始加載頁面...');
        await pageInstance.goto(`https://tw-event.beanfun.com/MapleStory/eventad/EventAD.aspx?EventADID=${page}`);
        console.log('頁面加載完成');

        console.log('等待表格元素...');
        await pageInstance.waitForSelector('table');
        console.log('表格元素已找到');

        await pageInstance.waitForFunction(() => document.readyState === 'complete');
        
        await setTimeout(5000);

        const pageContent = await pageInstance.content();
        if (pageContent.includes('抱歉') || pageContent.includes('Error')) {
            throw new Error('Page not found or error occurred.');
        }

        const eventTimeText = await pageInstance.evaluate(() => {
            const allText = document.body.innerText;
            const datePattern = /\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}/g;
            const dates = allText.match(datePattern);
            return dates ? dates.join(' ~ ') : '';
        });

        console.log('提取到的日期文本:', eventTimeText);

        const regex = /(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2})\s*~\s*(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2})/;
        const match = eventTimeText.match(regex);

        let eventStartTime = '2000/01/01 00:00';
        let eventEndTime = '2999/12/31 23:59';
        if (match) {
            [eventStartTime, eventEndTime] = match.slice(1);
        }

        await pageInstance.waitForSelector('table', { timeout: 20000 });
        
        await pageInstance.waitForSelector('table tr', { timeout: 20000 });
        
        await setTimeout(2000);

        const tableData = await pageInstance.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('table tr'));
            if (rows.length === 0) {
                return null; // 如果沒有找到表格行，返回 null
            }
            return rows.map(row => {
                const cells = Array.from(row.querySelectorAll('td'));
                return cells.map(cell => cell.innerText.trim());
            }).filter(row => row.length > 0); // 過濾掉空行
        });

        // 驗證數據
        if (!tableData || tableData.length === 0) {
            throw new Error('No table data found');
        }

        console.log(`成功抓取頁面 ${page} 的數據，共 ${tableData.length} 行`);
        return { eventStartTime, eventEndTime, tableData };

    } catch (error) {
        console.error(`抓取頁面 ${page} 時發生錯誤:`, error.message);
        console.error('完整錯誤:', error);
        return { 
            eventStartTime: '2000/01/01 00:00', 
            eventEndTime: '2999/12/31 23:59', 
            tableData: [] 
        };
    } finally {
        await browser.close();
    }
}

async function getGoldAppleData() {
    const page = 8369;
    const { eventStartTime, eventEndTime, tableData } = await getWebsiteData(page);

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

