import axiosInstance from "../utils/axiosInstance";


// Lấy danh sách tỉnh
export const getProvinces = async () => axiosInstance.get("/ghn/province");

// Lấy danh sách huyện theo ProvinceID
export const getDistricts = async (provinceId) =>
  axiosInstance.get("/ghn/district", { params: { provinceID: provinceId } });

// Lấy danh sách xã/phường theo DistrictID
export const getWards = async (districtId) =>
  axiosInstance.get("/ghn/ward", { params: { districtID: districtId } });

// services/orderService.js
export const getTrackingDetails = async (orderId) => {
  const response = await axiosInstance.get(`/ghn/tracking/${orderId}`);
  return response; // trả về {code, data: {...}, ...}
};
