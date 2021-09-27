<template lang="pug">
h1 API

p.button-group.center(v-if="tify")
  button.button(@click="tify.setPage(3)") Show page 3
  button.button(@click="tify.setPage([1, 8, 9])") Show pages 1, 8 and 9
  button.button(@click="setLanguage(language === 'en' ? 'de' : 'en')") Change language to {{language === 'en' ? 'German' : 'English'}}
  br
  button.button(@click="setView('thumbnails')") Show thumbnails
  button.button(@click="setView('toc')") Show contents
  button.button(@click="setView('')") Show scan only
  button.button(@click="tify.viewer.viewport.zoomTo(2)") Zoom in
  button.button(@click="tify.resetScan(true)") Reset scan

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
    tify.resetScan(true)

p
    router-link(to="/#api") API documentation
</template>

<script>
export default {
  data() {
    return {
      tify: null,
      language: 'en',
      panel: 'info',
    }
  },
  mounted() {
    const js = this.$refs.js.innerHTML
    this.tify = eval(`${js}\ntify`) // eslint-disable-line no-eval
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
