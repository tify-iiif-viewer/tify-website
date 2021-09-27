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

h3.small(style="margin: 0") Sample Manifests
ul.block-list.sample-manifests
  li(v-for="sample in sampleManifests" :class="manifestUrl === sample.url ? 'current' : ''")
    a(
      href="javascript:;"
      @click="loadManifest(sample.url)"
    )
      b {{sample.title}}
    span.separator /
    a(:href="sample.website") {{sample.source}}

.highlight
  h2 Get TIFY
  p.center(style="margin-bottom: 1rem")
    code(style="font-weight: bold") npm install tify
  .row.center
    .col.-collapsed
      p
        a.button(:href="downloadUrl") Download TIFY {{version}}
    .col.-collapsed
      p
        a.button.-outline(:href="githubUrl") GitHub Repository

h2 Features
ul.arrow-list(style="margin: 0 auto 1rem; width: 14rem")
  li Lightweight – only 135&nbsp;KB (gzipped)
  li Fast – also with very large manifests
  li Fully responsive and accessible
  li Highly configurable
  li Current state reflected in bookmarkable URL
p.center
  router-link.button(to="/examples") Usage examples

.highlight
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
      router-link.button.-outline(to="/examples") Usage examples
</template>

<script>
import { marked } from 'marked'
import readme from 'tify/README.md'
import sampleManifests from '../data/sample-manifests.json'

const defaultManifestUrl = 'https://manifests.sub.uni-goettingen.de/iiif/presentation/PPN623133725/manifest'

export default {
  data() {
    return {
      manifestUrl: defaultManifestUrl,
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
        .replace(/.*?([\n ]##.*?)## Build Setup.*/is, '$1') // remove introduction and build setup
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
    version() {
      return process.env.VUE_APP_TIFY_VERSION
    },
  },
  mounted() {
    this.loadManifest(this.manifestUrl)
  },
  beforeUnmount() {
    this.tify.destroy()
  },
  methods: {
    loadManifest(manifestUrl) {
      this.manifestUrl = manifestUrl

      // eslint-disable-next-line no-new, no-undef
      this.tify = new Tify({
        container: '#tify',
        manifestUrl: this.manifestUrl,
        pages: this.manifestUrl === defaultManifestUrl ? [2, 3] : [1],
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

        @media #{$dark} {
          filter: brightness(2);
        }
      }
    }
  }
}

.sample-manifests {
  .current {
    background: $link-color;
    color: $white;

    a {
      color: inherit;

      &:focus,
      &:hover {
        background: $shine;
      }
    }
  }
}
</style>
