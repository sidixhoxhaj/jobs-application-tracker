# Jobs Application Tracker

A modern, local-first ReactJS application for tracking job applications with powerful customization, statistics, and notes management. Keep all your job search organized in one place with data stored securely in your browser's local storage.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 📊 Dashboard & Application Management
- **Comprehensive table view** displaying all applications with sortable columns
- **Smart search** across all fields for quick filtering
- **Status-based filtering** with color-coded badges
- **Flexible pagination** (20, 40, or 60 items per page)
- **Quick actions** - Edit, delete, view details, or manage notes directly from the table
- **Responsive mobile view** - Expandable rows on smaller screens (<768px)
- **Empty states** with helpful onboarding for new users

### ✏️ Application & Notes Management
- **Add/Edit applications** with dynamic forms based on your custom fields
- **Detailed application view** modal with full information
- **Notes system** - Attach timestamped notes to any application
- **Notes timeline** - Chronological view of all notes (newest or oldest first)
- **Delete protection** - Confirmation dialogs prevent accidental deletions
- **Form validation** - Required field enforcement with error highlighting
- **Auto-save** - All changes immediately persisted to local storage

### 🎨 Fully Customizable Fields
- **Default fields included**: Company Name, Job Position, Job Description, Application Date, Status, Response Date
- **Add unlimited custom fields** to track anything you need
- **7 field types supported**:
  - Text input (short text)
  - Text area (long text, descriptions)
  - Date picker (with calendar UI)
  - Dropdown/Select (with custom options and colors)
  - Number input (salary, headcount, etc.)
  - URL input (job postings, company sites)
  - Checkbox (remote, willing to relocate, etc.)
- **Drag-and-drop reordering** for optimal workflow
- **Mark fields as required or optional**
- **Edit or delete** any field, including defaults
- **Status color customization** with 7 predefined colors

### 📈 Statistics & Analytics
- **Interactive dashboard** with comprehensive metrics:
  - Total applications count
  - Applications by status (pie chart with drill-down)
  - Applications over time (line chart)
  - Response rate calculation
  - Average response time
- **Clickable charts** - Click data points to view filtered applications
- **Date range filtering** - Focus on specific time periods
- **Empty states** when no data available
- **Responsive chart layouts** adapting to screen size

### 🌓 Dark Mode & Theming
- **System preference detection** - Automatically matches your OS theme
- **Manual toggle** - Switch themes with accessible toggle button
- **Persistent preference** - Theme choice saved to local storage
- **Smooth transitions** between light and dark modes
- **High contrast** for optimal readability in both modes

### 📱 Mobile Responsive Design
- **Mobile-first approach** with breakpoints at 768px and 1024px
- **Expandable table rows** on mobile for space efficiency
- **Touch-friendly** buttons and interactions
- **Adaptive navigation** with hamburger menu on small screens
- **Optimized modals** for mobile viewing

### 💾 Data Management & Export
- **Local storage** - Your data stays private in your browser
- **Three-file system**:
  - Applications data
  - Custom fields configuration
  - User preferences (theme, pagination)
- **Export to CSV** - Download applications for Excel/Google Sheets
- **Demo data option** - Pre-filled examples for first-time users
- **Start from scratch** option for clean slate

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/job-application-tracker.git
cd job-application-tracker
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
   - Navigate to `http://localhost:5173`
   - Choose to start with demo data or from scratch

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at localhost:5173 |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |
| `npm test` | Run Vitest unit tests |

### Production Build

```bash
# Build for production
npm run build

# The build output will be in the `dist/` folder
# Deploy this folder to any static hosting service
```

## 📖 Usage Guide

### Adding Your First Application

1. Click **"Add Application"** button in the top-right corner of the dashboard
2. Fill in the required fields (marked with *)
3. Optionally add notes in the notes section
4. Click **"Save Application"** to add it to your tracker

### Managing Applications

**Editing:**
- Click the edit icon (✏️) on any row
- Modify any field values
- Click "Save Application" to update

**Viewing Details:**
- Click the view icon (👁️) on any row
- See all application information in a modal
- Access notes timeline from the detail view

**Deleting:**
- Click the delete icon (🗑️) on any row
- Confirm deletion in the dialog
- Deletion is permanent (no undo)

### Adding and Managing Notes

1. Click the notes icon (📝) on any application row
2. View existing notes in chronological order
3. Add new notes in the text area
4. Click "Add Note" to save
5. Delete notes using the trash icon
6. Notes are automatically timestamped

### Customizing Fields

1. Navigate to **"Custom Fields"** from the top navigation
2. **Add new fields:**
   - Click "Add Field"
   - Enter field name and choose type
   - Set required/optional
   - For dropdowns: add options and choose colors
