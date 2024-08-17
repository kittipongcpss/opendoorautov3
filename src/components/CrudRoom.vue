<template>
    <div class="max-w-4xl p-4 mx-auto">
        <h1 class="mb-4 text-2xl font-bold">จัดการหมายเลขห้อง</h1>

        <!-- Add New Room -->
        <div class="mb-6">
            <input v-model="newRoomNumber" type="text" placeholder="กรุณากรอกหมายเลขห้อง"
                class="p-2 mr-2 border border-gray-300 rounded" />
            <button @click="addNewRoom" class="p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                เพิ่มห้อง
            </button>
        </div>

        <!-- Room List -->
        <table class="min-w-full bg-white border border-gray-200">
            <thead>
                <tr>
                    <th class="px-4 py-2 border-b">หมายเลขห้อง</th>
                    <th class="px-4 py-2 border-b">การดำเนินการ</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="room in rooms" :key="room.id">
                    <td class="flex items-center justify-center px-4 py-2 border-b ">

                        <input v-model="room.room_number"
                            class="w-full p-2 text-center border border-gray-300 rounded" />

                    </td>
                    <td class="px-4 py-2 border-b ">
                        <center>
                            <button @click="updateExistingRoom(room.id, room.room_number)"
                                class="p-2 mr-2 text-white bg-green-500 rounded hover:bg-green-600">
                                แก้ไขห้อง
                            </button>
                            <button @click="confirmDeleteRoom(room.id)"
                                class="p-2 text-white bg-red-500 rounded hover:bg-red-600">
                                ลบห้อง
                            </button>
                        </center>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { query, where, getDoc } from "firebase/firestore";
import { firestore, realtime, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "../main.js";
import { ref, set, get, update, remove } from "firebase/database";
export default {
    data() {
        return {
            newRoomNumber: "",
            rooms: []
        };
    },
    methods: {
        async getRooms() {
            try {
                const querySnapshot = await getDocs(collection(firestore, "room"));
                const rooms = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                return rooms;
            } catch (e) {
                console.error('Error getting documents: ', e);
            }
        },
        async addRoom(roomNumber) {
            try {
                // ตรวจสอบว่าหมายเลขห้องซ้ำหรือไม่
                const q = query(collection(firestore, "room"), where("room_number", "==", roomNumber));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    alert('มีหมายเลขห้องนี้อยู่แล้ว กรุณาใส่หมายเลขห้องอื่น.');
                    return;
                }

                // ถ้าไม่ซ้ำ ให้ทำการเพิ่มห้องใหม่
                const docRef = await addDoc(collection(firestore, "room"), {
                    room_number: roomNumber
                });

                // เพิ่มข้อมูลลงใน Realtime Database
                const roomRef = ref(realtime, `room/${roomNumber}`);
                await set(roomRef, {
                    open: false
                });

                console.log('Document written with ID: ', docRef.id);
            } catch (e) {
                console.error('Error adding document: ', e);
            }
        },
        async updateRoom(id, newRoomNumber) {
            try {
                // ตรวจสอบว่ามีหมายเลขห้องอื่นที่ซ้ำกับหมายเลขห้องใหม่หรือไม่
                const q = query(collection(firestore, "room"), where("room_number", "==", newRoomNumber));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty && querySnapshot.docs.every(doc => doc.id !== id)) {
                    alert('มีหมายเลขห้องนี้อยู่แล้ว กรุณาใส่หมายเลขห้องอื่น.');
                    return;
                }

                // ถ้าไม่ซ้ำ ให้ทำการอัปเดตห้อง
                const roomRef = doc(firestore, "room", id);
                await updateDoc(roomRef, {
                    room_number: newRoomNumber
                });

                // อัปเดตข้อมูลใน Realtime Database
                const oldRoomRef = ref(realtime, `room/${newRoomNumber}`);
                const snapshot = await get(oldRoomRef);
                if (snapshot.exists()) {
                    await remove(oldRoomRef);
                }
                await set(ref(realtime, `room/${newRoomNumber}`), { open: false });

                console.log('Document successfully updated!');
            } catch (e) {
                console.error('Error updating document: ', e);
            }
        },
        async deleteRoom(id) {
            try {
                // ดึงหมายเลขห้องจาก Firestore เพื่อใช้ลบใน Realtime Database
                const roomRefFirestore = doc(firestore, "room", id);
                const roomDoc = await getDoc(roomRefFirestore); // ใช้ getDoc แทน getDocs

                if (roomDoc.exists()) {
                    const roomNumber = roomDoc.data().room_number;

                    // ลบข้อมูลใน Firestore
                    await deleteDoc(roomRefFirestore);

                    // ลบข้อมูลใน Realtime Database
                    const roomRefRealtime = ref(realtime, `room/${roomNumber}`);
                    await remove(roomRefRealtime);

                    console.log('Document successfully deleted!');
                } else {
                    console.error('No such document!');
                }
            } catch (e) {
                console.error('Error deleting document: ', e);
            }
            // try {
            //     const roomRef = doc(firestore, "room", id);
            //     await deleteDoc(roomRef);
            //     console.log('Document successfully deleted!');
            // } catch (e) {
            //     console.error('Error deleting document: ', e);
            // }
        },
        async fetchRooms() {
            this.rooms = await this.getRooms();
        },
        async addNewRoom() {
            if (this.newRoomNumber.trim() === "") {
                alert("กรุณากรอกหมายเลขห้อง");
                return;
            }

            await this.addRoom(this.newRoomNumber);
            this.newRoomNumber = "";
            this.fetchRooms();
        },
        async updateExistingRoom(id, newRoomNumber) {
            await this.updateRoom(id, newRoomNumber);
            this.fetchRooms();
        },
        async confirmDeleteRoom(id) {
            const confirmation = confirm('คุณต้องการลบหมายเลขห้องนี้ใช่หรือไม่?');
            if (confirmation) {
                await this.deleteRoom(id);
                this.fetchRooms();
            }
        }
    },
    created() {
        this.fetchRooms();
    }
};
</script>

