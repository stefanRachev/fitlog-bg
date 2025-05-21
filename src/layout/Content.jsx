import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NoFound from "../pages/NoFound";


const Content = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NoFound />} />
    </Routes>
  );
};

export default Content;