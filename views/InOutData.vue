<template>
  <div>
    <Navbar />
    <!-- Search inputs -->
    <section class="container p-6 mx-auto font-sans">
      <div class="flex mb-8 space-x-4">
        <!-- Name or license plate search -->
        <input
          type="text"
          v-model="searchTerm"
          placeholder="ค้นหาชื่อหรือป้ายทะเบียน"
          class="w-full p-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        />

        <!-- Date search -->
        <input
          type="date"
          v-model="searchDate"
          class="p-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        />

        <!-- Search button -->
        <button
          @click="search"
          class="px-4 py-2 text-base text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          ค้นหา
        </button>

        <!-- Refresh button -->
        <button
          @click="resetFilters"
          class="px-4 py-2 text-base text-white bg-gray-500 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring focus:border-gray-300"
        >
          รีเฟรช
        </button>
      </div>

      <!-- Records table -->
      <div class="w-full overflow-hidden rounded-lg shadow-lg">
        <div class="w-full overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr
                class="font-semibold tracking-wide text-left text-gray-900 uppercase bg-gray-100 border-b border-gray-600 text-md"
              >
                <th class="px-4 py-3">ลำดับ</th>
                <th class="px-4 py-3">ชื่อ-นามสกุล</th>
                <th class="px-4 py-3">ป้ายทะเบียน</th>
                <th class="px-4 py-3">จังหวัด</th>
                <th class="px-4 py-3">สถานะการเข้า</th>
                <th class="px-4 py-3">สถานะการออก</th>
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr
                v-for="(record, index) in filteredRecords"
                :key="index"
                class="text-gray-700 border-b"
              >
                <td class="px-4 py-3 text-xl border">
                  {{ index + 1 }}
                  <!-- แสดงลำดับเริ่มจาก 1 -->
                </td>
                <td class="px-4 py-3 font-semibold border">
                  {{ record.firstName }} {{ record.lastName }}
                </td>
                <td class="px-4 py-3 border">
                  <p class="font-semibold text-black">
                    {{ record.licensePlate }}
                  </p>
                </td>
                <td class="px-4 py-3 border">
                  <p class="font-semibold text-black">
                    {{ record.licensePlateProvince }}
                  </p>
                </td>
                <td class="px-4 py-3 border">
                  <span :class="getStatusClass(record.timeIn, 'in')">
                    {{ formatTimestamp(record.TimeIn) }}
                  </span>
                </td>
                <td class="px-4 py-3 border">
                  <span :class="getStatusClass(record.timeOut, 'out')">
                    {{ formatTimestamp(record.TimeOut) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
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

// ฟังก์ชันแปลง timestamp เป็นรูปแบบวันที่และเวลา
const formatTimestamp = (timestamp) => {
  if (timestamp) {
    return moment(timestamp.toDate())
      .tz("Asia/Bangkok")
      .format("YYYY-MM-DD HH:mm:ss");
  }
  return "Invalid Date"; // คืนค่าหาก timestamp เป็นค่าไม่ถูกต้อง
};

const fetchRecords = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "TimeUser"));
    records.value = querySnapshot.docs.map((doc) => doc.data());
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
    const name = record.FirstName
      ? `${record.FirstName} ${record.LastName}`.toLowerCase()
      : "";
    const licensePlate = record.licensePlate
      ? record.licensePlate.toLowerCase()
      : "";

    const isNameMatch = name.includes(search);
    const isLicensePlateMatch = licensePlate.includes(search);
    const isDateMatch = !date || record.date === date;

    return (isNameMatch || isLicensePlateMatch) && isDateMatch;
  });
});

const search = () => {
  console.log(
    "Performing search with term:",
    searchTerm.value,
    "and date:",
    searchDate.value
  );
};

const resetFilters = () => {
  searchTerm.value = "";
  searchDate.value = "";
  console.log("Filters reset"); // แสดงข้อความเมื่อรีเซ็ตฟิลด์ค้นหา
};
</script>
