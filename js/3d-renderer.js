/**
 * 3D Renderer Module
 * Handles Three.js 3D scene, rendering, and stroke drawing
 */

class ThreeDRenderer {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.strokes = [];
        this.currentStroke = null;
        this.brushColor = new THREE.Color(0xff0000);
        this.brushSize = 0.5;
        this.autoRotate = true;
        this.rotationSpeed = 0.01;
        this.group = null;
        this.ambientLight = null;
        this.directionalLight = null;

        this.initialize();
    }

    /**
     * Initialize Three.js scene
     */
    initialize() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1e3c72);
        this.scene.fog = new THREE.Fog(0x1e3c72, 1000, 2000);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 10;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;

        // Group for all drawing objects
        this.group = new THREE.Group();
        this.scene.add(this.group);

        // Lighting
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLight.position.set(10, 10, 10);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(this.directionalLight);

        // Add grid helper
        const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x222222);
        gridHelper.position.y = -5;
        this.scene.add(gridHelper);

        // Add axes helper
        const axesHelper = new THREE.AxesHelper(5);
        this.group.add(axesHelper);

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start render loop
        this.render();
    }

    /**
     * Start a new stroke
     */
    startStroke(position, color, size) {
        this.currentStroke = {
            points: [position],
            color: color || this.brushColor,
            size: size || this.brushSize,
            mesh: null
        };
    }

    /**
     * Add point to current stroke
     */
    addPointToStroke(position) {
        if (!this.currentStroke) {
            this.startStroke(position);
        }

        this.currentStroke.points.push(position);
    }

    /**
     * End current stroke and create 3D mesh
     */
    endStroke() {
        if (!this.currentStroke || this.currentStroke.points.length < 2) {
            this.currentStroke = null;
            return;
        }

        // Create custom geometry for smooth 3D drawing
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const tubePoints = this.currentStroke.points;

        for (let i = 0; i < tubePoints.length - 1; i++) {
            const p1 = tubePoints[i];
            const p2 = tubePoints[i + 1];

            // Create cylinder between points
            const segments = 8;
            const radius = this.currentStroke.size * 0.05;

            for (let j = 0; j < segments; j++) {
                const angle1 = (j / segments) * Math.PI * 2;
                const angle2 = ((j + 1) / segments) * Math.PI * 2;

                // Calculate normals for better looking tube
                const offset1_1 = {
                    x: Math.cos(angle1) * radius,
                    y: Math.sin(angle1) * radius,
                    z: 0
                };
                const offset1_2 = {
                    x: Math.cos(angle2) * radius,
                    y: Math.sin(angle2) * radius,
                    z: 0
                };

                // First triangle
                positions.push(p1.x, p1.y, p1.z);
                positions.push(p1.x + offset1_1.x, p1.y + offset1_1.y, p1.z + offset1_1.z);
                positions.push(p1.x + offset1_2.x, p1.y + offset1_2.y, p1.z + offset1_2.z);

                // Second triangle
                positions.push(p2.x, p2.y, p2.z);
                positions.push(p1.x + offset1_2.x, p1.y + offset1_2.y, p1.z + offset1_2.z);
                positions.push(p2.x + offset1_2.x, p2.y + offset1_2.y, p2.z + offset1_2.z);

                // Add colors
                for (let k = 0; k < 6; k++) {
                    colors.push(this.currentStroke.color.r);
                    colors.push(this.currentStroke.color.g);
                    colors.push(this.currentStroke.color.b);
                }
            }
        }

        if (positions.length > 0) {
            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
            geometry.computeVertexNormals();

            const material = new THREE.MeshPhongMaterial({
                vertexColors: true,
                shininess: 100,
                emissive: 0x000000,
                wireframe: false
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            this.group.add(mesh);
            this.strokes.push({
                mesh: mesh,
                points: this.currentStroke.points,
                color: this.currentStroke.color,
                size: this.currentStroke.size
            });
        }

        this.currentStroke = null;
    }

    /**
     * Clear all strokes
     */
    clear() {
        this.strokes.forEach(stroke => {
            this.group.remove(stroke.mesh);
            stroke.mesh.geometry.dispose();
            stroke.mesh.material.dispose();
        });
        this.strokes = [];
        this.currentStroke = null;
    }

    /**
     * Set brush color
     */
    setBrushColor(color) {
        this.brushColor = new THREE.Color(color);
    }

    /**
     * Set brush size
     */
    setBrushSize(size) {
        this.brushSize = size;
    }

    /**
     * Set auto rotation
     */
    setAutoRotate(enabled) {
        this.autoRotate = enabled;
    }

    /**
     * Set rotation speed
     */
    setRotationSpeed(speed) {
        this.rotationSpeed = speed * 0.01;
    }

    /**
     * Main render loop
     */
    render() {
        requestAnimationFrame(() => this.render());

        // Auto rotate
        if (this.autoRotate) {
            this.group.rotation.x += this.rotationSpeed * 0.5;
            this.group.rotation.y += this.rotationSpeed;
        }

        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    /**
     * Convert normalized hand coordinates to 3D world coordinates
     */
    handToWorldCoordinates(handPos, canvasWidth, canvasHeight) {
        if (!handPos) return null;

        // Normalize to -1 to 1 range
        const x = (handPos.x - 0.5) * 20;
        const y = -(handPos.y - 0.5) * 15;
        const z = (handPos.z || 0) * 5;

        return new THREE.Vector3(x, y, z);
    }

    /**
     * Get stroke count
     */
    getStrokeCount() {
        return this.strokes.length;
    }

    /**
     * Get total vertices
     */
    getTotalVertices() {
        let count = 0;
        this.strokes.forEach(stroke => {
            if (stroke.mesh.geometry.getAttribute('position')) {
                count += stroke.mesh.geometry.getAttribute('position').count;
            }
        });
        return count;
    }

    /**
     * Export drawing as image
     */
    takeScreenshot() {
        return this.canvas.toDataURL('image/png');
    }

    /**
     * Export drawing as JSON
     */
    exportDrawing() {
        return {
            timestamp: new Date().toISOString(),
            strokes: this.strokes.map(stroke => ({
                points: stroke.points,
                color: stroke.color.getHexString(),
                size: stroke.size
            }))
        };
    }
}

// Export for use
window.ThreeDRenderer = ThreeDRenderer;