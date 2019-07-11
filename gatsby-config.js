module.exports = {
  pathPrefix: "/amohamed11.github.io",
  siteMetadata: {
    name: `Anas Mohamed`,
    tagline: `Hey, there`
  },
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-tslint`,
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/data`,
        name: `data`,
      },
    },
  ],
}
