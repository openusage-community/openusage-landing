import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "../styles.css"
import "./openusage-tailwind.css"
import "./app-preview.css"
import "./download-modal.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
