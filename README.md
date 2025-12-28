# Instagram Stories Feature

A simplified, mobile-first implementation of the Instagram Stories feature built with React. This application allows users to view a series of stories with smooth transitions, auto-advance functionality, and intuitive navigation controls.

## ✨ Features

- 📱 **Mobile-First Design** - Optimized for mobile devices with responsive layout
- 🎨 **Premium UI** - Classy, modern design with smooth animations and gradients
- 🖼️ **Image Stories** - Display stories with images from external sources
- ⏱️ **Auto-Advance** - Stories automatically progress after 5 seconds
- 👆 **Manual Navigation** - Tap left/right sides to navigate between stories
- 📊 **Progress Indicators** - Visual progress bars for each story
- 🔄 **Smooth Transitions** - Elegant animations for story viewing
- ⚡ **Image Preloading** - Preloads next story for seamless experience
- 🎯 **Loading States** - Proper loading indicators and error handling
- ♿ **Accessibility** - Keyboard navigation and ARIA labels
- 🚫 **No External Libraries** - Core functionality built without external dependencies

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd instagram-stories
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Usage

### Viewing Stories

1. **Story List**: Scroll horizontally through the list of available stories at the top
2. **Open Story**: Tap on any user's avatar to view their stories
3. **Navigate**: 
   - Tap the **left side** of the screen to go to the previous story
   - Tap the **right side** of the screen to go to the next story
   - Use **arrow keys** (← →) for keyboard navigation
4. **Close**: Tap the **×** button or press **Escape** to close the story viewer
5. **Auto-Advance**: Stories automatically move to the next one after 5 seconds

### Story Data

Stories are loaded from `public/stories.json`. The file structure:

```json
[
  {
    "id": 1,
    "username": "user_name",
    "userAvatar": "avatar_url",
    "stories": [
      {
        "id": 101,
        "type": "image",
        "url": "image_url",
        "duration": 5000
      }
    ]
  }
]
```

## 🎨 Design Features

- **Dark Theme**: Elegant black background with vibrant gradients
- **Gradient Accents**: Purple-to-pink gradients for visual appeal
- **Glassmorphism**: Modern frosted glass effects
- **Micro-animations**: Smooth hover and tap effects
- **Custom Typography**: Inter font for clean, modern look
- **Mobile Optimized**: Touch-friendly interface with proper spacing

## 🏗️ Project Structure

```
instagram-stories/
├── public/
│   ├── stories.json          # Story data
│   └── index.html            # HTML template
├── src/
│   ├── components/
│   │   ├── StoriesList.js    # Horizontal story list
│   │   └── StoryViewer.js    # Full-screen story viewer
│   ├── App.js                # Main application component
│   ├── App.css               # Application styles
│   ├── index.js              # Entry point
│   └── index.css             # Global styles
└── package.json
```

## 🛠️ Technologies Used

- **React** - UI library
- **CSS3** - Styling with modern features (Grid, Flexbox, Animations)
- **JavaScript (ES6+)** - Modern JavaScript features
- **Unsplash** - Free high-quality images
- **Pravatar** - Avatar generation

## 📝 Requirements Met

✅ Mobile-only design (mobile-first approach)  
✅ Horizontally scrollable story list  
✅ Stories fetched from external file  
✅ Manual navigation (tap left/right)  
✅ Auto-advance after 5 seconds  
✅ Proper loading states  
✅ No external libraries for core functionality  
✅ Smooth transitions  
✅ Premium, classy UI design

## 🎯 Key Implementation Details

### Auto-Advance Logic
- Uses `setInterval` to track progress
- Automatically moves to next story after 5 seconds
- Closes viewer when reaching the last story

### Image Preloading
- Preloads the next story image for seamless transitions
- Shows loading spinner while current image loads
- Prevents progress until image is fully loaded

### Navigation
- Touch-based navigation for mobile devices
- Keyboard support for desktop testing
- Visual feedback on tap/click

### Progress Bars
- Individual progress bar for each story
- Smooth animation using CSS transitions
- Visual indicator of current, completed, and upcoming stories

## 🔧 Customization

### Changing Story Duration
Edit the `duration` property in `stories.json` (in milliseconds):
```json
{
  "duration": 5000  // 5 seconds
}
```

### Adding New Stories
Add new entries to `public/stories.json`:
```json
{
  "id": 7,
  "username": "new_user",
  "userAvatar": "https://i.pravatar.cc/150?img=7",
  "stories": [
    {
      "id": 701,
      "type": "image",
      "url": "https://images.unsplash.com/photo-xxxxx",
      "duration": 5000
    }
  ]
}
```

### Styling
Modify CSS variables in `src/App.css`:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --dark-bg: #000000;
  /* ... other variables */
}
```

## 📱 Mobile Testing

For best results, test on actual mobile devices or use browser DevTools:

1. Open Chrome DevTools (F12)
2. Click the device toolbar icon (Ctrl+Shift+M)
3. Select a mobile device (iPhone, Android)
4. Refresh the page

## 🚀 Deployment

Build the production version:
```bash
npm run build
```

The optimized files will be in the `build/` directory, ready for deployment to any static hosting service.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Images from [Unsplash](https://unsplash.com)
- Avatars from [Pravatar](https://pravatar.cc)
- Inspired by Instagram Stories feature
