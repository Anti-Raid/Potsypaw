import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../Serendipy/prisma.js";

export default {
	url: "/posts/get",
	method: "GET",
	schema: {
		summary: "Get post",
		description: "Returns a post.",
		tags: ["posts"],
		querystring: {
			type: "object",
			properties: {
				post_id: { type: "string" },
			},
			required: ["post_id"],
		},
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const { post_id }: any = request.query;

		if (post_id || post_id != "") {
			let post = await database.Posts.get(post_id);
			return reply.send(post);
		} else
			return reply.status(404).send({
				error: "You did not provide a valid Post ID.",
			});
	},
};
