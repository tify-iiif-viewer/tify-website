<template lang="pug">
h1 API

p.button-group.center(v-if="tify")
  button.button(@click="tify.setPage(3)" :disabled="!ready")
    | Show page 3
  button.button(@click="tify.setPage([1, 8, 9])" :disabled="!ready")
    | Show pages 1, 8 and 9
  button.button(@click="setLanguage(language === 'en' ? 'de' : 'en')" :disabled="!ready")
    | Change language to {{language === 'en' ? 'German' : 'English'}}
  br
  button.button(@click="setView('thumbnails')" :disabled="!ready")
    | Show thumbnails
  button.button(@click="setView('toc')" :disabled="!ready")
    | Show contents
  button.button(@click="setView('')" :disabled="!ready")
    | Show scan only
  button.button(@click="tify.viewer.viewport.zoomTo(2)" :disabled="!ready")
    | Zoom in
  button.button(@click="tify.resetImage(true)" :disabled="!ready")
    | Reset image

.wide
  .frame#tify

p TIFY’s API allows most parameters to be controlled programmatically, for example pan and zoom, displayed pages, active view, and even the language.

pre
  code(ref="js").
    const tify = new Tify({
      container: '#tify',
      manifestUrl: 'https://manifests.sub.uni-goettingen.de/iiif/presentation/DE-611-HS-3216958/manifest',
      translationsDirUrl: '/tify-translations',
    })

pre
  code.
    tify.setPage(3)
    tify.setPage([1, 8, 9])

    tify.setLanguage(tify.options.language === 'en' ? 'de' : 'en')

    tify.setView('thumbnails')

    tify.viewer.viewport.zoomTo(2)
    tify.resetImage(true)

p
  a(:href="`https://github.com/tify-iiif-viewer/tify/blob/v${version}/doc/api.md`") API documentation
</template>

<script>
export default {
  data() {
    return {
      tify: null,
      language: 'en',
      panel: 'info',
      ready: false,
      version: process.env.VUE_APP_TIFY_VERSION,
    }
  },
  mounted() {
    const js = this.$refs.js.innerHTML
    this.tify = eval(`${js}\ntify`) // eslint-disable-line no-eval

    this.tify.ready.then(() => {
      this.ready = true
    })
  },
  beforeUnmount() {
    this.tify.destroy()
  },
  methods: {
    setLanguage(code) {
      this.language = code
      this.tify.setLanguage(code)
    },
    setView(name) {
      this.panel = name
      this.tify.setView(name)
    },
  },
}
</script>

<style lang="scss" scoped>
.frame {
  height: 40rem;
  max-width: 100%;
}
</style>
