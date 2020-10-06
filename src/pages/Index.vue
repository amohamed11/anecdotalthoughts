<template>
  <Layout>
    <header class="header">
      <g-image src="@/assets/Me.png" fit="cover" quality="75" immediate="true"/>
      <h1 v-html="$page.metaData.siteName" /> 
      <h2 v-html="$page.metaData.siteDescription" />
    </header>
    <section class="links">
      <a href="https://github.com/amohamed11">
        <font-awesome :icon="['fab', 'github']" size="lg" title="GitHub"/>
      </a>
      <a href="https://www.linkedin.com/in/amohamed11/">
        <font-awesome :icon="['fab', 'linkedin']" size="lg" title="Linkedin"/>
      </a>
      <g-link  href="Resume.pdf">
        <font-awesome :icon="['fas', 'file-alt']" size="lg" title="Resume"/>
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
  font-size: 18px;
  text-align: center;
  line-height: 24px;
  padding: 2em 2em;
}
.header h2 {
  font-weight: 200;
  font-size: 16px;
  line-height: 18px;
}
.links {
  text-align: center;
}
img {
  width: 140px;
  box-shadow: 0 6px 8px 0 rgba(0,0,0,0.4);
  border-radius: 100%;
}
a {
  padding: 1em;
}
</style>
