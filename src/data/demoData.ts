// Demo Data for first-time users
// Sample applications, fields, and configurations

import type { Application, CustomField, ChartConfig, OverviewCardConfig } from '../types';

export const DEMO_APPLICATIONS: Application[] = [
  {
    id: 'app-1730808000000-0',
    data: {
      companyName: 'Google',
      jobPosition: 'Senior Software Engineer',
      jobDescription: 'Exciting opportunity to work on cutting-edge technology',
      applicationDate: '2025-10-26',
      status: 'applied',
      responseDate: '',
      field_1762439194058: 'hr_company',
    },
    notes: [],
    createdAt: '2025-10-26T00:00:00.000Z',
    updatedAt: '2025-11-06T14:36:00.618Z',
  },
  {
    id: 'app-1730808000000-1',
    data: {
      companyName: 'Meta',
      jobPosition: 'Frontend Developer',
      jobDescription: 'Build scalable systems that impact millions of users',
      applicationDate: '2025-10-27',
      status: 'applied',
      responseDate: '',
      field_1762439194058: 'hr_company',
    },
    notes: [],
    createdAt: '2025-10-27T00:00:00.000Z',
    updatedAt: '2025-11-06T14:34:00.291Z',
  },
  {
    id: 'app-1730808000000-2',
    data: {
      companyName: 'Amazon',
      jobPosition: 'Full Stack Engineer',
      jobDescription: 'Join a fast-growing startup with great culture',
      applicationDate: '2025-10-28',
      status: '1st_interview_scheduled',
      responseDate: '2025-10-31',
      field_1762439194058: 'hr_company',
      field_1762439550951: '2025-11-01',
    },
    notes: [],
    createdAt: '2025-10-28T00:00:00.000Z',
    updatedAt: '2025-11-06T18:41:39.463Z',
  },
  {
    id: 'app-1730808000000-3',
    data: {
      companyName: 'Apple',
      jobPosition: 'Backend Developer',
      jobDescription: 'Work with talented engineers on innovative products',
      applicationDate: '2025-10-29',
      status: 'interview_completed',
      responseDate: '2025-11-01',
      field_1762439194058: 'direct_apply',
      field_1762439550951: '2025-11-03',
    },
    notes: [
      {
        id: 'note-1762439895211',
        content:
          'Interview went well, a lot of questions regarding my current company.\n\nKey parts:\n- Why leaving company.\n- Biggest challange\n- Why choosing apple',
        createdAt: '2025-11-06T14:38:15.211Z',
        updatedAt: '2025-11-06T14:38:15.211Z',
      },
    ],
    createdAt: '2025-10-29T00:00:00.000Z',
    updatedAt: '2025-11-06T14:38:15.212Z',
  },
  {
    id: 'app-1730808000000-4',
    data: {
      companyName: 'Microsoft',
      jobPosition: 'DevOps Engineer',
      jobDescription: 'Remote-first company with competitive compensation',
      applicationDate: '2025-10-14',
      status: 'offer_received',
      responseDate: '2025-10-18',
      field_1762439194058: 'direct_apply',
      field_1762439550951: '2025-10-24',
      field_1762440135267: '2025-11-01',
    },
    notes: [
      {
        id: 'note-1762439911681',
        content:
          'Interview went well, a lot of questions regarding my current company.\n\nKey parts:\n- Why leaving company.\n- Biggest challange\n- Why choosing Microsoft',
        createdAt: '2025-11-06T14:38:31.681Z',
        updatedAt: '2025-11-06T14:38:31.681Z',
      },
      {
        id: 'note-1762441704988',
        content: '2nd interview went fine.\n\nA lot of technical questions.',
        createdAt: '2025-11-06T15:08:24.988Z',
        updatedAt: '2025-11-06T15:08:24.988Z',
      },
    ],
    createdAt: '2025-10-30T00:00:00.000Z',
    updatedAt: '2025-11-06T15:08:24.989Z',
  },
  {
    id: 'app-1730808000000-5',
    data: {
      companyName: 'Netflix',
      jobPosition: 'React Developer',
      jobDescription: 'Lead technical initiatives and mentor junior developers',
      applicationDate: '2025-10-31',
      status: 'rejected',
      responseDate: '2025-11-03',
      field_1762439194058: 'direct_apply',
    },
    notes: [
      {
        id: 'note-1762439983226',
        content: 'Rejected because of needed other skill',
        createdAt: '2025-11-06T14:39:43.226Z',
        updatedAt: '2025-11-06T14:39:43.226Z',
      },
    ],
    createdAt: '2025-10-31T00:00:00.000Z',
    updatedAt: '2025-11-06T14:39:43.226Z',
  },
  {
    id: 'app-1730808000000-6',
    data: {
      companyName: 'Tesla',
      jobPosition: 'TypeScript Developer',
      jobDescription: 'Contribute to open source projects and internal tools',
      applicationDate: '2025-11-01',
      status: 'withdrawn',
      responseDate: '2025-11-04',
      field_1762439194058: 'hr_company',
    },
    notes: [
      {
        id: 'note-1762439964886',
        content: 'After carefully reviewing the code challenge, I does not worth doing it.',
        createdAt: '2025-11-06T14:39:24.886Z',
        updatedAt: '2025-11-06T14:39:24.886Z',
      },
    ],
    createdAt: '2025-11-01T00:00:00.000Z',
    updatedAt: '2025-11-06T14:39:24.887Z',
  },
  {
    id: 'app-1730808000000-7',
    data: {
      companyName: 'Stripe',
      jobPosition: 'Software Engineer',
      jobDescription: 'Design and implement core platform features',
      applicationDate: '2025-11-02',
      status: 'applied',
      responseDate: '',
      field_1762439194058: 'direct_apply',
    },
    notes: [],
    createdAt: '2025-11-02T00:00:00.000Z',
    updatedAt: '2025-11-06T14:27:11.082Z',
  },
  {
    id: 'app-1730808000000-8',
    data: {
      companyName: 'Airbnb',
      jobPosition: 'Principal Engineer',
      jobDescription: 'Collaborate with cross-functional teams',
      applicationDate: '2025-11-03',
      status: 'applied',
      responseDate: '',
      field_1762439194058: 'hr_company',
    },
    notes: [],
    createdAt: '2025-11-03T00:00:00.000Z',
    updatedAt: '2025-11-06T14:34:05.813Z',
  },
  {
    id: 'app-1730808000000-9',
    data: {
      companyName: 'Uber',
      jobPosition: 'Staff Engineer',
      jobDescription: 'Shape the future of our product architecture',
      applicationDate: '2025-11-04',
      status: '1st_interview_scheduled',
      responseDate: '2025-11-07',
      field_1762439194058: 'hr_company',
      field_1762439550951: '2025-11-14',
    },
    notes: [],
    createdAt: '2025-11-04T00:00:00.000Z',
    updatedAt: '2025-11-06T18:41:47.531Z',
  },
];

