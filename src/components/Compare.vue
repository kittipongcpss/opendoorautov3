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
            <!-- แสดงภาพถ่ายหลังจากกดปุ่ม capture image -->
            <!-- <div v-if="capturedImage" class="mt-4">
                <label class="block text-gray-700">ภาพที่ถ่าย</label>
                <img :src="capturedImage" alt="Captured Image" class="w-full mt-2 rounded-lg shadow-lg" />
            </div> -->
            <div class="mt-4">
                <label class="block text-gray-700">เลือกกล้อง</label>
                <select v-model="selectedCamera" @change="changeCamera"
                    class="w-full p-2 mt-1 border border-gray-300 rounded">
                    <option v-for="device in videoDevices" :key="device.deviceId" :value="device.deviceId">
                        {{ device.label || 'Camera ' + (videoDevices.indexOf(device) + 1) }}
                    </option>
                </select>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700">รหัสผู้ดูแล</label>
                <input v-model="number_person" type="text" class="w-full p-2 mt-1 border border-gray-300 rounded"
                    placeholder="กรอกรหัสผู้ดูแล" />
                <div v-if="errors.number_person" class="text-red-500">{{ errors.number_person }}</div>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700">หมายเลขห้อง</label>
                <select v-model="selectedRoom" class="w-full p-2 mt-1 border border-gray-300 rounded">
                    <option value="" disabled>เลือกหมายเลขห้อง</option>
                    <option v-for="room in rooms" :key="room.id" :value="room.room_number">
                        {{ room.room_number }}
                    </option>
                </select>
                <div v-if="errors.selectedRoom" class="text-red-500">{{ errors.selectedRoom }}</div>
            </div>
            <button @click="startCamera" class="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600">
                เปิดกล้อง
            </button>
            <button @click="stopCamera" class="px-4 py-2 mx-3 mt-4 text-white bg-red-500 rounded hover:bg-red-600">
                ปิดกล้อง
            </button>
            <!-- <button @click="captureImage" class="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600">
                ถ่ายภาพเปิดประตู
            </button> -->
            <div v-if="errors.faceEmbeddings" class="mt-4 text-red-500">{{ errors.faceEmbeddings }}</div>
            <button @click="submitForm" class="px-4 py-2 mt-4 text-white bg-purple-500 rounded hover:bg-purple-600">
                ถ่ายหน้าเปิดประตู
            </button>
            <!-- วาง div สำหรับแจ้งเตือนที่นี่ -->
            <div v-if="alertMessage" class="p-4 mt-4 mb-4 text-white bg-red-500 rounded">
                {{ alertMessage }}
            </div>
            <div v-if="alertMessageG" class="p-4 mt-4 mb-4 text-white bg-green-500 rounded">
                {{ alertMessageG }}
            </div>
        </div>
    </div>
</template>

<script>
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import * as faceapi from 'face-api.js';
import { ref, update } from "firebase/database";
import { firestore,realtime } from "../main.js";

