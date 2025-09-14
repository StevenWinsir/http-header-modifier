let isEnabled = false;
let customHeaders = {};
let ruleId = 1;

chrome.storage.sync.get(['enabled', 'headers'], (result) => {
  isEnabled = result.enabled || false;
  customHeaders = result.headers || {};
  updateIcon();
  updateRules();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    if (changes.enabled) {
      isEnabled = changes.enabled.newValue;
      updateIcon();
      updateRules();
    }
    if (changes.headers) {
      customHeaders = changes.headers.newValue || {};
      updateRules();
    }
  }
});

function updateIcon() {
  const iconPath = isEnabled ? 'icons/icon-active' : 'icons/icon';
  
  // 简单设置图标路径，不使用 setIcon API
  chrome.action.setIcon({
    path: {
      16: `${iconPath}16.png`,
      48: `${iconPath}48.png`,
      128: `${iconPath}128.png`
    }
  }).catch(err => {
    // 如果图标设置失败，使用默认图标
    console.log('Icon set failed, using default');
  });
  
  chrome.action.setBadgeText({
    text: isEnabled ? 'ON' : ''
  });
  
  chrome.action.setBadgeBackgroundColor({
    color: '#4CAF50'
  });
}

async function updateRules() {
  // 首先清除所有现有规则
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const existingRuleIds = existingRules.map(rule => rule.id);
  
  if (existingRuleIds.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingRuleIds
    });
  }
  
  if (!isEnabled || Object.keys(customHeaders).length === 0) {
    return;
  }
  
  // 创建新规则
  const rules = [];
  let currentRuleId = 1;
  
  // 为每个自定义header创建一个规则
  for (const [headerName, headerValue] of Object.entries(customHeaders)) {
    if (headerValue !== null && headerValue !== '') {
      rules.push({
        id: currentRuleId++,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          requestHeaders: [
            {
              header: headerName,
              operation: 'set',
              value: headerValue
            }
          ]
        },
        condition: {
          urlFilter: '*',
          resourceTypes: [
            'main_frame',
            'sub_frame',
            'stylesheet',
            'script',
            'image',
            'font',
            'object',
            'xmlhttprequest',
            'ping',
            'csp_report',
            'media',
            'websocket',
            'webtransport',
            'webbundle',
            'other'
          ]
        }
      });
    }
  }
  
  // 应用新规则
  if (rules.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules
    });
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStatus') {
    sendResponse({ enabled: isEnabled });
  }
});