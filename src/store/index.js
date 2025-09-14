import { createStore } from "vuex";
import auth from "./modules/auth";
import cow from "./modules/cow";
import milkingRecord from "./modules/milkingRecord";
import expense from ".//modules/expense";
import customer from "./modules/customer";
import sale from "./modules/sale";
import category from "./modules/category";
import issue from "./modules/issue";
import notification from "./modules/notification";
import setting from "./modules/setting";
import log from "./modules/log";
import report from "./modules/report";
import provider from "./modules/provider";
import processingRecord from "./modules/processingRecord";

export default createStore({
  modules: {
    auth,
    cow,
    milkingRecord,
    expense,
    customer,
    sale,
    category,
    issue,
    notification,
    setting,
    log,
    report,
    provider,
    processingRecord,
  },
});
