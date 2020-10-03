<template>
    <div v-html="content" class="preview-body" />
</template>

<script>
const options = {
  // server: 'http://localhost:8080'
}
const markdown = require('markdown-it')().use(require('markdown-it-plantuml'), options)

export default {
  name: 'PreView',
  methods: {
    onResize: function () {
      const height = this.$store.state.windowSize.height
      this.clientHeight = (height - 2) + 'px'
    },
    setMode: function (mode) {
      this.func = this.convert[mode]
    }
  },
  mounted: function () {
    this.func = this.convert[this.$store.state.settings.editmode]
  },
  computed: {
    content: function () {
      return this.func(this.$store.state.code)
    },
    width () {
      return this.clientWidth + 'px'
    },
    height () {
      return this.clientHeight + 'px'
    }
  },
  data: () => ({
    convert: { markdown: function (code) { return markdown.render(code) }, plain_text: function (code) { return code } },
    func: function (code) { return markdown.render(code) }
  })
}
</script>

<style scoped>
.preview-body{
  text-align: left;
  padding: 0px;
  margin: 0px;
}
</style>
