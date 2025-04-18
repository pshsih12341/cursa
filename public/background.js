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

let sessionInterval = null;

const startNewSession = (tab) => {
  if (!tab?.url) return;

  // Очищаем предыдущий интервал
  if (sessionInterval) clearInterval(sessionInterval);

  try {
    const url = new URL(tab.url);
    currentDomain = url.hostname.replace(/^www\./i, '').toLowerCase();
    sessionStart = Date.now();
    
    // Периодическое сохранение каждые 15 секунд
    sessionInterval = setInterval(() => {
      handleSessionEnd();
      sessionStart = Date.now(); // Сбрасываем таймер
    }, 15_000);

  } catch (e) {
    console.error('Invalid URL:', tab.url);
  }
};

// Обновите все обработчики вкладок:
chrome.tabs.onActivated.addListener(({ tabId }) => {
  handleSessionEnd().finally(() => {
    if (sessionInterval) clearInterval(sessionInterval); // Важно!
    activeTabId = tabId;
    chrome.tabs.get(tabId, startNewSession);
  });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === activeTabId) {
    handleSessionEnd().finally(() => {
      if (sessionInterval) clearInterval(sessionInterval); // Важно!
      activeTabId = null;
      sessionStart = null;
      currentDomain = null;
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.url) {
    // При изменении URL внутри вкладки
    handleSessionEnd().finally(() => {
      if (sessionInterval) clearInterval(sessionInterval);
      startNewSession(tab);
    });
  }
  
  // Обработчик изменения видимости вкладки
  if (tabId === activeTabId && changeInfo.hidden !== undefined) {
    if (changeInfo.hidden) {
      handleSessionEnd();
      if (sessionInterval) clearInterval(sessionInterval);
    } else {
      sessionStart = Date.now();
      sessionInterval = setInterval(() => {
        handleSessionEnd();
        sessionStart = Date.now();
      }, 15_000);
    }
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

const isScheduleNowActive = (schedule) => {
  if (!schedule || !schedule.days || !schedule.startTime || !schedule.endTime) return false;

  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday
  const isWeekday = currentDay >= 1 && currentDay <= 5;
  const isWeekend = currentDay === 0 || currentDay === 6;

  const [startHours, startMinutes] = schedule.startTime.split(":").map(Number);
  const [endHours, endMinutes] = schedule.endTime.split(":").map(Number);

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const start = startHours * 60 + startMinutes;
  const end = endHours * 60 + endMinutes;

  const withinTime = nowMinutes >= start && nowMinutes <= end;

  return (
    (schedule.days.includes("weekdays") && isWeekday && withinTime) ||
    (schedule.days.includes("weekends") && isWeekend && withinTime)
  );
};

setInterval(async () => {
  const result = await chrome.storage.local.get([
    'BlackListSchedule',
    'WhiteListSchedule'
  ]);

  const blackActive = isScheduleNowActive(result.BlackListSchedule);
  const whiteActive = isScheduleNowActive(result.WhiteListSchedule);

  // Если оба активны — приоритет у белого списка
  const mode = whiteActive ? 'whitelist' : blackActive ? 'blacklist' : null;
  const isBlacklistEnabled = mode === 'blacklist';
  const isWhitelistEnabled = mode === 'whitelist';

  await chrome.storage.local.set({
    isBlacklistEnabled,
    isWhitelistEnabled
  });

}, 60_000); // каждые 60 секунд
