# Job Application Tracker - Technical Project Description

## Overview
A local ReactJS application for tracking job applications with customizable fields and comprehensive data management capabilities. The application stores data in JSON files and runs entirely in the browser with file system persistence.

## Core Features

### 1. Data Management
- **Storage Format**: JSON files
- **Two separate JSON files**:
  - `custom_fields_config.json` - Stores field configurations
  - `job_applications.json` - Stores actual job application data
- **Auto-save**: Automatic file updates on any data modification
- **Data Export**: CSV export functionality for job applications

### 2. Main Dashboard (Table View)

#### Default Fields (Customizable via Custom Fields page):
- Company Name (text)
- Job Position Title (text)
- Job Description (textarea)
- Date of Application (date)
- Status (dropdown/select)
- Date of First Response (date)

#### Table Features:
- **Search**: Global search across all fields
- **Sorting**: Column-by-column sorting (ascending/descending)
- **Filtering**: Available for dropdown/select fields only (e.g., Status)
- **Pagination**: 
  - Options: 20, 40, 60 items per page
  - Default: 20 per page
- **Visual Indicators**: Color coding based on status (e.g., Applied=Blue, Interview=Yellow, Offer=Green, Rejected=Red)
- **Actions per row**:
  - View (opens read-only modal with application details and notes timeline)
  - Edit (opens editable modal)
  - Notes (opens modal showing only notes/comments timeline)
  - Delete (with confirmation)

#### Top-Right Actions:
- "Add New Application" button (opens modal)
- "Export to CSV" button
- Dark mode toggle

### 3. Add/Edit Application Modal

#### Modal Features:
- **Dynamic form** based on custom fields configuration
- **Field types supported**:
  - Text input
  - Textarea
  - Date picker
  - Dropdown/Select
  - Number input
  - Checkbox
- **Validation**: Required fields marked with asterisk (*)
- **Actions**:
  - Save
  - Cancel

### 4. Custom Fields Configuration Page

#### Purpose:
Manage all application fields dynamically, making the system fully customizable.

#### Features:
- **Add New Field**:
  - Field Name
  - Field Type (text, textarea, date, select, number, checkbox)
  - Required/Optional toggle
  - Default value (optional)
  - For select fields: Add/remove options with color codes
  
- **Edit Existing Field**:
  - Modify any field property
  - Change field order (drag-and-drop or up/down arrows)
  
- **Remove Field**:
  - Delete any field (with confirmation)
  - Warning if field contains data

- **Preview**: Live preview of how the form will look

#### Default Fields:
All default fields are editable/removable, giving complete flexibility.

### 5. Status Management

