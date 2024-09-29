import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../Serendipy/prisma.js";
import { getAuth } from "../../auth.js";

export default {
	url: "/users/@me",
	method: "PATCH",
	schema: {
		summary: "Update @me information",
		description:
			"Returns boolean value indicating whether the update was successful or not.",
		tags: ["@me"],
		body: {
			type: "object",
			properties: {
				name: { type: "string" },
				tag: { type: "string" },
				avatar: { type: "string" },
				bio: { type: "string" },
				discord: { type: "string" },
			},
			required: ["name", "avatar", "tag"],
		},
		security: [
			{
				apiKey: [],
			},
		],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		let data = request.body;
		const Authorization: any = request.headers.authorization;

		const user = await getAuth(Authorization, "profile.write");

		if (user) {
			if (!data["bio"] || data["bio"] === "") data["bio"] = null;
			if (!data["tag"] || data["tag"] === "") data["tag"] = null;
			if (!data["discord"] || data["discord"] === "")
				data["discord"] = null;

			if (data["tag"]) {
				if (user.usertag != data["tag"]) {
					const existingUser = await database.Users.get({
						usertag: data["tag"],
					});

					if (existingUser) {
						return reply.send({
							success: false,
							message:
								"That usertag is already in use. Please choose a new one.",
						});
					} else {
						await database.Users.updateUser(user.userid, {
							name: data["name"],
							usertag: data["tag"],
							avatar: data["avatar"],
							bio: data["bio"] || null,
							discord_id: data["discord"] || null,
						});

						return reply.send({
							success: true,
						});
					}
				} else {
					await database.Users.updateUser(user.userid, {
						name: data["name"],
						avatar: data["avatar"],
						bio: data["bio"] || null,
						discord_id: data["discord"] || null,
					});

					return reply.send({
						success: true,
					});
				}
			} else {
				await database.Users.updateUser(user.userid, {
					name: data["name"],
					avatar: data["avatar"],
					bio: data["bio"] || null,
					discord_id: data["discord"] || null,
				});

				return reply.send({
					success: true,
				});
			}
		} else
			reply.status(404).send({
				message:
					"We couldn't fetch any information about you in our database",
				token: Authorization,
				error: true,
			});
	},
};
