// import axios from "axios";

// const api = axios.create({
//   //   baseURL: "http://localhost:3000",
//   // baseURL: "http://192.168.61.206:3000",
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL,
// });

// api.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("access_token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }

//   return config;
// });

// export default api;

import axios from "axios";

const api = axios.create({
  //   baseURL: "http://localhost:3000",
  // baseURL: "http://192.168.61.206:3000",
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
