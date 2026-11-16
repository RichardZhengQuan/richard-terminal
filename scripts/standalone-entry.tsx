import { createRoot } from "react-dom/client";
import Home from "../src/app/page";

const root = document.getElementById("root");

if (!root) {
  throw new Error("The standalone stage is missing its root element.");
}

createRoot(root).render(<Home />);
