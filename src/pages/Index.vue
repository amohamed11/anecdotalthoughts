<template>
  <Layout>
    <header class="header">
      <g-image src="@/assets/Me.png" fit="cover" quality="75" immediate="true"/>
      <h1 v-html="$page.metaData.siteName" /> 
      <h2 v-html="$page.metaData.siteDescription" />
    </header>
    <section class="links">
      <a href="https://github.com/amohamed11">
        <font-awesome :icon="['fab', 'github']" size="2x" title="GitHub"/>
      </a>
      <a href="https://www.linkedin.com/in/amohamed11/">
        <font-awesome :icon="['fab', 'linkedin']" size="2x" title="Linkedin"/>
      </a>
      <g-link  href="Resume.pdf">
        <font-awesome :icon="['fas', 'file-alt']" size="2x" title="Resume"/>
      </g-link>
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
    title: "Anas Mohamed"
  }
};
</script>

<page-query>
query {
  metaData {
    siteName
    siteDescription
  }
}
</page-query>

<style>
.header {
  font-family: "Quicksand";
  font-size: 28px;
  text-align: center;
  line-height: 24px;
  padding: 5em 2em 0;
}
.header h2 {
  font-weight: 200;
  font-size: 24px;
  line-height: 32px;
}
.links {
  text-align: center;
}
img {
  width: 280px;
  box-shadow: 0 6px 8px 0 rgba(0,0,0,0.4);
  border-radius: 100%;
}
a {
  padding: 1em;
}
</style>
