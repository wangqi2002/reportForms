<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
html,
body {
  height: 100%;
  overflow: hidden;
  user-select: none;

  #app {
    height: 100%;
  }

  button {
    font-family: "Times New Roman", Times, serif;
  }

  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  ::-webkit-scrollbar-track {
    width: 6px;
    background: rgba(#101F1C, 0.1);
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(144, 147, 153, .5);
    background-clip: padding-box;
    min-height: 28px;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
    transition: background-color .3s;
    cursor: pointer;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(144, 147, 153, .3);
  }
}
</style>
