<template>
    <div>
        <Navbar />
        <Compare />
    </div>
</template>
<script>
import Compare from "../src/components/Compare.vue";
import Navbar from "../src/components/Navbar.vue";

export default {
    components: {
        Navbar,
        Compare,
    },
};
</script>