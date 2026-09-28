# 🎨 3D Gesture Drawing App

A web-based application that allows you to draw in 3D space using hand gestures captured by your webcam. Draw natural 3D strokes by moving your finger in front of the camera.

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 🎯 **Real-Time Hand Detection** - Powered by MediaPipe
- 🎨 **3D Drawing** - Create beautiful 3D strokes with your hand movements
- 🖌️ **Customizable Brush** - Adjust size and color
- 💾 **Save Drawings** - Export as PNG & JSON
- 🔄 **Auto Rotation** - View your 3D art from all angles
- 📱 **Responsive Design** - Works on desktop and tablets

## 🚀 Quick Start

### Option 1: Direct Usage
1. Clone the repository
2. Open `index.html` in your web browser
3. Allow camera access
4. Click "Start Drawing"

```bash
git clone https://github.com/bham384/gesture-3d-drawing.git
cd gesture-3d-drawing
# Open index.html in your browser
```

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Then visit http://localhost:8000
```

## 📖 How to Use

1. **Start Detection**: Click "▶ Start Drawing"
2. **Position Hand**: Hold your hand 1-2 feet from the camera
3. **Draw**: Keep index finger UP and other fingers DOWN to draw
4. **Stop**: Close your fist to pause, open to resume
5. **Customize**: 
   - Adjust brush size with the slider
   - Pick a color with the color picker
   - Control rotation speed
   - Toggle auto-rotation
6. **Save**: Click "💾 Save Drawing" to download PNG + JSON

## 🎮 Gesture Controls

| Gesture | Action |
|---------|--------|
| Index finger UP | Drawing mode |
| Index finger DOWN | Stop drawing |
| Fist CLOSED | Pause drawing |
| Fist OPEN | Resume drawing |

## 🛠️ Tech Stack

- **Hand Detection**: [MediaPipe Hands](https://google.github.io/mediapipe/)
- **3D Graphics**: [Three.js](https://threejs.org/)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Camera**: WebRTC

## 📁 Project Structure

```
gesture-3d-drawing/
├── index.html              # Main HTML file
├── styles.css              # Application styling
├── js/
│   ├── app.js             # Main controller
│   ├── gesture-detector.js # Hand detection
│   └── 3d-renderer.js     # 3D rendering
├── package.json           # Project metadata
├── README.md              # This file
└── .gitignore
```

## 🌐 Browser Support

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)
- ⚠️ Safari (WebGL required)

**Requirements:**
- WebGL support
- Webcam access
- Modern JavaScript (ES6)

## 💡 Tips for Best Results

1. **Good Lighting** - Use natural light or bright room lighting
2. **Distance** - Keep hand 1-2 feet away from camera
3. **Smooth Movements** - Make deliberate, slow strokes
4. **Colors** - Experiment with different brush colors
5. **Performance** - Close unnecessary browser tabs

## ⚙️ Customization

Edit the following in `js/app.js` for personalization:

```javascript
// Minimum drawing distance (default: 0.01)
this.minDrawingDistance = 0.01;
```

Edit in `js/3d-renderer.js`:

```javascript
// Initial brush size (default: 0.5)
this.brushSize = 0.5;

// Auto rotation speed (default: 0.01)
this.rotationSpeed = 0.01;
```

## 🐛 Troubleshooting

### Hand not detected?
- Check camera permissions in browser settings
- Ensure good lighting conditions
- Move hand closer to camera
- Try refreshing the page

### Slow performance?
- Close other browser tabs
- Reduce brush size
- Disable auto-rotation
- Check browser console for errors

### Camera not working?
- Check if another app is using the camera
- Reload the page
- Try a different browser
- Check privacy settings

## 🎯 Future Enhancements

- [ ] Multi-hand support
- [ ] Undo/Redo functionality
- [ ] Preset shapes
- [ ] Animation playback
- [ ] VR/AR support
- [ ] Collaborative drawing
- [ ] Sound effects
- [ ] Custom brush textures

## 📝 API Reference

### GestureDetector

```javascript
// Initialize and start
await detector.initialize(videoElement, canvasElement);
await detector.start();

// Get data
const gestures = detector.getGestures();
const position = detector.getIndexFingerPosition();
const isDetected = detector.isHandDetected();
```

### ThreeDRenderer

```javascript
// Control drawing
renderer.startStroke(position);
renderer.addPointToStroke(position);
renderer.endStroke();

// Settings
renderer.setBrushColor('#ff0000');
renderer.setBrushSize(1.0);
renderer.setAutoRotate(true);

// Export
const imageData = renderer.takeScreenshot();
const jsonData = renderer.exportDrawing();
```

## 📄 License

MIT License - Feel free to use and modify!

## 👤 Author

Created by [@bham384](https://github.com/bham384)

## 🙏 Acknowledgments

- MediaPipe for excellent hand tracking
- Three.js for powerful 3D graphics
- Google for inspiring creative ML applications

---

**Enjoy creating beautiful 3D art with your gestures!** 🎨✋
