export const commands = [
    {
        name: 'ping',
        description: '回覆 Pong!',
    },
    {
        name: '好楓寶指令',
        description: '當個稱職的坐牢人:D',
        options: [
            {
                type: 1, //副指令
                name: '戰地',
                description: '查詢角色的戰地排名',
                options: [
                    {
                        type: 3, // STRING
                        name: '角色名',
                        description: '輸入角色名稱',
                        required: true,
                    },
                    {
                        type: 3,
                        name: '排行',
                        description: '選擇排行類型',
                        required: true,
                        choices: [
                            {
                                name: '戰地總等級排行',
                                value: '3',
                            },
                            {
                                name: '角色等級排行',
                                value: '2',
                            },
                            {
                                name: '戰鬥力排行',
                                value: '1',
                            }
                        ]
                    }
                ],
            },
            {
                type: 1,
                name: '碎片進度',
                description: '計算六轉碎片進度',
                options: [
                    {
                        type: 3,
                        name: '技能核心',
                        description: '技能核心等級',
                        required: true,
                    },
                    {
                        type: 3,
                        name: "精通核心1",
                        description: "精通核心1等級",
                        required: true
                    },
                    {
                        type: 3,
                        name: "精通核心2",
                        description: "精通核心2等級",
                        required: true
                    },
                    {
                        type: 3,
                        name: "強化核心1",
                        description: "強化核心1等級",
                        required: true
                    },
                    {
                        type: 3,
                        name: "強化核心2",
                        description: "強化核心2等級",
                        required: true
                    },
                    {
                        type: 3,
                        name: "強化核心3",
                        description: "強化核心3等級",
                        required: true
                    },
                    {
                        type: 3,
                        name: "強化核心4",
                        description: "強化核心4等級",
                        required: true
                    },
                    {
                        type: 3,
                        name: "共用核心1",
                        description: "共用核心1等級",
                        required: true
                    },
                    {
                        type: 3,
                        name: "碎片數量",
                        description: "身上的碎片數量",
                        required: false
                    }
                ]
            },
            {
                type: 1,
                name: '里程王',
                description: 'boss資料',
                options: [
                    {
                        type: 3,
                        name: 'boss名稱',
                        description: 'boss名稱',
                        required: true,
                        choices: [
                            { name: "巴洛古", value: "巴洛古" },
                            { name: "殘暴炎魔", value: "殘暴炎魔" },
                            { name: "梅格耐斯", value: "梅格耐斯" },
                            { name: "希拉", value: "希拉" },
                            { name: "卡翁", value: "卡翁" },
                            { name: "拉圖斯", value: "拉圖斯" },
                            { name: "森蘭丸", value: "森蘭丸" },
                            { name: "比艾樂", value: "比艾樂" },
                            { name: "斑斑", value: "斑斑" },
                            { name: "血腥皇后", value: "血腥皇后" },
                            { name: "貝倫", value: "貝倫" },
                            { name: "凡雷恩", value: "凡雷恩" },
                            { name: "阿卡伊農", value: "阿卡伊農" },
                            { name: "皮卡啾", value: "皮卡啾" },
                            { name: "西格諾斯", value: "西格諾斯" },
                            { name: "培羅德", value: "培羅德" },
                            { name: "濃姬", value: "濃姬" },
                        ]
                    },
                    {
                        type: 3, // STRING
                        name: "難度",
                        description: "難度",
                        required: true,
                        choices: [
                            { name: "簡單", value: "easy" },
                            { name: "普通", value: "normal" },
                            { name: "困難/混沌", value: "hard" },
                            { name: "極限", value: "extreme" },
                        ]
                    }
                ],
            },
            {
                type: 1,
                name: '困王',
                description: 'boss資料',
                options: [
                    {
                        type: 3,
                        name: 'boss名稱',
                        description: 'boss名稱',
                        required: true,
                        choices: [
                            { name: "史烏", value: "史烏" },
                            { name: "戴米安", value: "戴米安" },
                            { name: "守護天使綠水靈", value: "守護天使綠水靈" },
                            { name: "露希妲", value: "露希妲" },
                            { name: "威爾", value: "威爾" },
                            { name: "戴斯克", value: "戴斯克" },
                            { name: "真希拉", value: "真希拉" },
                            { name: "頓凱爾", value: "頓凱爾" },
                            { name: "黑魔法師", value: "黑魔法師" },
                            { name: "受選的賽蓮", value: "受選的賽蓮" },
                            { name: "監視者卡洛斯", value: "監視者卡洛斯" },
                            { name: "咖凌", value: "咖凌" },
                            { name: "林波", value: "林波" }
                        ]
                    },
                    {
                        type: 3, // STRING
                        name: "難度",
                        description: "難度",
                        required: true,
                        choices: [
                            { name: "簡單", value: "easy" },
                            { name: "普通", value: "normal" },
                            { name: "困難/混沌", value: "hard" },
                            { name: "極限", value: "extreme" },
                        ]
                    },
                ],
            },
            {
                type: 1,
                name: '當前活動',
                description: '查看官網活動訊息',
            },
            {
                type:1,
                name: '當期抽獎機率',
                description: '當期抽獎機率',
                options: [
                    {
                        type:3,
                        name: '類別',
                        description: '類別',
                        required: true,
                        choices: [
                            { name: '蘋果', value: 'GoldApple' },
                            { name: '時尚', value: 'FashionBox' },
                        ],
                    },
                ],
            },
            {
                type: 1,
                name: '公式計算',
                description: '各種公式計算',
                options: [
                    {
                        type: 3,
                        name: '公式選擇',
                        description: '選擇公式',
                        required: true,
                        choices: [
                            { name: '說明', value: 'help',},
                            { name: '戰地攻擊力', value: 'unionattackdamage' },
                            { name: '等差終傷', value: 'levelfinaldamage' },
                            { name: '等差經驗', value: 'levelexpmodifier' }
                        ],
                    },
                    {
                        type: 4, //INT
                        name: '變數1',
                        description: '輸入變數1',
                        required: false,
                    },
                    {
                        type: 4, 
                        name: '變數2',
                        description: '輸入變數2',
                        required: false,
                    },
                ],
            },
        ],
    },
    {
        name: '欠債筆記',
        description: '幫你記錄你欠的債',
        options: [
            {
                type: 1,
                name: '增加債務',
                description: '增加某位成員的債務',
                options: [
                    {
                        type: 6, //user
                        name: '債權人',
                        description: '借出金錢的成員',
                        required: true,
                    },
                    {
                        type: 3,
                        name: '金額',
                        description: '借款金額(單位:億)',
                        required: true,
                    },
                ],

            },
            {
                type: 1,
                name: '還款',
                description: '還款給某位成員',
                options: [
                    {
                        type: 6, //user
                        name: "債權人",
                        description: "還給哪位成員",
                        required: true,
                    },
                    {
                        type: 3,
                        name: '金額',
                        description: "還款金額(單位:億)",
                        required: true,
                    },
                ],
            },
            {
                type:1,
                name: '查詢',
                description: '查詢某位成員的債務',
                options:[
                    {
                        type:6,
                        name: '債務人',
                        description: '查詢的成員，默認為自己',
                        required: false,
                    },
                ],
            },
        ],
    },
    {
        name: '曬卡',
        description: '曬卡模擬器，測試你的運氣',
        options: [
            {
                type: 3,
                name: '選擇',
                description: '正常曬卡or看機率',
                required: true,
                choices: [
                    {
                        name: '曬卡',
                        value: 'normal',
                    },
                    {
                        name: '查看機率',
                        value: 'probability',
                    },
                ],
            },
            {
                type: 3,
                name: '敘述',
                description: '許個願之類的',
                required: false,
            },
        ],
    },
    {
        name: 'aris',
        description: 'Blue Archive!',
    },
    {
        name: '蒼彼',
        description: ':)',
    },
    {
        name: '計算',
        description: '幫你算數',
        options: [
            {
                name: '式子',
                type: 3, // STRING
                description: '輸入要計算的式子',
                required: true,
            },
        ],
    },
];