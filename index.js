"use strict";
import express from 'express';
import { config } from 'dotenv';
import { commands } from './commands.js';
import { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } from 'discord.js';
//import { EmbedBuilder } from 'discord.js';
//import {Discord} from 'discord.js';
import configData from './config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { create, all } from 'mathjs';
const math = create(all);

const app = express();
const PORT = process.env.PORT || 3000;

const HexaNodesCost = JSON.parse(fs.readFileSync(path.join('json', 'HexaNodesCost.json'), 'utf-8'));

config();
const token = process.env.DISCORD_TOKEN;
const { prefix } = configData;
//const { Discord } = require("discord.js");
//const { prefix } = require('./config.json');

// 註冊斜線命令
const rest = new REST({ version: '9' }).setToken(token);

// 設定斜線命令


(async () => {
    try {
        console.log('開始註冊斜線命令...');

        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: commands,
        });

        console.log('成功註冊斜線命令');
        console.log('已註冊的命令:', commands);
    } catch (error) {
        console.error(error);
    }
})();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],

});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity(`輸入/ 查詢&使用各種指令`);
});

app.get('/', (req, res) => {
    res.send('Bot is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

client.on('interactionCreate', async msg => {
    //if (msg.member.user.bot) return;
    if (!msg.isChatInputCommand()) return;
    try {
        /*if (msg.content.substring(0, prefix[0].length) === prefix[0]) {
            msg.content = msg.content.replace(prefix[0], "");*/
        if (msg.commandName === 'ping') {
            msg.reply('Pong!');
        }

        if (msg.commandName === "好楓寶指令") {
            if (msg.options.getSubcommand() === "戰地") {
                //msg.content = msg.content.replace("戰地 ", "");
                //let keywords = msg.content;
                const characterName = msg.options.getString('角色名');
                const url = "https://tw-event.beanfun.com/MapleStory/api/UnionWebRank/GetRank";


                // 要發送的參數
                const data = {
                    RankType: parseInt(msg.options.getString('排行')),
                    GameWorldId: "-1",
                    CharacterName: characterName,
                };

                const rankingChoices = {
                    '3': '戰地總等級排行',
                    '2': '角色等級排行',
                    '1': '戰鬥力排行'
                };

                let rankingTypeName = rankingChoices[msg.options.getString('排行')];

                // 發送POST請求
                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => response.json())
                    .then((result) => {
                        const Data = result.Data;

                        //判斷是不是自己的公會
                        let GuildJudge = "";
                        if (Data.Guild == "Y-獨孤求敗") {
                            GuildJudge = "這個人是我們的好盟友";
                        }
                        else {
                            GuildJudge = "";
                        }

                        //隨機邊框顏色
                        let colorStr = "#" + Math.floor(Math.random() * 16777215).toString(16);
                        //256*256*256=16777216, 從0開始, 因此為16777215

                        //嵌入式訊息
                        const exampleEmbed = new EmbedBuilder()
                            .setColor(colorStr)
                            .setTitle(Data.CharacterName)
                            .setAuthor({ name: Data.GameWorldName, icon: Data.GameWorldImageUrl })
                            .setDescription(GuildJudge)
                            .setThumbnail(Data.CharacterLookUrl)
                            .addFields(
                                { name: '等級', value: String(Data.UnionLevel), inline: true },
                                { name: '職業', value: String(Data.JobName), inline: true },
                                { name: '公會', value: String(Data.Guild) },
                                { name: '戰地等級', value: String(Data.UnionTotalLevel), inline: true },
                                { name: '戰鬥力', value: String(separator(Data.UnionDPS)), inline: true },
                                { name: '戰地硬幣', value: String(parseInt(Data.UnionDPS / 1251251.26)), inline: true },
                                { name: rankingTypeName, value: String(Data.Rank) },
                            )
                            .setTimestamp()
                            .setFooter({ text: '聯盟戰地排行', iconURL: 'https://i.imgur.com/b6EUgCt.png' });

                        console.log(result);
                        msg.reply({ embeds: [exampleEmbed] });
                    })
                    .catch((error) => {
                        console.error("Error:", error)
                        msg.reply("查無此角色ID或是伺服器忙線中");
                    });
            }

            if (msg.options.getSubcommand() === '碎片進度') {
                const skillnodes1 = parseInt(msg.options.getString('技能核心'));
                const masterynodes1 = parseInt(msg.options.getString('精通核心1'));
                const masterynodes2 = parseInt(msg.options.getString('精通核心2'));
                const boostnode1 = parseInt(msg.options.getString('強化核心1'));
                const boostnode2 = parseInt(msg.options.getString('強化核心2'));
                const boostnode3 = parseInt(msg.options.getString('強化核心3'));
                const boostnode4 = parseInt(msg.options.getString('強化核心4'));
                const commonnode1 = parseInt(msg.options.getString('共用核心1'));
                const extrafragment = parseInt(msg.options.getString('碎片數量')) || 0;

                console.log(skillnodes1+" "+masterynodes1+" "+masterynodes2+" "+boostnode1+" "+boostnode2+" "+boostnode3+" "+boostnode4+" "+commonnode1+" "+extrafragment);

                const embed = await createSolErdaFragment(
                    skillnodes1,
                    masterynodes1,
                    masterynodes2,
                    boostnode1,
                    boostnode2,
                    boostnode3,
                    boostnode4,
                    commonnode1,
                    extrafragment
                );

                
                await msg.reply({ embeds: [embed] });
                //await msg.reply(embed.totalCount + " " + embed.maxTotal);

            }
        }


        if (msg.commandName === "曬卡") {
            const q = [3, 20, 100];
            let e = ["<:anyapride:1043167915085672528>",
                "<:anyaGold:1043167887482945626>",
                "<:anya:967336847233679360>"];
            let t = "";
            let s = 0;

            let textDrawCard = msg.options.getString('敘述') || '';
            let choice = msg.options.getString('選擇');

            if (choice === 'probability') {
                let pride = q[0];
                let gold = q[1] - q[0];
                let normal = q[2] - q[1];
                await msg.reply(`彩色 ${pride}% 金色 ${gold}% 普通 ${normal}%`);
                return;
            }

            if (textDrawCard.includes("作弊")) {
                for (let i = 0; i < 10; i++) {
                    t += e[0];
                }
                let response = `${msg.member.displayName} -> 作弊\n${t}\n(保底十彩)`;
                await msg.reply(response);
            } else {
                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (Math.random() * 100 < q[j]) {
                            s += j;
                            if (s == 20)
                                t += e[1];
                            else
                                t += e[j];
                            break;
                        }
                    }
                }
                let response = (`${msg.member.displayName} -> ${textDrawCard}\n${t}`);
                if (s > 18)
                    response += "(保底)";
                await msg.reply(response);
            }
        }

        if (msg.commandName === "aris") {
            let R = Math.floor(Math.random() * 9);
            R = parseInt(R);
            if (R === 0)
                await msg.reply("https://media1.tenor.com/m/BjPnBRcCPwcAAAAd/arisu-aris.gif");
            else if (R === 1)
                await msg.reply("https://media1.tenor.com/m/GsRRxufjC1EAAAAC/arisu-alice.gif");
            else if (R === 2)
                await msg.reply("https://media1.tenor.com/m/JyHMlpMxRKwAAAAC/arisbm.gif");
            else if (R === 3)
                await msg.reply("https://media1.tenor.com/m/1p2LS_qMotYAAAAC/arisu-scared.gif");
            else if (R === 4)
                await msg.reply("https://media1.tenor.com/m/96m6Vv9m_kIAAAAd/arisu-maid.gif");
            else if (R === 5)
                await msg.reply("https://media1.tenor.com/m/8V5V_q7X1TsAAAAC/arisu-aris.gif");
            else if (R === 6)
                await msg.reply("https://media1.tenor.com/m/Rw8RS3ysbKAAAAAC/blue-archive-alice-tendou.gif");
            else if (R === 7)
                await msg.reply("https://media.tenor.com/oA5ClfmykW8AAAAi/alice-aris.gif");
            else if (R === 8)
                await msg.reply("https://media1.tenor.com/m/JqbC4quHIVAAAAAd/arisu-tendo-arisu.gif");

        }

        if (msg.commandName === "蒼彼") {
            await msg.reply("《蒼之彼方的四重奏》是由sprite在2014年發售的一款成人向美少女遊戲。\n" +
                "劇情圍繞在名為「Flying Circus」（簡稱FC）的虛構運動上，這是一種使用反重力鞋在空中進行的競技運動。\n" +
                "遊戲講述了主角日向晶也與社團夥伴們在這個競技上交織成的一部熱血、青春的戀愛物語。\n" +
                "本作在2016年1月動畫化，並於2016年2月發售全年齡版本至PSV上，隨後也發售了PS4、NS等版本。\n" +
                "2019年9月登上steam，並且有日文、英文、繁中、簡中四種語言可以選擇。\n" +
                "steam發售頁面：https://store.steampowered.com/app/1044620/");
            await msg.followUp("???：我認為每個人都應該玩過一遍蒼彼，一起來感受真白有多麼可愛。\n" +
                "https://i.imgur.com/2jR5xEZ.jpg");
        }

        if (msg.commandName === "計算") {
            const expression = msg.options.getString('式子');
        
            try {
                const result = math.evaluate(expression);
                await msg.reply(`${expression}=${result}`);
            } catch (error) {
                await msg.reply('無法計算該式子，請檢查輸入。');
            }
        }

    } catch (err) {
        console.log(err);
        await msg.reply("發生錯誤，請稍後再試。");
    }
});


function separator(numb) {
    var str = numb.toString().split('.');
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return str.join('.');
}

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
async function createSolErdaFragment(SkillNodes1, MasteryNodes1, MasteryNodes2, BoostNode1, BoostNode2, BoostNode3, BoostNode4, CommonNode1, extrafragment) {
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

client.login(token);

