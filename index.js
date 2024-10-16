"use strict";
import express from 'express';
import { config } from 'dotenv';
import { commands } from './commands.js';
import { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } from 'discord.js';
//import { EmbedBuilder } from 'discord.js';
//import {Discord} from 'discord.js';
import configData from './config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import cron from 'node-cron';
import { create, all } from 'mathjs';

const math = create(all);

import { createSolErdaFragment } from './functions/CreateSolErdaFragmentEmbed.js';
import { createAppleEmbed, createFashionBoxEmbed } from './functions/CreatePrizeEmbed.js';
import { createBossDataEmbed, getDifficultyValue } from './functions/CreateBossDataEmbed.js';
import { formatFashionBoxPrizeData, formatApplePrizeData, saveAppleJsonFile, saveFashionBoxJsonFile } from './functions/MSCrawler.js';
import { addDebt, repayDebt, queryDebt, queryDebtByCreditor} from './functions/debtsNote.js';
import { unionAttackDamage, levelFinalDamage, levelExpModifier} from './functions/Formulas.js';

import { unionCommand, solerdaCommand, bossCommand, eventCommand, chanceCommand, formulasCommand } from './slashCommands/slashMSCommand.js';
import { addDebtCommand, repayDebtCommand, queryDebtCommand } from './slashCommands/slashDebtsNoteCommand.js';

const app = express();
const PORT = process.env.PORT || 3000;

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

    // 每週三下午執行爬蟲
    cron.schedule('0,30 14,15,16,17,18 * * 3', async () => {
        console.log('執行爬蟲任務...');

        //let hasUpdates = false;
        let appleUpdates = false;
        let fashionUpdates = false;
        try {
            appleUpdates = await saveAppleJsonFile()
            fashionUpdates = await saveFashionBoxJsonFile();
            console.log('爬蟲任務執行成功！');

            // 如果有更新，則發送通知到指定頻道
            if (appleUpdates || fashionUpdates) {
                const channelId = process.env.CHANNEL_ID;
                const channel = client.channels.cache.get(channelId);
                if (channel) {
                    if (appleUpdates && fashionUpdates) {
                        await channel.send('黃金蘋果 & 時尚箱機率表更新完成！');
                    } else if (appleUpdates) {
                        await channel.send('黃金蘋果機率表更新完成！');
                    } else if (fashionUpdates) {
                        await channel.send('時尚箱機率表更新完成！');
                    }
                } else {
                    console.error('Channel not found.');
                }
            }
        } catch (error) {
            console.error('爬蟲任務執行失敗 錯誤訊息:', error);
        }
    });
});

