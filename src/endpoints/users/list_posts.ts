import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../Serendipy/prisma.js";

export default {
	url: "/users/list_posts",
	method: "GET",
	schema: {
		summary: "Get user posts",
		description: "Gets a user's posts.",
		tags: ["users"],
		querystring: {
			type: "object",
			properties: {
				tag: { type: "string" },
			},
			required: ["tag"],
		},
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const data: any = request.query;

		const tag = data.tag;
		let posts;

		if (tag || tag != "") {
			let user = await database.Users.get({ usertag: tag });

			if (user) {
				if (user.state === "BANNED")
					return reply.status(404).send({
						message:
							"This user has been banned, for violating our community guidelines.",
						error: true,
					});

				posts = await database.Posts.getAllUserPosts(user.userid);
				posts.reverse();

				return reply.send(posts);
			} else
				return reply.status(404).send({
					message:
						"We couldn't fetch any information about this user in our database",
					error: true,
				});
		} else
			return reply.status(404).send({
				error: "There was no user tag specified with the request.",
			});
	},
};
