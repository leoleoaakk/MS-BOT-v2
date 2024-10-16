import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const debtFile = path.join(dirname, '..', 'json', 'debts.json');

// 載入或初始化債務記錄
let debts = {};
if (fs.existsSync(debtFile)) {
    debts = JSON.parse(fs.readFileSync(debtFile));
} else {
    fs.writeFileSync(debtFile, JSON.stringify({}));
}

// 儲存債務記錄
function saveDebts(){
    fs.writeFileSync(debtFile, JSON.stringify(debts, null, 2));
};

// 增加債務
export function addDebt(debtor, creditor, amount){
    if (!debts[debtor]) debts[debtor] = {};
    if (!debts[debtor][creditor]) debts[debtor][creditor] = 0;
    debts[debtor][creditor] += amount;
    saveDebts();
}

// 還款
export function repayDebt(debtor, creditor, amount){

    if (debts[debtor] && debts[debtor][creditor]) {
        debts[debtor][creditor] -= amount;
        if (debts[debtor][creditor] <= 0) {
            delete debts[debtor][creditor];
        }
        if (Object.keys(debts[debtor]).length === 0) {
            delete debts[debtor];
        }
        saveDebts();
    }
}

// 債務人查詢債務
export function queryDebt(debtor){
    return debts[debtor] || {};
}

//債權人查詢債務
export function queryDebtByCreditor(creditorId) {
    const creditorDebts = {}; // 用來儲存結果

    // 遍歷所有的債務人
    for (const [debtorId, creditors] of Object.entries(debts)) {
        // 檢查是否是查詢的債權人
        if (creditors[creditorId]) {
            creditorDebts[debtorId] = creditors[creditorId]; // 保存債務人及其借款金額
        }
    }

    return creditorDebts; // 返回債權人及金額
}
