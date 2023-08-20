<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/map">Map</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script setup lang="ts">

</script>

<style scoped>
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
/*}*/
</style>
