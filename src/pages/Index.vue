<template>
  <Layout>
    <header class="header">
      <h1 v-html="$page.metaData.siteName" />
      <h2 v-html="$page.metaData.siteDescription" />
    </header>
    <section class="posts">
      <PostList v-for="edge in $page.allPost.edges" :key="edge.node.id" :post="edge.node" />
    </section>
  </Layout>
</template>

<script>
import PostList from "@/components/PostList";
export default {
  components: {
    PostList
  },
  metaInfo: {
    title: "Anas Mohamed | Things & Stuff"
  }
};
</script>

<page-query>
query {
  metaData {
    siteName
    siteDescription
  }
  allPost {
    totalCount
    edges {
      node {
        id
        title
        timeToRead
        description
        date (format: "MMMM D YYYY")
        path
      }
    }

  }
}
</page-query>

<style>
.header {
  font-family: "Quicksand";
  font-size: 28px;
  text-align: center;
  line-height: 25px;
  padding: 0.7em;
}
.header h2 {
  font-weight: 200;
  font-size: 24px;
  line-height: 30px;
}
</style>
