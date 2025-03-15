/* eslint-disable no-undef */

// Блокировка сайтов
const updateDynamicRules = async (domains, mode) => {
  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: Array.from({length: 1000}, (_, i) => i + 1)
    });

    if (!domains?.length || !mode) return;

    const newRules = [];
    
    if (mode === 'whitelist') {
      newRules.push({
        id: 1,
        priority: 1,
        action: { type: 'block' },
        condition: {
          urlFilter: '.*',
          resourceTypes: ['main_frame'],
          excludedInitiatorDomains: domains,
          excludedRequestDomains: domains
        }
      });
    } else {
      newRules.push(...domains.map((domain, index) => ({
        id: index + 1,
        priority: 1,
        action: { type: 'block' },
        condition: {
          urlFilter: `||${domain}^`,
          resourceTypes: ['main_frame']
        }
      })));
    }

    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: newRules
    });
  } catch (error) {
    console.error('Error updating rules:', error);
  }
};

// Инициализация
try {
  
  // Обработчик изменений настроек блокировки
  chrome.storage.onChanged.addListener(async (changes) => {
    try {
      const result = await chrome.storage.local.get([
        'BlackList', 
        'WhiteList',
        'isBlacklistEnabled',
        'isWhitelistEnabled'
      ]);
      
      const mode = result.isWhitelistEnabled ? 'whitelist' : 
                  result.isBlacklistEnabled ? 'blacklist' : 
                  null;

      const domains = mode === 'whitelist' 
        ? result.WhiteList || []
        : result.BlackList || [];

      updateDynamicRules(domains, mode);
    } catch (error) {
      console.error('Error handling storage changes:', error);
    }
  });

} catch (error) {
  console.error('Initialization error:', error);
}

// background.js
let activeTabId = null;
let sessionStart = null;
let currentDomain = null;
let lastDate = new Date().toISOString().split('T')[0];

const getCurrentDate = () => new Date().toISOString().split('T')[0];

const handleSessionEnd = async () => {
  if (!sessionStart || !currentDomain) return;

  const sessionEnd = Date.now();
  const seconds = Math.round((sessionEnd - sessionStart) / 1000);
  const dateKey = getCurrentDate();

  const data = await chrome.storage.local.get('stats');
  const stats = data.stats || {};
  stats[dateKey] = stats[dateKey] || {};
  stats[dateKey][currentDomain] = (stats[dateKey][currentDomain] || 0) + seconds;
  
  await chrome.storage.local.set({ stats });
  console.log('Stats updated:', dateKey, currentDomain, seconds);
};

const startNewSession = (tab) => {
  if (!tab?.url) return;
  
  try {
    const url = new URL(tab.url);
    currentDomain = url.hostname.replace(/^www\./i, '').toLowerCase();
    console.log(currentDomain);
    sessionStart = Date.now();
  } catch (e) {
    console.error('Invalid URL:', tab.url);
  }
};

// Tab event handlers
chrome.tabs.onActivated.addListener(({ tabId }) => {
  handleSessionEnd().finally(() => {
    activeTabId = tabId;
    chrome.tabs.get(tabId, startNewSession);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && (changeInfo.status === 'complete' || changeInfo.url)) {
    handleSessionEnd().finally(() => startNewSession(tab));
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === activeTabId) {
    handleSessionEnd().finally(() => {
      activeTabId = null;
      sessionStart = null;
      currentDomain = null;
    });
  }
});

// Day change handler
setInterval(() => {
  const currentDate = getCurrentDate();
  if (currentDate !== lastDate) {
    lastDate = currentDate;
    handleSessionEnd().finally(() => {
      sessionStart = null;
      currentDomain = null;
    });
  }
}, 60000);

// Browser shutdown handler
chrome.runtime.onSuspend.addListener(() => {
  handleSessionEnd().catch(console.error);
});