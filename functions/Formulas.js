import { EmbedBuilder } from 'discord.js';

function calculateUnionPowerCombatPower(combatPower) {
    let unionPower, formula;
    if (combatPower <= 499999) {
        unionPower = 2.00 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.00*750*sqrt(戰鬥力+30000)";
    } else if (combatPower <= 999999) {
        unionPower = 2.05 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.05*750*sqrt(戰鬥力+30000)";
    } else if (combatPower <= 4999999) {
        unionPower = 2.10 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.10*750*sqrt(戰鬥力+30000)";
    } else if (combatPower <= 9999999) {
        unionPower = 2.15 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.15*750*sqrt(戰鬥力+30000)";
    } else if (combatPower <= 19999999) {
        unionPower = 2.20 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.20*750*sqrt(戰鬥力+30000)";
    } else if (combatPower <= 39999999) {
        unionPower = 2.25 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.25*750*sqrt(戰鬥力+30000)";
    } else if (combatPower <= 59999999) {
        unionPower = 2.30 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.30*750*sqrt(戰鬥力+30000)";
    } else if (combatPower <= 79999999) {
        unionPower = 2.35 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.35*750*sqrt(戰鬥力+30000)";
    } else if (combatPower <= 99999999) {
        unionPower = 2.40 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.40*750*sqrt(戰鬥力+30000)";
    } else if (combatPower <= 124999999) {
        unionPower = 2.45 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.45*750*sqrt(戰鬥力+30000)";
    } else if (combatPower <= 149999999) {
        unionPower = 2.50 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.50*750*sqrt(戰鬥力+30000)";
    } else if (combatPower <= 174999999) {
        unionPower = 2.55 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.55*750*sqrt(戰鬥力+30000)";
    } else if (combatPower <= 199999999) {
        unionPower = 2.60 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.60*750*sqrt(戰鬥力+30000)";
    } else if (combatPower <= 249999999) {
        unionPower = 2.65 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.65*750*sqrt(戰鬥力+30000)";
    } else if (combatPower <= 299999999) {
        unionPower = 2.70 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.70*750*sqrt(戰鬥力+30000)";
    } else if (combatPower <= 349999999) {
        unionPower = 2.75 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.75*750*sqrt(戰鬥力+30000)";
    } else if (combatPower <= 399999999) {
        unionPower = 2.80 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.80*750*sqrt(戰鬥力+30000)";
    } else if (combatPower <= 499999999) {
        unionPower = 2.85 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.85*750*sqrt(戰鬥力+30000)";
    } else {
        unionPower = 2.90 * 750 * Math.sqrt(combatPower + 30000);
        formula = "2.90*750*sqrt(戰鬥力+30000)";
    }

    return { unionPower, formula };
}

function CalculateUnionPowerLevel(level) {
    let unionPower, formula;
    if (level >= 60 && level <= 99) {
        unionPower = 0.5 * (level ** 3);
        formula = "0.5*等級^3";
    } else if (level >= 100 && level <= 139) {
        unionPower = 0.4 * (level ** 3);
        formula = "0.4*等級^3";
    } else if (level >= 140 && level <= 179) {
        unionPower = 0.7 * (level ** 3);
        formula = "0.7*等級^3";
    } else if (level >= 180 && level <= 199) {
        unionPower = 0.8 * (level ** 3);
        formula = "0.8*等級^3";
    } else if (level >= 200 && level <= 209) {
        unionPower = (level ** 3);
        formula = "1*等級^3";
    } else if (level >= 210 && level <= 219) {
        unionPower = 1.1 * (level ** 3);
        formula = "1.1*等級^3";
    } else if (level >= 220 && level <= 229) {
        unionPower = 1.15 * (level ** 3);
        formula = "1.15*等級^3";
    } else if (level >= 230 && level <= 239) {
        unionPower = 1.2 * (level ** 3);
        formula = "1.2*等級^3";
    } else if (level >= 240 && level <= 249) {
        unionPower = 1.25 * (level ** 3);
        formula = "1.25*等級^3";
    } else if (level >= 250 && level <= 259) {
        unionPower = 1.3 * (level ** 3);
        formula = "1.3*等級^3";
    } else if (level >= 260 && level <= 269) {
        unionPower = 1.35 * (level ** 3);
        formula = "1.35*等級^3";
    } else if (level >= 270 && level <= 279) {
        unionPower = 1.4 * (level ** 3);
        formula = "1.4*等級^3";
    } else if (level >= 280 && level <= 289) {
        unionPower = 1.45 * (level ** 3);
        formula = "1.45*等級^3";
    } else if (level >= 290 && level <= 299) {
        unionPower = 1.5 * (level ** 3);
        formula = "1.5*等級^3";
    } else if (level >= 300) {
        unionPower = 1.55 * (level ** 3);
        formula = "1.55*等級^3";
    } else {
        throw new Error("Level must be 60 or higher.");
    }

    return { unionPower, formula };
}