export const DEMO_CUSTOM_FIELDS: CustomField[] = [
  {
    id: 'companyName',
    name: 'Company Name',
    type: 'text',
    required: true,
    order: 1,
    showInTable: true,
  },
  {
    name: 'Application Type',
    type: 'select',
    required: true,
    showInTable: true,
    options: [
      {
        value: 'hr_company',
        label: 'HR Company',
        color: '#ff9300',
      },
      {
        value: 'direct_apply',
        label: 'Direct Apply',
        color: '#0433ff',
      },
    ],
    id: 'field_1762439194058',
    order: 2,
  },
  {
    id: 'jobPosition',
    name: 'Job Title',
    type: 'text',
    required: false,
    order: 3,
    showInTable: false,
  },
  {
    id: 'jobDescription',
    name: 'Job Description',
    type: 'textarea',
    required: false,
    order: 4,
    showInTable: false,
  },
  {
    id: 'applicationDate',
    name: 'Application Date',
    type: 'date',
    required: true,
    order: 5,
    showInTable: true,
  },
  {
    id: 'status',
    name: 'Status',
    type: 'select',
    required: true,
    order: 6,
    options: [
      { value: 'applied', label: 'Applied', color: '#0070F3' },
      { value: '1st_interview_scheduled', label: '1st Interview Scheduled', color: '#F5A623' },
      { value: 'interview_completed', label: 'Interview Completed', color: '#50E3C2' },
      { value: 'offer_received', label: 'Offer Received', color: '#00C853' },
      { value: 'rejected', label: 'Rejected', color: '#ff2600' },
      { value: 'withdrawn', label: 'Withdrawn', color: '#A3A3A3' },
      { value: '2st_interview_scheduled', label: '2nd Interview Scheduled', color: '#ffaa00' },
    ],
    showInTable: true,
  },
  {
    id: 'responseDate',
    name: '1st Response',
    type: 'date',
    required: false,
    order: 7,
    showInTable: true,
  },
  {
    name: '1st Interview',
    type: 'date',
    required: false,
    showInTable: true,
    id: 'field_1762439550951',
    order: 8,
  },
  {
    name: '2nd Interview',
    type: 'date',
    required: false,
    showInTable: true,
    id: 'field_1762440135267',
    order: 9,
  },
];

