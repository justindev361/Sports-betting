import { useContext } from "react"
import { AppContext } from "../providers/AppContextProvider";

const useAppContext = () => {
  return useContext(AppContext);
}

export default useAppContext;