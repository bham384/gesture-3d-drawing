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
        this.handLandmarks = null;
        this.gestures = {
            indexUp: false,
            fistClosed: false,
            thumbUp: false,
            pinch: false,
            openPalm: false,
            indexMovement: null
        };
    }

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

    stop() {
        if (this.camera) {
            this.camera.stop();
        }
        this.isDetecting = false;
    }

    onHandsResults(results) {
        const ctx = this.canvasElement.getContext('2d');
        this.canvasElement.width = this.videoElement.videoWidth || 640;
        this.canvasElement.height = this.videoElement.videoHeight || 480;
        ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            this.handLandmarks = results.multiHandLandmarks[0];
            this.updateGestures();
            this.drawHand(ctx, this.handLandmarks);
        } else {
            this.handLandmarks = null;
            this.gestures = {
                indexUp: false,
                fistClosed: false,
                thumbUp: false,
                pinch: false,
                openPalm: false,
                indexMovement: null
            };
        }
    }

    updateGestures() {
        if (!this.handLandmarks || this.handLandmarks.length < 21) {
            return;
        }

        const landmarks = this.handLandmarks;
        const indexTip = landmarks[8];
        const indexPIP = landmarks[6];
        const middleTip = landmarks[12];
        const ringTip = landmarks[16];
        const pinkyTip = landmarks[20];
        const thumbTip = landmarks[4];
        const thumbIP = landmarks[3];

        const indexExtended = indexTip.y < indexPIP.y;
        const middleExtended = middleTip.y < landmarks[10].y;
        const ringExtended = ringTip.y < landmarks[14].y;
        const pinkyExtended = pinkyTip.y < landmarks[18].y;

        this.gestures.indexUp = indexExtended;
        this.gestures.fistClosed = !indexExtended && !middleExtended && !ringExtended && !pinkyExtended;
        this.gestures.thumbUp = thumbTip.y < thumbIP.y;
        this.gestures.openPalm = indexExtended && middleExtended && ringExtended && pinkyExtended;

        const indexThumbDistance = this.distance(thumbTip, indexTip);
        this.gestures.pinch = indexThumbDistance < 0.06 && indexExtended;

        if (indexExtended) {
            this.gestures.indexMovement = {
                x: indexTip.x,
                y: indexTip.y,
                z: indexTip.z
            };
        }
    }

    distance(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    drawHand(ctx, landmarks) {
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],
            [0, 5], [5, 6], [6, 7], [7, 8],
            [0, 9], [9, 10], [10, 11], [11, 12],
            [0, 13], [13, 14], [14, 15], [15, 16],
            [0, 17], [17, 18], [18, 19], [19, 20]
        ];

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

    getGestures() {
        return this.gestures;
    }

    getHandLandmarks() {
        return this.handLandmarks;
    }

    isHandDetected() {
        return this.handLandmarks !== null;
    }

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

window.GestureDetector = GestureDetector;