app.get('/', (req, res) => {
    res.send('Bot is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    try {
        if (interaction.commandName === 'ping') {
            interaction.reply('Pong!');
        }

        if (interaction.commandName === "好楓寶指令") {
            if (interaction.options.getSubcommand() === "戰地") {
                await unionCommand(interaction);
            }

            if (interaction.options.getSubcommand() === '碎片進度') {
                await solerdaCommand(interaction);
            }

            if (interaction.options.getSubcommand() === '里程王') {
                await bossCommand(interaction);
            }

            if (interaction.options.getSubcommand() === '困王') {
                await bossCommand(interaction);
            }

            if (interaction.options.getSubcommand() === '當前活動') {
                await eventCommand(interaction);
            }

            if (interaction.options.getSubcommand() === '當期抽獎機率') {
                await chanceCommand(interaction);
            }

            if (interaction.options.getSubcommand() === '公式計算') {
                await formulasCommand(interaction);
            }
        }

        if (interaction.commandName === "欠債筆記") {
            if (interaction.options.getSubcommand() === "增加債務") {
                await addDebtCommand(interaction);
            }

            if (interaction.options.getSubcommand() === "還款") {
                await repayDebtCommand(interaction);
            }

            if (interaction.options.getSubcommand() === "查詢") {
                await queryDebtCommand(interaction);
            } 
        }

        if (interaction.commandName === "曬卡") {
            const q = [3, 20, 100];
            let e = ["<:anyapride:1043167915085672528>",
                "<:anyaGold:1043167887482945626>",
                "<:anya:967336847233679360>"];
            let t = "";
            let s = 0;

            let textDrawCard = interaction.options.getString('敘述') || '';
            let choice = interaction.options.getString('選擇');

            if (choice === 'probability') {
                let pride = q[0];
                let gold = q[1] - q[0];
                let normal = q[2] - q[1];
                await interaction.reply(`彩色 ${pride}% 金色 ${gold}% 普通 ${normal}%`);
                return;
            }

            if (textDrawCard.includes("作弊")) {
                for (let i = 0; i < 10; i++) {
                    t += e[0];
                }
                let response = `${interaction.member.displayName} -> 作弊\n${t}\n(保底十彩)`;
                await interaction.reply(response);
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
                let response = (`${interaction.member.displayName} -> ${textDrawCard}\n${t}`);
                if (s > 18)
                    response += "(保底)";
                await interaction.reply(response);
            }
        }

        if (interaction.commandName === "aris") {
            let R = Math.floor(Math.random() * 9);
            R = parseInt(R);
            if (R === 0)
                await interaction.reply("https://media1.tenor.com/m/BjPnBRcCPwcAAAAd/arisu-aris.gif");
            else if (R === 1)
                await interaction.reply("https://media1.tenor.com/m/GsRRxufjC1EAAAAC/arisu-alice.gif");
            else if (R === 2)
                await interaction.reply("https://media1.tenor.com/m/JyHMlpMxRKwAAAAC/arisbm.gif");
            else if (R === 3)
                await interaction.reply("https://media1.tenor.com/m/1p2LS_qMotYAAAAC/arisu-scared.gif");
            else if (R === 4)
                await interaction.reply("https://media1.tenor.com/m/96m6Vv9m_kIAAAAd/arisu-maid.gif");
            else if (R === 5)
                await interaction.reply("https://media1.tenor.com/m/8V5V_q7X1TsAAAAC/arisu-aris.gif");
            else if (R === 6)
                await interaction.reply("https://media1.tenor.com/m/Rw8RS3ysbKAAAAAC/blue-archive-alice-tendou.gif");
            else if (R === 7)
                await interaction.reply("https://media.tenor.com/oA5ClfmykW8AAAAi/alice-aris.gif");
            else if (R === 8)
                await interaction.reply("https://media1.tenor.com/m/JqbC4quHIVAAAAAd/arisu-tendo-arisu.gif");

        }

        if (interaction.commandName === "蒼彼") {
            await interaction.reply("《蒼之彼方的四重奏》是由sprite在2014年發售的一款成人向美少女遊戲。\n" +
                "劇情圍繞在名為「Flying Circus」（簡稱FC）的虛構運動上，這是一種使用反重力鞋在空中進行的競技運動。\n" +
                "遊戲講述了主角日向晶也與社團夥伴們在這個競技上交織成的一部熱血、青春的戀愛物語。\n" +
                "本作在2016年1月動畫化，並於2016年2月發售全年齡版本至PSV上，隨後也發售了PS4、NS等版本。\n" +
                "2019年9月登上steam，並且有日文、英文、繁中、簡中四種語言可以選擇。\n" +
                "steam發售頁面：https://store.steampowered.com/app/1044620/");
            await interaction.followUp("???：我認為每個人都應該玩過一遍蒼彼，一起來感受真白有多麼可愛。\n" +
                "https://i.imgur.com/2jR5xEZ.jpg");
        }

        if (interaction.commandName === "計算") {
            const expression = interaction.options.getString('式子');

            try {
                const result = math.evaluate(expression);
                await interaction.reply(`${expression}=${result}`);
            } catch (error) {
                await interaction.reply('無法計算該式子，請檢查輸入。');
            }
        }

    } catch (err) {
        console.log(err);
        await interaction.reply("發生錯誤，請稍後再試。");
    }
});

// 創建活動嵌入的函數
function CreateMapleEventsEmbeds(listData) {
    const embeds = [];
    listData.forEach(data => {
        const embed = new EmbedBuilder()
            .setTitle(data.adName)
            .setURL(data.adUrl)
            .setImage(data.adImage);

        const startDt = new Date(data.adsTime);
        const endDt = new Date(data.adeTime);
        const dateText = `${startDt.toLocaleString('zh-TW')} ~ ${endDt.toLocaleString('zh-TW')}`;
        embed.addFields({ name: "活動期限:", value: dateText });

        embeds.push(embed);
    });
    return embeds;
}

client.login(token);

