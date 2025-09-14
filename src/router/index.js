import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Home.vue";
import Login from "../views/admin/Login.vue";
import Register from "../views/admin/Register.vue";
import Cows from "../views/Cows.vue";
import MilkingRecords from "../views/MilkingRecords.vue";
import Expense from "../views/Expense.vue";
import Customer from "../views/Customer.vue";
import Sale from "../views/Sales.vue";
import addCow from "../views/addCow.vue";
import cowsList from "../views/cowsList.vue";
import cowDetails from "../views/cowDetails.vue";
import Issues from "../views/Issues.vue";
import addIssue from "../views/addIssue.vue";
import myIssues from "../views/myIssues.vue";
import category from "../views/Category.vue";
import settings from "../views/Settings.vue";
import Providers from "../views/Provider.vue";
import ProcessingRecords from "@/views/ProcessingRecord.vue";
import Inventory from "@/views/Inventory.vue";

import notFound from "../views/notFound.vue";
import store from "../store";
import PaymentHistory from "@/views/PaymentHistory.vue";
import ChangePassword from "@/views/admin/ChangePassword.vue";

const routes = [
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: notFound,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/changePassword",
    name: "changePassword",
    component: ChangePassword,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/",
    name: "dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/addCow",
    name: "addCow",
    component: addCow,
    meta: { requiresAuth: true },
  },
  {
    path: "/cows",
    name: "cow",
    component: Cows,
    meta: { requiresAuth: true },
  },
  {
    path: "/processingRecords",
    name: "processingRecord",
    component: ProcessingRecords,
    meta: { requiresAuth: true },
  },
  {
    path: "/cows",
    name: "cow",
    component: Cows,
    meta: { requiresAuth: true },
  },
  {
    path: "/inventory",
    name: "inventory",
    component: Inventory,
    meta: { requiresAuth: true },
  },
  {
    path: "/providers",
    name: "provider",
    component: Providers,
    meta: { requiresAuth: true },
  },
  {
    path: "/milkingRecords",
    name: "milkingRecord",
    component: MilkingRecords,
    meta: { requiresAuth: true },
  },
  {
    path: "/expenses",
    name: "expense",
    component: Expense,
    meta: { requiresAuth: true },
  },
  {
    path: "/customers",
    name: "customer",
    component: Customer,
    meta: { requiresAuth: true },
  },
  {
    path: "/sales",
    name: "sale",
    component: Sale,
    meta: { requiresAuth: true },
  },
  {
    path: "/paymentHistory",
    name: "paymentHistory",
    component: PaymentHistory,
    meta: { requiresAuth: true },
  },
  {
    path: "/cowsList",
    name: "cowsList",
    component: cowsList,
    meta: { requiresAuth: true },
  },
  {
    path: "/cowDetails/:id",
    name: "cowDetails",
    component: cowDetails,
    meta: { requiresAuth: true },
    props: true,
  },

  {
    path: "/issues",
    name: "issue",
    component: Issues,
    meta: { requiresAuth: true },
  },
  {
    path: "/addIssue",
    name: "addIssue",
    component: addIssue,
    meta: { requiresAuth: true },
  },
  {
    path: "/myIssues",
    name: "myIssues",
    component: myIssues,
    meta: { requiresAuth: true },
  },

  {
    path: "/category",
    name: "category",
    component: category,
    meta: { requiresAuth: true },
  },

  {
    path: "/settings",
    name: "settings",
    component: settings,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  //console.log(`Navigating to: ${to.name}`);
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters["auth/isAuthenticated"]) {
      console.log("Not authenticated, redirecting to login");
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  console.log(`Successfully navigated to: ${to.name}`);
});

export default router;
