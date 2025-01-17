import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../Serendipy/prisma.js";
import { getAuth } from "../../auth.js";

export default {
	url: "/posts/vote",
	method: "PUT",
	schema: {
		summary: "Vote on post",
		description: "Votes on a post.",
		tags: ["posts"],
		querystring: {
			type: "object",
			properties: {
				PostID: { type: "string" },
				type: { type: "string" },
			},
			required: ["PostID", "type"],
		},
		security: [
			{
				apiKey: [],
			},
		],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const { PostID, type }: any = request.query;
		const Authorization: any = request.headers.authorization;
		const user = await getAuth(Authorization, "posts.vote");

		let post = await database.Posts.get(PostID);

		if (type === "up") {
			if (user) {
				if (post) {
					if (
						user.state === "BANNED" ||
						user.state === "VOTE_BANNED"
					) {
						return reply.send({
							success: false,
							error: "You cannot vote for this post, as you have been banned (or Vote Banned) for violating our Community Guidelines.",
						});
					} else {
						if (
							post.upvotes.find(
								(a) => a.userid === user.userid
							) ||
							post.downvotes.find((a) => a.userid === user.userid)
						)
							return reply.send({
								success: false,
								error: "You cannot update your vote, for this post.",
							});
						else {
							const update = await database.Posts.upvote(
								PostID,
								user.userid
							);

							if (update)
								return reply.send({
									success: true,
								});
							else
								return reply.send({
									success: false,
									error: "An unexpected error has occured while trying to complete your request.",
								});
						}
					}
				} else
					return reply.send({
						error: "The provided post id is invalid.",
						success: false,
					});
			} else
				return reply.send({
					success: false,
					error: "The provided user token is invalid, or the user does not exist.",
				});
		}

		if (type === "down") {
			if (user) {
				if (post) {
					if (
						user.state === "BANNED" ||
						user.state === "VOTE_BANNED"
					) {
						return reply.send({
							success: false,
							error: "You cannot vote for this post, as you have been banned (or Vote Banned) for violating our Community Guidelines.",
						});
					} else {
						if (
							post.upvotes.find(
								(a) => a.userid === user.userid
							) ||
							post.downvotes.find((a) => a.userid === user.userid)
						)
							return reply.send({
								success: false,
								error: "You cannot update your vote, for this post.",
							});
						else {
							const update = await database.Posts.downvote(
								PostID,
								user.userid
							);

							if (update)
								return reply.send({
									success: true,
								});
							else
								return reply.send({
									success: false,
									error: "An unexpected error has occured while trying to complete your request.",
								});
						}
					}
				} else
					return reply.send({
						success: false,
						error: "The provided post id is invalid.",
					});
			} else
				return reply.send({
					success: false,
					error: "The provided user token is invalid, or the user does not exist.",
				});
		}
	},
};
