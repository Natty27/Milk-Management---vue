import { isoToEthiopianString } from "@/utils/ethiopianDate";

export default {
  install(app) {
    app.config.globalProperties.$toEthiopianString = isoToEthiopianString;
    app.provide("toEthiopianString", isoToEthiopianString);
  },
};
