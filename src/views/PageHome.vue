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
  //- NOTE: We would prefer to redirect from /examples/ to /examples/basic/,
  //- but this does not work with prerendering.
  router-link.button(to="/examples/basic/") Usage examples

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
.readme(v-html="readmeHtml")

h3#options Options
.options(style="margin-bottom: 1.5rem")
  ul.options-list
    li.highlight.option(v-for="option in tifyOptions" :key="option.name")
      .option-header
        h4
          code {{option.name}}
      .option-body
        dl
          div
            dt Type
            dd(v-html="option.type")
          div
            dt Default
            dd #[code {{option.defaultValue}}]
        p.option-description(v-html="option.comment")

.row.center
  .col.-collapsed
    p
      a.button(:href="downloadUrl") Download TIFY {{version}}
  .col.-collapsed
    p
      a.button.-outline(:href="githubUrl") GitHub Repository
  .col.-collapsed
    p
      router-link.button(to="/examples/basic/") Usage examples
</template>

<script>
import { marked } from 'marked'
import readme from 'tify/README.md'
import configText from 'tify/src/config'
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
    readmeHtml() {
      const markdown = readme
        .replace(/<h1>.*?<\/h1>/s, '') // remove h1
        .replace(/.*\(https:\/\/tify.rocks\/\).*/, '') // remove paragraph with website link
        .replace(/(\s)## Build Setup.*/s, '') // remove build setup
        .replace(/(\s)#### /g, '$1##### ') // change h4 to h5
        .replace(/(\s)### /g, '$1#### ') // change h3 to h4
        .replace(/(\s)## /g, '$1### ') // change h2 to h3
        .replace(/\[config.js\]\(.*?\)/g, '[options](#options)') // replace config link

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
    tifyOptions() {
      const options = configText
        .replace(/export default \{(.*)\};?/s, '$1')
        .replace(/^\s*/gm, '')
        .replace(/^\* ?/gm, '')
        .replace(/,\n/g, '')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .split('/**')
        .slice(1)

      return options
        .map((string) => {
          const parts = string.split('@type ')
          const typeAndName = parts[1]?.split(/\n\/\n/)

          const comment = parts[0]
            .replace(/\n/g, ' ') // line breaks to spaces
            .replace(/(https[^ ]+)/g, '<a href="$1">$1</a>') // make URLs clickable
            .replace(/`(.*?)`/g, '<code>$1</code>') // add code markup

          const type = typeAndName[0]
            .replace(/{|}/g, '') // remove curly braces
            .replace(/\|/, ' or ') // replace "|"" with "or"
            .replace(/\?(.*)/, '$1 or <code>null</code>') // spell out "null"

          const [name, defaultValue] = typeAndName[1]
            .replace(/\n/g, ' ') // line breaks to spaces
            .replace(/,( ])|,( })/, '$1$2') // remove trailing comma
            .split(/: (.*)/s)

          return {
            comment,
            type,
            name,
            defaultValue,
          }
        })
    },
    version() {
      return process.env.VUE_APP_TIFY_VERSION
    },
  },
  mounted() {
    this.loadManifest(
      this.manifestUrl,
      this.manifestUrl === defaultManifestUrl
        ? { pages: [2, 3] }
        : {},
    )
  },
  beforeUnmount() {
    this.tify.destroy()
  },
  methods: {
    loadManifest(manifestUrl, options = {}) {
      const url = new URL(window.location)

      if (this.tify) {
        this.tify.destroy()
        url.searchParams.delete('tify')
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

.options-list {
  list-style: none;
  padding: 0;
}

.option {
  margin: 0 0 .5rem !important;
  padding: 0;

  @media #{$small} {
    display: flex;
  }
}

.option-header {
  background: radial-gradient($shade 20%, transparent 20%);
  background-size: 3px 3px;
  flex: 0 0 8rem;
  line-height: .75rem;
  padding: .5rem;

  code {
    background: none;
    text-shadow: 0 0 1px $white, 0 0 2px $white;
  }

  h4 {
    margin: 0;
  }
}

.option-body {
  font-size: $font-size-small;
  line-height: .75rem;
  padding: .5rem;

  > :last-child {
    margin-bottom: 0;
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
  height: 1.5rem;
  margin: 0 -.3em 0 0;
  object-fit: cover;
  width: 1.5rem;
}

.sample-manifests-link {
  align-items: center;
  display: flex;
  border: 0;
  line-height: .5rem;

  .current > & {
    color: inherit;
  }
}

.sample-manifests-title {
  font-weight: bold;
  padding: .25rem .5rem;
}

.tify {
  color-scheme: light;
  font-size: 16px;
  line-height: 1.5;

  .dark & {
    color-scheme: dark;
  }
}
</style>
