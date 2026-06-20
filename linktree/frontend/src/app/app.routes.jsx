import { createBrowserRouter } from "react-router"
import Home from "../features/home/pages/Home"


const router = createBrowserRouter([
    {
        path: "/",
        element: <h1>Home </h1>
    },
    {
        path: "/about",
        element: <h1>About </h1>
    },
    {
        path: "/:username",
        element: <Home />
    }
])

export default router