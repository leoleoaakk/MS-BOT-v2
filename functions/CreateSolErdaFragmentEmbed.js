import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EmbedBuilder } from 'discord.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const HexaNodesCostPath = path.join(dirname ,'..','json', 'HexaNodesCost.json');
const HexaNodesCost = JSON.parse(fs.readFileSync(HexaNodesCostPath, 'utf-8'));

// 計算碎片
function calculateFragment(SkillNodes1, MasteryNodes1, MasteryNodes2, BoostNode1, BoostNode2, BoostNode3, BoostNode4, CommonNode1, extrafragment) {
    let maxTotal = 0;
    let totalCount = 0;

    if (SkillNodes1 >= 0) {
        maxTotal += 4400;
        totalCount += HexaNodesCost.SkillNodes.solerdafragment.slice(0, SkillNodes1).reduce((a, b) => a + b, 0);
    }
    if (MasteryNodes1 >= 0) {
        totalCount += HexaNodesCost.MasteryNodes.solerdafragment.slice(0, MasteryNodes1).reduce((a, b) => a + b, 0);
        maxTotal += 2252;
    }
    if (MasteryNodes2 >= 0) {
        totalCount += HexaNodesCost.MasteryNodes.solerdafragment.slice(0, MasteryNodes2).reduce((a, b) => a + b, 0);
        maxTotal += 2252;
    }
    if (BoostNode1 >= 0) {
        totalCount += HexaNodesCost.BoostNodes.solerdafragment.slice(0, BoostNode1).reduce((a, b) => a + b, 0);
        maxTotal += 3383;
    }
    if (BoostNode2 >= 0) {
        totalCount += HexaNodesCost.BoostNodes.solerdafragment.slice(0, BoostNode2).reduce((a, b) => a + b, 0);
        maxTotal += 3383;
    }
    if (BoostNode3 >= 0) {
        totalCount += HexaNodesCost.BoostNodes.solerdafragment.slice(0, BoostNode3).reduce((a, b) => a + b, 0);
        maxTotal += 3383;
    }
    if (BoostNode4 >= 0) {
        totalCount += HexaNodesCost.BoostNodes.solerdafragment.slice(0, BoostNode4).reduce((a, b) => a + b, 0);
        maxTotal += 3383;
    }
    if (CommonNode1 >= 0) {
        totalCount += HexaNodesCost.CommonNodes.solerdafragment.slice(0, CommonNode1).reduce((a, b) => a + b, 0);
        maxTotal += 6268;
    }

    totalCount += extrafragment;

    return { totalCount, maxTotal };
}

// 創建進度嵌入
export async function createSolErdaFragment(SkillNodes1, MasteryNodes1, MasteryNodes2, BoostNode1, BoostNode2, BoostNode3, BoostNode4, CommonNode1, extrafragment) {
    // 確保所有節點等級都在有效範圍內
    const nodes = [SkillNodes1, MasteryNodes1, BoostNode1, BoostNode2, BoostNode3, BoostNode4];
    for (const node of nodes) {
        if (node < -30 || node > 30) {
            const errorEmbed = new EmbedBuilder()
                .setTitle("等級輸入錯誤")
                .setDescription("必須填入-30~30之間的數")
                .setColor(0xff0000);
            return errorEmbed;
        }
    }


    const { totalCount, maxTotal } = calculateFragment(
        SkillNodes1,
        MasteryNodes1,
        MasteryNodes2,
        BoostNode1,
        BoostNode2,
        BoostNode3,
        BoostNode4,
        CommonNode1,
        extrafragment
    );

    const percentage = (totalCount / maxTotal) * 100;
    const percentageMsg = `${totalCount}/${maxTotal} (${percentage.toFixed(2)}%)`;

    // 計算進度條的長度
    const progressLength = 20;
    const progress = Math.min(Math.floor((totalCount / maxTotal) * progressLength), 20);
    const progressBar = '▓'.repeat(progress) + '░'.repeat(progressLength - progress);

    //console.log(progress+" "+progressBar+" "+percentageMsg);
    // 構建嵌入
    let embed = new EmbedBuilder()
        .setTitle("**靈魂艾爾達碎片進度**")
        .setColor(0x6f00d2);

    /*const now = new Date();
    const probability = (now.getMonth() === 3 && now.getDate() === 1) ? 0.99 : 0.01;
    let stolenFragments = 0;
    
    if (Math.random() < probability) {
        stolenFragments += totalCount;

        embed.addFields({ name: `你原本的進度是${percentage.toFixed(2)}%`, value: "但***邪惡***的蟲蟲把他們都偷走了", inline: false });
    }*/

    embed.addFields(
        { name: `當前進度：${percentageMsg}`, value: progressBar, inline: false },
        { name: "技能核心", value: `\`\`\`autohotkey\n技能核心 : ${SkillNodes1}\n\`\`\``, inline: false },
        { name: "精通核心", value: `\`\`\`autohotkey\n精通核心1 : ${MasteryNodes1}\n精通核心2 : ${MasteryNodes2}\n\`\`\``, inline: false },
        { name: "強化核心", value: `\`\`\`autohotkey\n強化核心1 : ${BoostNode1}\n強化核心2 : ${BoostNode2}\n強化核心3 : ${BoostNode3}\n強化核心4 : ${BoostNode4}\n\`\`\``, inline: false },
        { name: "共用核心", value: `\`\`\`autohotkey\n共用核心1 : ${CommonNode1}\n\`\`\``, inline: false },
        //{ name: `蟲蟲已經累計偷走了${stolenFragments.toLocaleString()}個碎片`, value: "請保護好你的碎片", inline: false }
    );

    embed.setFooter({ text: `預留碎片 : ${extrafragment}` });
    embed.setThumbnail('https://cdn.discordapp.com/emojis/1196836355225952336.webp?size=96&quality=lossless');
    return embed;
}