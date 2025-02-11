import axios from "axios";
import { HTTP_BACKEND } from "../../config";

export const getAllDiagram = async (roomId: string) => {
    try {
      const response = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.allChats;
    } catch (error) {
      console.log(error);
    }
  };
  