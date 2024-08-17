<template>
  <router-view />
</template>

<script setup>
// import { onMounted, ref } from "vue";
// import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router"; //import router
const router = useRouter(); //get a reference to our vue router
// const isLoggedIn = ref(false);
// let auth;
// onMounted(() => {
//   auth = getAuth();
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       isLoggedIn.value = true;
//     } else {
//       isLoggedIn.value = false;
//     }
//   });
// });
</script>