export default {
    data() {
        return {
            capturedImage: '', // เก็บข้อมูลภาพที่ถ่าย
            alertMessage: '', // เก็บข้อความแจ้งเตือน
            alertMessageG: '', 
            videoDevices: [], // Array to store video devices
            selectedCamera: null, // Selected camera deviceId
            stream: null, // MediaStream object
            selectedRoom: '',
            rooms: [], // Array to store rooms fetched from Firestore
            faceDetectionAnimationFrame: null, // RequestAnimationFrame ID for face detection
            faceEmbeddings: null, // Store face embeddings data
            faceRecognitionStatus: false, // Status for face recognition
            errors: {}, // Object to store validation errors
            number_person: '', // Store the caretaker number input
            name: '', // Store name input (add this if you want to use it)
            position: '', // Store position input (add this if you want to use it)
            bestMatch: null
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
        async fetchUserByNumberAndRoom() {
            try {
                const usersRef = collection(firestore, "users");
                const q = query(
                    usersRef,
                    where("number_person", "==", this.number_person),
                    where("room_number", "==", this.selectedRoom)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Map all matching documents
                    const users = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            ...data,
                            face_embedding: data.face_embedding.map(embedding => ({
                                descriptor: new Float32Array(embedding.descriptor)
                            }))
                        };
                    });

                    // Handle multiple users
                    // Example: return all matching users
                    return users;
                } else {
                    console.error("No matching documents found.");
                    return [];
                }
            } catch (e) {
                console.error("Error fetching users: ", e);
                return [];
            }
        },
        async compareCapturedImageWithFirestoreEmbeddings(faceEmbeddings) {
            const users = await this.fetchUserByNumberAndRoom();
            if (users.length > 0) {
                
                let lowestDistance = Infinity;

                users.forEach(user => {
                    user.face_embedding.forEach(embedding => {
                        if (faceEmbeddings[0] && embedding.descriptor && faceEmbeddings[0].length === embedding.descriptor.length) {
                            const distance = faceapi.euclideanDistance(faceEmbeddings[0], embedding.descriptor);
                            if (distance < lowestDistance) {
                                lowestDistance = distance;
                                this.bestMatch = user;
                            }
                        } else {
                            console.error(`Length mismatch: ${faceEmbeddings[0]?.length} !== ${embedding.descriptor?.length}`);
                        }
                    });
                });

                const threshold = 0.6;
                const max_distance = 1.0;
                const similarityPercentage = Math.max(0, (1 - lowestDistance / max_distance) * 100).toFixed(2);

                if (this.bestMatch && similarityPercentage >= 70) {
                    this.showAlertG(`ยินดีต้อนรับ ${this.bestMatch.name} (ความเหมือน: ${similarityPercentage}%)`);
                    // alert(`Face matched with ${this.bestMatch.name} (Similarity: ${similarityPercentage}%)`);
                    return true;
                } else {
                    this.showAlert("ใบหน้าไม่ตรงกับผู้ดูแลห้อง.");
                    // alert("ใบหน้าไม่ตรงกับผู้ดูแลห้อง.");
                    return false;
                }
            } else {
                this.showAlert("ไม่พบข้อมูลผู้ดูแลห้อง หรือเกิดความผิดพลาดในการดึงข้อมูล.");
                // alert("ไม่พบข้อมูลผู้ดูแลห้อง หรือเกิดความผิดพลาดในการดึงข้อมูล.");
                return false;
            }
        },

        async getRooms() {
            const roomsCollection = collection(firestore, 'room');
            const roomSnapshot = await getDocs(roomsCollection);
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

            // this.$refs.video.onloadedmetadata = () => {
            //     const videoWidth = this.$refs.video.videoWidth;
            //     const videoHeight = this.$refs.video.videoHeight;

            //     // ปรับขนาดของ canvas ให้ตรงกับขนาดของ video ที่ได้รับจากกล้อง
            //     this.$refs.canvas.width = videoWidth;
            //     this.$refs.canvas.height = videoHeight;

            //     // กำหนดขนาดของ video ให้ครอบคลุม canvas โดยรักษาอัตราส่วนภาพ
            //     const aspectRatio = videoWidth / videoHeight;
            //     if (aspectRatio > 1) {
            //         this.$refs.video.style.width = "100%";
            //         this.$refs.video.style.height = "auto";
            //     } else {
            //         this.$refs.video.style.width = "auto";
            //         this.$refs.video.style.height = "100%";
            //     }

            //     // เริ่มการตรวจจับใบหน้า
            //     this.detectFaces();
            // };

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
            const video = this.$refs.video;
            const canvas = this.$refs.canvas;
            const context = canvas.getContext('2d');
            

            // canvas.width = this.$refs.video.videoWidth;
            // canvas.height = this.$refs.video.videoHeight;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL('image/jpeg');
            // this.capturedImage = imageData; // บันทึกภาพที่ถ่ายไว้ใน data property
            
            this.processFaceRecognition(imageData);
        },

        async processFaceRecognition(imageData) {
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

                console.log('Detections:', detections);

                if (detections.length === 0) {
                    this.showAlert("ไม่พบใบหน้าที่ตรวจจับ กรุณาถ่ายภาพใหม่");
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
            this.faceRecognitionStatus = true;

            const isMatch = await this.compareCapturedImageWithFirestoreEmbeddings(this.faceEmbeddings);
            if (isMatch) {
                // อัพเดทข้อมูลใน Realtime Database
                const roomPath = `/room/${this.selectedRoom}`;
                // const dbRef = realtime.database().ref(roomPath);
                const dbRef = ref(realtime, roomPath);

                // dbRef.update({ open: true })
                update(dbRef, { open: true })
                    .then(() => {
                        console.log(`Room ${this.selectedRoom} is now open.`);
                    })
                    .catch((error) => {
                        console.error("Error updating the database: ", error);
                    });
                
                const timeUserOpenRef = collection(firestore, 'TimeUserOpen');
                const timestamp = new Date();

                await addDoc(timeUserOpenRef, {
                    number_person: this.bestMatch.number_person,
                    name: this.bestMatch.name,
                    position: this.bestMatch.position,
                    room_number: this.bestMatch.room_number,
                    timeOpen: timestamp
                });

                console.log(isMatch)
                
            }
        },
        validateForm() {
            this.errors = {};

            if (!this.number_person) {
                this.errors.number_person = "กรุณากรอกรหัสผู้ดูแล";
            }

            if (!this.selectedRoom) {
                this.errors.selectedRoom = "กรุณาเลือกหมายเลขห้อง";
            }



            return Object.keys(this.errors).length === 0;
        },

        async submitForm() {
            if (this.validateForm()) {
                this.captureImage()
                if (this.stream) {
                    this.stopCamera();
                    this.startCamera();
                }
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
