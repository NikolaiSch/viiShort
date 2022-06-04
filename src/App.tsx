import IndexApp from "./IndexApp";
import { Routes, Route } from "solid-app-router";
import Stats from "./Stats";
import Create from "./Create";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<IndexApp />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/create" element={<Create />} />
        </Routes>
    );
}
