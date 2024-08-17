<template>
  <div>
    <Navbar />
    <form @submit.prevent="handleSubmit">
      <div
        class="bg-gray-200 flex items-center justify-center min-h-screen py-16"
      >
        <div class="container mx-auto px-4 md:px-8 lg:px-12">
          <div class="bg-white rounded-lg shadow-lg p-6 md:p-8 lg:p-10">
            <div class="text-gray-700 mb-6">
              <p class="font-bold text-2xl md:text-3xl lg:text-4xl mb-2">
                เพิ่มบุคลากร
              </p>
              <p class="text-gray-600 text-base md:text-lg lg:text-xl">
                กรุณากรอกข้อมูลด้านล่างให้ครบถ้วน
              </p>
            </div>

            <div class="space-y-6">
              <div>
                <label
                  for="first_name"
                  class="block text-gray-800 font-medium text-lg md:text-xl"
                >
                  ชื่อ
                </label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  class="h-12 border border-gray-300 mt-1 rounded-lg px-4 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  v-model="firstName"
                  placeholder="ไม่ต้องใส่คำนำหน้า"
                  required
                />
              </div>

              <div>
                <label
                  for="last_name"
                  class="block text-gray-800 font-medium text-lg md:text-xl"
                >
                  นามสกุล
                </label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  class="h-12 border border-gray-300 mt-1 rounded-lg px-4 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  v-model="lastName"
                  required
                />
              </div>

              <div>
                <label
                  for="license_plate"
                  class="block text-gray-800 font-medium text-lg md:text-xl"
                >
                  ป้ายทะเบียน
                </label>
                <input
                  type="text"
                  name="license_plate"
                  id="license_plate"
                  class="h-12 border border-gray-300 mt-1 rounded-lg px-4 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  v-model="licensePlate"
                  placeholder="กรอกป้ายทะเบียน"
                  required
                />
              </div>

              <div>
                <label
                  for="license_plate_province"
                  class="block text-gray-800 font-medium text-lg md:text-xl"
                >
                  จังหวัดของป้ายทะเบียน
                </label>
                <input
                  type="text"
                  name="license_plate_province"
                  id="license_plate_province"
                  class="h-12 border border-gray-300 mt-1 rounded-lg px-4 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  v-model="licensePlateProvince"
                  placeholder="กรอกจังหวัดของป้ายทะเบียนให้ถูกต้อง"
                  required
                />
              </div>

              <div class="text-right">
                <button
                  type="submit"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
                >
                  เพิ่มข้อมูลบุคลากร
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <transition name="fade">
      <Alert
        v-if="showAlert"
        :message-title="alertTitle"
        :message="alertMessage"
        @dismiss="onDismissAlert"
      />
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../src/main.js";
import Navbar from "../src/components/Navbar.vue";
import Alert from "../src/components/Alert.vue";
import { useRouter } from "vue-router";

export default {
  components: {
    Navbar,
    Alert,
  },
  setup() {
    const firstName = ref("");
    const lastName = ref("");
    const licensePlate = ref("");
    const licensePlateProvince = ref("");
    const showAlert = ref(false);
    const alertTitle = ref("");
    const alertMessage = ref("");
    const router = useRouter();

    const handleSubmit = async () => {
      try {
        const docRef = await addDoc(collection(firestore, "users"), {
          firstName: firstName.value,
          lastName: lastName.value,
          licensePlate: licensePlate.value,
          licensePlateProvince: licensePlateProvince.value,
        });
        console.log("Document written with ID: ", docRef.id);

        firstName.value = "";
        lastName.value = "";
        licensePlate.value = "";
        licensePlateProvince.value = "";

        alertTitle.value = "การลงทะเบียนสำเร็จ!";
        alertMessage.value = "การลงทะเบียนของคุณสำเร็จแล้ว.";
        showAlert.value = true;
      } catch (e) {
        console.error("Error adding document: ", e);
        alertTitle.value = "เกิดข้อผิดพลาด!";
        alertMessage.value = "ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่.";
        showAlert.value = true;
      }
    };

    const onDismissAlert = () => {
      showAlert.value = false;
      router.push("/");
    };

    return {
      firstName,
      lastName,
      licensePlate,
      licensePlateProvince,
      showAlert,
      alertTitle,
      alertMessage,
      handleSubmit,
      onDismissAlert,
    };
  },
};
</script>

<style scoped>
/* Fade transition for alert */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Adjusting padding and margin to move form up */
.min-h-screen {
  padding-top: 2rem; /* Adjust as needed */
}

/* Responsive styles for the form container */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