export function unionAttackDamage(level, combatPower) {
    let embed;

    if (level < 60 || level > 300) {
        embed = new EmbedBuilder()
            .setTitle("***戰地攻擊力***")
            .setDescription("**等級需介於60~300等之間**")
            .setColor(0xff0000);
    } else {
        const { unionPower: unionPowerLevel, formula: formulaLevel } = CalculateUnionPowerLevel(level);
        const { unionPower: unionPowerCombatPower, formula: formulaCombatPower } = calculateUnionPowerCombatPower(combatPower);

        embed = new EmbedBuilder()
            .setTitle("***戰地攻擊力***")
            .setColor(0xFF8040)
            .addFields(
                { name: "\n", value: `\`\`\`autohotkey\n等級　　　　: ${level.toString()}\n戰鬥力　　　: ${combatPower.toLocaleString()}\n戰地攻擊力　: ${(unionPowerLevel + unionPowerCombatPower + 312500).toLocaleString()}\n\`\`\``, inline: false },
                /*{ name: "\n", value: `\`\`\`autohotkey\n等級　　　　:${level.toString()}\n`, inline: false },
                { name: "\n", value: `戰鬥力　　　:${combatPower.toLocaleString()}\n`, inline: false },
                { name: "\n", value: `戰地攻擊力　:${(unionPowerLevel + unionPowerCombatPower + 312500).toLocaleString()}\n\`\`\`` , inline: false },*/
            )
            .setFooter({ text: `戰地攻擊力=${formulaLevel}+${formulaCombatPower}+312500` });
    }

    return embed;
}

export function levelFinalDamage(level, monsterLevel) {
    const deltaLevel = level - monsterLevel;
    let finalDamage, formula;

    if (deltaLevel >= 0) {
        finalDamage = 1.1 + 0.02 * Math.min(deltaLevel, 5);
        formula = "1.1+0.02*等差";
    } else if (deltaLevel >= -5) {
        finalDamage = (1.1 + 0.02 * deltaLevel) * (1 + 0.025 * deltaLevel);
        formula = "(1.1 + 0.02 * 等差) * (1 + 0.025 * 等差)";
    } else if (deltaLevel > -40) {
        finalDamage = 1 + 0.025 * deltaLevel;
        formula = "(1+0.025*等差)";
    } else {
        finalDamage = 0;
        formula = "固定1點傷害";
    }

    const embed = new EmbedBuilder()
        .setTitle("***等差終傷***")
        .setColor(0xFF8040)
        .addFields(
            { name: "\n", value: `\`\`\`autohotkey\n角色等級　:${level.toString()}\n怪物等級　:${monsterLevel.toLocaleString()}\n等差終傷　:${(finalDamage * 100).toFixed(1)}%\n\`\`\``, inline: false },
            /*{ name: "怪物等級", value: monsterLevel.toLocaleString(), inline: false },
            { name: "等差終傷", value: (finalDamage * 100).toFixed(1) + "%", inline: false },*/
        )
        .setFooter({ text: `等差終傷=${formula}` });

    return embed;
}

export function levelExpModifier(level, monsterLevel) {
    const deltaLevel = level - monsterLevel;
    let expModifier, formula;

    if (1 >= deltaLevel && deltaLevel >= -1) {
        expModifier = 1.2;
        formula = "±0~1等 +20%";
    } else if (4 >= deltaLevel && deltaLevel > 1) {
        expModifier = 1.1;
        formula = "±2~4等 +10%";
    } else if (9 >= deltaLevel && deltaLevel > 4) {
        expModifier = 1.05;
        formula = "+5~9等 +5%";
    } else if (deltaLevel === 10 || deltaLevel === -10) {
        expModifier = 1.00;
        formula = "+0%";
    } else if (18 >= deltaLevel && deltaLevel > 10) {
        expModifier = 1 - Math.round((deltaLevel - 10) / 2) * 0.01;
        formula = "+10~20等 每2等-1%";
    } else if (20 >= deltaLevel && deltaLevel > 18) {
        expModifier = 0.95;
        formula = "+10~20等 每2等-1%";
    } else if (deltaLevel > 20) {
        expModifier = 1 - Math.min((deltaLevel - 10), 30) * 0.01;
        formula = "+21等以上 每1等-1% max-30%";
    } else if (-4 <= deltaLevel && deltaLevel < -1) {
        expModifier = 1.1;
        formula = "±2~4等 +10%";
    } else if (-9 <= deltaLevel && deltaLevel < -4) {
        expModifier = 1.05;
        formula = "±5~9等 +5%";
    } else if (-20 <= deltaLevel && deltaLevel < -10) {
        expModifier = 1 + (deltaLevel + 10) * 0.01;
        formula = "-10~20等 每1等%";
    } else if (deltaLevel < -20) {
        expModifier = 0.7 + Math.max((deltaLevel + 21), -15) * 0.04;
        formula = "-21等以上 每1等-4% max-90%";
    }

    const embed = new EmbedBuilder()
        .setTitle("***等差經驗***")
        .setColor(0xFF8040)
        .addFields(
            { name: "\n", value: `\`\`\`autohotkey\n角色等級　:${level.toString()}\n怪物等級　:${monsterLevel.toLocaleString()}\n等差經驗　:${(expModifier * 100).toFixed(1)}%\n\`\`\``, inline: false },
            /*{ name: "怪物等級", value: monsterLevel.toLocaleString(), inline: false },
            { name: "等差經驗", value: (expModifier * 100).toFixed(1) + "%", inline: false },*/
        )
        .setFooter({ text: `等差經驗=${formula}` });

    return embed;
}