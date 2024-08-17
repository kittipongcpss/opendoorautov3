<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <!-- Hero Section -->
    <section
      class="relative flex items-center justify-center h-screen overflow-hidden text-center"
    >
      <video
        autoplay
        muted
        loop
        class="absolute inset-0 object-cover w-full h-full"
      >
        <source src="/src/assets/Video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div class="absolute inset-0 bg-black bg-opacity-60"></div>
      <div class="relative z-10 max-w-4xl px-6 py-12 mx-auto text-white">
        <h1
          class="mb-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-5xl"
        >
          ระบบเปิดประตูอัตโนมัติ
        </h1>

        <p class="mb-8 text-lg md:text-xl lg:text-2xl">
          การเปลี่ยนแปลงแนวคิดสู่การปฏิบัติด้วยการนำเสนอทางออกที่ทันสมัยและนวัตกรรมใหม่
        </p>
        <div class="relative inline-flex group">
          <div
            class="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-white via-white to-white rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"
          ></div>
          <a
            href="/"
            class="relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-xl hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            เริ่มต้นใช้งาน
          </a>
        </div>
      </div>
    </section>

    <!-- Developer Highlights -->
    <section class="py-16 bg-gray-200">
      <div class="max-w-6xl px-6 mx-auto text-center">
        <!-- Developers Section -->
        <h2 class="mb-12 text-2xl font-extrabold md:text-3xl lg:text-4xl">
          ผู้พัฒนาระบบ
        </h2>
        <div class="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2 lg:grid-cols-3">
          <!-- Developer Card 1 -->
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            class="min-h-0 p-6 bg-white rounded-lg shadow-lg"
          >
            <img
              src="/src/assets/png/member1.jpg"
              alt="ธีระวัฒน์ ยศจำรัส"
              class="object-cover mx-auto mb-4 rounded-full w-44 h-44 md:w-48 md:h-48 lg:w-56 lg:h-56"
            />
            <h3 class="mb-2 text-lg font-semibold md:text-xl lg:text-2xl">
              นายธีระวัฒน์ ยศจำรัส
            </h3>
            <p class="mb-4 text-sm text-gray-600 md:text-base">
              หัวหน้าโครงงาน
            </p>
          </div>

          <!-- Developer Card 2 -->
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            class="min-h-0 p-6 bg-white rounded-lg shadow-lg"
          >
            <img
              src="/src/assets/png/member2.jpg"
              alt="คเณศ ชูแสงทอง"
              class="object-cover w-40 h-40 mx-auto mb-4 rounded-full md:w-48 md:h-48 lg:w-56 lg:h-56"
            />
            <h3 class="mb-2 text-lg font-semibold md:text-xl lg:text-2xl">
              นายคเณศ ชูแสงทอง
            </h3>
            <p class="mb-4 text-sm text-gray-600 md:text-base">
              สมาชิกกลุ่มโครงงาน
            </p>
          </div>

          <!-- Developer Card 3 -->
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            class="min-h-0 p-6 bg-white rounded-lg shadow-lg"
          >
            <img
              src="/src/assets/png/member3.png"
              alt="ธนวัฒน์ ฉัตรวัฒน์"
              class="object-cover w-40 h-40 mx-auto mb-4 rounded-full md:w-48 md:h-48 lg:w-56 lg:h-56"
            />
            <h3 class="mb-2 text-lg font-semibold md:text-xl lg:text-2xl">
              นายธนวัฒน์ ฉัตรวัฒน์
            </h3>
            <p class="mb-4 text-base text-gray-600 md:text-base">
              สมาชิกกลุ่มโครงงาน
            </p>
          </div>
        </div>

        <!-- Advisors Section -->
        <h2 class="mb-12 text-2xl font-extrabold md:text-3xl lg:text-4xl">
          ครูที่ปรึกษา
        </h2>
        <div class="flex justify-center">
          <div
            class="w-full max-w-md min-h-0 p-6 mx-auto bg-white rounded-lg shadow-lg"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <img
              src="/src/assets/png/Advisor.png"
              alt="ครูที่ปรึกษา 1"
              class="object-cover w-40 h-40 mx-auto mb-4 rounded-full md:w-48 md:h-48 lg:w-56 lg:h-56"
            />
            <h2 class="mb-2 text-lg font-semibold md:text-xl lg:text-2xl">
              นายกิตติพงษ์ จรัญศิริไพศาล
            </h2>
            <p class="mb-4 text-sm text-gray-600 md:text-base">ครูที่ปรึกษา</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 text-white bg-gray-900">
      <div class="max-w-6xl px-6 mx-auto text-center">
        <div class="mb-8">
          <h2 class="mb-4 text-lg font-semibold md:text-xl lg:text-2xl">
            ติดตามพวกเราได้ที่นี่
          </h2>
          <p class="text-sm md:text-base">
            ติดตามข่าวสารล่าสุดเกี่ยวกับโรงเรียนและห้องเรียนแผนการเรียนปัญญาประดิษฐ์
            (AI) ของเรา
            เราจะพาคุณไปพบกับการสร้างสรรค์เทคโนโลยีที่ทันสมัยเพื่อให้คุณได้สัมผัสประสบการณ์การเรียนรู้ที่ไม่เหมือนใคร.
          </p>
        </div>
        <div class="mb-4 text-sm">
          <a
            href="https://www.facebook.com/p/%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%8A%E0%B8%B8%E0%B8%A1%E0%B9%81%E0%B8%9E%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2-100075871300445/"
            class="hover:text-blue-500"
            >โรงเรียนชุมแพศึกษา</a
          >
          |
          <a href="https://web.cpss.ac.th/" class="hover:text-blue-500"
            >เว็ปไซต์โรงเรียนชุมแพศึกษา</a
          >
          |
          <a
            href="https://www.facebook.com/profile.php?id=61558691456022&mibextid=LQQJ4d"
            class="hover:text-blue-500"
            >แผนการเรียนปัญญาประดิษฐ์</a
          >
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import Navbar from "../src/components/Navbar.vue";
import AOS from "aos";
import "aos/dist/aos.css";

onMounted(() => {
  AOS.init();
});
</script>

<style>
body {
  font-family: "Arial", sans-serif;
}
/* ทำให้แน่ใจว่าภาพเต็มกรอบและรักษาสัดส่วนภาพ */
img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
/* ปรับขนาดและสไตล์ของข้อความ */
h2 {
  font-size: 2rem; /* ขนาดข้อความสำหรับมือถือ */
}

h3 {
  font-size: 1.5rem; /* ขนาดข้อความชื่อผู้พัฒนา */
}

p {
  font-size: 1rem; /* ขนาดข้อความตำแหน่ง */
}
</style>
