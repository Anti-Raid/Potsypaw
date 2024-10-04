import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../Serendipy/prisma.js";
import { getAuth } from "../../auth.js";

export default {
	url: "/posts/comment",
	method: "POST",
	schema: {
		summary: "Add a comment to a post",
		description:
			"Returns boolean value indicating whether the comment was successful or not.",
		tags: ["posts"],
		querystring: {
			type: "object",
			properties: {
				id: { type: "string" },
			},
			required: ["id"],
		},
		body: {
			type: "object",
			properties: {
				caption: { type: "string" },
				image: { type: "string" },
			},
			required: ["caption"],
		},
		security: [
			{
				apiKey: [],
			},
		],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const data = request.body;
		const { id }: any = request.query;
		const Authorization: any = request.headers.authorization;

		const user = await getAuth(Authorization, "posts.comment");
		let post = await database.Posts.get(id);

		if (user) {
			if (post) {
				if (post.user.state === "BANNED") {
					return reply.send({
						error: "You cannot comment on this post, as you have been banned for violating our Community Guidelines.",
					});
				} else {
					const update = await database.Posts.comment(
						post.postid,
						user.userid,
						data["caption"],
						data["image"]
					);

					if (update) return reply.send({ success: true });
					else
						return reply.send({
							error: "Something went wrong with processing your request.",
						});
				}
			} else
				return reply.send({
					error: "The provided post id is invalid.",
				});
		} else
			return reply.send({
				error: "The provided user token is invalid, or the user does not exist.",
			});
	},
};
