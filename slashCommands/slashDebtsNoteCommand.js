import { addDebt, repayDebt, queryDebt, queryDebtByCreditor } from '../functions/debtsNote.js';

async function getDebtorInfo(interaction) {
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const debtorId = interaction.user.id; // 存儲用戶的 ID
    const debtorName = member.displayName || interaction.user.username; // 取得顯示名稱
    return {debtorId, debtorName};
}

export async function addDebtCommand(interaction) {
    const {debtorId, debtorName}=await getDebtorInfo(interaction); 
    const amount = parseInt(interaction.options.getString("金額"));
    const creditor = interaction.options.getUser("債權人");

    if (!creditor || isNaN(amount)) {
        interaction.reply('請提供正確的金額和債權人。');
        return;
    }

    const creditorMember = await interaction.guild.members.fetch(creditor.id);
    const creditorId = creditor.id; // 存儲債權人的 ID
    const creditorName = creditorMember.displayName || creditor.username; // 取得顯示名稱

    addDebt(debtorId, creditorId, amount); // 使用 ID 儲存債務
    interaction.reply(`已記錄 ${debtorName} 向 ${creditorName} 借${amount}億楓幣。`);
}

export async function repayDebtCommand(interaction) {
    const {debtorId, debtorName}=await getDebtorInfo(interaction);
    const amount = parseInt(interaction.options.getString("金額"));
    const creditor = interaction.options.getUser("債權人");

    if (!creditor || isNaN(amount)) {
        interaction.reply('請提供正確的金額和債權人。');
        return;
    }

    const creditorMember = await interaction.guild.members.fetch(creditor.id);
    const creditorId = creditor.id; // 存儲債權人的 ID
    const creditorName = creditorMember.displayName || creditor.username; // 取得顯示名稱

    repayDebt(debtorId, creditorId, amount); // 使用 ID 儲存還款
    interaction.reply(`已記錄 ${debtorName} 還 ${creditorName} ${amount}億楓幣。`);
}

export async function queryDebtCommand(interaction) {
    const debtorUser = interaction.options.getUser("債務人") || interaction.user;
    const debtorMember = await interaction.guild.members.fetch(debtorUser.id);
    const debtorId = debtorUser.id; // 存儲債務人的 ID
    const debtorName = debtorMember.displayName || debtorUser.username; // 取得顯示名稱

    const debtsInfo = queryDebt(debtorId); // 使用 ID 查詢債務

    // 查詢債權人的債務
    const creditorDebtsInfo = queryDebtByCreditor(debtorId); // 使用函數查詢

    let replyMessage = '';

    if (Object.keys(debtsInfo).length === 0) {
        replyMessage += `${debtorName} 沒有任何債務。\n`;
    } else {
        replyMessage += `**${debtorName} 的債務如下：**\n`;
        for (const [creditorId, amount] of Object.entries(debtsInfo)) {
            const creditorMember = await interaction.guild.members.fetch(creditorId).catch(() => null);
            const creditorName = creditorMember ? creditorMember.displayName : creditorId;
            replyMessage += `> 欠 **${creditorName}**: ${amount}億楓幣。\n`;
        };
    }

    // 債權人的債務
    if (Object.keys(creditorDebtsInfo).length === 0) {
        replyMessage += `${debtorName} 沒有借給任何人楓幣。\n`;
    } else {
        replyMessage += `**${debtorName} 借出去的金額如下：**\n`;
        for (const [creditorId, amount] of Object.entries(creditorDebtsInfo)) {
            const creditorMember = await interaction.guild.members.fetch(creditorId).catch(() => null);
            const creditorName = creditorMember ? creditorMember.displayName : creditorId;
            replyMessage += `> 借給 **${creditorName}**: ${amount}億楓幣。\n`;
        }
    }

    interaction.reply(replyMessage);
}
