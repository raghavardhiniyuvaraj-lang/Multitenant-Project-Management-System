import api from "./api";

// Get Profile
export const getProfile = async () => {
    const res = await api.get("/profile");
    return res.data;
};

// Update Profile
export const updateProfile = async (data) => {
    const res = await api.put("/profile", data);
    return res.data;
};