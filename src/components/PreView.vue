<template>
    <div class="preview-body" ref="previewBody" :style="{width: '100%', height: '10px'}" v-html="content">
    </div>
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
      const size = this.$store.state.windowSize
      const bodyStyle = this.$refs.previewBody.style
      bodyStyle.height = (size.height - 2) + 'px'
    },
    setWidth: function (width) {
      const bodyStyle = this.$refs.previewBody.style
      bodyStyle.width = width + 'px'
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
  overflow: scroll;
}
</style>
