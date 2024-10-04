import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../Serendipy/prisma.js";
import { getAuth } from "../../auth.js";
import { State } from "../../Serendipy/types/prismaTypes.js";

export default {
	url: "/users/follow",
	method: "PUT",
	schema: {
		summary: "Follow user",
		description: "Follows a user.",
		tags: ["users"],
		querystring: {
			type: "object",
			properties: {
				target: { type: "string" },
				type: { type: "string" },
			},
			required: ["target", "type"],
		},
		security: [
			{
				apiKey: [],
			},
		],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const data: any = request.query;
		const Authorization: any = request.headers.authorization;
		const user = await getAuth(Authorization, "users.follow");
		const target = await database.Users.get({
			userid: data.target,
		});

		if (data.type === "follow") {
			if (user) {
				if (target) {
					if (
						user.following.find((p) => p.targetid === target.userid)
					)
						return reply.send({
							error: "You cannot follow this user again.",
						});
					else {
                        if ((user.state as State) === State.BANNED || (user.state as State) === State.FOLLOW_BANNED) {
                            return reply.send({
                                error: "You cannot follow this user, as you have been banned (or Follow Banned) for violating our Community Guidelines."
                            });
                        }        
                        
						const update = await database.Users.follow(
							user.userid,
							target.userid
						);

						if (update)
							return reply.send({
								success: true,
							});
						else
							return reply.send({
								error: "An unexpected error has occured while trying to complete your request.",
							});
					}
				} else
					return reply.send({
						error: "The provided target user tag is invalid.",
					});
			} else
				return reply.send({
					error: "The provided user token is invalid, or the user does not exist.",
				});
		}

		if (data.type === "unfollow") {
			if (user) {
				if (target) {
					if (
						!user.following.find(
							(a) => a.targetid === target.userid
						)
					)
						return reply.send({
							error: "You cannot unfollow this user. Reason: You are not following to this user.",
						});
					else {
                        if ((user.state as State) === State.BANNED || (user.state as State) === State.FOLLOW_BANNED) {
                            return reply.send({
                                error: "You cannot unfollow this user, as you have been banned (or Follow Banned) for violating our Community Guidelines."
                            });
                        }   

						const update = await database.Users.unfollow(
							user.userid,
							target.userid
						);

						if (update)
							return reply.send({
								success: true,
							});
						else
							return reply.send({
								error: "An unexpected error has occured while trying to complete your request.",
							});
					}
				} else
					return reply.send({
						error: "The provided target user id is invalid.",
					});
			} else
				return reply.send({
					error: "The provided user token is invalid, or the user does not exist.",
				});
		}
	},
};
