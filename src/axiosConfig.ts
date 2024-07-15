import axios from "axios";

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Setting token in headers:", token);
      config.headers.Authorization = token; // 로컬스토리지에 저장된 Bearer 토큰 사용
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response) => {
    // 응답에서 토큰 추출
    const token = response.headers["authorization"];
    if (token) {
      localStorage.setItem("token", token); // Bearer 접두사 포함하여 저장
      console.log("Token stored in localStorage:", token);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized, logging out...");
      localStorage.removeItem("token");
      setTimeout(() => {
        window.location.href = "/login"; // 로그인 페이지로 리디렉션
      }, 1000); 
    } else {
      console.error("Error response:", error.response);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { axios };