export const DEMO_CHART_CONFIGS: ChartConfig[] = [
  {
    id: 'default-apps-daily',
    title: 'Applications & Responses per Day',
    chartType: 'line',
    series: [
      {
        id: 'series-1',
        label: 'Applications',
        dataSource: 'applications-count',
        color: '#0056d6',
      },
      {
        id: 'series-1762438900668',
        label: 'First Response',
        dataSource: 'custom-field',
        customFieldId: 'responseDate',
        color: '#ff9300',
      },
    ],
    groupBy: 'day',
    dateRange: 'last7',
    order: 1,
    createdAt: '2025-11-06T14:15:02.690Z',
  },
  {
    id: 'default-apps-monthly',
    title: 'Applications & Responses Per Month',
    chartType: 'bar',
    series: [
      {
        id: 'series-1',
        label: 'Applications Per Month',
        dataSource: 'applications-count',
        color: '#0056d6',
      },
      {
        id: 'series-1762438994351',
        label: 'First Response',
        dataSource: 'custom-field',
        customFieldId: 'responseDate',
        color: '#ff9300',
      },
    ],
    groupBy: 'month',
    order: 2,
    createdAt: '2025-11-06T14:15:02.690Z',
  },
  {
    id: 'default-status-breakdown',
    title: 'Status Breakdown',
    chartType: 'pie',
    series: [
      {
        id: 'series-1',
        label: 'Status Breakdown',
        dataSource: 'custom-field',
        customFieldId: 'status',
        color: '#000000',
      },
    ],
    groupBy: 'value',
    order: 3,
    createdAt: '2025-11-06T14:15:02.690Z',
  },
  {
    id: 'chart-1762439420751',
    title: 'Application Type',
    chartType: 'pie',
    series: [
      {
        id: 'series-1',
        label: 'Type',
        dataSource: 'custom-field',
        color: '#000000',
        customFieldId: 'field_1762439194058',
      },
    ],
    groupBy: 'day',
    dateRange: 'last30',
    order: 4,
    createdAt: '2025-11-06T14:30:20.751Z',
  },
];

export const DEMO_OVERVIEW_CARDS: OverviewCardConfig[] = [
  {
    id: 'default-total-apps',
    title: 'Total Applications',
    dataSource: 'total-applications',
    order: 1,
    createdAt: '2025-11-06T14:15:02.690Z',
  },
  {
    id: 'default-total-responses',
    title: 'Total Responses',
    dataSource: 'total-responses',
    order: 2,
    createdAt: '2025-11-06T14:15:02.690Z',
  },
  {
    id: 'default-response-rate',
    title: 'Response Rate',
    dataSource: 'response-rate',
    order: 3,
    createdAt: '2025-11-06T14:15:02.690Z',
  },
  {
    id: 'default-avg-response-time',
    title: 'Avg Response Time',
    dataSource: 'avg-response-time',
    order: 4,
    createdAt: '2025-11-06T14:15:02.690Z',
  },
];

// Load demo data into localStorage
export const loadDemoData = () => {
  try {
    // Save demo applications
    localStorage.setItem('job_tracker_applications', JSON.stringify(DEMO_APPLICATIONS));

    // Save demo custom fields
    localStorage.setItem('job_tracker_custom_fields', JSON.stringify(DEMO_CUSTOM_FIELDS));

    // Save demo chart configurations
    const chartConfigs = {
      charts: DEMO_CHART_CONFIGS,
      overviewCards: DEMO_OVERVIEW_CARDS,
    };
    localStorage.setItem('job_tracker_chart_configs', JSON.stringify(chartConfigs));

    // Save default preferences (if not already set)
    const existingPrefs = localStorage.getItem('job_tracker_preferences');
    if (!existingPrefs) {
      const defaultPreferences = {
        theme: 'system',
        defaultPagination: 20,
      };
      localStorage.setItem('job_tracker_preferences', JSON.stringify(defaultPreferences));
    }

    return true;
  } catch (error) {
    console.error('Error loading demo data:', error);
    return false;
  }
};
