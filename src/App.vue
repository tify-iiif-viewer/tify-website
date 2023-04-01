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

  button.nav-dark-toggle(type="button" @click="toggleDarkMode()" aria-label="Toggle dark mode")
    svg.icon
      //- MDI theme-light-dark
      path(d="M7.5,2C5.71,3.15 4.5,5.18 4.5,7.5C4.5,9.82 5.71,11.85 7.53,13C4.46,13 2,10.54 2,7.5A5.5,5.5 0 0,1 7.5,2M19.07,3.5L20.5,4.93L4.93,20.5L3.5,19.07L19.07,3.5M12.89,5.93L11.41,5L9.97,6L10.39,4.3L9,3.24L10.75,3.12L11.33,1.47L12,3.1L13.73,3.13L12.38,4.26L12.89,5.93M9.59,9.54L8.43,8.81L7.31,9.59L7.65,8.27L6.56,7.44L7.92,7.35L8.37,6.06L8.88,7.33L10.24,7.36L9.19,8.23L9.59,9.54M19,13.5A5.5,5.5 0 0,1 13.5,19C12.28,19 11.15,18.6 10.24,17.93L17.93,10.24C18.6,11.15 19,12.28 19,13.5M14.6,20.08L17.37,18.93L17.13,22.28L14.6,20.08M18.93,17.38L20.08,14.61L22.28,17.15L18.93,17.38M20.08,12.42L18.94,9.64L22.28,9.88L20.08,12.42M9.63,18.93L12.4,20.08L9.87,22.27L9.63,18.93Z")
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
        'Basic Usage': '/examples/basic/',
        'Multiple Instances': '/examples/multiple/',
        API: '/examples/api/',
      }
    },
    githubUrl() {
      return process.env.VUE_APP_GITHUB_URL
    },
  },
  methods: {
    toggleDarkMode() {
      document.documentElement.classList.toggle('dark')
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

@import '../node_modules/highlight.js/styles/github-dark-dimmed.css';
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
    .dark & {
      filter: invert(1) grayscale(1);
    }
  }
}

.header {
  text-align: center;

  &.-large {
    padding: .5rem .5rem 1rem;

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

  .dark & {
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

  .dark & {
    background: mix(#fff, invert($beige), 5%);
  }

  .header.-large + & > :first-child {
    margin-top: -2rem;
  }
}

.nav {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: .5rem 0 .25rem;

  @media #{$large} {
    flex-direction: row;
    margin: .25rem 0;
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

    // space for dark mode toggle
    @media #{$large} and (max-width: 1540px) {
      margin-right: 1.25rem;
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

      &:focus,
      &:hover {
        transition-duration: 0s;
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

.nav-dark-toggle {
  background: none;
  border-radius: $br;
  border: 0;
  color: $link-color;
  cursor: pointer;
  height: 1.5rem;
  position: absolute;
  right: .25rem;
  top: .25rem;
  transition: background $td, color $td, filter $td;
  width: 1.5rem;

  &:focus,
  &:hover {
    background: $link-hover-bg;
    color: $link-hover-color;
    transition-duration: 0s;
  }

  .dark & {
    color: $white;

    &:focus,
    &:hover {
      background: rgba(invert($body-color), .1);
    }
  }
}
</style>
