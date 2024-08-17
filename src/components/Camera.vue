<template>

    <div class="flex flex-col items-center justify-start h-screen pt-5 space-y-6 bg-gray-100">
        <div class="relative p-6 bg-white rounded-lg shadow-lg">
            <!-- <div class="relative w-full h-64">
               
                <video ref="video" autoplay playsinline
                    class="absolute top-0 left-0 w-full h-full bg-black rounded-lg"></video>
               
                <canvas ref="canvas" class="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none"
                    style="z-index: 10;"></canvas>
            </div> -->
            <div class="relative w-full h-64">
                <!-- Video element with object-fit: cover -->
                <video ref="video" autoplay playsinline class="absolute top-0 left-0 w-full h-full bg-black rounded-lg"
                    style="object-fit: cover;"></video>
                <!-- Canvas element -->
                <canvas ref="canvas" class="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none"
                    style="z-index: 10;"></canvas>
            </div>
            <div class="mt-4">
                <label class="block text-gray-700">เลือกกล้อง</label>
                <select v-model="selectedCamera" @change="changeCamera"
                    class="w-full p-2 mt-1 border border-gray-300 rounded">
                    <option v-for="device in videoDevices" :key="device.deviceId" :value="device.deviceId">
                        {{ device.label || 'Camera ' + (videoDevices.indexOf(device) + 1) }}
                    </option>
                </select>
            </div>
            <button @click="startCamera" class="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600">
                เปิดกล้อง
            </button>
            <button @click="stopCamera" class="px-4 py-2 mx-3 mt-4 text-white bg-red-500 rounded hover:bg-red-600">
                ปิดกล้อง
            </button>
            <button @click="captureImage" class="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600">
                ถ่ายภาพจดจำใบหน้า
            </button>

            <!-- แสดงภาพถ่ายหลังจากกดปุ่ม capture image -->
            <!-- <div v-if="capturedImage" class="mt-4">
                <label class="block text-gray-700">ภาพที่ถ่าย</label>
                <img :src="capturedImage" alt="Captured Image" class="w-full mt-2 rounded-lg shadow-lg" />
            </div> -->

            <div v-if="faceRecognitionStatus" class="mt-4 text-green-500">
                จดจำใบหน้าเสร็จเรียบร้อย
            </div>
        </div>
        <!-- วาง div สำหรับแจ้งเตือนที่นี่ -->
        <div v-if="alertMessage" class="p-4 mb-4 text-white bg-red-500 rounded">
            {{ alertMessage }}
        </div>
        <div v-if="alertMessageG" class="p-4 mb-4 text-white bg-green-500 rounded">
            {{ alertMessageG }}
        </div>
        <!-- Display form only after face recognition is successful -->
        <div v-if="faceRecognitionStatus" class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <div class="mb-4">
                <label class="block text-gray-700">รหัสผู้ดูแล</label>
                <input v-model="number_person" type="text" class="w-full p-2 mt-1 border border-gray-300 rounded"
                    placeholder="กรอกรหัสผู้ดูแล" />
                <div v-if="errors.number_person" class="text-red-500">{{ errors.number_person }}</div>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700">ชื่อ-นามสกุล</label>
                <input v-model="name" type="text" class="w-full p-2 mt-1 border border-gray-300 rounded"
                    placeholder="กรอกชื่อ-นามสกุล" />
                <div v-if="errors.name" class="text-red-500">{{ errors.name }}</div>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700">ตำแหน่ง</label>
                <input v-model="position" type="text" class="w-full p-2 mt-1 border border-gray-300 rounded"
                    placeholder="กรอกตำแหน่ง" />
                <div v-if="errors.position" class="text-red-500">{{ errors.position }}</div>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700">ห้องที่ดูแล</label>
                <select v-model="selectedRoom" class="w-full p-2 mt-1 border border-gray-300 rounded">
                    <option value="" disabled>เลือกหมายเลขห้อง</option>
                    <option v-for="room in rooms" :key="room.id" :value="room.room_number">
                        {{ room.room_number }}
                    </option>
                </select>
                <div v-if="errors.selectedRoom" class="text-red-500">{{ errors.selectedRoom }}</div>
            </div>
            <button :disabled="!faceEmbeddings" @click="submitForm"
                class="px-4 py-2 mx-3 text-white bg-green-500 rounded hover:bg-green-600">
                บันทึกผู้ดูแลห้อง
            </button>
            <button :disabled="!faceEmbeddings" @click="resetinForm"
                class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                รีเซต
            </button>
            <div v-if="errors.faceEmbeddings" class="mt-4 text-red-500">{{ errors.faceEmbeddings }}</div>

        </div>
    </div>
