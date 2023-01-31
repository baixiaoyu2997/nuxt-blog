// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ["github-markdown-css/github-markdown.css"],
  modules: ["@nuxt/content"],
  content: {
    highlight: {
      // Theme used in all color schemes.
      theme: "github-dark",
    },
  },
});
