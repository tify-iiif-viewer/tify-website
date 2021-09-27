<template lang="pug">
h1 Basic Usage

.wide
  .frame#tify

p A basic TIFY instance requires just a container element and a IIIF manifest to load. Additionally, the URL parameter store has been enabled, reflecting any user interaction in the URL, so every state can be bookmarked and shared.

pre
  code(ref="js").
    const tify = new Tify({
      container: '#tify',
      manifestUrl: 'https://manifests.sub.uni-goettingen.de/iiif/presentation/PPN857449303/manifest',
      pageLabelFormat: 'P',
      urlQueryKey: 'tify',
    })

p
  router-link(to="/#embedding-tify") Documentation
</template>

<script>
export default {
  data() {
    return {
      tify: null,
    }
  },
  mounted() {
    const js = this.$refs.js.innerHTML
    this.tify = eval(`${js}\ntify`) // eslint-disable-line no-eval
  },
  beforeUnmount() {
    this.tify.destroy()
  },
}
</script>

<style lang="scss" scoped>
.frame {
  height: 22rem;
  max-width: 100%;
}
</style>
