import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
const q = [3, 20, 100];
const e = ["<:anyapride:1043167915085672528>",
    "<:anyaGold:1043167887482945626>",
    "<:anya:967336847233679360>"];


// 使用 Map 來追踪每個用戶的統計數據
const userStats = new Map();

function getUserStats(userId) {
    if (!userStats.has(userId)) {
        userStats.set(userId, {
            totalDrawCount: 0,
            totalPrideCount: 0
        });
    }
    return userStats.get(userId);
}

function performDraw(userId,isCheat) {
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


    const stats = getUserStats(userId);
    stats.totalDrawCount += 10;
    stats.totalPrideCount += result.prideCount;

    return result;
};

function createButtonRow(userId) {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`continue_draw:${userId}`)
                .setLabel('連抽')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`end_draw:${userId}`)
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
    const userId = interaction.user.id;
    const result = performDraw(userId,isCheat);

    let response = `${interaction.member.displayName} -> ${textDrawCard}\n${result.text}`;

    if (isCheat) {
        response += "\n(保底十彩)";
        await interaction.reply(response);
    } else if (result.score > 18) {
        response += "\n(保底)";
    }

    try {
        await interaction.reply({
            content: response,
            components: [createButtonRow(userId)]
        });
    } catch (error) {
        console.error('回覆錯誤:', error);
    }
}

export async function handleDrawCardButtons(interaction) {
    try {
        const [action, userId] = interaction.customId.split(':');
        // 檢查是否為原始命令發起者
        if (userId !== interaction.user.id) {
            await interaction.reply({ 
                content: '只有原始抽卡者可以使用這些按鈕！', 
                ephemeral: true 
            });
            return;
        }

        if (action === 'continue_draw') {
            const result = performDraw(userId, false);
            const stats = getUserStats(userId);

            // 獲取原始訊息內容
            let originalContent = interaction.message.content;
            originalContent = originalContent.replace(/\n目前總共\d+抽，總計\d+張彩色$/, '');

            // 限制只顯示最後5行抽卡結果
            let lines = originalContent.split('\n');
            const userName = lines[0];  // 保存用戶名那行
            lines = lines.slice(1);     // 移除用戶名那行

            if (lines.length > 5) {
                lines = lines.slice(-5);  // 只保留最後5行
            }

            let updatedContent = userName + '\n' + lines.join('\n') + '\n' + result.text;
            if (result.score > 18) updatedContent += "(保底)";
            updatedContent += `\n目前總共${stats.totalDrawCount}抽，總計${stats.totalPrideCount}張彩色`;

            // 更新訊息
            await interaction.update({
                content: updatedContent,
                components: [createButtonRow(userId)] // 保持按鈕
            });
        }

        if (action === 'end_draw') {
            userStats.delete(userId); // 清除該用戶的統計數據
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
