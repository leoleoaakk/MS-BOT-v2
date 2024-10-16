import fetch from 'node-fetch';
import { EmbedBuilder } from 'discord.js';

import { createSolErdaFragment } from '../functions/CreateSolErdaFragmentEmbed.js';
import { createBossDataEmbed, getDifficultyValue } from '../functions/CreateBossDataEmbed.js';
import { createAppleEmbed, createFashionBoxEmbed } from '../functions/CreatePrizeEmbed.js';
import { unionAttackDamage, levelFinalDamage, levelExpModifier} from '../functions/Formulas.js';

export async function unionCommand(interaction) {
    const characterName = interaction.options.getString('角色名');
    const url = "https://tw-event.beanfun.com/MapleStory/api/UnionWebRank/GetRank";


    // 要發送的參數
    const data = {
        RankType: parseInt(interaction.options.getString('排行')),
        GameWorldId: "-1",
        CharacterName: characterName,
    };

    const rankingChoices = {
        '3': '戰地總等級排行',
        '2': '角色等級排行',
        '1': '戰鬥力排行'
    };

    let rankingTypeName = rankingChoices[interaction.options.getString('排行')];

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
            interaction.reply({ embeds: [exampleEmbed] });
        })
        .catch((error) => {
            console.error("Error:", error)
            interaction.reply("查無此角色ID或是伺服器忙線中");
        });
}

function separator(numb) {
    var str = numb.toString().split('.');
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return str.join('.');
}

export async function solerdaCommand(interaction) {
    const skillnodes1 = parseInt(interaction.options.getString('技能核心'));
    const masterynodes1 = parseInt(interaction.options.getString('精通核心1'));
    const masterynodes2 = parseInt(interaction.options.getString('精通核心2'));
    const boostnode1 = parseInt(interaction.options.getString('強化核心1'));
    const boostnode2 = parseInt(interaction.options.getString('強化核心2'));
    const boostnode3 = parseInt(interaction.options.getString('強化核心3'));
    const boostnode4 = parseInt(interaction.options.getString('強化核心4'));
    const commonnode1 = parseInt(interaction.options.getString('共用核心1'));
    const extrafragment = parseInt(interaction.options.getString('碎片數量')) || 0;

    console.log(skillnodes1 + " " + masterynodes1 + " " + masterynodes2 + " " + boostnode1 + " " + boostnode2 + " " + boostnode3 + " " + boostnode4 + " " + commonnode1 + " " + extrafragment);

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

    await interaction.reply({ embeds: [embed] });
    //await interaction.reply(embed.totalCount + " " + embed.maxTotal);
}

export async function bossCommand(interaction) {
    const bossname = interaction.options.getString("boss名稱");
    const difficulty = interaction.options.getString("難度");

    const [index, indexError] = getDifficultyValue(bossname, difficulty);
    if (indexError === true) {
        return interaction.reply(`${interaction.user}, ${bossname} 沒有這個難度`);
    }
    const embed = createBossDataEmbed(bossname, index);
    return interaction.reply({ embeds: [embed] });
}

export async function eventCommand(interaction) {
    await interaction.deferReply(); // 延遲回覆以避免超時

    // API URL
    const API_BULLETIN = "https://maplestory.beanfun.com/api/GamaAd/FindAdData?AdType=MainBulletin&_=";
    const timestamp = Math.floor(Date.now() / 1000); // 獲取當前時間戳
    const url = `${API_BULLETIN}${timestamp}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('網路錯誤');

        const json = await response.json();
        console.log(json);
        const embeds = CreateMapleEventsEmbeds(json.listData); // 創建嵌入訊息
        await interaction.editReply({ embeds }); // 回覆嵌入
    } catch (error) {
        console.error(error);
        await interaction.editReply("無法獲取活動資料，請稍後再試。");
    }
}

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

export async function chanceCommand(interaction) {
    const type = interaction.options.getString("類別");

    let embed;
    if (type === 'GoldApple') {
        embed = createAppleEmbed();
    } else if (type === 'FashionBox') {
        embed = createFashionBoxEmbed();
    }

    return interaction.reply({ embeds: [embed] });
}

export async function formulasCommand(interaction) {
    const formulas = interaction.options.getString('公式選擇');
    await interaction.deferReply();

    const var1 = interaction.options.getInteger('變數1');
    const var2 = interaction.options.getInteger('變數2');
    //console.log(var1+" "+var2);
    let embed;
    if (formulas == "help") {
        embed = new EmbedBuilder()
            .setTitle("公式說明")
            .setDescription("各種公式")
            .setColor(0x00ff00)
            .addFields([
                { name: "戰地攻擊力", value: `\`\`\`autohotkey\n1:等級\n2:戰鬥力\n\`\`\``, inline: true },
                { name: "等差終傷", value: `\`\`\`autohotkey\n1:角色等級\n2:怪物等級\n\`\`\``, inline: true },
                { name: "等差經驗", value: `\`\`\`autohotkey\n1:角色等級\n2:怪物等級\n\`\`\``, inline: true }
            ]);
    }
    else if (formulas == "unionattackdamage")
        embed = unionAttackDamage(var1, var2);
    else if (formulas == "levelfinaldamage")
        embed = levelFinalDamage(var1, var2);
    else if (formulas == "levelexpmodifier")
        embed = levelExpModifier(var1, var2);

    await interaction.editReply({ embeds: [embed] });
}