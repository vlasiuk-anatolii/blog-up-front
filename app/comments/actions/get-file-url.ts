//import { API_URL } from "../../common/constants/api";

export const getFileUrl = (fileName: string): string => {
    if (fileName.includes(".txt")) {
        //return `${API_URL}/text-files/comments/${fileName}`;
        return `/text-files/comments/${fileName}`;
    }
     
    //return `${API_URL}/images/comments/${fileName}`;
    return `/images/comments/${fileName}`;
}
  