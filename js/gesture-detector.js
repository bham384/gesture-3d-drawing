/**
 * Gesture Detector Module
 * Handles hand detection and gesture recognition using MediaPipe
 */

class GestureDetector {
    constructor() {
        this.hands = null;
        this.camera = null;
        this.isInitialized = false;
        this.isDetecting = false;
        this.lastHandPosition = null;
        this.handLandmarks = null;
        this.gestures = {
            indexUp: false,
            fistClosed: false,
            thumbUp: false,
            indexMovement: null
        };
    }

    /**
     * Initialize MediaPipe Hands
     */
    async initialize(videoElement, canvasElement) {
        try {
            this.hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                }
            });

            this.hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            this.hands.onResults((results) => this.onHandsResults(results));

            this.camera = new Camera(videoElement, {
                onFrame: async () => {
                    await this.hands.send({ image: videoElement });
                },
                width: 640,
                height: 480
            });

            this.canvasElement = canvasElement;
            this.videoElement = videoElement;
            this.isInitialized = true;

            return true;
        } catch (error) {
            console.error('Failed to initialize gesture detector:', error);
            return false;
        }
    }

    /**
     * Start hand detection
     */
    async start() {
        if (!this.isInitialized) {
            console.error('Gesture detector not initialized');
            return false;
        }

        try {
            await this.camera.initialize();
            this.isDetecting = true;
            return true;
        } catch (error) {
            console.error('Failed to start gesture detection:', error);
            return false;
        }
    }

    /**
     * Stop hand detection
     */
    stop() {
        if (this.camera) {
            this.camera.stop();
        }
        this.isDetecting = false;
    }

    /**
     * Handle MediaPipe hand detection results
     */
    onHandsResults(results) {
        const ctx = this.canvasElement.getContext('2d');

        // Set canvas dimensions to match video
        this.canvasElement.width = this.videoElement.videoWidth;
        this.canvasElement.height = this.videoElement.videoHeight;

        // Clear canvas
        ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            this.handLandmarks = results.multiHandLandmarks[0];
            this.updateGestures();
            this.drawHand(ctx, results.multiHandLandmarks[0]);
        } else {
            this.handLandmarks = null;
            this.gestures = {
                indexUp: false,
                fistClosed: false,
                thumbUp: false,
                indexMovement: null
            };
        }
    }

    /**
     * Detect and update gesture states
     */
    updateGestures() {
        if (!this.handLandmarks || this.handLandmarks.length < 21) {
            return;
        }

        const landmarks = this.handLandmarks;

        // Get key points
        const indexTip = landmarks[8];      // Index finger tip
        const indexPIP = landmarks[6];      // Index finger PIP
        const middleTip = landmarks[12];    // Middle finger tip
        const ringTip = landmarks[16];      // Ring finger tip
        const pinkyTip = landmarks[20];     // Pinky finger tip
        const thumbTip = landmarks[4];      // Thumb tip
        const palm = landmarks[0];          // Wrist/Palm

        // Check if index finger is up
        this.gestures.indexUp = indexTip.y < indexPIP.y;

        // Check if fist is closed
        const fingersExtended = [
            indexTip.y < indexPIP.y,
            middleTip.y < landmarks[10].y,
            ringTip.y < landmarks[14].y,
            pinkyTip.y < landmarks[18].y
        ];
        this.gestures.fistClosed = fingersExtended.filter(e => e).length < 2;

        // Check thumb up
        this.gestures.thumbUp = thumbTip.y < landmarks[3].y;

        // Track index finger movement
        if (this.gestures.indexUp) {
            const currentPos = { x: indexTip.x, y: indexTip.y, z: indexTip.z };
            this.gestures.indexMovement = currentPos;
        }
    }

    /**
     * Draw hand landmarks on canvas
     */
    drawHand(ctx, landmarks) {
        // Draw connections
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],           // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8],           // Index
            [0, 9], [9, 10], [10, 11], [11, 12],      // Middle
            [0, 13], [13, 14], [14, 15], [15, 16],    // Ring
            [0, 17], [17, 18], [18, 19], [19, 20]     // Pinky
        ];

        // Draw lines
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;

        connections.forEach(([start, end]) => {
            const p1 = landmarks[start];
            const p2 = landmarks[end];

            ctx.beginPath();
            ctx.moveTo(p1.x * this.canvasElement.width, p1.y * this.canvasElement.height);
            ctx.lineTo(p2.x * this.canvasElement.width, p2.y * this.canvasElement.height);
            ctx.stroke();
        });

        // Draw circles on landmarks
        ctx.fillStyle = '#FF0000';
        landmarks.forEach((landmark, index) => {
            ctx.beginPath();
            ctx.arc(
                landmark.x * this.canvasElement.width,
                landmark.y * this.canvasElement.height,
                5,
                0,
                2 * Math.PI
            );
            ctx.fill();

            // Highlight index finger tip
            if (index === 8) {
                ctx.strokeStyle = '#00FFFF';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(
                    landmark.x * this.canvasElement.width,
                    landmark.y * this.canvasElement.height,
                    10,
                    0,
                    2 * Math.PI
                );
                ctx.stroke();
            }
        });
    }

    /**
     * Get current gesture state
     */
    getGestures() {
        return this.gestures;
    }

    /**
     * Get hand landmarks
     */
    getHandLandmarks() {
        return this.handLandmarks;
    }

    /**
     * Check if hand is detected
     */
    isHandDetected() {
        return this.handLandmarks !== null;
    }

    /**
     * Get index finger position in normalized coordinates
     */
    getIndexFingerPosition() {
        if (!this.handLandmarks || this.handLandmarks.length < 9) {
            return null;
        }

        const indexTip = this.handLandmarks[8];
        return {
            x: indexTip.x,
            y: indexTip.y,
            z: indexTip.z
        };
    }
}

// Export for use
window.GestureDetector = GestureDetector;