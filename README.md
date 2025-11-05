# Jobs Application Tracker

A lightweight, local-first ReactJS application for tracking job applications with fully customizable fields. Keep all your job search data organized in one place, stored securely in JSON files on your local machine.

## Features

### 📊 Dashboard & Table View
- **Comprehensive table view** of all job applications with key information at a glance
- **Smart search** across all fields to quickly find applications
- **Column sorting** - Click any column header to sort ascending or descending
- **Advanced filtering** for dropdown fields (like application status)
- **Flexible pagination** - Choose between 20, 40, or 60 items per page
- **Color-coded status indicators** for quick visual identification
- **In-line actions** - Edit or delete applications directly from the table

### ✏️ Application Management
- **Easy-to-use modal** for adding new applications
- **Edit existing applications** with pre-filled data
- **Delete applications** with confirmation to prevent accidents
- **Dynamic forms** that adapt to your custom field configuration
- **Required field validation** to ensure data completeness

### 🎨 Fully Customizable Fields
- **Default fields included**: Company Name, Job Position, Job Description, Application Date, Status, Response Date
- **Add custom fields** to track anything important to you
- **Multiple field types supported**:
  - Text input
  - Text area (for longer content)
  - Date picker
  - Dropdown/Select (with custom options)
  - Number input
  - Checkbox
- **Mark fields as required or optional**
- **Reorder fields** to match your workflow
- **Edit or remove** any field, including defaults
- **Separate configuration** stored in its own JSON file

### 💾 Data Management
- **Local JSON storage** - Your data stays on your machine
- **Auto-save functionality** - Changes are immediately persisted
- **Export to CSV** - Download your data for use in spreadsheets or other tools
- **Two-file system**:
  - `custom_fields_config.json` - Your field configuration
  - `job_applications.json` - Your application data

## Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/job-application-tracker.git
cd job-application-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Usage

### Adding Your First Application

1. Click the **"Add New Application"** button in the top-right corner
2. Fill in the application details in the modal form
3. Required fields are marked with an asterisk (*)
4. Click **"Save"** to add the application to your tracker

### Customizing Fields

1. Navigate to the **"Custom Fields"** page from the navigation bar
2. Add new fields by clicking **"Add New Field"**
3. Configure field properties:
   - Field name
   - Field type
   - Required/Optional
   - For dropdown fields: add custom options
4. Edit or remove existing fields as needed
5. Changes are automatically saved

### Filtering and Searching

- Use the **search bar** to find applications by any field content
- Use **filter dropdowns** to narrow down by status or other select fields
- Click **column headers** to sort by that column
- Adjust **items per page** at the bottom of the table

### Exporting Data

Click the **"Export to CSV"** button to download your applications as a CSV file for backup or analysis in spreadsheet software.

## Project Structure

```
job-application-tracker/
├── src/
│   ├── components/        # React components
│   ├── services/          # File handling and export logic
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Helper functions
│   ├── context/           # React context for state management
│   └── App.jsx            # Main application component
├── public/
│   ├── custom_fields_config.json    # Field configuration
│   └── job_applications.json        # Application data
└── package.json
```

## Data Models

### Custom Fields Configuration
Each field in your tracker is defined with:
- **Unique ID** (e.g., `companyName_0`, `status_1`)
- **Field name** (display label)
- **Field type** (text, textarea, date, select, number, checkbox)
- **Required flag** (true/false)
- **Order** (position in the form)
- **Options** (for select/dropdown fields, including colors for status)

### Application Data
Each application entry contains:
- **Unique ID**
- **Creation timestamp**
- **Last updated timestamp**
- **Data object** with values for each custom field

## Status Management

The application comes with default status options:
- 🔵 Applied
- 🔵 Screening
- 🟡 Interview Scheduled
- 🟠 Interview Completed
- 🟢 Offer Received
- 🔴 Rejected
- ⚪ Withdrawn

You can fully customize these statuses, add new ones, or change their colors in the Custom Fields configuration.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy job hunting! 🚀**
