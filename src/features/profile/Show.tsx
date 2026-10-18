import { useEffect } from "react";

export default function Show() {
  useEffect(() => {
    console.log("show!");
  }, []);
  return null;
}
