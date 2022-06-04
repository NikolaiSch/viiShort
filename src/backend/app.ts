import express from "express";
import type { link } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { Md5 } from "ts-md5/dist/md5";
const cors = require("cors");
import * as path from "path";

const prisma = new PrismaClient();

interface newRequest {
    url: string;
    password: string | null;
    slug: string;
}

function isUrl(string: string) {
    let url: URL;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("./dist"));

const port = 3000;

app.post("/api/new", async (req, res) => {
    try {
        const body: newRequest = req.body;
        const { url, password } = body;

        if (!isUrl(url)) {
            return;
        }
        let output: newRequest = {
            url: url,
            password: null,
            slug: Md5.hashStr(url).substring(0, 10),
        };

        if (password) {
            output.password = Md5.hashStr(password);
            output.slug = Md5.hashStr(url + password).substring(0, 10);
        }

        let data = await prisma.link.upsert({
            create: output,
            where: {
                slug: output.slug,
            },
            update: {
                users: {
                    increment: 1,
                },
            },
        });

        res.send({
            status: "success",
            slug: data.slug,
            url: data.url,
            users: data.users,
        });
    } catch (e: any) {
        res.status(200).send({ status: "error", reason: e.message });
    }
});

app.post("/api/slug", async (req, res) => {
    let link = await prisma.link.findUnique({
        where: {
            slug: req.body.slug,
        },
    });

    if (link?.password && !req.body.password) {
        res.status(200).send({ status: "needPass" });
        return;
    }

    if (link?.password && !!req.body.password) {
        if (Md5.hashStr(req.body.password) == link.password) {
            await prisma.link.update({
                where: {
                    slug: link.slug,
                },
                data: {
                    users: {
                        increment: 1,
                    },
                },
            });
            res.send({
                status: "success",
                url: link.url,
                users: link.users,
                slug: link.slug,
            });
            return;
        } else {
            res.status(200).send({ status: "incorrectPassword" });
        }
    } else if (link) {
        await prisma.link.update({
            where: {
                slug: link.slug,
            },
            data: {
                users: {
                    increment: 1,
                },
            },
        });
        res.send({
            status: "success",
            url: link.url,
            users: link.users,
            slug: link.slug,
        });
        return;
    } else {
        res.send({ status: "wrongSlug" });
    }
});

app.get("/api/stats", async (_, res) => {
    res.send({
        totalLinks: totalLinks,
        totalViews: totalViews,
        topLinks: topLinks,
    });
});

let totalLinks: number;
let totalViews: number;
let topLinks: link[];

async function getStats() {
    totalLinks = await prisma.link.count();
    totalViews =
        (
            await prisma.link.aggregate({
                _sum: {
                    users: true,
                },
            })
        )._sum.users || 0;
    topLinks = await prisma.link.findMany({
        orderBy: [{ users: "desc" }],
        take: 5,
    });
}

app.get("/:slug((([a-f]|[0-9]){10}))", async (req, res) => {
    let url = await prisma.link.findUnique({
        where: {
            slug: req.params.slug,
        },
        select: {
            url: true,
        },
    });

    await prisma.link.update({
        where: {
            slug: req.params.slug,
        },
        data: {
            users: {
                increment: 1,
            },
        },
    });

    res.redirect(url!.url);
});

app.get("/[stats|create|index]", (req, res) => {
    res.sendFile(path.resolve("./dist/index.html"));
});

getStats();

setInterval(async () => {
    await getStats();
}, 1000);

app.listen(port);
