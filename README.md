# Website Time Tracker Chrome Extension

A Chrome extension that tracks how much time you spend on different websites. It provides accurate timing statistics and a clean user interface to view your browsing habits.

## Features

- **Real-time Website Tracking**: Automatically tracks time spent on each website
- **Accurate Domain Tracking**: 
  - Properly handles subdomains (e.g., all YouTube tabs are tracked under youtube.com)
  - Removes 'www.' prefix for consistent domain tracking
- **Precise Time Display**:
  - Shows seconds for durations under 1 minute
  - Shows MM:SS format for durations under 1 hour
  - Shows HH:MM:SS format for durations over 1 hour
- **Top 10 Websites**: Displays your most visited websites, sorted by time spent
- **Data Management**:
  - Individual website statistics can be deleted with the '✕' button
  - All data can be cleared with the "Clear Data" button
- **Reliable Time Tracking**:
  - Auto-saves data every 30 seconds to prevent data loss
  - Handles browser crashes and sudden closures
  - Tracks time accurately even with multiple windows and tabs

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. After installation, you'll see the extension icon in your Chrome toolbar
2. Click the icon to view your website time statistics
3. The popup will show your top 10 most visited websites
4. Use the '✕' button next to each site to remove individual statistics
5. Use the "Clear Data" button to reset all statistics

## Technical Details

- Uses Chrome's Storage API for persistent data storage
- Implements periodic auto-saving every 30 seconds
- Handles various browser events:
  - Tab activation and updates
  - Window focus changes
  - Browser startup and installation
- Excludes Chrome internal pages (chrome://) and extension pages from tracking

## Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- You have full control over your browsing statistics

## License

This project is open source and available under the MIT License. "# web-site-timer" 
