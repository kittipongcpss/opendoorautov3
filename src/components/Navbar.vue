<template>
  <div>
    <!-- Navbar -->
    <nav class="flex items-center justify-between px-4 py-3 text-white bg-gray-800">
      <!-- Logo and Title -->
      <div class="flex items-center">
        <div class="flex-shrink-0 w-12 h-12 mr-2 overflow-hidden rounded-full">
          <img src="/src/assets/png/Logo.png" alt="Logo" class="object-cover w-full h-full" />
        </div>
        <div class="text-xl font-bold tracking-tight">
          ระบบเปิดประตูอัตโนมัติ สำหรับผู้ดูแลห้อง
        </div>
      </div>

      <!-- Hamburger Menu Button -->
      <button @click="toggleMenu" class="text-white md:hidden focus:outline-none">
        <font-awesome-icon :icon="isMenuOpen ? 'times' : 'bars'" />
      </button>

      <!-- Navigation Links -->
      <div :class="[
          'flex items-center',
          { hidden: !isMenuOpen && windowWidth <= 768 },
          'md:flex',
        ]">
        <router-link class="px-4 py-2 text-sm leading-none rounded-full hover:bg-gray-700" to="/">หน้าหลัก</router-link>
        <router-link class="px-4 py-2 text-sm leading-none rounded-full hover:bg-gray-700"
          to="/room">จัดการห้อง</router-link>
          <router-link class="px-4 py-2 text-sm leading-none rounded-full hover:bg-gray-700"
          to="/open">ข้อมูลผู้ดูแลเปิดห้อง</router-link>
        <router-link class="px-4 py-2 text-sm leading-none rounded-full hover:bg-gray-700"
          to="/photo">เพิ่มผู้ดูแลห้อง</router-link>
        <router-link class="px-4 py-2 text-sm leading-none rounded-full hover:bg-gray-700"
          to="/compare">เปิดห้อง</router-link>
        <!-- <router-link class="px-4 py-2 text-sm leading-none rounded-full hover:bg-gray-700"
          to="/register">เพิ่มบุคลากร</router-link>
        <router-link class="px-4 py-2 text-sm leading-none rounded-full hover:bg-gray-700"
          to="/inoutdata">ข้อมูลเข้าออก</router-link>
        <router-link class="px-4 py-2 text-sm leading-none rounded-full hover:bg-gray-700"
          to="/togglein">เปิด-ปิดแผงกั้นทางเข้า</router-link>
        <router-link class="px-4 py-2 text-sm leading-none rounded-full hover:bg-gray-700"
          to="/toggleout">เปิด-ปิดแผงกั้นทางออก</router-link> -->

        <LogoutButton class="ml-4" />
      </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <div v-if="isMenuOpen && windowWidth <= 768" class="fixed inset-0 z-50 flex flex-col bg-white">
      <!-- Close Button -->
      <button @click="toggleMenu" class="absolute text-2xl text-gray-800 top-4 right-4 focus:outline-none">
        <font-awesome-icon icon="times" />
      </button>

      <!-- Menu Links -->
      <div class="flex flex-col px-4 mt-12 space-y-4">
        <router-link class="block w-full py-2 text-lg text-gray-800 border-b border-gray-300" to="/"
          @click="closeMenu">หน้าหลัก</router-link>
        <router-link class="block w-full py-2 text-lg text-gray-800 border-b border-gray-300" to="/room"
          @click="closeMenu">จัดการห้อง</router-link>
          <router-link class="block w-full py-2 text-lg text-gray-800 border-b border-gray-300" to="/open"
          @click="closeMenu">ข้อมูลผู้ดูแลเปิดห้อง</router-link>
        <router-link class="block w-full py-2 text-lg text-gray-800 border-b border-gray-300" to="/photo"
          @click="closeMenu">เพิ่มผู้ดูแลห้อง</router-link>
        <router-link class="block w-full py-2 text-lg text-gray-800 border-b border-gray-300" to="/compare"
          @click="closeMenu">เปิดห้อง</router-link>

        <!-- <router-link class="block w-full py-2 text-lg text-gray-800 border-b border-gray-300" to="/register"
          @click="closeMenu">เพิ่มบุคลากร</router-link>
        <router-link class="block w-full py-2 text-lg text-gray-800 border-b border-gray-300" to="/inoutdata"
          @click="closeMenu">ข้อมูลเข้าออก</router-link>
        <router-link class="block w-full py-2 text-lg text-gray-800 border-b border-gray-300" to="/togglein"
          @click="closeMenu">เปิด-ปิดแผงกั้นทางเข้า</router-link>
        <router-link class="block w-full py-2 text-lg text-gray-800 border-b border-gray-300" to="/toggleout"
          @click="closeMenu">เปิด-ปิดแผงกั้นทางออก</router-link> -->
        <LogoutButton class="block w-full py-2 text-lg text-gray-800" @click="closeMenu" />
      </div>
    </div>
  </div>
</template>

<script>
import LogoutButton from "../components/LogoutButton.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";

export default {
  components: {
    LogoutButton,
  },
  setup() {
    const isMenuOpen = ref(false);
    const windowWidth = ref(window.innerWidth);

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const closeMenu = async () => {
      isMenuOpen.value = false;
    };

    const handleResize = () => {
      windowWidth.value = window.innerWidth;
    };

    onMounted(() => {
      window.addEventListener("resize", handleResize);
      handleResize();
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize);
    });

    return {
      isMenuOpen,
      toggleMenu,
      closeMenu,
      windowWidth,
    };
  },
};
</script>

<style scoped>
/* Additional Styles for Mobile Menu */
@media (max-width: 768px) {
  .fixed {
    display: flex;
  }
}
</style>
