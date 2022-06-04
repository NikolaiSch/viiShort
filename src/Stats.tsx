import type { Component } from "solid-js";
import { createSignal, For } from "solid-js";
import type { link } from "@prisma/client";

import Navbar from "./Navbar";
import Copy from "./Copy";

const [linkCount, setLinkCount] = createSignal(0);
const [viewCount, setViewCount] = createSignal(0);
const [topLinks, setTopLinks] = createSignal([] as link[]);

await getStats();

const Stats: Component = () => {
    return (
        <div class="bg-slate-700/30 t min-h-screen py-4">
            <Navbar />
            <div class="bg-gray-100/90 w-1/3 min-h-min shadow-xl shadow-gray-100/40 mx-auto px-20 py-8 rounded-lg text-lg">
                <div class="grid grid-cols-1 grid-rows-11">
                    <div class="row-start-1 row-end-4">
                        <p>
                            <span class="text-2xl">Total Links</span>
                            <span class="ml-4 text-2xl">{linkCount()}</span>
                        </p>
                    </div>
                    <div class="row-start-4 row-end-7 mb-12">
                        <p>
                            <span class="text-2xl">Total Visits</span>
                            <span class="ml-4 text-2xl">{viewCount()}</span>
                        </p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>URL</th>
                                <th>Slug</th>
                                <th>Views</th>
                            </tr>
                        </thead>
                        <tbody>
                            <For each={topLinks()}>
                                {(item) => (
                                    <tr class="">
                                        <td>
                                            <a href={item.url}>
                                                {item.url.slice(
                                                    0,
                                                    Math.min(
                                                        25,
                                                        item.url.length
                                                    )
                                                )}
                                            </a>
                                        </td>
                                        <td>
                                            <Copy
                                                toCopy={item.slug}
                                                text={item.slug}
                                            />
                                        </td>
                                        <td>{item.users}</td>
                                    </tr>
                                )}
                            </For>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

async function getStats() {
    let response = await fetch("./api/stats", {
        method: "GET",
    });

    let body = JSON.parse(await response.text());
    setLinkCount(body.totalLinks);
    setViewCount(body.totalViews);
    setTopLinks(body.topLinks);
}

export default Stats;
