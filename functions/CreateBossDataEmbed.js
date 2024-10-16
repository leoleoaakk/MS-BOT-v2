import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

import { EmbedBuilder } from 'discord.js';

// Boss aliases
const bossAliases = {
    '巴洛古': '巴洛古',
    '殘暴炎魔': '殘暴炎魔',
    '炎魔': '殘暴炎魔',
    '梅格耐斯': '梅格耐斯',
    '西拉': '希拉',
    '希拉': '希拉',
    '卡翁': '卡翁',
    '拉圖斯': '拉圖斯',
    '森蘭丸': '森蘭丸',
    '比艾樂': '比艾樂',
    '斑斑': '斑斑',
    '血腥皇后': '血腥皇后',
    '皇后': '血腥皇后',
    '貝倫': '貝倫',
    '凡雷恩': '凡雷恩',
    '暗黑龍王': '闇黑龍王',
    '闇黑龍王': '闇黑龍王',
    '阿卡伊農': '阿卡伊農',
    '皮卡啾': '皮卡啾',
    '西格諾斯': '西格諾斯',
    '培羅德': '培羅德',
    '濃姬': '濃姬',
    '史烏': '史烏',
    '使烏': '史烏',
    '戴米安': '戴米安',
    '守護天使綠水靈': '守護天使綠水靈',
    '露希妲': '露希妲',
    '露希達': '露希妲',
    '露西妲': '露希妲',
    '威爾': '威爾',
    '戴斯克': '戴斯克',
    '真希拉': '真希拉',
    '頓凱爾': '頓凱爾',
    '盾凱爾': '頓凱爾',
    '黑魔法師': '黑魔法師',
    '受選的賽蓮': '受選的賽蓮',
    '賽蓮': '受選的賽蓮',
    '監視者卡洛斯': '監視者卡洛斯',
    '卡洛斯': '監視者卡洛斯',
    '咖凌': '咖凌',
    '林波': '林波',
    '蟲蟲': '蟲蟲'
};

// Load boss data from JSON file
const bossDataPath = path.join(dirname, '..', 'json', 'BossData.json');
let bossData;
fs.readFile(bossDataPath, 'utf-8', (err, data) => {
    if (err) throw err;
    bossData = JSON.parse(data);
});

// Create boss data embed
export function createBossDataEmbed(bossname, difficulty) {
    const bossName = bossAliases[bossname];

    if (!bossData[bossName]) return null;

    const subtitles = Object.keys(bossData[bossName]);
    const selectedMode = subtitles[difficulty];
    const bossInfo = bossData[bossName][selectedMode];
    console.log(bossInfo);

    const entryLevel = bossInfo.EntryLevel || 0;
    const timeLimit = bossInfo.Timelimit || 0;
    const potionCooldown = bossInfo.PotionCoolDown || 0;
    const deathCount = bossInfo.DeathCount || 0;
    const specialKill = bossInfo.SpecialKill || 0;
    const deathPrint = specialKill ? `${deathCount} (💥機制殺)` : `${deathCount}`;
    const completeCount = bossInfo.CompleteCount || "";
    const defense = bossInfo.Defense || "";
    const useArcAut = bossInfo.UseArcorAUT || "";
    
    const stages = [
        bossInfo["1stStage"] || {},
        bossInfo["2ndStage"] || {},
        bossInfo["3rdStage"] || {},
        bossInfo["4thStage"] || {},
        bossInfo["5thStage"] || {}
    ].map(stage => Object.entries(stage).map(([k, v]) => `LV. ${k}：${v}`).join('\n'));

    const mainDrop = bossInfo.MainDrop || "";
    const subDrop = bossInfo.SubDrop || [];
    const cubeDrop = bossInfo.CubeDrop || "";
    const glowingSoulCrystal = bossInfo.GlowingSoulCrystal || 0;

    let arcaneAuthentic = "";
    if (useArcAut === "Arcane") {
        arcaneAuthentic = `\n🌌祕法力量：${bossInfo.Arcane || ''}`;
    } else if (useArcAut === "Authentic") {
        arcaneAuthentic = `\n🌌真實力量：${bossInfo.Authentic || ''}`;
    }

    const subDropItems = [];
    for (let i = 0; i < subDrop.length; i += 3) {
        subDropItems.push(subDrop.slice(i, i + 3).join(' '));
    }
    const subDropDescription = subDropItems.join('\n') + `\n${cubeDrop}`;
    const mainDropDescription = mainDrop.join('\n');

    const embed = new EmbedBuilder()
        .setTitle(`**${bossName}(${selectedMode})**`)
        .setDescription(`🚩入場等級：${entryLevel}\n⌛時間限制：${timeLimit}mins\n🧪藥水冷卻：${potionCooldown}sec\n💀死亡次數：${deathPrint}\n📆完成次數：${completeCount}${arcaneAuthentic}\n🛡怪物防禦：${defense}\n${'-'.repeat(40)}`)
        .setColor(0xfbe200)
        .setFooter({ text: '資料引用自hsiliya/zxcvll1379' })
        .addFields({ name: "> 🩸__**BOSS血量**__", value: "\n", inline: false });

    const stageCount = ["第一階段", "第二階段", "第三階段", "第四階段", "第五階段"];
    stages.forEach((stage, index) => {
        if (stage) {
            embed.addFields({ name: stageCount[index], value: stage, inline: true });
        }
    });
    embed.addFields({ name: "> 💎__**獎勵**__", value: "\n", inline: false });
    embed.addFields({ name: "🎁__主要掉落物__", value: mainDropDescription, inline: true });
    embed.addFields({ name: "🎁__其他掉落物__", value: subDropDescription, inline: true });
    embed.addFields({ name: "💰結晶石", value: glowingSoulCrystal.toLocaleString(), inline: true });

    return embed;
}

// Get difficulty value
export function getDifficultyValue(bossname, difficulty) {
    const difficulties = Object.keys(bossData[bossname]);
    const translated = translateDifficulty(difficulty);
    
    for (const value of difficulties) {
        if (Array.isArray(translated) && translated.includes(value)) {
            return [difficulties.indexOf(value), false];
        }
    }
    return [null, true];
}

// Translate difficulty
export function translateDifficulty(difficulty) {
    const translations = {
        "easy": ["簡單", "初級模式"],
        "normal": ["普通", "中級模式"],
        "hard": ["困難", "混沌", "高級模式"],
        "extreme": ["極限", "終極", "頂級模式"],
    };
    return translations[difficulty];
}
