<template>
  <div class="landing-page">
    <header class="header">
      <h1>Welcome to Our Landing Page</h1>
      <p>Explore the features of our application.</p>
    </header>
    <main class="content">
      <Button label="Get Started" icon="pi pi-check" class="p-button-success" />
      <Button
        label="Learn More"
        icon="pi pi-info-circle"
        class="p-button-info"
      />
    </main>
    <footer class="footer">
      <p>&copy; 2023 Your Company</p>
    </footer>
  </div>
</template>

<script setup>
import { Button } from 'primevue/button'
</script>

<style>
.landing-page {
  text-align: center;
  padding: 2rem;
}

.header {
  margin-bottom: 2rem;
}

.content {
  margin-bottom: 2rem;
}

.footer {
  margin-top: 2rem;
  font-size: 0.8rem;
  color: #888;
}
</style>
