<template>
    <div class="page-container">
        <header class="header" data-aos="fade-down">
            <h1>LMS</h1>
        </header>

        <div class="team-grid">
            <div v-for="(member, index) in teamMembers" :key="index" class="team-member"
                :data-aos="getAnimation(index)">
                <div class="model-container">
                    <div :ref="`character${index}`" class="character-container"></div>
                </div>
                <div class="member-info">
                    <h2>{{ member.name }}</h2>
                    <h3>{{ member.title }}</h3>
                    <p>{{ member.description }}</p>
                </div>
            </div>
        </div>

        <footer class="footer" data-aos="fade-up">
            <p>© 2024 Our Amazing Company. All rights reserved.</p>
        </footer>
    </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import AOS from 'aos';
import 'aos/dist/aos.css';

import cat from '@/assets/images/fixed/cat.glb'
import character_head from '@/assets/images/fixed/character_head.glb'
import running_jerry from '@/assets/images/fixed/running_jerry.glb'
import pac_man from '@/assets/images/fixed/pac_man.glb'
import inosuke_mask from '@/assets/images/fixed/inosuke_mask.glb'

export default {
    data() {
        return {
            teamMembers: [
                { name: '최민지', title: '조장', description: 'brings over a decade of experience in design and branding to our team.', modelUrl: cat },
                { name: '이민재', title: '조원', description: ' is a full-stack wizard with a passion for clean, efficient code.', modelUrl: character_head },
                { name: '이근', title: '조원', description: ' s insights drive our user- centered design approach.', modelUrl: running_jerry },
                { name: '이현석', title: '조원', description: ' keeps our projects on track and our clients happy.', modelUrl: pac_man },
                { name: '이재호', title: '조원', description: ' crafts compelling stories that resonate with our audience.', modelUrl: inosuke_mask },
            ],
            scenes: [],
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.teamMembers.forEach((member, index) => {
                this.initThreeJS(index);
            });
            AOS.init({
                duration: 1000,
                once: true,
                offset: 200,
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
            controls.enableZoom = true;

            if (this.teamMembers[index].modelUrl === character_head) {
                camera.position.set(0, 0.5, 100);
                controls.target.set(0, 0.5, 0);
            } else if (this.teamMembers[index].modelUrl === pac_man) {
                camera.position.set(0, 0, 60);
            } else if (this.teamMembers[index].modelUrl === running_jerry) {
                camera.position.set(0, 0, 34);
            } else {
                camera.position.set(0, 2, 6);
                controls.target.set(0, 0, 0);
            }

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(0, 1, 0);
            scene.add(directionalLight);

            const loader = new GLTFLoader();
            loader.load(
                this.teamMembers[index].modelUrl,
                (gltf) => {
                    scene.add(gltf.scene);
                    gltf.scene.scale.set(1.5, 1.5, 1.5);

                    const box = new THREE.Box3().setFromObject(gltf.scene);
                    const center = box.getCenter(new THREE.Vector3());
                    gltf.scene.position.set(-center.x, -center.y, -center.z);

                    if (this.teamMembers[index].modelUrl !== character_head) {
                        gltf.scene.position.y += 0.2;
                    }

                    const pivotPoint = new THREE.Object3D();
                    scene.add(pivotPoint);
                    pivotPoint.add(gltf.scene);

                    const mixer = new THREE.AnimationMixer(gltf.scene);
                    gltf.animations.forEach((clip) => {
                        mixer.clipAction(clip).play();
                    });

                    controls.update();

                    const animate = () => {
                        requestAnimationFrame(animate);
                        if (this.teamMembers[index].modelUrl == running_jerry) {
                            mixer.update(0.02);
                        } else {
                            pivotPoint.rotation.y += 0.01;
                        }

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
        },
        getAnimation(index) {
            const animations = ['fade-up', 'fade-down', 'fade-right', 'fade-left'];
            return animations[index % animations.length];
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
.page-container {
    background-color: #f0f4f8;
    min-height: 100vh;
    font-family: 'Poppins', sans-serif;
}

.header {
    text-align: center;
    padding: 60px 0;
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    color: white;
}

.header h1 {
    font-size: 3em;
    margin-bottom: 10px;
}

.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
    padding: 60px;
    max-width: 1200px;
    margin: 0 auto;
}

.team-member {
    background-color: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.team-member:hover {
    transform: translateY(-10px);
}

.model-container {
    height: 300px;
    background-color: #edf2f7;
}

.character-container {
    width: 100%;
    height: 100%;
}

.member-info {
    padding: 20px;
}

.member-info h2 {
    font-size: 1.5em;
    color: #2d3748;
    margin-bottom: 5px;
}

.member-info h3 {
    font-size: 1em;
    color: #718096;
    margin-bottom: 15px;
}

.member-info p {
    color: #4a5568;
    line-height: 1.6;
}

.footer {
    text-align: center;
    padding: 20px;
    background-color: #2d3748;
    color: white;
}

@media (max-width: 768px) {
    .team-grid {
        grid-template-columns: 1fr;
        padding: 30px;
    }

    .header {
        padding: 40px 20px;
    }

    .header h1 {
        font-size: 2em;
    }
}
</style>