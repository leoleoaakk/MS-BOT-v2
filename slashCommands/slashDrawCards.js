import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
const q = [3, 20, 100];
const e = ["<:anyapride:1043167915085672528>",
    "<:anyaGold:1043167887482945626>",
    "<:anya:967336847233679360>"];

let totalDrawCount = 0;
let totalPrideCount = 0;

function performDraw(isCheat) {
    let result = {
        text: '',
        score: 0,
        prideCount: 0
    };

    if (isCheat) {
        result.text = e[0].repeat(10);
        return result;
    }

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 3; j++) {
            if (Math.random() * 100 < q[j]) {
                result.score += j;
                if (j === 0) result.prideCount++;
                if (result.score == 20)
                    result.text += e[1];
                else
                    result.text += e[j];
                break;
            }
        }
    }

    totalDrawCount += 10;
    totalPrideCount += result.prideCount;

    return result;
};

function createButtonRow() {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('continue_draw')
                .setLabel('連抽')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('end_draw')
                .setLabel('結束')
                .setStyle(ButtonStyle.Secondary),
        );
}

export async function drawCards(interaction) {
    
    let textDrawCard = interaction.options.getString('敘述') || '';
    let choice = interaction.options.getString('選擇');

    if (choice === 'probability') {
        let pride = q[0];
        let gold = q[1] - q[0];
        let normal = q[2] - q[1];
        await interaction.reply(`彩色 ${pride}% 金色 ${gold}% 普通 ${normal}%`);
        return;
    }

    const isCheat = textDrawCard.includes("作弊");
    const result = performDraw(isCheat);

    let response = `${interaction.member.displayName} -> ${textDrawCard}\n${result.text}`;

    if(isCheat){
        response += "\n(保底十彩)";
        await interaction.reply(response);
    } else if (result.score > 18) {
        response += "\n(保底)";
    }

    try {
        await interaction.reply({
            content: response,
            components: [createButtonRow()]
        });
    } catch (error) {
        console.error('回覆錯誤:', error);
    }
}

export async function handleDrawCardButtons(interaction) {
    try {
        if (interaction.customId === 'continue_draw') {
            const result = performDraw(false);

            // 獲取原始訊息內容
            let originalContent = interaction.message.content;
            originalContent = originalContent.replace(/\n目前總共\d+抽，總計\d+張彩色$/, '');

            let updatedContent = originalContent + '\n' + result.text;
            if (result.score > 18) updatedContent += "(保底)";
            updatedContent += `\n目前總共${totalDrawCount}抽，總計${totalPrideCount}張彩色`;

            // 更新訊息
            await interaction.update({
                content: updatedContent,
                components: [createButtonRow()] // 保持按鈕
            });
        }

        if (interaction.customId === 'end_draw') {
            totalDrawCount = 0;
            totalPrideCount = 0;
            // 移除按鈕
            await interaction.update({
                content: interaction.message.content,
                components: []
            });
        }
    } catch (error) {
        console.error('按鈕交互錯誤:', error);
    }
}
