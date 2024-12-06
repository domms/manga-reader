import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/HomePage";
import MangaPage from "../Pages/MangaPage";
import ReadPage from "../Pages/ReadPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {path: "", element: <HomePage />},
            {path: "Manga/:id", element: <MangaPage />},
            {path: "Manga/:id/Read/:id", element: <ReadPage />},
        ]
    }
])