<template>
  <div>
    <Navbar />
    <!-- Search inputs -->
    <section class="container p-6 mx-auto font-sans">
      <div class="flex mb-8 space-x-4">
        <!-- Name or license plate search -->
        <input type="text" v-model="searchTerm" placeholder="ค้นหาชื่อหรือรหัสผู้ดูแล"
          class="w-full p-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300" />

        <!-- Date search -->
        <input type="date" v-model="searchDate"
          class="p-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300" />

        <!-- Search button -->
        <button @click="search"
          class="px-4 py-2 text-base text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
          ค้นหา
        </button>

        <!-- Refresh button -->
        <button @click="resetFilters"
          class="px-4 py-2 text-base text-white bg-gray-500 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring focus:border-gray-300">
          รีเฟรช
        </button>
      </div>

      <!-- Records table -->
      <div class="w-full overflow-hidden rounded-lg shadow-lg">
        <div class="w-full overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr
                class="font-semibold tracking-wide text-left text-gray-900 uppercase bg-gray-100 border-b border-gray-600 text-md">
                <th class="px-4 py-3">ลำดับ</th>
                <th class="px-4 py-3">รหัสผู้ดูแลห้อง</th>
                <th class="px-4 py-3">ชื่อ-นามสกุล</th>
                <th class="px-4 py-3">ตำแหน่ง</th>
                <th class="px-4 py-3">ห้องที่ดูแล</th>
                <th class="px-4 py-3">วันที่เปิดประตู</th> <!-- คอลัมน์สำหรับวันที่ -->
                <th class="px-4 py-3">เวลาเปิดประตู</th> <!-- คอลัมน์สำหรับเวลา -->
              </tr>
            </thead>

            <tbody class="bg-white">
              <!-- <tr v-for="(record, index) in filteredRecords" :key="index" class="text-gray-700 border-b">
                <td class="px-4 py-3 text-xl border">
                  {{ index + 1 }}
                 
                </td> -->
              <tr v-for="(record, index) in paginatedRecords" :key="index" class="text-gray-700 border-b">
                <td class="px-4 py-3 text-xl border">
                  {{ (currentPage - 1) * rowsPerPage + index + 1 }}
                </td>
                <td class="px-4 py-3 font-semibold border">
                  {{ record.number_person }}
                </td>
                <td class="px-4 py-3 border">
                  <p class="font-semibold text-black">
                    {{ record.name }}
                  </p>
                </td>
                <td class="px-4 py-3 border">
                  <p class="font-semibold text-black">
                    {{ record.position }}
                  </p>
                </td>
                <td class="px-4 py-3 border">
                  <p class="font-semibold text-black">
                    {{ record.room_number }}
                  </p>
                </td>
                <td class="px-4 py-3 border"> <!-- วันที่ -->
                  <span>
                    {{ formatDate(record.timeOpen) }}
                  </span>
                </td>
                <td class="px-4 py-3 border"> <!-- เวลา -->
                  <span :class="getStatusClass(record.timeOpen, 'in')">
                    {{ formatTime(record.timeOpen) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex items-center justify-between py-2">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
              class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200">
              ย้อนกลับ
            </button>
            <span>หน้าที่ {{ currentPage }} จาก {{ totalPages }} หน้า</span>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
              class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200">
              ถัดไป
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../src/components/Navbar.vue";
import { firestore } from "../src/main"; // ปรับ path ตามที่คุณใช้
import moment from "moment";
import "moment-timezone";

const records = ref([]); // สถานะสำหรับเก็บข้อมูลที่ดึงมาจาก Firestore
const searchTerm = ref(""); // คำค้นหาจากฟิลด์ค้นหา
const searchDate = ref(""); // วันที่ที่เลือกสำหรับการค้นหา
const currentPage = ref(1); // เก็บหน้าปัจจุบัน
const rowsPerPage = 10; // จำนวนแถวต่อหน้า

const formatDate = (timestamp) => {
  if (timestamp) {
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
      "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
      "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    moment.locale("th");
    const date = moment(timestamp.toDate()).tz("Asia/Bangkok");

    const day = date.format("DD");
    const month = thaiMonths[date.month()];
    const year = date.year() + 543;

    return `${day} ${month} ${year}`;
  }
  return "Invalid Date";
};

const formatTime = (timestamp) => {
  if (timestamp) {
    const time = moment(timestamp.toDate()).tz("Asia/Bangkok").format("HH:mm:ss");
    return time;
  }
  return "Invalid Time";
};

const fetchRecords = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "TimeUserOpen"));
    records.value = querySnapshot.docs.map((doc) => doc.data());

    // เรียงลำดับตามเวลาล่าสุด โดยการแปลง timestamp เป็น Date แล้วใช้การเรียงลำดับจากมากไปน้อย
    records.value.sort((a, b) => b.timeOpen.toDate() - a.timeOpen.toDate());
    
    console.log("Records fetched:", records.value); // แสดงข้อมูลที่ดึงมาบนคอนโซล
  } catch (error) {
    console.error("Error fetching records:", error); // แสดงข้อผิดพลาดหากมี
  }
};

onMounted(() => {
  fetchRecords(); // ดึงข้อมูลเมื่อคอมโพเนนต์ถูกติดตั้ง
});

const getStatusClass = (time, type) => {
  // ฟังก์ชันคืนคลาส CSS ตามสถานะการเข้า (in) หรือออก (out)
  if (type === "in") {
    return "px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm";
  } else if (type === "out") {
    return "px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm";
  }
  return "";
};

const filteredRecords = computed(() => {
  // คอมพิวเท็ดพรอพเพอร์ตี้ที่กรองข้อมูลตามคำค้นหาและวันที่
  const search = searchTerm.value.toLowerCase();
  const date = searchDate.value;

  return records.value.filter((record) => {
    const name = record.name
      ? `${record.name}`.toLowerCase()
      : "";
    const numberPerson = record.number_person
      ? record.number_person.toLowerCase()
      : "";

    const isNameMatch = name.includes(search);
    const isNumberPersonMatch = numberPerson.includes(search);
    // ตรวจสอบว่ามีการค้นหาวันที่หรือไม่
    const isDateMatch = date
      ? moment(record.timeOpen.toDate()).format("YYYY-MM-DD") === date
      : true;


    return (isNameMatch || isNumberPersonMatch) && isDateMatch;
  });
});
const paginatedRecords = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  return filteredRecords.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  return Math.ceil(filteredRecords.value.length / rowsPerPage);
});
const search = () => {
  console.log(
    "Performing search with term:",
    searchTerm.value,
    "and date:",
    searchDate.value
  );
};
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const resetFilters = () => {
  searchTerm.value = "";
  searchDate.value = "";
  console.log("Filters reset"); // แสดงข้อความเมื่อรีเซ็ตฟิลด์ค้นหา
};
</script>
