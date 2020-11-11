<template>
  <Layout>
    <header class="header">
      <g-image src="@/assets/Me.png" fit="cover" quality="75" immediate="true"/>
      <h1 v-html="$page.metadata.siteName" /> 
      <h2>
        Computing Science student at UAlberta.
        <br/>Times Person of the Year 2006.
        <br/>I like to program and stuff.
      </h2>
    </header>
    <section class="links">
      <a href="https://github.com/amohamed11">
        <font-awesome :icon="['fab', 'github']" size="2x" title="GitHub"/>
      </a>
      <a href="https://www.linkedin.com/in/amohamed11/">
        <font-awesome :icon="['fab', 'linkedin']" size="2x" title="Linkedin"/>
      </a>
      <g-link  href="Anas Mohamed's Resume.pdf" target="_blank">
        <font-awesome :icon="['fas', 'file-alt']" size="2x" title="Resume"/>
      </g-link>
    </section>
    <section class="posts">
      <PostList
        v-for="edge in $page.allPost.edges"
        :key="edge.node.id"
        :post="edge.node"
      />
    </section>
  </Layout>
</template>

<script>
import PostList from "@/components/PostList";
import { faGithub } from '@fortawesome/free-brands-svg-icons';
export default {
  components: {
    PostList
  },
  metaInfo: {
    title: "Anas Mohamed | sometimes blog"
  }
};
</script>

<page-query>
query {
  metadata {
    siteName
  }
  allPost {
    totalCount
    edges {
      node {
        id
        title
        timeToRead
        description
        date (format: "D MMMM YYYY")
        path
      }
    }

  }
}
</page-query>

<style>
.header {
  font-family: "Quicksand";
  font-size: 20px;
  text-align: center;
  line-height: 20px;
  padding-top: 2em;
}
.header h2 {
  font-weight: 200;
  font-size: 20px;
  line-height: 24px;
}
.links {
  text-align: center;
}
.links a {
  padding: 1em;
}
.header img {
  width: 200px;
  box-shadow: 0 6px 8px 0 rgba(0,0,0,0.4);
  border-radius: 100%;
}
</style>