3. **Reorder fields:**
   - Drag and drop fields using the handle (⋮⋮)
   - New order applies immediately to forms
4. **Edit existing fields:**
   - Click edit icon on any field
   - Modify properties as needed
5. **Delete fields:**
   - Click delete icon
   - Confirm deletion (data will be lost)

### Viewing Statistics

1. Navigate to **"Statistics"** from the top navigation
2. **View key metrics:**
   - Total applications
   - Status distribution (pie chart)
   - Applications over time (line chart)
   - Response rate and average response time
3. **Filter by date range:**
   - Select start and end dates
   - Charts update automatically
4. **Interactive charts:**
   - Click pie chart segments to filter dashboard by status
   - Click line chart points to see applications from that day

### Search and Filtering

- **Search:** Type in the search bar to filter across all fields
- **Status filter:** Select a status from the dropdown
- **Sort:** Click any column header to sort (click again to reverse)
- **Pagination:** Choose 20, 40, or 60 items per page

### Exporting Data

1. Click **"Export to CSV"** button on the dashboard
2. File downloads automatically
3. Open in Excel, Google Sheets, or any spreadsheet software
4. All visible columns are included in the export

### Dark Mode

- Click the theme toggle button (🌙/☀️) in the navigation
- Theme preference is saved automatically
- App respects system preference on first visit

## 🏗️ Project Structure

```
job-application-tracker/
├── src/
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── DateInput/
│   │   │   ├── Dropdown/
│   │   │   ├── StatusBadge/
│   │   │   ├── ThemeToggle/
│   │   │   ├── WelcomeModal/
│   │   │   ├── ErrorBoundary/
│   │   │   ├── LoadingSpinner/
│   │   │   └── EmptyState/
│   │   ├── dashboard/        # Dashboard page components
│   │   │   ├── ApplicationTable/
│   │   │   ├── TableRow/
│   │   │   ├── ExpandableTableRow/
│   │   │   ├── ApplicationModal/
│   │   │   ├── Filters/
│   │   │   └── Pagination/
│   │   ├── customFields/     # Custom fields management
│   │   │   ├── FieldList/
│   │   │   ├── FieldItem/
│   │   │   └── FieldModal/
│   │   ├── statistics/       # Statistics & charts
│   │   │   ├── StatCard/
│   │   │   ├── StatusPieChart/
│   │   │   ├── TimelineChart/
│   │   │   ├── DateRangeFilter/
│   │   │   └── ChartContainer/
│   │   ├── notes/            # Notes management
│   │   │   ├── NotesModal/
│   │   │   └── NoteItem/
│   │   ├── layout/           # Layout components
│   │   │   └── Navigation/
│   │   └── pages/            # Route components
│   │       ├── DashboardPage/
│   │       ├── CustomFieldsPage/
│   │       └── StatisticsPage/
│   ├── redux/
│   │   ├── store.ts          # Redux store configuration
│   │   ├── hooks.ts          # Typed Redux hooks
│   │   └── slices/           # Redux Toolkit slices
│   │       ├── applicationsSlice.ts
│   │       ├── customFieldsSlice.ts
│   │       ├── preferencesSlice.ts
│   │       └── chartConfigsSlice.ts
│   ├── services/             # Business logic & utilities
│   │   ├── localStorageService.ts    # Data persistence
│   │   ├── statsService.ts           # Statistics calculations
│   │   └── chartDataService.ts       # Chart data transformation
│   ├── data/                 # Static data & demo content
│   │   └── demoData.ts
│   ├── context/              # React Context providers
│   │   └── ThemeContext.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useDebounce.ts
│   │   └── useClickOutside.ts
│   ├── types/                # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── customField.ts
│   │   └── chartConfig.ts
│   ├── styles/               # Global styles & design tokens
│   │   ├── global.scss
│   │   └── tokens/
│   │       ├── _spacing.scss
│   │       ├── _typography.scss
│   │       ├── _theme-colors.scss
│   │       └── _index.scss
│   ├── App.tsx               # Main application component
│   └── main.tsx              # Application entry point
├── public/                   # Static assets
├── index.html                # HTML template
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies & scripts
```

## 🗄️ Data Models

### Local Storage Structure

The app uses browser localStorage with three keys:

#### 1. `job_tracker_applications`
Stores all job applications:
```typescript
interface Application {
  id: string;                    // Unique identifier
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
  data: {                        // Dynamic field values
    [fieldId: string]: any;
  };
  notes: Note[];                 // Array of notes
}

interface Note {
  id: string;                    // Unique identifier
  content: string;               // Note text
  timestamp: string;             // ISO timestamp
}
```

