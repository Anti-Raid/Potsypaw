import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../Serendipy/prisma.js";
import { getAuth } from "../../auth.js";

export default {
	url: "/posts/delete",
	method: "DELETE",
	schema: {
		summary: "Delete post",
		description: "Delete a post. Returns boolean.",
		tags: ["posts"],
		body: {
			type: "object",
			properties: {
				post_id: { type: "string" },
			},
			required: ["post_id"],
		},
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const data = request.body;
		const Authorization: any = request.headers.authorization;

		if (!Authorization)
			return reply.send({
				error: "Oops, it seems that you are not logged in.",
			});
		if (!data["post_id"])
			return reply.send({
				error: "Oops, it seems that you did not pass the Post ID.",
			});
		else {
			const user = await getAuth(Authorization, "posts.delete");

			if (user) {
				let origPost = await database.Posts.get(data["post_id"]);

				if (origPost) {
					if (origPost.userid === user.userid) {
						await database.Posts.delete(origPost.postid);

						return reply.send({ success: true });
					} else
						return reply.send({
							success: false,
							error: "You are NOT the author of this post. Access denied.",
						});
				} else
					reply.send({
						success: false,
						error: "The Post ID provided is invalid.",
					});
			} else {
				return reply.send({
					success: false,
					error: "The user token was not passed with token.",
				});
			}
		}
	},
};
