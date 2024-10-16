import fs from 'fs';
import path from 'path';
import { EmbedBuilder } from 'discord.js';
import { fileURLToPath } from 'url';
import { saveAppleJsonFile, saveFashionBoxJsonFile } from './MSCrawler.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Load JSON data
const fashionDataPath= path.join(dirname, '..', 'json', 'FashionBoxProbabilityTable.json');
const appleDataPath=path.join(dirname, '..', 'json', 'GoldAppleProbabilityTable.json');

let fashionData={};
let appleData={};

const loadData = async () => {
    if (fs.existsSync(fashionDataPath)) {
        fashionData = JSON.parse(fs.readFileSync(fashionDataPath, 'utf-8'));
    } else {
        console.log('FashionBoxProbabilityTable.json 不存在，執行爬蟲...');
        await saveFashionBoxJsonFile();
        fashionData = JSON.parse(fs.readFileSync(fashionDataPath, 'utf-8'));
    }

    if (fs.existsSync(appleDataPath)) {
        appleData = JSON.parse(fs.readFileSync(appleDataPath, 'utf-8'));
    } else {
        console.log('GoldAppleProbabilityTable.json 不存在，執行爬蟲...');
        await saveAppleJsonFile();
        appleData = JSON.parse(fs.readFileSync(appleDataPath, 'utf-8'));
    }
};

// 初始載入資料
await loadData();

// 監聽檔案變化
fs.watchFile(fashionDataPath, (curr, prev) => {
    console.log(`${fashionDataPath} 檔案已更新。`);
    loadData(); // 重新載入資料
});

fs.watchFile(appleDataPath, (curr, prev) => {
    console.log(`${appleDataPath} 檔案已更新。`);
    loadData(); // 重新載入資料
});

export function createFashionBoxEmbed() {
    const fashionBoxProbabilityTableDate = Object.keys(fashionData).pop();
    const fashionBoxChanceDict = fashionData[fashionBoxProbabilityTableDate].table;

    const maxLength = Math.max(...Object.keys(fashionBoxChanceDict).map(unit => unit.length));

    const fashionBoxTable = [];
    let totalChance = 0;

    for (const [unit, value] of Object.entries(fashionBoxChanceDict)) {
        const formattedUnit = unit.padEnd(maxLength).replace(/ /g, '\u2003');
        fashionBoxTable.push(`${formattedUnit}: ${(value * 100).toFixed(2)}%`);
        totalChance += value;
    }

    const fashionBoxValue = '```autohotkey\n' + fashionBoxTable.join('\n') + '\n```';

    const startTime = fashionData[fashionBoxProbabilityTableDate].starttime;
    const endTime = fashionData[fashionBoxProbabilityTableDate].endtime;

    const embed = new EmbedBuilder()
        .setTitle('**時尚隨機箱**')
        .setDescription(`開始時間 : ${startTime}\n結束時間 : ${endTime}`)
        .setColor(0xfbe222)
        .addFields({ name: '**機率表**', value: fashionBoxValue, inline: false })
        .setFooter({ text: `大獎總機率: ${(totalChance * 100).toFixed(2)}%` });

    return embed;
}

export function createAppleEmbed() {
    const appleProbabilityTableDate = Object.keys(appleData).pop();

    const appleChanceDict = appleData[appleProbabilityTableDate].appletable;
    const boxChanceDict = appleData[appleProbabilityTableDate].boxtable;

    const maxLength1 = Math.max(...Object.keys(appleChanceDict).map(unit => unit.length));
    const maxLength2 = Math.max(...Object.keys(boxChanceDict).map(unit => unit.length));

    const appleTable = [];
    let totalChance1 = 0;

    for (const [unit, value] of Object.entries(appleChanceDict)) {
        const formattedUnit = unit.padEnd(maxLength1).replace(/ /g, '\u2003');
        appleTable.push(`${formattedUnit}: ${(value * 100).toFixed(2)}%`);
        totalChance1 += value;
    }

    const appleValue = '```autohotkey\n' + appleTable.join('\n') + '\n```';

    const boxTable = [];
    let totalChance2 = 0;

    for (const [unit, value] of Object.entries(boxChanceDict)) {
        const formattedUnit = unit.padEnd(maxLength2).replace(/ /g, '\u2003');
        boxTable.push(`${formattedUnit}: ${(value * 100).toFixed(2)}%`);
        totalChance2 += value;
    }

    const boxValue = '```autohotkey\n' + boxTable.join('\n') + '\n```';

    const startTime = appleData[appleProbabilityTableDate].starttime;
    const endTime = appleData[appleProbabilityTableDate].endtime;

    const embed = new EmbedBuilder()
        .setTitle('**黃金蘋果**')
        .setDescription(`開始時間 : ${startTime}\n結束時間 : ${endTime}`)
        .setColor(0xfbe222)
        .addFields(
            { name: '**蘋果機率**', value: appleValue, inline: false },
            { name: '**金箱機率**', value: boxValue, inline: false }
        )
        .setFooter({ text: `蘋果總機率: ${(totalChance1 * 100).toFixed(2)}% 金箱總機率: ${(totalChance2 * 100).toFixed(2)}%` });

    return embed;
}
