<template>
  <div>
    <Navbar />
    <Togglebuttonin />
  </div>
</template>
<script>
import Togglebuttonin from "../src/components/Togglebuttonin.vue";
import Navbar from "../src/components/Navbar.vue";

export default {
  components: {
    Navbar,
    Togglebuttonin,
  },
};
</script>
