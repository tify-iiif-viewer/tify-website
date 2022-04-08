<template lang="pug">
h1 Multiple Instances

.wide
  .row
    .col
      .frame#tify-1
    .col
      .frame#tify-2

p Any number of TIFY instances can be run independently on the same website. Both instances above have the URL query parameter store enabled and initial pan and zoom set. The first instance also has a page selected.

pre
  code(ref="js").
    const tify1 = new Tify({
      container: '#tify-1',
      manifestUrl: 'https://iiif.harvardartmuseums.org/manifests/object/299843',
      pageLabelFormat: 'L',
      pages: [4],
      urlQueryKey: 'tify-1',
      pan: { x: .45, y: .5 },
      zoom: 1.25,
    })

    const tify2 = new Tify({
      container: '#tify-2',
      manifestUrl: 'https://iiif.bodleian.ox.ac.uk/iiif/manifest/e32a277e-91e2-4a6d-8ba6-cc4bad230410.json',
      pageLabelFormat: 'L',
      urlQueryKey: 'tify-2',
      pan: { x: .73, y: .43 },
      zoom: 4.5,
    })

p
  router-link(to="/#embedding-tify") Documentation
</template>

<script>
export default {
  data() {
    return {
      tifyInstances: [],
    }
  },
  mounted() {
    const js = this.$refs.js.innerHTML
    this.tifyInstances = eval(`${js}\nnew Array(tify1, tify2)`) // eslint-disable-line no-eval
  },
  beforeUnmount() {
    this.tifyInstances.forEach((tify) => tify.destroy())
  },
}
</script>

<style lang="scss" scoped>
.frame {
  height: 20rem;
  max-width: 100%;
  width: 100%;
}
</style>
