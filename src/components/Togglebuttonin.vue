<template>
  <div class="flex flex-col items-center justify-center p-4 m-10 space-y-4">
    <div
      class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <!-- <a href="#">
        <img class="rounded-t-lg" src="" alt="" />
      </a> -->
      <div class="p-5">
        <a href="#">
          <h5
            class="mb-2 text-2xl font-bold tracking-tight text-center text-blue-900 dark:text-white"
          >
            ควบคุมการเปิดปิดไม้กั้นทางเข้า
          </h5>
        </a>
        <p class="mb-3 font-normal text-center text-red-600 dark:text-gray-400">
          กรุณาเลือกการควบคุมอย่างระมัดระวัง.
        </p>
      </div>
    </div>

    <!-- ปุ่มเปิด -->
    <button
      @click="toggleOn"
      :class="{
        'w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 py-4 rounded-lg text-white text-2xl font-semibold': true,
        'bg-green-500': isOn,
        'bg-gray-300': !isOn,
      }"
      class="transition duration-300 ease-in-out transform hover:scale-105"
    >
      เปิดไม้กั้นทางเข้า
    </button>

    <!-- ปุ่มปิด -->
    <button
      @click="toggleOff"
      :class="{
        'w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 py-4 rounded-lg text-white text-2xl font-semibold': true,
        'bg-red-500': isOff,
        'bg-gray-300': !isOff,
      }"
      class="transition duration-300 ease-in-out transform hover:scale-105"
    >
      ปิดไม้กั้นทางเข้า
    </button>
    <!-- ปุ่มออโต้ -->
    <button
      @click="toggleauto"
      :class="{
        'w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 py-4 rounded-lg text-white text-2xl font-semibold': true,
        'bg-blue-500': isAuto,
        'bg-gray-300': !isAuto,
      }"
      class="transition duration-300 ease-in-out transform hover:scale-105"
    >
      เปิดอัตโนมัติทางเข้า
    </button>

    <!-- <div class="bg-white">
      <div class="max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">


        <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          <a href="#" class="group">
            <div
              class="w-full p-4 overflow-hidden text-center bg-gray-200 rounded-lg aspect-h-1 aspect-w-1 xl:aspect-h-8 xl:aspect-w-7">
              <h1 class="text-green-700"><b> ระยะทางเซนเซอร์ตัวที่ 1</b></h1>
              <font size="+3">
                <p>{{ distance1 }}</p>
              </font>
            </div>

          </a>
          <a href="#" class="group">
            <div
              class="w-full p-4 overflow-hidden text-center bg-gray-200 rounded-lg aspect-h-1 aspect-w-1 xl:aspect-h-8 xl:aspect-w-7">
              <h1 class="text-green-700"><b> ระยะทางเซนเซอร์ตัวที่ 2</b></h1>
              <font size="+3">
                <p>{{ distance2 }}</p>
              </font>
            </div>

          </a>
          <a href="#" class="group">
            <div
              class="w-full p-4 overflow-hidden text-center bg-gray-200 rounded-lg aspect-h-1 aspect-w-1 xl:aspect-h-8 xl:aspect-w-7">
              <h1 class="text-green-700"><b> ระยะทางเซนเซอร์ตัวที่ 3</b></h1>
              <font size="+3">
                <p>{{ distance3 }}</p>
              </font>
            </div>

          </a>
          <a href="#" class="group">
            <div
              class="w-full p-4 overflow-hidden text-center bg-gray-200 rounded-lg aspect-h-1 aspect-w-1 xl:aspect-h-8 xl:aspect-w-7">
              <h1 class="text-green-700"><b> ระยะทางเซนเซอร์ตัวที่ 4</b></h1>
              <font size="+3">
                <p>{{ distance4 }}</p>
              </font>
            </div>

          </a>


        </div>


      </div>
    </div> -->
  </div>
</template>

<script>
import { ref } from "vue";
import { realtime } from "../main.js";
import { ref as dbRef, get, update } from "firebase/database";
// import { ref, push, onValue, remove, update } from 'firebase/database';
export default {
  setup() {
    const isOn = ref(false);
    const isOff = ref(false);
    const isAuto = ref(false);

    const fetchData = async () => {
      const barrier_in_on = dbRef(realtime, "barrier_in_on"); // กำหนด path ไปยัง field ที่ต้องการ
      const barrier_in_off = dbRef(realtime, "barrier_in_off"); // กำหนด path ไปยัง field ที่ต้องการ
      const barrier_in_auto = dbRef(realtime, "barrier_in_auto"); // กำหนด path ไปยัง field ที่ต้องการ

      const [snapshot1, snapshot2, snapshot3] = await Promise.all([
        get(barrier_in_on),
        get(barrier_in_off),
        get(barrier_in_auto),
      ]);

      if (snapshot1.exists()) {
        isOn.value = snapshot1.val();
      } else {
        console.log("No data available for field1");
      }

      if (snapshot2.exists()) {
        isOff.value = snapshot2.val();
      } else {
        console.log("No data available for field2");
      }
    };

    fetchData();

    const toggleOn = async () => {
      const updates = {};
      updates["barrier_in_on"] = true;
      updates["barrier_in_off"] = false;
      updates["barrier_in_auto"] = false;
      await update(dbRef(realtime), updates);
      fetchData(); // เรียก fetchData เพื่อรีเฟรชค่าใน fieldValue

      isOn.value = true;
      isOff.value = false;
      isAuto.value = false;
    };

    const toggleOff = async () => {
      const updates = {};
      updates["barrier_in_on"] = false;
      updates["barrier_in_off"] = true;
      updates["barrier_in_auto"] = false;
      await update(dbRef(realtime), updates);
      fetchData(); // เรียก fetchData เพื่อรีเฟรชค่าใน fieldValue
      isOn.value = false;
      isOff.value = true;
      isAuto.value = false;
    };
    const toggleauto = async () => {
      const updates = {};
      updates["barrier_in_on"] = false;
      updates["barrier_in_off"] = false;
      updates["barrier_in_auto"] = true;
      await update(dbRef(realtime), updates);
      fetchData(); // เรียก fetchData เพื่อรีเฟรชค่าใน fieldValue
      isOn.value = false;
      isOff.value = false;
      isAuto.value = true;
    };

    return {
      isOn,
      isOff,
      isAuto,
      toggleOn,
      toggleOff,
      toggleauto,
    };
  },
};
</script>

<style scoped>
button {
  transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
}

button:hover {
  transform: scale(1.05);
}
</style>
