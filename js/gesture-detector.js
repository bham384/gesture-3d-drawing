* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
}

header {
    text-align: center;
    color: white;
    margin-bottom: 30px;
}

header h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

header p {
    font-size: 1.1em;
    opacity: 0.9;
}

.main-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
}

.camera-section,
.canvas-section,
.controls,
.info-panel {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 15px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.camera-section,
.canvas-section {
    padding: 15px;
    overflow: hidden;
}

.camera-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 3;
    background: #000;
    border-radius: 10px;
    overflow: hidden;
}

#webcam {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scaleX(-1);
}

#canvas-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scaleX(-1);
}

.hand-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: #ff6b6b;
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 0.9em;
    font-weight: bold;
    z-index: 10;
}

.hand-indicator.detected {
    color: #51cf66;
}

.canvas-section {
    position: relative;
}

#3d-canvas {
    width: 100%;
    height: 400px;
    display: block;
    border-radius: 10px;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}

.drawing-stats {
    position: absolute;
    top: 25px;
    left: 25px;
    background: rgba(0, 0, 0, 0.72);
    color: #ffd700;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.9em;
    font-weight: bold;
    z-index: 10;
}

.drawing-stats p {
    margin: 5px 0;
}

.controls {
    padding: 25px;
    margin-bottom: 30px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 15px;
    align-items: center;
}

.tool-modes {
    grid-column: 1 / -1;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 5px;
}

.mode-btn,
.btn {
    border: none;
    border-radius: 8px;
    font-size: 0.95em;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.25s ease;
}

.mode-btn {
    padding: 10px 18px;
    background: #e9ecef;
    color: #333;
}

.mode-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35);
}

.btn {
    padding: 12px 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-secondary {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
}

.btn-danger {
    background: #ff6b6b;
    color: white;
}

.btn-success {
    background: #51cf66;
    color: white;
}

.btn:hover:not(:disabled),
.mode-btn:hover {
    transform: translateY(-2px);
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.control-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.control-group label {
    font-weight: 600;
    color: #333;
    white-space: nowrap;
}

.control-group input[type="range"] {
    flex: 1;
    cursor: pointer;
}

.control-group input[type="color"] {
    width: 50px;
    height: 40px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.checkbox-wrap {
    justify-content: center;
}

.control-group input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

#brushSizeValue {
    font-weight: bold;
    color: #667eea;
    min-width: 30px;
}

.info-panel {
    padding: 25px;
}

.info-panel h3 {
    color: #667eea;
    margin-bottom: 15px;
    font-size: 1.3em;
}

.info-panel ul {
    list-style: none;
}

.info-panel li {
    padding: 8px 0;
    color: #333;
    border-bottom: 1px solid #eee;
    font-size: 0.95em;
}

.info-panel li:before {
    content: "✓ ";
    color: #51cf66;
    font-weight: bold;
    margin-right: 8px;
}

.info-panel li:last-child {
    border-bottom: none;
}

@media (max-width: 1024px) {
    .main-content {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    body {
        padding: 12px;
    }

    header h1 {
        font-size: 1.6em;
    }

    .controls {
        grid-template-columns: 1fr;
    }

    .control-group {
        flex-direction: column;
        align-items: flex-start;
    }

    .control-group input[type="range"] {
        width: 100%;
    }
}