</template>

<script>
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import * as faceapi from 'face-api.js';
import { firestore } from "../main.js";

export default {
    data() {
        return {
            capturedImage: '', // เก็บข้อมูลภาพที่ถ่าย
            alertMessage: '', // เก็บข้อความแจ้งเตือน
            alertMessageG: '', // เก็บข้อความแจ้งเตือน
            videoDevices: [], // Array to store video devices
            selectedCamera: null, // Selected camera deviceId
            stream: null, // MediaStream object
            number_person: '',
            name: '',
            position: '',
            selectedRoom: '',
            rooms: [], // Array to store rooms fetched from Firestore
            faceDetectionAnimationFrame: null, // RequestAnimationFrame ID for face detection
            faceEmbeddings: null, // Store face embeddings data
            faceRecognitionStatus: false, // Status for face recognition
            errors: {}, // Object to store validation errors
        };
    },
    methods: {
        showAlert(message) {
            this.alertMessage = message;
            // ตั้งค่าให้ข้อความแจ้งเตือนหายไปหลังจากผ่านไป 3 วินาที
            setTimeout(() => {
                this.alertMessage = '';
            }, 3000);
        },
        showAlertG(message) {
            this.alertMessageG = message;
            // ตั้งค่าให้ข้อความแจ้งเตือนหายไปหลังจากผ่านไป 3 วินาที
            setTimeout(() => {
                this.alertMessageG = '';
            }, 3000);
        },
        async getRooms() {
            const roomsCollection = collection(firestore, 'room'); // Get collection reference
            const roomSnapshot = await getDocs(roomsCollection); // Fetch documents from the collection
            this.rooms = roomSnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    room_number: doc.data().room_number,
                };
            });
        },
        async getVideoDevices() {
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.videoDevices = devices.filter(device => device.kind === 'videoinput');
        },
        async startCamera() {
            await this.getVideoDevices();
            const constraints = {
                video: {
                    deviceId: this.selectedCamera ? { exact: this.selectedCamera } : undefined,
                },
            };
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.$refs.video.srcObject = this.stream;

            
            this.$refs.video.onloadedmetadata = () => {
                const aspectRatio = this.$refs.video.videoWidth / this.$refs.video.videoHeight;
                this.$refs.canvas.width = this.$refs.video.videoWidth;
                this.$refs.canvas.height = this.$refs.video.videoHeight;

                const videoWidth = this.$refs.video.videoWidth;
                const videoHeight = this.$refs.video.videoHeight;

                if (videoWidth / videoHeight > aspectRatio) {
                    this.$refs.video.style.width = "100%";
                    this.$refs.video.style.height = "auto";
                } else {
                    this.$refs.video.style.width = "auto";
                    this.$refs.video.style.height = "100%";
                }
            };

            // this.$refs.video.onloadedmetadata = () => {
            //     this.$refs.canvas.width = this.$refs.video.videoWidth;
            //     this.$refs.canvas.height = this.$refs.video.videoHeight;
            //     this.detectFaces();
            // };
        },
        stopCamera() {
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
                this.stream = null;
                this.$refs.video.srcObject = null;
            }
            // Stop detecting faces
            if (this.faceDetectionAnimationFrame) {
                cancelAnimationFrame(this.faceDetectionAnimationFrame);
                this.faceDetectionAnimationFrame = null;
            }
        },
        async changeCamera() {
            this.stopCamera();
            await this.startCamera();
        },
        captureImage() {
            const video = this.$refs.video; // ดึง video element
            const canvas = this.$refs.canvas; // ดึง canvas element
            const context = canvas.getContext('2d'); // ดึง context ของ canvas

            // canvas.width = this.$refs.video.videoWidth;
            // canvas.height = this.$refs.video.videoHeight;
            // กำหนดขนาดของ canvas ให้ตรงกับขนาดของ video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // วาดภาพจาก video ลงใน canvas โดยรักษาอัตราส่วนของภาพ
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // ดึงข้อมูลภาพจาก canvas
            const imageData = canvas.toDataURL('image/jpeg');

            // this.capturedImage = imageData; // บันทึกภาพที่ถ่ายไว้ใน data property
            // ส่งข้อมูลภาพไปประมวลผล
            this.processFaceRecognition(imageData);

        },
        async processFaceRecognition(imageData) {
            // Load models and check if they are loaded correctly
            await faceapi.nets.ssdMobilenetv1.loadFromUri(
                '/models2/ssd_mobilenetv1_model-weights_manifest.json'
            ).catch(err => console.error('Error loading ssdMobilenetv1 model:', err));

            await faceapi.nets.faceLandmark68Net.loadFromUri(
                '/models2/face_landmark_68_model-weights_manifest.json'
            ).catch(err => console.error('Error loading faceLandmark68Net model:', err));

            await faceapi.nets.faceRecognitionNet.loadFromUri(
                '/models2/face_recognition_model-weights_manifest.json'
            ).catch(err => console.error('Error loading faceRecognitionNet model:', err));

            const img = new Image();
            img.src = imageData;
            img.onload = async () => {
                const detections = await faceapi.detectAllFaces(img)
                    .withFaceLandmarks()
                    .withFaceDescriptors();

                // Debugging: Log detections
                console.log('Detections:', detections);

                if (detections.length === 0) {
                    this.showAlert("ไม่พบใบหน้าที่ตรวจจับ กรุณาถ่ายภาพใหม่");
                    // alert('ไม่พบใบหน้าที่ตรวจจับ กรุณาถ่ายภาพใหม่');
                } else {
                    this.generateFaceEmbeddings(detections, img);
                }
            };
        },
        async generateFaceEmbeddings(detections, img) {
            const results = await Promise.all(
                detections.map(d => faceapi.computeFaceDescriptor(img, d))
            );
            this.faceEmbeddings = results;
            this.faceRecognitionStatus = true; // Set status to true when recognition is done
        },
        async checkDuplicate() {
            const q = query(
                collection(firestore, "users"),
                where("number_person", "==", this.number_person),
                where("room_number", "==", this.selectedRoom)
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.size > 0;
        },
        async uploadToFirestore(faceEmbeddings) {
            // Firebase Firestore upload logic
            try {
                // แปลง faceEmbeddings ที่เป็น array ของ array ให้เป็น object
                const convertedEmbeddings = faceEmbeddings.map(embedding => {
                    return { descriptor: Array.from(embedding) };
                });

                await addDoc(collection(firestore, "users"), {
                    number_person: this.number_person,
                    name: this.name,
                    position: this.position,
                    room_number: this.selectedRoom,
                    face_embedding: convertedEmbeddings, // ใช้ object ที่แปลงแล้ว
                });
                this.showAlertG("ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
                /////Add reset
                if (this.stream) {
                    this.stopCamera();
                    this.startCamera();
                }
                this.faceEmbeddings = null;
                this.errors = {};
                this.faceRecognitionStatus = false;
                /////
                // this.resetForm(); // Reset form after successful submission

            } catch (e) {
                console.error("Error adding document: ", e);
            }
        },
        validateForm() {
            this.errors = {};

            if (!this.number_person) {
                this.errors.number_person = "กรุณากรอกรหัสผู้ดูแล";
            }

            if (!this.name) {
                this.errors.name = "กรุณากรอกชื่อ-นามสกุล";
            }

            if (!this.position) {
                this.errors.position = "กรุณากรอกตำแหน่ง";
            }

            if (!this.selectedRoom) {
                this.errors.selectedRoom = "กรุณาเลือกหมายเลขห้อง";
            }

            if (!this.faceEmbeddings || this.faceEmbeddings.length === 0) {
                this.errors.faceEmbeddings = "ไม่พบใบหน้าที่ตรวจจับ กรุณาถ่ายภาพใหม่";
            }

            // Return true if there are no errors
            return Object.keys(this.errors).length === 0;
        },
        async submitForm() {
            if (this.validateForm()) {
                this.uploadToFirestore(this.faceEmbeddings);
                // const isDuplicate = await this.checkDuplicate();
                // if (isDuplicate) {
                //     this.showAlert("มีผู้ดูแลซ้ำกับห้องที่ดูแล");
                // } else {
                //     this.uploadToFirestore(this.faceEmbeddings);
                // }
            }
        },
        resetinForm() { 
            this.number_person = '';
            this.name = '';
            this.position = '';
            this.selectedRoom = '';
        },
        resetForm() {
            this.number_person = '';
            this.name = '';
            this.position = '';
            this.selectedRoom = '';
            this.faceEmbeddings = null;
            this.errors = {};
            this.faceRecognitionStatus = false;
            // this.alertMessage = '';
            // this.alertMessageG = '';

            if (this.stream) {
                this.stopCamera();
                this.startCamera();
            }
        },
    },
    mounted() {
        this.getVideoDevices();
        this.getRooms(); // Fetch rooms from Firestore when component mounts
    },
    beforeDestroy() {
        this.stopCamera();
    }
};
</script>
