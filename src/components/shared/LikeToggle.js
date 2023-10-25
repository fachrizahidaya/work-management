import axiosInstance from "../../config/api";

export const LikeToggle = async (post_id, action) => {
  try {
    const res = await axiosInstance.post(`/hr/posts/${post_id}/${action}`);
    setTimeout(() => {
      console.log("liked this post!");
    }, 500);
  } catch (err) {
    console.log(err);
  }
};
