<template>
  <div id="app">
    <h2>{{ title }}</h2>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      title: '单测覆盖'
    }
  },
  methods: {
    getTitle() {
      return this.tilte;
    }
  }
}
</script>