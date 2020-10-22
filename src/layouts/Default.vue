<template>
  <main class="layout" role="main">
    <div class="container">
      <slot />
      <div class="footer">
        <p>
          Made with ☕
        </p>
      </div>
    </div>
  </main>
</template>

<style>
body {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  margin: 0;
  padding: 0;
  line-height: 1.5;
  min-height: 100vh;
}

.layout {
  min-height: 96vh;
  border: 2vh solid #0288d1;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.footer {
  padding-top: 40vh;
  text-align: center;
  font-size: 20px;
}

.link {
  /* border: 2px dashed rgb(254, 205, 67); */
  color: #333;
  text-decoration: underline;
  text-decoration-thickness: 4px;
  text-decoration-color: #0288d1;
}
.link:hover {
  text-decoration-color: #c75fff;
}
</style>
