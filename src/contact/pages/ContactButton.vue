<template>
    <v-container fluid class="pa-0">
      <div class="fixed-icon-container">
        <div class="interactive-area" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
          <div class="icon-container" :style="{
            transform: `translate(${position.x}px, ${position.y}px)`
          }" @click="gotoContactPage">
            <div v-for="(bg, index) in backgrounds" :key="index" :class="['background', `bg-${index + 1}`]" :style="{
              backgroundColor: bg.color,
              opacity: bg.opacity,
              borderRadius: bg.borderRadius,
              width: `${bg.size}px`,
              height: `${bg.size}px`,
              top: `${(96 - bg.size) / 2}px`,
              left: `${(96 - bg.size) / 2}px`
            }"></div>
            <div class="image-overlay"></div>
          </div>
        </div>
      </div>
    </v-container>
  </template>
  
  <script>
  import router from "@/router";
  export default {
    name: 'FixedPositionIcon',
    data() {
      return {
        backgrounds: [
          { color: 'black', opacity: 0.7, borderRadius: '40% 42% 45% 55%', size: 75 },
          { color: 'black', opacity: 0.6, borderRadius: '55% 41% 65% 43%', size: 75 },
          { color: 'black', opacity: 0.5, borderRadius: '58% 56% 72% 58%', size: 75 },
          { color: 'black', opacity: 0.4, borderRadius: '52% 72% 45% 61%', size: 75 },
        ],
        position: { x: 0, y: 0 },
      }
    },
    methods: {
      handleMouseMove(event) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
  
        const radius = 20;
        const distance = Math.sqrt(x * x + y * y);
        const factor = Math.min(distance, radius) / distance;
  
        this.position = {
          x: x * factor,
          y: y * factor
        };
      },
      handleMouseLeave() {
        this.position = { x: 0, y: 0 };
      },
      gotoContactPage() {
        router.push("/contact")
      }
    }
  }
  </script>
  
  <style scoped>
  .fixed-icon-container {
    position: fixed;
    top: 10%;
    left: 92%;
    transform: translate(-50%, -50%);
    z-index: 1000;
  }
  
  
  .interactive-area {
    width: 316px;
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  .icon-container {
    width: 96px;
    height: 96px;
    transition: transform 0.3s ease-out;
  }
  
  .icon-container:hover {
    cursor: pointer;
  }
  
  .background {
    position: absolute;
  }
  
  .bg-1,
  .bg-3 {
    animation: rotateBackground720 5s linear infinite;
  }
  
  .bg-2,
  .bg-4 {
    animation: rotateBackground720Reverse 5s linear infinite;
  }
  
  .image-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 25px;
    height: 25px;
    background-image: url('@/assets/images/fixed/hand.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    z-index: 1;
  }
  
  @keyframes rotateBackground720 {
    0% {
      transform: rotate(0deg);
    }
  
    100% {
      transform: rotate(-720deg);
    }
  }
  
  @keyframes rotateBackground720Reverse {
    0% {
      transform: rotate(0deg);
    }
  
    100% {
      transform: rotate(720deg);
    }
  }
  </style>