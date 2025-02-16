import axios from "axios";
import { HTTP_BACKEND } from "../../config";

const token = localStorage.getItem("token")

export const getAllDiagram = async (roomId: string) => {
  try {
    const response = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.allChats;
  } catch (error) {
    console.log(error);
    return 'Somthing went wrong'
  }
};

export const getAllDocs = async () => {
 try {
  const response = await axios.get(`${HTTP_BACKEND}/my-docs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data 
 } catch (error) {
   console.log(error);
    return 'Somthing went wrong'
 }
};
