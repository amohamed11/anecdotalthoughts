<template>
  <main class="layout" role="main">
    <slot/>
    <div class="footer">
      <p>
        Made with ☕
      </p>
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
  border: 20px solid #a722ee;
  outline: 4px solid black;
  outline-offset: -20px;
  background: whitesmoke;
}

.layout {
  max-width: 760px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.footer {
  padding-top: calc(30em / 4);
  text-align: center;
  font-size: 1em;
}

.link {
  border: 2px dashed #a722ee;
  padding: 7px;
  color: #333;
  text-decoration: none;
}
</style>
