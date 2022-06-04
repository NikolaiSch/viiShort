import type { Component } from "solid-js";
import { createSignal, createEffect } from "solid-js";
import Navbar from "./Navbar";
import Copy from "./Copy";

let url: HTMLInputElement;
let pass: HTMLInputElement;
let mainDiv: HTMLDivElement;

const Create: Component = () => {
    return (
        <div class="bg-slate-700/30 t min-h-screen py-4">
            <Navbar></Navbar>
            <div class="bg-gray-100/90 w-1/3 h-96 shadow-xl shadow-gray-100/40 mx-auto px-20 py-8 rounded-lg text-lg">
                <h1 class="text-black text-3xl py-4">Create Link</h1>
                <form class="flex flex-col" onSubmit={formSubmit}>
                    <label for="slug" class="py-2">
                        Please Enter the URL
                    </label>
                    <input
                        ref={url}
                        type="text"
                        name="slug"
                        placeholder="https://google.com"
                        class="px-2 py-1"
                    />
                    <label for="pass" class="pt-6 pb-2">
                        Enter the password if needed (optional)
                    </label>
                    <input
                        ref={pass}
                        type="text"
                        name="pass"
                        class="px-2 py-1"
                    />
                    <button class="btn mt-8 text-2xl">Submit</button>
                </form>
            </div>
            <div ref={mainDiv}></div>
        </div>
    );
};

async function formSubmit(e: Event) {
    e.preventDefault();

    let response = await fetch("./api/new", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.value, password: pass.value }),
    });

    let body = JSON.parse(await response.text());
    if (body.status == "success") {
        let newInfo = (
            <div class="bg-gray-100/90 w-96 lg:w-1/3 min-h-min shadow-xl shadow-gray-100/40 mx-auto rounded-lg my-6 py-4">
                <div class="grid grid-cols-3 grid-rows-2 place-items-center gap-1 text-lg">
                    <p>Slug</p>
                    <p>URL</p>
                    <p>Uses</p>
                    <Copy
                        toCopy={`https://viidb.herokuapp.com/${body.slug}`}
                        text={body.slug}
                    ></Copy>
                    <a
                        href={body.url}
                        class="underline underline-offset-1 hover:-translate-y-1 transition-all duration-300"
                        rel="noreferrer noopener"
                        target="_blank"
                    >
                        {body.url.slice(0, Math.min(15, body.url.length - 1))}
                    </a>
                    <p>{body.users}</p>
                </div>
            </div>
        );
        mainDiv.appendChild(newInfo as Node);
    }
}

export default Create;
