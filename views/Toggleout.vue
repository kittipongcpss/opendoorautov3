<template>
  <div>
    <Navbar />
    <Togglebuttonout />
  </div>
</template>
<script>
import Togglebuttonout from "../src/components/Togglebuttonout.vue";
import Navbar from "../src/components/Navbar.vue";

export default {
  components: {
    Navbar,
    Togglebuttonout,
  },
};
</script>
