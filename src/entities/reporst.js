import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { blockedUrls, productiveUrls } from '../shared/consts/urls';

export const initializeReports = createAsyncThunk(
  'reports/initialize',
  async () => {
    try {
      // eslint-disable-next-line no-undef
      const { reports } = await chrome.storage.local.get('reports');
      return reports || [];
    } catch (error) {
      console.error('Error initializing reports:', error);
      return [];
    }
  }
);

const categorizeSite = (domain, state) => {
  try {

    // Проверяем в WhiteList (продуктивные) - пользовательский список
    if (state.listSlyce.WhiteList && state.listSlyce.WhiteList.some(url => domain.includes(url))) {
      console.log('Found in WhiteList');
      return 'productive';
    }

    // Проверяем в BlackList (развлекательные) - пользовательский список
    if (state.listSlyce.BlackList && state.listSlyce.BlackList.some(url => domain.includes(url))) {
      console.log('Found in BlackList');
      return 'entertainment';
    }

    // Проверяем в productiveUrls (продуктивные) - предустановленный список
    if (productiveUrls.some(url => domain.includes(url))) {
      console.log('Found in productiveUrls');
      return 'productive';
    }

    // Проверяем в blockedUrls (развлекательные) - предустановленный список
    if (blockedUrls.some(url => domain.includes(url))) {
      console.log('Found in blockedUrls');
      return 'entertainment';
    }

    console.log('No matches found, returning unknown');
    return 'unknown';
  } catch (error) {
    console.error('Error categorizing site:', error);
    return 'unknown';
  }
};

const processStatsData = (stats, dateFrom, dateTo, siteFilter) => {
  try {
    const dateRange = [];
    let currentDate = new Date(dateFrom);
    const endDate = new Date(dateTo);
    
    while (currentDate <= endDate) {
      dateRange.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const filteredStats = {};
    dateRange.forEach(date => {
      if (stats[date]) {
        filteredStats[date] = {};
        Object.entries(stats[date]).forEach(([site, seconds]) => {
          if (!siteFilter.length || siteFilter.includes(site)) {
            filteredStats[date][site] = seconds;
          }
        });
      }
    });

    return filteredStats;
  } catch (error) {
    console.error('Error processing stats data:', error);
    return {};
  }
};

const generateReport = (processedStats, state) => {
  try {
    const topSites = [];
    const activityByDay = [];
    const categorySummary = {
      entertainment: 0,
      productive: 0,
      unknown: 0
    };

    let totalTimeSec = 0;

    // Сначала собираем все дни с их общей активностью
    const daysWithActivity = Object.entries(processedStats).map(([date, sites]) => {
      const dayStats = {
        date,
        topSite: '',
        topSiteTimeSec: 0,
        totalTimeSec: 0,
        entertainmentSec: 0,
        productiveSec: 0,
        unknownSec: 0,
        topSiteCategory: ''
      };

      Object.entries(sites).forEach(([site, seconds]) => {
        const category = categorizeSite(site, state);
        dayStats[`${category}Sec`] += seconds;
        categorySummary[category] += seconds;
        totalTimeSec += seconds;

        if (seconds > dayStats.topSiteTimeSec) {
          dayStats.topSite = site;
          dayStats.topSiteTimeSec = seconds;
          dayStats.topSiteCategory = category;
        }
      });

      dayStats.totalTimeSec = dayStats.entertainmentSec + dayStats.productiveSec + dayStats.unknownSec;
      return dayStats;
    });

    // Сортируем дни по общей активности и берем топ-3
    const topDays = daysWithActivity
      .sort((a, b) => b.totalTimeSec - a.totalTimeSec)
      .slice(0, 3);

    activityByDay.push(...topDays);

    // Calculate top sites across all days
    const siteTotals = {};
    Object.values(processedStats).forEach(sites => {
      Object.entries(sites).forEach(([site, seconds]) => {
        siteTotals[site] = (siteTotals[site] || 0) + seconds;
      });
    });

    Object.entries(siteTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .forEach(([site, seconds]) => {
        topSites.push({
          domain: site,
          seconds,
          category: categorizeSite(site, state)
        });
      });

    return {
      totalTimeSec,
      avgTimePerDaySec: Math.floor(totalTimeSec / Object.keys(processedStats).length),
      topSites,
      activityByDay,
      categorySummary
    };
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

export const createReport = createAsyncThunk(
  'reports/create',
  async ({ dateFrom, dateTo, siteFilter }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentReports = state.reportSlice.reports;
      const stats = state.statsSlice.stats;

      if (!stats) {
        throw new Error('No stats data available');
      }
      
      const processedStats = processStatsData(stats, dateFrom, dateTo, siteFilter);
      
      if (Object.keys(processedStats).length === 0) {
        throw new Error('No data available for the selected date range');
      }

      const reportData = generateReport(processedStats, state);

      const newReport = {
        reportId: `report_${Date.now()}`,
        dateFrom,
        dateTo,
        siteFilter,
        generatedAt: new Date().toISOString(),
        ...reportData
      };

      const updatedReports = [newReport,...currentReports];
      // eslint-disable-next-line no-undef
      await chrome.storage.local.set({ reports: updatedReports });

      return newReport;
    } catch (error) {
      console.error('Error creating report:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateReport = createAsyncThunk(
  'reports/update',
  async ({ reportId, newName }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentReports = state.reportSlice.reports;
      
      const updatedReports = currentReports.map(report => 
        report.reportId === reportId 
          ? { ...report, reportId: newName }
          : report
      );

      // eslint-disable-next-line no-undef
      await chrome.storage.local.set({ reports: updatedReports });
      
      return { reportId, newName };
    } catch (error) {
      console.error('Error updating report:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteReport = createAsyncThunk(
  'reports/delete',
  async (reportId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentReports = state.reportSlice.reports;
      
      const updatedReports = currentReports.filter(report => report.reportId !== reportId);

      // eslint-disable-next-line no-undef
      await chrome.storage.local.set({ reports: updatedReports });
      
      return reportId;
    } catch (error) {
      console.error('Error deleting report:', error);
      return rejectWithValue(error.message);
    }
  }
);

const reportSlice = createSlice({
  name: 'reportSlice',
  initialState: {
    reports: [],
    activeReport: null,
    loading: false,
    error: null
  },
  reducers: {
    setActiveReport: (state, action) => {
      state.activeReport = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeReports.fulfilled, (state, action) => {
        state.reports = action.payload;
      })
      .addCase(createReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.reports.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create report';
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        const { reportId, newName } = action.payload;
        state.reports = state.reports.map(report => 
          report.reportId === reportId 
            ? { ...report, reportId: newName }
            : report
        );
        if (state.activeReport?.reportId === reportId) {
          state.activeReport = { ...state.activeReport, reportId: newName };
        }
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.reports = state.reports.filter(report => report.reportId !== deletedId);
        if (state.activeReport?.reportId === deletedId) {
          state.activeReport = null;
        }
      });
  }
});

export const { setActiveReport } = reportSlice.actions;
export default reportSlice.reducer;