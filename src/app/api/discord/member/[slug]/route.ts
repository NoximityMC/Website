import { extractFirstPart, isAuthorized } from "@/app/lib/misc";
import { NextResponse } from "next/server";

export async function GET(req:any, {params}: any) {
    const auth = await isAuthorized(req);
    if (!auth) {
        return NextResponse.json({success: false, message: 'Unauthorized'}, { status: 403})
    }

    if (!params.slug) {
        return NextResponse.json({success: false, message: 'Missing one or more fields'}, { status: 400 })
    }

    var staff = false;
    var admin = false;
    const memRes = await fetch(`https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${params.slug}`, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
        }
    });

    if (memRes.ok) {
        const mem = await memRes.json();
        const name = mem.user.global_name;
        var roles = mem.roles;
        const ignoredRoles = process.env.DISCORD_IGNORED_ROLES?.split(', ') || [];
        const staffRoles = process.env.DISCORD_STAFF_ROLES?.split(', ') || [];
        const adminRoles = process.env.DISCORD_ADMIN_ROLES?.split(', ') || [];

        if (roles.some((r:any) => staffRoles.includes(r))) {
            staff = true;
        } else {
            staff = false;
        }

        if (roles.some((r:any) => adminRoles.includes(r))) {
            admin = true;
        } else {
            admin = false;
        }
        
        roles = roles.filter((r:any) => !ignoredRoles.includes(r));

        const roleRes = await fetch(`https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/roles`, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
            }
        });

        var highestPosition = -1;
        var highestPositionID = '';

        if (roleRes.ok) {
            const role = await roleRes.json();

            for (const id of roles) {
                const matchingObject = role.find((r:any) => r.id === id);
                if (matchingObject && matchingObject.position > highestPosition) {
                    highestPosition = matchingObject.position;
                    highestPositionID = matchingObject.id;
                }
            }

            const rank = role.find((r:any) => r.id === highestPositionID);

            if (rank) {
                const rankName = extractFirstPart(rank.name);

                return NextResponse.json({
                    success: true,
                    data: {
                        name: name,
                        rank: {
                            name: rankName,
                            color: rank.color,
                            id: rank.id
                        }
                    }
                }, { status: 200 })
            }

        }

        return NextResponse.json({
            success: true,
            data: {
                name: name,
                rank: null
            }
        }, { status: 200 });
    } else {
        return NextResponse.json({
            success: true,
            data: {
                name: null,
                rank: null
            }
        }, { status: 200 });
    }
}