#### 2. `job_tracker_custom_fields`
Stores field configuration:
```typescript
interface CustomField {
  id: string;                    // e.g., "companyName_123"
  name: string;                  // Display label
  type: FieldType;               // text, textarea, date, select, number, url, checkbox
  required: boolean;             // Validation flag
  order: number;                 // Display order
  options?: FieldOption[];       // For select fields
}

interface FieldOption {
  label: string;                 // Display text
  value: string;                 // Stored value
  color?: string;                // Badge color (for status)
}
```

#### 3. `job_tracker_preferences`
Stores user preferences:
```typescript
interface Preferences {
  theme: 'light' | 'dark' | 'system';
  itemsPerPage: 20 | 40 | 60;
}
```

### Default Status Options

The app includes 7 predefined status colors:
- **Blue** (#3B82F6) - Applied, Screening
- **Yellow** (#FBBF24) - Interview Scheduled
- **Orange** (#F97316) - Interview Completed
- **Green** (#10B981) - Offer Received
- **Red** (#EF4444) - Rejected
- **Gray** (#6B7280) - Withdrawn
- **Purple** (#A855F7) - Custom statuses

All statuses are fully customizable through the Custom Fields page.

## 🛠️ Technology Stack

### Core Technologies
- **React 18.2** - UI library with hooks and functional components
- **TypeScript 5.3** - Type-safe JavaScript with full type definitions
- **Vite 5.0** - Fast build tool and dev server with HMR

### State Management
- **Redux Toolkit 2.0** - Centralized state management with slices
- **React Redux 9.0** - React bindings for Redux
- **React Context** - Theme management

### Routing
- **React Router v6** - Client-side routing with lazy loading

### UI & Styling
- **SCSS/Sass** - CSS preprocessing with design tokens
- **CSS Variables** - Dynamic theming (light/dark mode)
- **BEM Methodology** - Component-scoped class naming

### Data Visualization
- **Recharts 2.10** - React charting library for statistics
- **Interactive charts** - Click handlers for drill-down navigation

### Form Components
- **react-datepicker 4.25** - Accessible date picker with calendar UI
- **Custom form components** - Fully controlled inputs with validation

### Testing
- **Vitest** - Fast unit test runner compatible with Vite
- **Testing Library** - React component testing utilities
- **Jest DOM** - Custom matchers for DOM assertions

### Development Tools
- **ESLint** - Code quality and consistency
- **TypeScript strict mode** - Maximum type safety
- **Vite plugin React** - Fast refresh and JSX transform

### Performance Optimizations
- **Code splitting** - Route-level lazy loading
- **React.memo** - Component memoization
- **Tree shaking** - Dead code elimination
- **Minification** - Production bundle optimization

## 🎨 Design System

### Minimal Black & White Aesthetic
- **Color Palette:** Black (#000), White (#FFF), Grayscale
- **Typography:** Inter font family, 14px base size
- **Spacing:** 8px base unit with consistent scale
- **Status Colors:** Minimal but functional accent colors

### Design Principles
- Clean, distraction-free interface
- Typography and spacing over decorative elements
- Subtle shadows and borders
- Accessibility-first approach

## ♿ Accessibility Features

- **ARIA labels** on all interactive elements and icon buttons
- **Keyboard navigation** - Full keyboard support for all features
- **Focus management** - Visible focus indicators and modal trapping
- **Screen reader support** - Semantic HTML and ARIA attributes
- **High contrast** - Meets WCAG AA standards in both themes
- **Error messaging** - Clear, actionable error descriptions

## 🚀 Performance

### Bundle Size
- **Initial load:** ~117 KB gzipped (main bundle)
- **Route chunks:** 20-50 KB gzipped per page
- **Total reduction:** 55% smaller than monolithic bundle

### Optimizations
- Lazy loading for route components
- Memoized list items to prevent re-renders
- Debounced search input
- Efficient Redux selectors
- Minimal re-renders with React.memo

## 🔒 Privacy & Data Security

- **100% local storage** - No server, no cloud, no third parties
- **Browser-based** - Data never leaves your device
- **No tracking** - No analytics or telemetry
- **Offline-capable** - Works without internet connection
- **Export anytime** - CSV export for data portability

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style and conventions
- Write meaningful commit messages
- Add comments only for complex logic
- Test your changes thoroughly
- Update documentation if needed

## 📝 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

## 🐛 Support & Issues

If you encounter any issues or have questions:
- Open an issue on [GitHub Issues](https://github.com/yourusername/job-application-tracker/issues)
- Provide detailed reproduction steps
- Include browser version and error messages if applicable

## 🙏 Acknowledgments

- **Inter font** by Rasmus Andersson
- **Recharts** for beautiful React charts
- **React community** for amazing ecosystem and tools

---

**Built with ❤️ for job seekers everywhere. Good luck with your search! 🚀**
