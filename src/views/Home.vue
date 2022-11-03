<template lang="pug">
h2.sr-only Demo
.frame#tify
p(style="margin-top: -.5rem")
  label IIIF Manifest URL
    input(
      type="text"
      :value="manifestUrl"
      @change="loadManifest($event.target.value)"
      @focus="$event.target.select()"
      placeholder="IIIF Manifest URL"
    )

h3.small(style="margin: 0") Sample Documents
ul.sample-manifests(ref="sampleManifests")
  li(v-for="sample in sampleManifests" :class="manifestUrl === sample.url ? 'current' : ''")
    a.sample-manifests-link(
      href="javascript:;"
      @click="loadManifest(sample.url, sample.options || {})"
    )
      img.sample-manifests-image(:src="`img/iiif-thumbnails/${sample.title}.jpg`" alt)
      span.sample-manifests-title {{sample.title}}

h2 Core Features
ul.arrow-list(style="margin: 0 auto 1rem; width: 14rem")
  li Lightweight – only {{sizeKb}}&nbsp;kB (gzipped)
  li Fast – also with very large manifests
  li Easy to embed and highly configurable
  li Fully responsive and accessible
  li State can be reflected in bookmarkable&nbsp;URL
p.center
  router-link.button(to="/examples/") Usage examples

.highlight
  h2 Get TIFY
  .row.center
    .col.-collapsed
      p
        code(style="font-weight: bold; display: inline-block; padding: .375rem 1rem") npm install tify
    .col.-collapsed
      p
        a.button(:href="downloadUrl") Download TIFY {{version}}
    .col.-collapsed
      p
        a.button.-outline(:href="githubUrl") GitHub Repository

h2 Getting Started
.readme(v-html="readme")

.row.center
  .col.-collapsed
    p
      a.button(:href="downloadUrl") Download TIFY {{version}}
  .col.-collapsed
    p
      a.button.-outline(:href="githubUrl") GitHub Repository
  .col.-collapsed
    p
      router-link.button(to="/examples/") Usage examples
</template>

<script>
import { marked } from 'marked'
import readme from 'tify/README.md'
import sampleManifests from '../data/sample-manifests.json'

const defaultManifestUrl = 'https://manifests.sub.uni-goettingen.de/iiif/presentation/PPN623133725/manifest'

export default {
  data() {
    return {
      manifestUrl: (new URLSearchParams(window.location.search)).get('manifest') || defaultManifestUrl,
      sampleManifests,
      tify: null,
    }
  },
  computed: {
    downloadUrl() {
      return `${process.env.VUE_APP_GITHUB_URL}/archive/refs/tags/v${process.env.VUE_APP_TIFY_VERSION}.zip`
    },
    githubUrl() {
      return `${process.env.VUE_APP_GITHUB_URL}/tree/v${process.env.VUE_APP_TIFY_VERSION}`
    },
    readmeUrl() {
      return `${process.env.VUE_APP_GITHUB_URL}/blob/v${process.env.VUE_APP_TIFY_VERSION}/README.md`
    },
    readme() {
      const markdown = readme
        .replace(/<h1>.*?<\/h1>/s, '') // remove h1
        .replace(/.*\(https:\/\/tify.rocks\/\).*/, '') // remove paragraph with website link
        .replace(/(\s)## Build Setup.*/s, '') // remove build setup
        .replace(/(\s)#### /g, '$1##### ') // change h4 to h5
        .replace(/(\s)### /g, '$1#### ') // change h3 to h4
        .replace(/(\s)## /g, '$1### ') // change h2 to h3

      let html = marked(markdown)

      // Fix local links
      html = html.replace(
        / href="((?!#)(?!https?:).*?)"/g,
        ` href="${process.env.VUE_APP_GITHUB_URL}/blob/v${process.env.VUE_APP_TIFY_VERSION}/$1"`,
      )

      return html
    },
    sizeKb() {
      return Math.round(process.env.VUE_APP_TIFY_SIZE / 1000)
    },
    version() {
      return process.env.VUE_APP_TIFY_VERSION
    },
  },
  mounted() {
    this.loadManifest(this.manifestUrl, this.manifestUrl === defaultManifestUrl ? { pages: [2, 3] } : {})
  },
  beforeUnmount() {
    this.tify.destroy()
  },
  methods: {
    loadManifest(manifestUrl, options = {}) {
      const url = new URL(window.location)

      if (this.tify) {
        url.searchParams.delete('tify')
        this.tify.destroy()
      }

      const defaultOptions = {
        container: '#tify',
        manifestUrl,
        urlQueryKey: 'tify',
      }

      this.tify = new Tify({ ...defaultOptions, ...options })

      if (manifestUrl !== defaultManifestUrl) {
        url.searchParams.set('manifest', manifestUrl)
      } else {
        url.searchParams.delete('manifest')
      }

      window.history.pushState({}, '', url)

      this.manifestUrl = manifestUrl

      this.$nextTick(() => {
        // eslint-disable-next-line no-unused-expressions
        this.$refs.sampleManifests.querySelector('.current')?.scrollIntoView(({ behavior: 'smooth', block: 'nearest', inline: 'center' }))
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/settings';

.frame {
  width: 44rem;
  height: 22rem;
  left: 50%;
  transform: translate(-50%);
}
</style>

<style lang="scss">
@import '@/styles/settings';

.readme {
  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  // Options and API parameters
  > ul {
    list-style: none;
    padding-left: .5rem;

    > li {
      position: relative;

      &::before {
        background: rgba($blue, .25);
        content: '';
        display: block;
        left: -.5rem;
        top: 4px;
        bottom: 2px;
        position: absolute;
        width: 4px;
        border-radius: 2px;

        .dark & {
          background: rgba(mix(#fff, $blue), .25);
        }
      }
    }
  }
}

.sample-manifests {
  display: flex;
  font-size: $font-size-small;
  list-style: none;
  margin: -1px; // keep border visible
  max-width: calc(100% + .25rem);
  overflow: auto;
  padding: 0;
  scroll-snap-type: x proximity;

  @media #{$small} {
    flex-wrap: wrap;
    margin: -.125rem -.125rem (1.5rem - .125rem);
  }

  li {
    background: $white;
    border-radius: $br;
    box-shadow: 0 0 0 1px $border-color;
    flex: 1 0 auto;
    margin: 1px; // keep border visible
    scroll-snap-align: center;
    // scroll-margin: 1px; // keep border visible

    + li {
      margin-left: .25rem;

      @media #{$small} {
        margin: .125rem;
      }
    }

    @media #{$small} {
      margin: .125rem;
    }

    .dark & {
      background: $body-color;
    }

    &.current {
      background: $button-bg;
      color: $white;
    }
  }
}

.sample-manifests-image {
  border-radius: $br 0 0 $br;
  box-shadow: 1px 0 $border-color;
  filter: sepia(.8) opacity(.8);
  margin: 0 -.3em 0 0;
  object-fit: cover;
  height: 1.5rem;
  width: 1.5rem;
  transition: filter $td;
}

.sample-manifests-link {
  align-items: center;
  display: flex;
  border: 0;
  line-height: .5rem;

  &:hover,
  &:focus {
    > img {
      filter: none;
      transition-duration: 0s;
    }
  }

  .current > & {
    color: inherit;
  }
}

.sample-manifests-title {
  font-weight: bold;
  padding: .25rem .5rem;
}
</style>