#### Default Status Options:
- Applied (Blue - #3B82F6)
- Screening (Light Blue - #60A5FA)
- Interview Scheduled (Yellow - #FBBF24)
- Interview Completed (Orange - #F97316)
- Offer Received (Green - #10B981)
- Rejected (Red - #EF4444)
- Withdrawn (Gray - #6B7280)

#### Features:
- Fully customizable via Custom Fields page
- Each status can have associated color
- Status dropdown in filter bar

### 6. Notes & Comments System

#### Features:
- **Multiple notes per application** - Timeline/log style with chronological ordering
- **Timestamped entries** - Display format: dd/mm/yyyy
- **Note content**: Text area for detailed notes/comments
- **Actions**: 
  - Add new note
  - Edit existing note
  - Delete note (with confirmation)
- **Display Options**: 
  - **Notes action button** in table row - Opens modal showing only notes/comments timeline
  - **View action button** in table row - Opens full application details modal with notes timeline at the bottom
  - Notes timeline shows all notes in chronological order (newest first or oldest first, configurable)
- **Modal Views**:
  - **Notes Modal**: Dedicated modal for viewing/managing notes
  - **Application View Modal**: Read-only view of application with notes section at the bottom
  - **Edit Modal**: Editable form with notes section included

#### Use Cases:
- Track conversation details from interviews
- Record feedback from recruiters
- Document follow-up actions taken
- Log networking connections related to the application
- Keep a history of all communication and updates

### 7. Statistics Dashboard

#### New Route: `/statistics`

#### Metrics Displayed:

**Overview Cards:**
- Total Applications
- Total Responses (applications that received a response)
- Response Rate (percentage of applications with responses)
- Average Response Time (days from application to first response)

**Applications Over Time:**
- **Line graph** showing applications submitted per day
- **Interactive**: Click on any day point to see list of companies applied on that day
- **Drill-down**: Click on a company name to open full job application details modal
- X-axis: Date (daily view)
- Y-axis: Number of applications
- Date range selector (last 7/30/90 days, or custom date range)

**Responses Over Time:**
- **Line graph** showing responses received per day
- **Interactive**: Click on any day point to see list of companies that responded
- **Drill-down**: Click on a company name to open full job application details modal
- X-axis: Date (daily view)
- Y-axis: Number of responses
- Date range selector (last 7/30/90 days, or custom date range)

**Applications Per Month:**
- **Bar chart or line graph** showing total applications submitted each month
- Displays multiple months for trend analysis
- Hover shows exact count for each month

**Responses Per Month:**
- **Bar chart or line graph** showing total responses received each month
- Displays multiple months for trend analysis
- Hover shows exact count for each month

**Status Breakdown:**
- **Pie chart** showing distribution across all statuses
- Count and percentage for each status
- Legend with status colors
- Click on pie segment to filter main dashboard table by that status

#### Export Statistics:
- Export charts as PNG images
- Export statistics data as CSV

### 8. Dark Mode

### 8. Dark Mode

#### Features:
- **Toggle switch** in navigation bar (moon/sun icon)
- **Theme Priority** (in order of preference):
  1. User's manual selection (stored in localStorage)
  2. Browser/OS default theme (detected via `prefers-color-scheme`)
- **Persistent preference** stored in localStorage
- **Complete theme coverage**:
  - All pages and components
  - Tables, modals, forms
  - Charts and graphs
- **Initial load**: Checks user preference first, falls back to system preference

### 9. Mobile Responsive Design

### 9. Mobile Responsive Design

#### Design Philosophy:
- **Mobile-first approach**: Single codebase shared between desktop and mobile
- **Responsive breakpoints**: Adjust layout based on screen size
- **No separate mobile components**: Same components adapt to screen size

#### Table View (Mobile):
- **Expandable rows**: On mobile screens (< 768px), only the first column is visible by default
- **Expansion mechanism**: 
  - Arrow icon on the right side of each row
  - Click/tap arrow to expand row
  - Expanded view shows all other columns in a vertical layout beneath the row
  - Click/tap arrow again to collapse
- **Actions**: Edit, Delete, View, and Notes actions remain accessible in expanded view
- **Filters and search**: Remain at the top, may stack vertically on very small screens
- **Pagination controls**: Adapt to smaller screens with simplified layout

#### Modal Forms (Mobile):
- **Full-width modals** on mobile (with small margin)
- **Stacked form fields** for better readability
- **Touch-friendly inputs**: Large touch targets for buttons and form controls
- **Native date pickers**: Use device-native date/time selection when available
- **Scrollable content**: Modals scroll internally when content exceeds viewport height

#### Navigation (Mobile):
- **Responsive navigation bar**: 
  - Collapses to hamburger menu on small screens (< 768px)
  - Full navigation on larger screens
- **Theme toggle**: Always visible in navigation
- **Logo/Title**: Scales appropriately

#### No Swipe Gestures:
- All interactions use standard tap/click
- No swipe-to-delete or swipe-to-edit functionality

## Technical Architecture

### File Structure:
```
job-application-tracker/
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── ApplicationTable.jsx
│   │   │   ├── ExpandableTableRow.jsx
│   │   │   ├── TableFilters.jsx
│   │   │   ├── TablePagination.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── Modal/
│   │   │   ├── ApplicationModal.jsx (for Add/Edit)
│   │   │   ├── ApplicationViewModal.jsx (read-only view with notes)
│   │   │   ├── NotesModal.jsx (dedicated notes management)
│   │   │   └── DeleteConfirmation.jsx
│   │   ├── CustomFields/
│   │   │   ├── FieldConfigurator.jsx
│   │   │   ├── FieldEditor.jsx
│   │   │   └── FieldPreview.jsx
│   │   ├── Statistics/
│   │   │   ├── StatsDashboard.jsx
│   │   │   ├── OverviewCards.jsx
│   │   │   ├── StatusPieChart.jsx
│   │   │   ├── ApplicationsPerDayChart.jsx
│   │   │   ├── ResponsesPerDayChart.jsx
│   │   │   ├── ApplicationsPerMonthChart.jsx
│   │   │   ├── ResponsesPerMonthChart.jsx
│   │   │   └── DayDetailModal.jsx (shows companies for clicked day)
│   │   ├── Common/
│   │   │   ├── DynamicForm.jsx
│   │   │   ├── FormField.jsx
│   │   │   └── ThemeToggle.jsx
│   │   └── Layout/
│   │       ├── Navigation.jsx
│   │       └── Header.jsx
│   ├── services/
│   │   ├── fileService.js (Handle JSON read/write)
│   │   ├── exportService.js (CSV export)
│   │   ├── statsService.js (Calculate statistics)
│   │   └── validationService.js
│   ├── hooks/
│   │   ├── useApplications.js
│   │   ├── useCustomFields.js
│   │   ├── useNotes.js
│   │   ├── useTheme.js
│   │   ├── useStats.js
│   │   └── useMediaQuery.js (responsive)
│   ├── utils/
│   │   ├── dateHelpers.js
│   │   ├── colorHelpers.js
│   │   ├── sortHelpers.js
│   │   └── chartHelpers.js
│   ├── context/
│   │   ├── AppContext.js
│   │   └── ThemeContext.js
│   ├── styles/
│   │   ├── themes/
│   │   │   ├── light.js
│   │   │   └── dark.js
│   │   └── global.css
│   └── App.jsx
├── public/
│   ├── custom_fields_config.json
│   └── job_applications.json
└── package.json
```
│   │   ├── AppContext.js
│   │   └── ThemeContext.js
│   ├── styles/
│   │   ├── themes/
│   │   │   ├── light.js
│   │   │   └── dark.js
│   │   └── global.css
│   └── App.jsx
├── public/
│   ├── custom_fields_config.json
│   └── job_applications.json
└── package.json
```

### Data Models:

#### custom_fields_config.json:
```json
{
  "fields": [
    {
      "id": "companyName_0",
      "name": "Company Name",
      "type": "text",
      "required": true,
      "order": 1
    },
    {
      "id": "jobPosition_1",
      "name": "Job Position",
      "type": "text",
      "required": true,
      "order": 2
    },
    {
      "id": "jobDescription_2",
      "name": "Job Description",
      "type": "textarea",
      "required": false,
      "order": 3
    },
    {
      "id": "applicationDate_3",
      "name": "Date of Application",
      "type": "date",
      "required": true,
      "order": 4
    },
    {
      "id": "status_4",
      "name": "Status",
      "type": "select",
      "required": true,
      "options": [
        { "value": "applied", "label": "Applied", "color": "#3B82F6" },
        { "value": "screening", "label": "Screening", "color": "#60A5FA" },
        { "value": "interview_scheduled", "label": "Interview Scheduled", "color": "#FBBF24" },
        { "value": "interview_completed", "label": "Interview Completed", "color": "#F97316" },
        { "value": "offer_received", "label": "Offer Received", "color": "#10B981" },
        { "value": "rejected", "label": "Rejected", "color": "#EF4444" },
        { "value": "withdrawn", "label": "Withdrawn", "color": "#6B7280" }
      ],
      "order": 5
    },
    {
      "id": "firstResponseDate_5",
      "name": "Date of First Response",
      "type": "date",
      "required": false,
      "order": 6
    }
  ]
}
```

#### job_applications.json:
```json
{
  "applications": [
    {
      "id": "app_1",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-20T14:20:00Z",
      "data": {
        "companyName_0": "Google",
        "jobPosition_1": "Senior Software Engineer",
        "jobDescription_2": "Full-stack role working on search infrastructure...",
        "applicationDate_3": "2025-01-15",
        "status_4": "interview_scheduled",
        "firstResponseDate_5": "2025-01-20"
      },
      "notes": [
        {
          "id": "note_1",
          "content": "Applied through referral from John",
          "createdAt": "2025-01-15T10:35:00Z"
        },
        {
          "id": "note_2",
          "content": "Recruiter reached out for phone screen",
          "createdAt": "2025-01-20T14:20:00Z"
        },
        {
          "id": "note_3",
          "content": "Phone screen completed. Technical interview scheduled for Jan 25",
          "createdAt": "2025-01-22T16:45:00Z"
        }
      ]
    }
  ]
}
```

#### user_preferences.json:
```json
{
  "theme": "dark",
  "defaultPagination": 20
}
```

## Navigation Structure

### Routes:
1. `/` - Main Dashboard (Table View)
2. `/custom-fields` - Custom Fields Configuration
3. `/statistics` - Statistics Dashboard

### Navigation Bar:
- Logo/App Name
- Dashboard (link)
- Custom Fields (link)
- Statistics (link)
- Theme toggle (dark/light mode)

## User Workflows

### Workflow 1: Add New Application
1. User clicks "Add New Application" button
2. Modal opens with dynamic form based on custom fields
3. User fills required fields
4. Click "Save"
5. Data written to `job_applications.json`
6. Modal closes, table refreshes with new entry

### Workflow 2: Edit Application
1. User clicks Edit icon on table row
2. Modal opens pre-filled with existing data
3. User modifies fields
4. Click "Save"
5. `job_applications.json` updated
6. Table refreshes

### Workflow 3: Customize Fields
1. Navigate to Custom Fields page
2. Add/edit/remove fields as needed
3. Changes auto-save to `custom_fields_config.json`
4. Dashboard form automatically reflects changes

### Workflow 4: Filter & Search
1. Enter search term in search bar (searches all fields)
2. Select status from filter dropdown
3. Click column headers to sort
4. Change pagination size if needed

### Workflow 5: View Application Details
1. User clicks View icon on table row
2. Modal opens showing read-only application details
3. Notes timeline displayed at the bottom
4. User can navigate to Edit mode if changes needed
5. Close modal to return to table

### Workflow 6: Manage Notes
1. User clicks Notes icon on table row
2. Dedicated notes modal opens
3. View all notes in chronological timeline
4. Actions available:
   - Add new note
   - Edit existing note
   - Delete note
5. All changes auto-save to `job_applications.json`
6. Close modal to return to table

### Workflow 7: View Statistics
1. Navigate to Statistics page
2. View overview metrics in cards
3. Analyze daily/monthly charts:
   - Click on a day point in "Applications per Day" or "Responses per Day" chart
   - Modal shows list of companies for that day
   - Click on a company name to open full application details modal
4. Review status distribution in pie chart
5. Click on pie segment to navigate to Dashboard with status filter applied
6. Export specific charts or data as needed

### Workflow 8: Notes Management
1. From table, click Notes icon on any row
2. Dedicated notes modal opens showing timeline of all notes
3. Add new note with automatic timestamp (dd/mm/yyyy format)
4. Edit or delete existing notes
5. All changes auto-save to `job_applications.json`
6. Close modal to return to table

Alternatively, view notes within Application View modal:
1. Click View icon on table row
2. Application details modal opens
3. Scroll to bottom to see notes timeline
4. Notes are read-only in view mode; click Edit to modify

## Implementation Considerations

### File System Access
Since this is a browser-based React app, file system access options:
- **File System Access API** (requires user permission each time)
- **Electron wrapper** for desktop app (full file system access)
- **localStorage as backup** with download/upload JSON functionality
- **Recommended approach**: localStorage with export/import for portability

### Initial Setup
The app should create default files if they don't exist:
- `custom_fields_config.json` with default fields
- `job_applications.json` with empty applications array
- `user_preferences.json` with default preferences

### Field Reordering
For reordering fields in Custom Fields page:
- Option 1: Use `react-beautiful-dnd` for drag-and-drop
- Option 2: Simple up/down arrow buttons
- Recommended: Start with up/down buttons, add drag-and-drop later

### Confirmation Dialogs
- Delete applications: Yes, require confirmation
- Remove fields with data: Yes, show warning with data count
- Bulk operations: Yes, show summary before execution

### Charts & Graphs
Use a lightweight charting library like:
- **Chart.js** with react-chartjs-2
- **Recharts** (more React-friendly)
- Recommended: Recharts for better React integration

### Mobile Optimization
- Use CSS media queries with breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- Touch-friendly targets: minimum 44x44px
- Expandable table rows for mobile view
- No swipe gestures - standard tap/click interactions only

### Dark Mode Implementation
- Use CSS variables for theme colors
- Store preference in localStorage
- Detect system preference using `prefers-color-scheme`
- Ensure WCAG contrast ratios in both themes

## Performance Considerations

- **Lazy loading**: Load statistics page components only when navigated to
- **Virtualization**: For tables with 100+ rows, use react-window or react-virtualized
- **Debouncing**: Search input should debounce at 300ms
- **Memoization**: Use React.memo for table rows and chart components
- **Local caching**: Cache computed statistics until data changes

## Testing Strategy

- **Unit tests**: Services (file, export, stats, validation)
- **Integration tests**: Form submission, data persistence, notes management
- **E2E tests**: Complete workflows (add, edit, delete, view, notes)
- **Mobile testing**: Physical devices or browser dev tools - test expandable rows
- **Accessibility testing**: Keyboard navigation, screen readers

## Security & Privacy

- All data stored locally - no external servers
- No telemetry or tracking
- Export functionality allows user-controlled backups
- No sensitive data in localStorage (only theme preferences)

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-05
