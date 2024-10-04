export const commands = [
    {
        name: 'ping',
        description: '回覆 Pong!',
    },
    {
        name:'好楓寶指令',
        description:'當個稱職的坐牢人:D',
        options:[
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
                        choices:[
                            {
                                name:'戰地總等級排行',
                                value:'3',
                            },
                            {
                                name:'角色等級排行',
                                value:'2',
                            },
                            {
                                name:'戰鬥力排行',
                                value:'1',
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
            }
        ],
    },
    {
        name: '曬卡',
        description: '曬卡模擬器，測試你的運氣',
        options: [
            {
                type: 3,
                name: '選擇',
                description:'正常曬卡or看機率',
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