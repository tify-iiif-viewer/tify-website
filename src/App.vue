<template lang="pug">
header.header(:class="$route.path === '/' ? '-large' : '-small'")
  .container(v-if="$route.path === '/'")
    h1
      router-link.logo-link(to="/")
        .logo
        .sr-only TIFY &ndash;
      span A slim and mobile-friendly <span style="white-space: nowrap">IIIF document viewer</span>
  .container.-wide(v-else)
    nav.nav
      router-link.logo-link(to="/")
        .logo
        .sr-only TIFY

      ul(v-if="$route.path.startsWith('/examples/')")
        li(v-for="url, label in nav")
          router-link(:to="url") {{label}}

main.main
  .container
    router-view

footer.footer
  .wide
    .row
      .col
        p TIFY and the code of this website are released unter the <a href="https://opensource.org/licenses/AGPL-3.0">GNU Affero General Public License 3.0</a>. Content is released under the <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 license</a>.
        p Different licenses may apply for external content displayed in the viewer.
      .col
        hr
        nav(aria-label="Footer navigation")
          ul.inline-list.center.lg-right
            li(v-for="url, label in nav")
              router-link(:to="url") {{label}}
            li
              a(href="https://www.sub.uni-goettingen.de/en/imprint/") Legal Notice
            li
              a(href="https://www.sub.uni-goettingen.de/en/imprint/data-privacy-statement/") Privacy Policy
            li
              a.image-link(:href="githubUrl")
                img(src="/img/github-icon.svg" alt="GitHub" height="24")

        p.center.lg-right(style="margin-top: .5rem")
          a.image-link(href="https://www.sub.uni-goettingen.de/en/news/")
            img(src="/img/sub-logo.svg" alt="Göttingen State and University Library" height="32")
</template>

<script>
export default {
  computed: {
    nav() {
      return {
        Home: '/',
        'Basic Usage': '/examples/basic',
        'Multiple Instances': '/examples/multiple',
        API: '/examples/api',
      }
    },
    githubUrl() {
      return process.env.VUE_APP_GITHUB_URL
    },
  },
}
</script>

<style lang="scss">
@import 'reset-css';
@import '@/styles/settings';
@import '@/styles/fonts';
@import '@/styles/elements';
@import '@/styles/utils';
</style>

<style lang="scss" scoped>
@import '@/styles/settings';

h1 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 1;
}

.footer {
  font-size: $font-size-small;
  line-height: .75rem;
  padding: .75rem .5rem;

  hr {
    display: block;

    @media #{$large} {
      display: none;
    }
  }

  img {
    @media #{$dark} {
      filter: invert(1) grayscale(1);
    }
  }
}

.header {
  text-align: center;

  &.-large {
    padding: .5rem .5rem 2rem;

    h1 {
      font: inherit;
      font-weight: bold;
    }
  }

  &.-small {
    padding: 0 .5rem;
  }
}

.logo-link {
  border: 0;
  display: block;
  margin: 1rem auto;

  &:focus,
  &:hover {
    background: none;
  }

  .header.-small & {
    margin: 0;
  }
}

.logo {
  background: url('/img/tify-logo.svg') center no-repeat;
  background-size: contain;
  height: 2rem;
  width: 8rem;

  @media #{$large} {
    height: 3rem;
  }

  @media #{$dark} {
    background-image: url('/img/tify-logo-white.svg');
  }

  .header.-small & {
    height: 1rem;
    width: 3rem;
  }
}

.main {
  box-shadow: 0 1px 0 $border-color inset, 0 -1px 0 $border-color inset;
  background: $beige;
  padding: 1rem .5rem;

  @media #{$dark} {
    background: mix(#fff, invert($beige), 5);
  }

  .header.-large + & > :first-child {
    margin-top: -3rem;
  }
}

.nav {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: .5rem 0;

  @media #{$large} {
    flex-direction: row;
    justify-content: space-between;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    list-style: none;
    margin: .5rem 0 0;
    padding: 0;

    @media #{$large} {
      margin: 0 -.5rem 0 0;
    }

    li {
      margin: 0 0 0 2px;
    }

    a {
      border: 0;
      display: block;
      font-size: .5rem;
      font-weight: bold;
      letter-spacing: 2px;
      padding: .25rem .5rem;
      position: relative;
      text-decoration: none;
      text-transform: uppercase;

      &::after {
        background: currentColor;
        bottom: .25rem;
        content: '';
        display: block;
        height: 2px;
        left: .5rem;
        opacity: 0;
        position: absolute;
        transform: scale(0);
        right: .5rem;
        transition: opacity $td, transform ($td * .5);
      }

      &.router-link-active {
        &::after {
          opacity: 1;
          transform: none;
        }

        &:not(:focus):not(:hover) {
          color: inherit;
        }
      }
    }
  }
}
</style>
