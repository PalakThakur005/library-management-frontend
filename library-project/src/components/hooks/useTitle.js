import { useEffect } from "react";

const useTitle = (title ,defaultTitle="my app") => {
    useEffect(()=>{
      document.title = title ||defaultTitle 
    },[title , defaultTitle])
}

export default useTitle;