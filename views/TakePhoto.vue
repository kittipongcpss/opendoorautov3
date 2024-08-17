<template>
    <div>
        <Navbar />
        <Camera />
    </div>
</template>
<script>
import Camera from "../src/components/Camera.vue";
import Navbar from "../src/components/Navbar.vue";

export default {
    components: {
        Navbar,
        Camera,
    },
};
</script>