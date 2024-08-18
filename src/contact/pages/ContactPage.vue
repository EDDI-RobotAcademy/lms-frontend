<template>
    <div class="container">
        <div v-for="(card, index) in cards" :key="index" class="card-wrapper" :class="{ 'right': index % 2 !== 0 }">
            <div class="content-wrapper" :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'">
                <v-card class="card">
                    <div :ref="`character${index}`" class="character-container"></div>
                </v-card>
                <div class="text-content" :class="{ 'text-right': index % 2 !== 0 }">
                    <h3>{{ card.name }}</h3>
                    <h4>{{ card.title }}</h4>
                    <p>{{ card.description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gorg from '@/assets/images/fixed/gorg.glb'
import character_head from '@/assets/images/fixed/character_head.glb'
export default {
    data() {
        return {
            cards: [
                { name: '최민지', title: '조장', description: '네 맞습니다 LMS 조의 조장입니다.', modelUrl: gorg },
                { name: '이민재', title: '조원', description: '네 맞습니다 LMS 조의 조원입니다.', modelUrl: character_head },
                { name: '최민지', title: '조장', description: '네 맞습니다 LMS 조의 조장입니다.', modelUrl: gorg },
                { name: '최민지', title: '조장', description: '네 맞습니다 LMS 조의 조장입니다.', modelUrl: gorg },
            ],
            scenes: [],
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.cards.forEach((card, index) => {
                this.initThreeJS(index);
            });
        });
    },
    methods: {
        initThreeJS(index) {
            const container = this.$refs[`character${index}`][0];
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.enableZoom = false;

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(0, 1, 0);
            scene.add(directionalLight);

            const loader = new GLTFLoader();
            loader.load(
                this.cards[index].modelUrl,
                (gltf) => {
                    scene.add(gltf.scene);
                    gltf.scene.scale.set(2, 2, 2);
                    camera.position.z = 1.4;

                    const box = new THREE.Box3().setFromObject(gltf.scene);
                    const center = box.getCenter(new THREE.Vector3());
                    controls.target.copy(center);
                    
                    const animate = () => {
                        requestAnimationFrame(animate);
                        gltf.scene.rotation.y += 0.005;
                        controls.update();
                        renderer.render(scene, camera);
                    };
                    animate();
                },
                undefined,
                (error) => {
                    console.error('An error happened', error);
                }
            );

            this.scenes.push({ scene, camera, renderer, controls });
        }
    },
    beforeUnmount() {
        this.scenes.forEach(({ scene, camera, renderer, controls }) => {
            scene.remove.apply(scene, scene.children);
            renderer.dispose();
            controls.dispose();
        });
    }
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.card-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 100px;
}

.card-wrapper.right {
    justify-content: flex-end;
}

.content-wrapper {
    display: flex;
    align-items: center;
    width: 80%;
    max-width: 800px;
}

.card-wrapper.right .content-wrapper {
    flex-direction: row-reverse;
}

.card {
    width: 300px;
    height: 400px;
    background-color: rgba(255, 255, 255, 0.1) !important;
    border: 2px solid #e0e0e0 !important;
    border-radius: 10px !important;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
}

.character-container {
    width: 100%;
    height: 100%;
}

.text-content {
    padding: 0 20px;
    max-width: 300px;
}

.text-content h3 {
    margin-bottom: 5px;
    color: #333;
}

.text-content h4 {
    margin-bottom: 10px;
    color: #666;
}

.text-content p {
    color: #444;
}

.text-content.text-right {
    text-align: right;
}

@media (max-width: 768px) {
    .card-wrapper,
    .card-wrapper.right {
        justify-content: center;
    }

    .content-wrapper,
    .card-wrapper.right .content-wrapper {
        flex-direction: column;
        align-items: center;
    }

    .card {
        width: 100%;
        max-width: 300px;
        margin-bottom: 20px;
    }

    .text-content,
    .text-content.text-right {
        text-align: center;
        padding: 0;
    }
}
</style>