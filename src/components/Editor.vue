<template>
    <ace-editor id="ace_editor" ref="ace_editor" @init="initEditor"></ace-editor>
</template>

<script>
import 'ace-builds/src-min-noconflict/keybinding-emacs'
import 'ace-builds/src-min-noconflict/keybinding-sublime'
import 'ace-builds/src-min-noconflict/keybinding-vim'
import 'ace-builds/src-min-noconflict/keybinding-vscode'

import 'ace-builds/src-min-noconflict/mode-markdown'
import 'ace-builds/src-min-noconflict/mode-plain_text'

import 'ace-builds/src-min-noconflict/theme-ambiance'
import 'ace-builds/src-min-noconflict/theme-chrome'
import 'ace-builds/src-min-noconflict/theme-monokai'
import 'ace-builds/src-min-noconflict/theme-solarized_dark'
import 'ace-builds/src-min-noconflict/theme-terminal'
import 'ace-builds/src-min-noconflict/theme-tomorrow'
import 'ace-builds/src-min-noconflict/theme-tomorrow_night'
import 'ace-builds/src-min-noconflict/theme-tomorrow_night_bright'
import 'ace-builds/src-min-noconflict/theme-twilight'
import 'ace-builds/src-min-noconflict/theme-xcode'

export default {
  name: 'Editor',
  components: {
  },
  data: () => ({
    code: '',
    editor: null
  }),
  methods: {
    initEditor: function (editor) {
      this.editor = editor
    },
    onResize: function () {
      const height = this.$store.state.windowSize.height
      this.clientHeight = (height - 2) + 'px'
      this.$nextTick(() => {
        this.editor.resize(false)
      })
    },
    commitCode: function () {
      this.$store.commit('updateCode', this.editor.session.getValue())
    },
    getCode: function () {
      return this.editor.session.getValue()
    },
    setKeybindings: function (keybindings) {
      this.editor.setKeyboardHandler('ace/keyboard/' + keybindings)
    },
    setMode: function (mode) {
      this.editor.session.setMode('ace/mode/' + mode)
    },
    setTheme: function (theme) {
      this.editor.setTheme('ace/theme/' + theme)
    },
    setCode: function (code) {
      this.editor.session.setValue(code)
    },
    setSessionState: function () {
      const session = this.editor.session
      session.setUseWrapMode(false)
      session.setNewLineMode('unix')

      session.on('change', this.commitCode)
    }
  }, // methods
  mounted: function () {
    const editor = this.editor
    editor.$blockScrolling = Infinity
    editor.setOptions({
      showGutter: true,
      showLineNumbers: true,
      tabSize: 4,
      useSoftTabs: true
    })
    editor.setKeyboardHandler('ace/keyboard/' + this.$store.state.settings.keybindings)
    editor.setTheme('ace/theme/' + this.$store.state.settings.theme)
    // editor.commands.addCommand({
    //  name: 'save',
    //  exec: this.save,
    //  bindKey: { mac: 'cmd-s', win: 'ctrl-s' }
    // })

    editor.session.setMode('ace/mode/' + this.$store.state.settings.editmode)
    this.setSessionState()
  }, // mounted
  computed: {
    width () {
      return this.clientWidth + 'px'
    },
    height () {
      return this.clientHeight + 'px'
    }
  }
}
</script>
