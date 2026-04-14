// ============================================================
// SubTrack — Google Apps Script Backend
// ============================================================

const SHEET_SUBSCRIPTIONS = 'subscriptions';
const SHEET_BILLS = 'bills';

// ============================================================
// GET Entry Point — handles ALL actions (no POST / no CORS preflight)
// ============================================================
// All write operations pass data as a URL-encoded JSON string:
//   ?action=addSubscription&data={...}
// ============================================================

function doGet(e) {
  const action = e.parameter.action;
  let result;

  try {
    // Parse optional data payload
    const data = e.parameter.data ? JSON.parse(e.parameter.data) : null;

    if (action === 'getSubscriptions') {
      result = getSheetData(SHEET_SUBSCRIPTIONS);

    } else if (action === 'getBills') {
      result = getSheetData(SHEET_BILLS);

    } else if (action === 'addSubscription') {
      appendRow(SHEET_SUBSCRIPTIONS, data);
      result = { success: true };

    } else if (action === 'updateSubscription') {
      updateRow(SHEET_SUBSCRIPTIONS, data);
      result = { success: true };

    } else if (action === 'addBill') {
      appendRow(SHEET_BILLS, data);
      result = { success: true };

    } else if (action === 'deleteSubscription') {
      deleteRow(SHEET_SUBSCRIPTIONS, data.id);
      if (data.deleteBills === true) {
        deleteRowsBySubId(SHEET_BILLS, data.id);
      }
      result = { success: true };

    } else if (action === 'getRates') {
      result = getLiveRates();

    } else {
      result = { error: 'Unknown action: ' + action };
    }
  } catch (err) {
    result = { error: err.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// Helper: Read all rows as array of objects
// ============================================================

function getSheetData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error('找不到工作表: ' + sheetName);

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
}

// ============================================================
// Helper: Append a new row
// ============================================================

function appendRow(sheetName, data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error('找不到工作表: ' + sheetName);

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(header => (data[header] !== undefined ? data[header] : ''));
  sheet.appendRow(row);
}

// ============================================================
// Helper: Find row by id and update changed fields
// ============================================================

function updateRow(sheetName, data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error('找不到工作表: ' + sheetName);

  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  const idIndex = headers.indexOf('id');
  if (idIndex === -1) throw new Error('工作表缺少 id 欄位: ' + sheetName);

  for (let i = 1; i < allData.length; i++) {
    if (String(allData[i][idIndex]) === String(data.id)) {
      headers.forEach((header, j) => {
        if (data[header] !== undefined) {
          sheet.getRange(i + 1, j + 1).setValue(data[header]);
        }
      });
      return;
    }
  }

  throw new Error('找不到 id 為 ' + data.id + ' 的資料列');
}

// ============================================================
// Helper: Delete row by id
// ============================================================

function deleteRow(sheetName, id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error('找不到工作表: ' + sheetName);

  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  const idIndex = headers.indexOf('id');
  if (idIndex === -1) throw new Error('工作表缺少 id 欄位: ' + sheetName);

  // Iterate from bottom to avoid index shifting
  for (let i = allData.length - 1; i >= 1; i--) {
    if (String(allData[i][idIndex]) === String(id)) {
      sheet.deleteRow(i + 1);
      return;
    }
  }
}

// ============================================================
// Helper: Delete all bill rows matching subscriptionId
// ============================================================

function deleteRowsBySubId(sheetName, subscriptionId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error('找不到工作表: ' + sheetName);

  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  const subIdIndex = headers.indexOf('subscriptionId');
  if (subIdIndex === -1) throw new Error('工作表缺少 subscriptionId 欄位: ' + sheetName);

  // Iterate from bottom to avoid index shifting after deletion
  for (let i = allData.length - 1; i >= 1; i--) {
    if (String(allData[i][subIdIndex]) === String(subscriptionId)) {
      sheet.deleteRow(i + 1);
    }
  }
}

// ============================================================
// Helper: Fetch live exchange rates via GOOGLEFINANCE
// ============================================================

function getLiveRates() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('rates');
  if (!sheet) throw new Error('找不到 rates 工作表');

  const data = sheet.getDataRange().getValues();
  const rates = {};
  data.forEach(row => {
    if (row[0] && row[1]) {
      rates[String(row[0]).trim()] = parseFloat(row[1]) || null;
    }
  });
  return rates;
}

// ============================================================
// SETUP GUIDE
// ============================================================
//
// 1. 建立 Google 試算表，新增兩個工作表：
//    - 工作表名稱：subscriptions
//      第一列標題：id | name | category | emoji | billingCycle | amount | currency | startDate | endDate | nextBillingDate | status | notes
//    - 工作表名稱：bills
//      第一列標題：id | subscriptionId | date | amount | currency
//
// 2. 在 Google Apps Script 專案中貼上此程式碼。
//    前往「擴充功能」→「Apps Script」。
//
// 3. 部署為 Web App：
//    點選「部署」→「新增部署項目」→ 類型選「網頁應用程式」
//    - 以我的身分執行
//    - 誰可以存取：任何人
//    點選「部署」，複製 Web App URL。
//
// 4. 將 Web App URL 貼入 index.html 中的 CONFIG.API_URL 欄位。
//
// ============================================================
