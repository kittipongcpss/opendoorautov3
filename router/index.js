import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createRouter, createWebHistory } from "vue-router";

import SignInView from "../views/SignIn.vue";
import HomeView from "../views/Home.vue";
import RegisterView from "../views/Register.vue";
import InOutDataView from "../views/InOutData.vue";
import Togglein from "../views/Togglein.vue";
import Toggleout from "../views/Toggleout.vue";
import TakePhoto from "../views/TakePhoto.vue";
import CompareFace from "../views/CompareFace.vue";
import Room from "../views/Room.vue";
import TimeOpenDoor from "../views/TimeOpenDoor.vue";

const allowedEmails = ["kittipong@cpss.ac.th", "bern3729@gmail.com","bellthanawat8@gmail.com","kanetchusangthong@gmail.com"]; // อีเมลที่ได้รับอนุญาตให้เข้าถึง router

const restrictedPaths = ["/room", "/photo"]; // เส้นทางที่จำกัดเฉพาะผู้ใช้อีเมลที่อนุญาต

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/sign-in",
      name: "sign-in",
      component: SignInView,
    },
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/room",
      name: "room",
      component: Room,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/open",
      name: "open",
      component: TimeOpenDoor,
      meta: {
        requiresAuth: true,
      },
    },
     {
      path: "/photo",
      name: "photo",
      component: TakePhoto,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/compare",
      name: "compare",
      component: CompareFace,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: "/inoutdata",
      name: "inoutdata",
      component: InOutDataView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/togglein",
      name: "togglein",
      component: Togglein,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/toggleout",
      name: "toggleout",
      component: Toggleout,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

// router.beforeEach(async (to, from, next) => {
//   if (to.matched.some((record) => record.meta.requiresAuth)) {
//     if (await getCurrentUser()) {
//       next();
//     } else {
//       next({ name: "sign-in" });
//     }
//   } else {
//     next();
//   }
// });
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const user = await getCurrentUser();
    if (user) {
      if (restrictedPaths.includes(to.path)) {
        // ตรวจสอบว่าผู้ใช้อยู่ในรายชื่อที่อนุญาตหรือไม่
        if (allowedEmails.includes(user.email)) {
          next();
        } else {
          alert("คุณไม่สามารถเข้าถึงหน้านี้ได้.");
          next(false); // ป้องกันการเปลี่ยนเส้นทาง
        }
      } else {
        next();
      }
    } else {
      next({ name: "sign-in" });
    }
  } else {
    next();
  }
});
export default router;
