import { Component, createSignal, Show } from "solid-js";
import { VscCopy, VscCheck } from "solid-icons/vsc";

interface ICopy {
    toCopy: string;
    text: string;
}

const Copy: Component<ICopy> = (props) => {
    const [copy, setCopy] = createSignal(true);
    const copyFunc = async (text: string) => {
        setCopy(false);
        setTimeout(() => {
            setCopy(true);
        }, 2000);
        await navigator.clipboard.writeText(text);
    };
    return (
        <h4
            class="text-black transition cursor-pointer flex flex-row group"
            onClick={() => copyFunc(props.toCopy)}
        >
            <p>{props.text}</p>
            <Show
                when={copy()}
                fallback={
                    <VscCheck
                        size={15}
                        color="#000000"
                        class="my-2 ml-2 scale-125 transition"
                    />
                }
            >
                <VscCopy
                    size={15}
                    color="#000000"
                    class="my-2 ml-2 group-hover:scale-125 transition"
                />
            </Show>
        </h4>
    );
};

export default Copy;
