import type { Component } from "solid-js";
import { createSignal, createEffect } from "solid-js";

import Alert from "./Alert";
import Copy from "./Copy";

let slug: HTMLInputElement;
let pass: HTMLInputElement;
let showing: HTMLDivElement;
let mainDiv: HTMLDivElement;

let [error, setError] = createSignal(null);
let [show, setShow] = createSignal(false);
let toggleShow = () => {
    setShow(!show());
};

const Main: Component = () => {
    createEffect(() => {
        showing.style.visibility = show() ? "visible" : "hidden";
    });
    return (
        <div>
            <div class="bg-gray-100/90 w-1/3 h-96 shadow-xl shadow-gray-100/40 mx-auto px-20 py-8 rounded-lg text-lg">
                <div class="absolute t-4 w-[32rem] mx-auto" ref={showing}>
                    <Alert
                        /* @ts-ignore */
                        errorMessage={error()}
                        toggle={toggleShow}
                    />
                </div>
                <h1 class="text-black text-3xl py-4">View Link Information</h1>
                <form class="flex flex-col" onSubmit={formSubmit}>
                    <label for="slug" class="py-2">
                        Please Enter the Slug
                    </label>
                    <input
                        ref={slug}
                        type="text"
                        name="slug"
                        placeholder="012345abcdef"
                        class="px-2 py-1"
                    />
                    <label for="pass" class="pt-6 pb-2">
                        Enter the password if needed
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

let regex = /^[0-9a-f]{10}$/;

async function formSubmit(e: Event) {
    e.preventDefault();
    console.log(slug.value);
    if (!regex.test(slug.value)) {
        setError("incorrectSlugFormat");
        setShow(true);
        setTimeout(() => {
            setShow(false);
        }, 2000);
        return;
    }

    let response = await fetch("http://localhost:4000/api/slug", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: slug.value, password: pass.value }),
    });

    let body = JSON.parse(await response.text());
    if (body.status == "success") {
        let newInfo = (
            <div class="bg-gray-100/90 w-1/3 h-32 shadow-xl shadow-gray-100/40 mx-auto px-10 py-8 rounded-lg my-10">
                <div class="grid grid-cols-3 grid-rows-3 place-items-center gap-4 text-lg">
                    <p>Slug</p>
                    <p>URL</p>
                    <p>Uses</p>
                    <Copy
                        toCopy={"http://localhost:3000/" + body.slug}
                        text={body.slug}
                    />
                    <a
                        href={body.url}
                        class="underline underline-offset-1 hover:-translate-y-1 transition-all duration-300"
                        rel="noreferrer noopener"
                        target="_blank"
                    >
                        {body.url}
                    </a>
                    <p>{body.users}</p>
                </div>
            </div>
        );
        let x = mainDiv.appendChild(newInfo as Node);
    } else {
        setError(body.status);
        setShow(true);
        setTimeout(() => {
            setShow(false);
        }, 2000);
        return;
    }
}

export default Main;
