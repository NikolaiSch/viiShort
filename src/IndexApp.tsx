import type { Component } from "solid-js";
import { lazy } from "solid-js";
const Navbar = lazy(() => import("./Navbar"));
import Main from "./Main";

const IndexApp: Component = () => {
    return (
        <div class="bg-slate-700/30 t min-h-screen py-4 select-none">
            <Navbar />
            <Main />
        </div>
    );
};

export default IndexApp;
