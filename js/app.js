/**
 * Main Application Controller
 * Integrates gesture detection with 3D rendering
 */

class GestureDrawingApp {
    constructor() {
        this.gestureDetector = null;
        this.renderer = null;
        this.isDrawing = false;
        this.lastIndexPosition = null;
        this.drawingEnabled = false;
        this.minDrawingDistance = 0.01;

        this.initializeElements();
        this.setupEventListeners();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        // Buttons
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.saveBtn = document.getElementById('saveBtn');

        // Controls
        this.brushSizeInput = document.getElementById('brushSize');
        this.brushSizeValue = document.getElementById('brushSizeValue');
        this.colorPicker = document.getElementById('colorPicker');
        this.autoRotateCheckbox = document.getElementById('autoRotate');
        this.rotationSpeedInput = document.getElementById('rotationSpeed');

        // Video elements
        this.webcamVideo = document.getElementById('webcam');
        this.canvasOverlay = document.getElementById('canvas-overlay');

        // 3D Canvas
        this.canvas3D = document.getElementById('3d-canvas');

        // Stats
        this.strokeCount = document.getElementById('strokeCount');
        this.vertexCount = document.getElementById('vertexCount');
        this.handIndicator = document.getElementById('handIndicator');

        // Initialize detector and renderer
        this.gestureDetector = new GestureDetector();
        this.renderer = new ThreeDRenderer(this.canvas3D);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Button events
        this.startBtn.addEventListener('click', () => this.start());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.saveBtn.addEventListener('click', () => this.save());

        // Control events
        this.brushSizeInput.addEventListener('input', (e) => {
            this.renderer.setBrushSize(parseFloat(e.target.value));
            this.brushSizeValue.textContent = e.target.value;
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
    }

    /**
     * Start gesture detection and drawing
     */
    async start() {
        try {
            // Initialize gesture detector
            const initialized = await this.gestureDetector.initialize(
                this.webcamVideo,
                this.canvasOverlay
            );

            if (!initialized) {
                alert('Failed to initialize camera and hand detection');
                return;
            }

            // Start detection
            const started = await this.gestureDetector.start();
            if (!started) {
                alert('Failed to start hand detection');
                return;
            }

            this.drawingEnabled = true;
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;

            // Start monitoring gestures
            this.monitorGestures();

            console.log('✓ Hand detection started');
        } catch (error) {
            console.error('Error starting app:', error);
            alert('Error: ' + error.message);
        }
    }

    /**
     * Stop gesture detection
     */
    stop() {
        if (this.isDrawing) {
            this.renderer.endStroke();
            this.isDrawing = false;
        }

        this.gestureDetector.stop();
        this.drawingEnabled = false;
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;

        console.log('✓ Hand detection stopped');
    }

    /**
     * Monitor hand gestures and update drawing
     */
    monitorGestures() {
        if (!this.drawingEnabled) return;

        const gestures = this.gestureDetector.getGestures();
        const handDetected = this.gestureDetector.isHandDetected();

        // Update hand indicator
        if (handDetected) {
            this.handIndicator.textContent = 'Hand Detection: ON';
            this.handIndicator.classList.add('detected');
        } else {
            this.handIndicator.textContent = 'Hand Detection: OFF';
            this.handIndicator.classList.remove('detected');
        }

        // Get index finger position
        const indexPosition = this.gestureDetector.getIndexFingerPosition();

        if (handDetected && indexPosition && gestures.indexUp && !gestures.fistClosed) {
            // Convert hand coordinates to world coordinates
            const worldPos = this.renderer.handToWorldCoordinates(
                indexPosition,
                this.webcamVideo.videoWidth,
                this.webcamVideo.videoHeight
            );

            if (worldPos) {
                if (!this.isDrawing) {
                    // Start new stroke
                    this.renderer.startStroke(worldPos);
                    this.isDrawing = true;
                    console.log('Drawing started');
                } else {
                    // Check if movement is significant enough
                    if (this.lastIndexPosition) {
                        const distance = worldPos.distanceTo(this.lastIndexPosition);
                        if (distance > this.minDrawingDistance) {
                            this.renderer.addPointToStroke(worldPos);
                        }
                    }
                }

                this.lastIndexPosition = worldPos.clone();
            }
        } else if (this.isDrawing) {
            // End stroke when finger goes down or fist closes
            this.renderer.endStroke();
            this.isDrawing = false;
            this.lastIndexPosition = null;
            console.log('Drawing ended');
        }

        // Update stats
        this.updateStats();

        // Continue monitoring
        requestAnimationFrame(() => this.monitorGestures());
    }

    /**
     * Update drawing statistics
     */
    updateStats() {
        this.strokeCount.textContent = this.renderer.getStrokeCount();
        this.vertexCount.textContent = this.renderer.getTotalVertices();
    }

    /**
     * Clear canvas
     */
    clear() {
        if (confirm('Are you sure you want to clear the entire drawing?')) {
            this.renderer.clear();
            this.isDrawing = false;
            this.lastIndexPosition = null;
            this.updateStats();
            console.log('Canvas cleared');
        }
    }

    /**
     * Save drawing
     */
    save() {
        const drawingData = this.renderer.exportDrawing();

        // Download as JSON
        const dataStr = JSON.stringify(drawingData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `drawing-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);

        // Also save screenshot
        const imageData = this.renderer.takeScreenshot();
        const imageLink = document.createElement('a');
        imageLink.href = imageData;
        imageLink.download = `drawing-${Date.now()}.png`;
        imageLink.click();

        console.log('✓ Drawing saved');
        alert('Drawing saved as JSON and PNG!');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Gesture Drawing App...');
    window.app = new GestureDrawingApp();
    console.log('✓ App initialized. Click "Start Drawing" to begin.');
});