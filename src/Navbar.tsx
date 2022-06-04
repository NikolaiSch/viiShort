import type { Component } from "solid-js";
import { mergeProps } from "solid-js/web";
import { Link, NavLink } from "solid-app-router";
import { VscGithub } from "solid-icons/vsc";
import { ImStatsDots } from "solid-icons/im";
import { IoCreateOutline } from "solid-icons/io";
import { CgArrowsExchange } from "solid-icons/cg";

interface INavbar {
    iconSize?: number;
    iconColor?: string;
}

let iconSize = 40;
let iconColor = "#000000";

const Navbar: Component<INavbar> = (initProps) => {
    let props = mergeProps(
        { iconSize: iconSize, iconColor: iconColor },
        initProps
    );
    return (
        <nav class="flex flex-row justify-between mx-4 py-2 text-2xl">
            <h1
                class="text-6xl mx-4 hover:cursor-pointer flex flex-row group select-none"
                onClick={() => (window.location.href = "./")}
            >
                viiShort
                <CgArrowsExchange
                    size={60}
                    color="#000000"
                    class="group-hover:animate-spin"
                />
            </h1>
            <div>
                <NavLink href="https://github.com/NikolaiSch">
                    <button class="btn">
                        <div class="flex flex-row">
                            <VscGithub
                                size={iconSize}
                                color={iconColor}
                                class="mx-1 my-1"
                            />
                        </div>
                    </button>
                </NavLink>
                <NavLink href="/stats">
                    <button class="btn">
                        <div class="flex flex-row">
                            <ImStatsDots
                                size={iconSize}
                                color={iconColor}
                                class="mx-1 my-1"
                            />
                        </div>
                    </button>
                </NavLink>
                <NavLink href="/create">
                    <button class="btn">
                        <div class="flex flex-row">
                            <IoCreateOutline
                                size={iconSize}
                                color={iconColor}
                                class="mx-1 my-1"
                            />
                        </div>
                    </button>
                </NavLink>
            </div>
        </nav>
    );
};

export default Navbar;
