/**
 * Main Application Controller
 * Integrates gesture detection with 3D rendering
 */

class GestureDrawingApp {
    constructor() {
        this.gestureDetector = null;
        this.renderer = null;
        this.activeMode = 'draw';
        this.isDrawing = false;
        this.lastIndexPosition = null;
        this.drawingEnabled = false;
        this.minDrawingDistance = 0.02;
        this.modeButtons = [];
        this.lastToolTime = 0;

        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.saveBtn = document.getElementById('saveBtn');

        this.brushSizeInput = document.getElementById('brushSize');
        this.brushSizeValue = document.getElementById('brushSizeValue');
        this.colorPicker = document.getElementById('colorPicker');
        this.autoRotateCheckbox = document.getElementById('autoRotate');
        this.rotationSpeedInput = document.getElementById('rotationSpeed');

        this.webcamVideo = document.getElementById('webcam');
        this.canvasOverlay = document.getElementById('canvas-overlay');
        this.canvas3D = document.getElementById('3d-canvas');
        this.strokeCount = document.getElementById('strokeCount');
        this.vertexCount = document.getElementById('vertexCount');
        this.handIndicator = document.getElementById('handIndicator');
        this.toolLabel = document.getElementById('toolLabel');
        this.modeButtons = Array.from(document.querySelectorAll('.mode-btn'));

        this.gestureDetector = new GestureDetector();
        this.renderer = new ThreeDRenderer(this.canvas3D);
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.saveBtn.addEventListener('click', () => this.save());

        this.brushSizeInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.renderer.setBrushSize(value);
            this.brushSizeValue.textContent = value.toFixed(1);
        });

        this.colorPicker.addEventListener('input', (e) => {
            this.renderer.setBrushColor(e.target.value);
        });

        this.autoRotateCheckbox.addEventListener('change', (e) => {
            this.renderer.setAutoRotate(e.target.checked);
        });

        this.rotationSpeedInput.addEventListener('input', (e) => {
            this.renderer.setRotationSpeed(parseFloat(e.target.value));
        });

        this.modeButtons.forEach((button) => {
            button.addEventListener('click', () => {
                this.setMode(button.dataset.mode);
            });
        });
    }

    setMode(mode) {
        this.activeMode = mode;
        this.toolLabel.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);

        this.modeButtons.forEach((button) => {
            button.classList.toggle('active', button.dataset.mode === mode);
        });
    }

    async start() {
        try {
            const initialized = await this.gestureDetector.initialize(
                this.webcamVideo,
                this.canvasOverlay
            );

            if (!initialized) {
                alert('Failed to initialize camera and hand detection');
                return;
            }

            const started = await this.gestureDetector.start();
            if (!started) {
                alert('Failed to start hand detection');
                return;
            }

            this.drawingEnabled = true;
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.monitorGestures();
        } catch (error) {
            console.error('Error starting app:', error);
            alert('Error: ' + error.message);
        }
    }

    stop() {
        if (this.isDrawing) {
            this.renderer.endStroke();
            this.isDrawing = false;
        }

        this.gestureDetector.stop();
        this.drawingEnabled = false;
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
    }

    monitorGestures() {
        if (!this.drawingEnabled) return;

        const gestures = this.gestureDetector.getGestures();
        const handDetected = this.gestureDetector.isHandDetected();
        const indexPosition = this.gestureDetector.getIndexFingerPosition();

        if (handDetected) {
            this.handIndicator.textContent = 'Hand Detection: ON';
            this.handIndicator.classList.add('detected');
        } else {
            this.handIndicator.textContent = 'Hand Detection: OFF';
            this.handIndicator.classList.remove('detected');
        }

        if (this.activeMode === 'erase') {
            if (handDetected && gestures.pinch) {
                this.renderer.eraseLastStroke();
                this.isDrawing = false;
                this.lastIndexPosition = null;
            }
            this.updateStats();
            requestAnimationFrame(() => this.monitorGestures());
            return;
        }

        if (handDetected && indexPosition && gestures.indexUp && !gestures.fistClosed) {
            const worldPos = this.renderer.handToWorldCoordinates(indexPosition);
            if (!worldPos) {
                requestAnimationFrame(() => this.monitorGestures());
                return;
            }

            if (this.activeMode === 'cube' || this.activeMode === 'sphere') {
                if (!this.lastIndexPosition) {
                    this.lastIndexPosition = worldPos.clone();
                }

                const distance = worldPos.distanceTo(this.lastIndexPosition);
                if (distance > 0.4) {
                    this.renderer.addPrimitive(this.activeMode, worldPos, this.colorPicker.value);
                    this.lastIndexPosition = worldPos.clone();
                }
            } else {
                if (!this.isDrawing) {
                    this.renderer.startStroke(worldPos, this.colorPicker.value, this.renderer.brushSize);
                    this.isDrawing = true;
                } else if (this.lastIndexPosition) {
                    const distance = worldPos.distanceTo(this.lastIndexPosition);
                    if (distance > this.minDrawingDistance) {
                        this.renderer.addPointToStroke(worldPos);
                    }
                }

                this.lastIndexPosition = worldPos.clone();
            }
        } else {
            if (this.isDrawing) {
                this.renderer.endStroke();
                this.isDrawing = false;
            }
            this.lastIndexPosition = null;
        }

        this.updateStats();
        requestAnimationFrame(() => this.monitorGestures());
    }

    updateStats() {
        this.strokeCount.textContent = this.renderer.getStrokeCount();
        this.vertexCount.textContent = this.renderer.getTotalVertices();
    }

    clear() {
        if (confirm('Clear the entire drawing?')) {
            this.renderer.clear();
            this.isDrawing = false;
            this.lastIndexPosition = null;
            this.updateStats();
        }
    }

    save() {
        const data = this.renderer.exportDrawing();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(blob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = `drawing-${Date.now()}.json`;
        jsonLink.click();
        URL.revokeObjectURL(jsonUrl);

        const imageData = this.renderer.takeScreenshot();
        const imageLink = document.createElement('a');
        imageLink.href = imageData;
        imageLink.download = `drawing-${Date.now()}.png`;
        imageLink.click();

        alert('Drawing saved as JSON and PNG!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new GestureDrawingApp();
    console.log('Gesture app initialized');
});
