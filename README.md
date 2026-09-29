# 🎨 3D Gesture Drawing App

A web-based application that allows you to draw in 3D space using hand gestures captured by your webcam. Draw natural 3D strokes by moving your finger in front of the camera.

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 🎯 **Real-Time Hand Detection** - Powered by MediaPipe
- 🖌️ **4 Drawing Modes** - Draw, Erase, Cube, Sphere
- 🎨 **Customizable Brush** - Adjust size, color, and rotation
- 💾 **Save Drawings** - Export as PNG & JSON
- 🔄 **Auto Rotation** - View your 3D art from all angles
- 📱 **Responsive Design** - Works on desktop and tablets

## 🚀 Quick Start

### Option 1: Using Python (Recommended)

```bash
# Navigate to project folder
cd gesture-3d-drawing

# Start local server
python -m http.server 8000

# Or on Windows
py -m http.server 8000

# Or with Python 3
python3 -m http.server 8000
```

Then open: **http://localhost:8000**

### Option 2: Using Node.js

```bash
npx http-server
```

Then open: **http://localhost:8080**

## 🎮 How to Use

### **Draw Mode** ✏️
- Keep your **index finger UP**
- Move your finger to draw 3D strokes
- Close your **fist** to stop drawing
- Open your hand to continue

### **Erase Mode** 🗑️
- **Pinch** your thumb and index finger together
- This deletes the last stroke
- Release to stop erasing

### **Cube Mode** 🎲
- Tap your index finger to place a cube
- Each tap adds a new cube at that position
- Move your hand farther/closer for new placement

### **Sphere Mode** 🔮
- Tap your index finger to place a sphere
- Each tap adds a new sphere at that position
- Combine with colors for beautiful compositions

## 🎛️ Controls

- **Brush Size**: Adjust thickness (0.1 - 2.0)
- **Brush Color**: Pick any color
- **Rotation Speed**: Control auto-rotation speed
- **Auto Rotate**: Toggle automatic 3D rotation
- **Clear Canvas**: Delete all strokes
- **Save Drawing**: Export as PNG & JSON

## 🖥️ System Requirements

- **Browser**: Chrome, Edge, Firefox (latest versions)
- **Camera**: Webcam or integrated camera
- **Internet**: Required for library CDNs
- **Lighting**: Good lighting improves accuracy

## 📁 Project Structure

```
gesture-3d-drawing/
├── index.html              # Main HTML file
├── styles.css              # CSS styling
├── js/
│   ├── app.js             # Main app controller
│   ├── gesture-detector.js # Hand detection
│   └── 3d-renderer.js     # 3D rendering
├── README.md              # This file
└── .gitignore
```

## 🔧 Technologies Used

- **Hand Detection**: [MediaPipe Hands](https://google.github.io/mediapipe/)
- **3D Graphics**: [Three.js](https://threejs.org/)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Camera**: WebRTC

## 💡 Tips for Best Results

1. **Lighting**: Use natural light or bright room lighting
2. **Distance**: Keep hand 1-2 feet from camera
3. **Speed**: Make smooth, deliberate movements
4. **Colors**: Experiment with different brush colors
5. **Performance**: Close other browser tabs for better FPS
6. **Angles**: Disable auto-rotate to control view manually

## 🎯 Gesture Recognition

| Gesture | Action |
|---------|--------|
| Index finger UP | Drawing mode |
| Index finger DOWN | Stop drawing |
| Fist CLOSED | Pause drawing |
| Fist OPEN | Resume drawing |
| Pinch (thumb + index) | Erase last stroke |
| Open Palm | Ready to draw |

## 🐛 Troubleshooting

### "Camera not found"
- Check browser permissions
- Ensure no other app is using camera
- Try a different browser

### "Connection refused"
- Make sure server is running
- Check you're visiting http://localhost:8000
- Verify Python/Node is installed

### "Slow performance"
- Close other browser tabs
- Reduce brush size
- Disable auto-rotation
- Check browser console for errors

### "Hand not detected"
- Improve lighting
- Move hand closer to camera
- Clean camera lens
- Try different hand position

## 📦 Installation Without Python

If you don't have Python installed:

1. **Download Node.js** from nodejs.org
2. Open terminal and run: `npm install -g http-server`
3. Navigate to project: `cd gesture-3d-drawing`
4. Start server: `http-server`
5. Open browser to the provided URL

## 🌟 Future Enhancements

- [ ] Undo/Redo functionality
- [ ] Multi-hand support
- [ ] Preset shapes library
- [ ] Animation timeline
- [ ] VR/AR support
- [ ] Collaborative drawing
- [ ] Sound effects
- [ ] Custom brush textures
- [ ] Export to GLTF/OBJ
- [ ] Touch support for tablets

## 📄 License

MIT License - Feel free to use and modify!

## 👨‍💻 Author

Created by [@bham384](https://github.com/bham384)

## 🙏 Acknowledgments

- MediaPipe for excellent hand tracking
- Three.js for powerful 3D graphics
- Google for inspiring creative ML applications

## 💬 Support

If you encounter issues:
1. Check the browser console (F12)
2. Try a different browser
3. Ensure good lighting and camera access
4. Verify all files are in correct locations

---

**Enjoy creating beautiful 3D art with your gestures!** 🎨✋