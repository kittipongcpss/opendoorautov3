<template>
    <div>
        <Navbar />
        <CrudRoom />
    </div>
</template>
<script>
import CrudRoom from "../src/components/CrudRoom.vue";
import Navbar from "../src/components/Navbar.vue";

export default {
    components: {
        Navbar,
        CrudRoom,
    },
};
</script>