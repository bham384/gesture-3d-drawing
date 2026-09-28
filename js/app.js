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

        this.initialize();
    }

    initialize() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1e3c72);
        this.scene.fog = new THREE.Fog(0x1e3c72, 1000, 2000);

        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 10;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.group = new THREE.Group();
        this.scene.add(this.group);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(8, 8, 10);
        this.scene.add(directionalLight);

        const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x222222);
        gridHelper.position.y = -5;
        this.scene.add(gridHelper);

        window.addEventListener('resize', () => this.onWindowResize());
        this.render();
    }

    startStroke(position, color, size) {
        this.currentStroke = {
            points: [position],
            color: color || this.brushColor.clone(),
            size: size || this.brushSize,
            type: 'stroke'
        };
    }

    addPointToStroke(position) {
        if (!this.currentStroke) {
            this.startStroke(position);
        }
        this.currentStroke.points.push(position);
    }

    endStroke() {
        if (!this.currentStroke || this.currentStroke.points.length < 2) {
            this.currentStroke = null;
            return;
        }

        const points = this.currentStroke.points;
        const curve = new THREE.CatmullRomCurve3(points);
        const radius = this.currentStroke.size * 0.08;
        const geometry = new THREE.TubeGeometry(curve, Math.max(points.length * 12, 60), radius, 10, false);
        const material = new THREE.MeshStandardMaterial({
            color: this.currentStroke.color,
            metalness: 0.2,
            roughness: 0.35
        });

        const mesh = new THREE.Mesh(geometry, material);
        this.group.add(mesh);
        this.strokes.push({
            mesh,
            type: 'stroke',
            color: this.currentStroke.color,
            points: points.slice(),
            size: this.currentStroke.size
        });

        this.currentStroke = null;
    }

    eraseLastStroke() {
        if (!this.strokes.length) return;
        const last = this.strokes.pop();
        if (last && last.mesh) {
            this.group.remove(last.mesh);
            last.mesh.geometry.dispose();
            if (last.mesh.material) {
                last.mesh.material.dispose();
            }
        }
    }

    addPrimitive(type, position, color) {
        const finalColor = color || this.brushColor.clone();
        let geometry;
        let mesh;

        if (type === 'cube') {
            geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
        } else {
            geometry = new THREE.SphereGeometry(0.8, 24, 24);
        }

        const material = new THREE.MeshStandardMaterial({
            color: finalColor,
            metalness: 0.35,
            roughness: 0.25
        });

        mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        this.group.add(mesh);

        this.strokes.push({
            mesh,
            type,
            color: finalColor,
            points: [position.clone()],
            size: 1
        });
    }

    clear() {
        this.strokes.forEach(stroke => {
            this.group.remove(stroke.mesh);
            if (stroke.mesh.geometry) {
                stroke.mesh.geometry.dispose();
            }
            if (stroke.mesh.material) {
                stroke.mesh.material.dispose();
            }
        });
        this.strokes = [];
        this.currentStroke = null;
    }

    setBrushColor(color) {
        this.brushColor = new THREE.Color(color);
    }

    setBrushSize(size) {
        this.brushSize = size;
    }

    setAutoRotate(enabled) {
        this.autoRotate = enabled;
    }

    setRotationSpeed(speed) {
        this.rotationSpeed = speed * 0.01;
    }

    render() {
        requestAnimationFrame(() => this.render());

        if (this.autoRotate) {
            this.group.rotation.x += this.rotationSpeed * 0.5;
            this.group.rotation.y += this.rotationSpeed;
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    handToWorldCoordinates(handPos) {
        if (!handPos) return null;

        const x = (handPos.x - 0.5) * 20;
        const y = -(handPos.y - 0.5) * 15;
        const z = (handPos.z || 0) * 5;

        return new THREE.Vector3(x, y, z);
    }

    getStrokeCount() {
        return this.strokes.length;
    }

    getTotalVertices() {
        let count = 0;
        this.strokes.forEach(stroke => {
            if (!stroke.mesh || !stroke.mesh.geometry) return;
            const attr = stroke.mesh.geometry.getAttribute('position');
            if (attr) count += attr.count;
        });
        return count;
    }

    takeScreenshot() {
        return this.canvas.toDataURL('image/png');
    }

    exportDrawing() {
        return {
            timestamp: new Date().toISOString(),
            strokes: this.strokes.map(stroke => ({
                type: stroke.type,
                points: stroke.points,
                color: stroke.color ? stroke.color.getHexString() : '#ffffff',
                size: stroke.size
            }))
        };
    }
}

window.ThreeDRenderer = ThreeDRenderer;
