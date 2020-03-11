<template>
  <main class="layout" role="main">
    <div class="layout-header">
      <input class="tgl tgl-light" id="cb1" type="checkbox"/>
      <label class="tgl-btn" for="cb1"></label>
    </div>
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
  /* border: 10px solid black; */
  /* outline: 20px solid black; */
}

.layout {
  max-width: 900px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.footer {
  padding-top: calc(30em / 4);
  text-align: center;
  font-size: 1em;
}

.layout-header {
  float: right;
  margin: 10px;
  font-size: 0.8em;
}

.layout-header p {
  margin-bottom: 0;
}
.link {
  /* border: 2px dashed rgb(254, 205, 67); */
  color: #333;
  text-decoration: underline;
  text-decoration-thickness: 4px;
  text-decoration-color: #a722ee;
}
.link:hover {
  text-decoration-color: #c75fff;
}
</style>
