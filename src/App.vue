<template>
  <v-app>
<v-container fluid>
<v-row no-gutters>
<v-col>
    <v-toolbar ref="app_bar" height="45" dense>
        <v-toolbar-title>DevText</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon v-on:click="onClickLoad"><v-icon>mdi-upload-outline</v-icon></v-btn><input class="hidden-form" type="file" ref="input">
        <v-btn icon v-on:click="onClickSave"><v-icon>mdi-content-save-outline</v-icon></v-btn>
        <v-spacer></v-spacer>
        <v-select v-model="keybindings" :items="key_items" label="keybindings" item-text="key" item-value="key" v-on:change="onChangeKey" dense ref="keybindins"></v-select>
        <v-select v-model="editmode" :items="mode_items" label="mode" item-text="mode" item-value="mode" v-on:change="onChangeMode" dense></v-select>
        <v-select v-model="theme" :items="theme_items" label="theme" item-text="theme" item-value="theme" v-on:change="onChangeTheme" dense></v-select>
    </v-toolbar>
</v-col>
</v-row>
<v-row no-gutters>
<v-col>
    <v-main>
      <multipane class="vertical-panes" ref="panes" layout="vertical" :style="{height: '10px'}" v-on:paneResize="onPanelResize">
        <div class="pane" ref="paneL" :style="{width: '50%', minWidth: '20%', maxWidth: '100%', height: '10px'}"
            :class="{'over': isDragOver}" @dragover.prevent="onDrag('over')" @dragleave.prevent="onDrag('leave')" @drop.stop.prevent="onDrop">
            <Editor ref="editor" />
        </div>
        <multipane-resizer ref="resizer" :style="{height: '10px', width: '8px'}"></multipane-resizer>
        <div class="pane" ref="paneR" :style="{flexGrow: 1, height: '10px'}">
            <PreView ref="preview" />
        </div>
      </multipane>
    </v-main>
</v-col>
</v-row>
</v-container>
  </v-app>
</template>

<script>
import { Multipane, MultipaneResizer } from 'vue-multipane'
import Editor from './components/Editor.vue'
import PreView from './components/PreView.vue'

export default {
  name: 'App',

  components: {
    Multipane,
    MultipaneResizer,
    Editor,
    PreView
  },
  methods: {
    handleResize: function () {
      this.$store.commit('setWindowSize', this.$refs.app_bar.$el.clientHeight)
      this.onResize()
    },
    onResize: function () {
      const height = this.$store.state.windowSize.height + 'px'
      this.$refs.panes.$el.style.height = height
      this.$refs.resizer.$el.style.height = height
      this.$refs.paneL.style.height = height
      this.$refs.paneR.style.height = height
      this.$refs.editor.onResize()
      this.$refs.preview.onResize()
    },
    onChangeKey: function (key) {
      this.$store.commit('updateKeybindings', key)
      this.$refs.editor.setKeybindings(key)
    },
    onChangeMode: function (mode) {
      this.$store.commit('updateEditmode', mode)
      this.$refs.editor.setMode(mode)
      this.$refs.preview.setMode(mode)
    },
    onChangeTheme: function (theme) {
      this.$store.commit('updateTheme', theme)
      this.$refs.editor.setTheme(theme)
    },
    onDrag: function (type) {
      this.isDragOver = type === 'over'
    },
    onDrop: function (event) {
      this.isDragOver = false
      const files = event.dataTransfer.files
      this.loadFile(files[0])
    },
    loadFile: function (file) {
      const editor = this.$refs.editor
      const fileReader = new FileReader()
      fileReader.onload = function (e) {
        editor.setCode(fileReader.result)
      }
      fileReader.readAsText(file)
    },
    onClickLoad: function () {
      console.log(this.$refs.input)
      const loadFile = this.loadFile
      const input = this.$refs.input
      input.oninput = function () {
        input.oninput = null
        loadFile(input.files[0])
      }
      this.$refs.input.click()
    },
    onClickSave: function () {
      const a = document.createElement('a')
      a.href = 'data:text/plain,' + encodeURIComponent(this.$refs.editor.getCode())
      a.download = 'text.txt'

      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    onPanelResize: function (pane, resizer, size) {
      const resizerWidth = parseInt(resizer.style.width, 10)
      const totalWidth = this.$refs.panes.$el.clientWidth
      const ratio = parseFloat(size) * 0.01
      const width = Math.max(Math.floor(totalWidth * (1.0 - ratio) - resizerWidth), 0)
      this.$refs.preview.setWidth(width)
    }
  }, // methods
  mounted: function () {
    this.keybindings = this.$store.state.settings.keybindings
    this.eidtmode = this.$store.state.settings.editmode
    this.theme = this.$store.state.settings.theme

    window.addEventListener('resize', this.handleResize)
    this.$store.commit('setWindowSize', this.$refs.app_bar.$el.clientHeight)
    this.$nextTick(() => {
      this.onResize()
    })
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },
  data: () => ({
    isDragOver: false,
    keybindings: 'vim',
    editmode: 'markdown',
    theme: 'ambiance',
    key_items: [{ key: 'vim' }, { key: 'vscode' }, { key: 'emacs' }, { key: 'sublime' }],
    mode_items: [{ mode: 'markdown' }, { mode: 'plain_text' }],
    theme_items: [{ theme: 'ambiance' }, { theme: 'chrome' }, { theme: 'monokai' }, { theme: 'solarized_dark' }, { theme: 'terminal' }, { theme: 'tomorrow' }, { theme: 'tomorrow_night' }, { theme: 'tomorrow_night_bright' }, { theme: 'twilight' }, { theme: 'xcode' }],
    previewActive: false
  })
}
</script>

<style scoped>
.vertical-panes {
  width: 100%;
  border: 0px solid #ccc;
}
.vertical-panes > .pane {
  border: 0px solid #ccc;
  text-align: left;
  padding: 0px;
  overflow: hidden;
}
.multipane-resizer {
  margin: 0;
  left: 0;
  background: #ccc;
}
.hidden-form {
    display: none;
}
</style>
