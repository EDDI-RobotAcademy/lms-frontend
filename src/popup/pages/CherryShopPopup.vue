<template>
    <div class="shop-popup">
      <div class="shop-content">
        <h2>체리 상점</h2>
        <button @click="$emit('close')">닫기</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ShopPopup',
  }
  </script>
  
  <style scoped>
  .shop-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .shop-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
  }
  </style>