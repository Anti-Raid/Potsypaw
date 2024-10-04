import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../Serendipy/prisma.js";

export default {
	url: "/users/get",
	method: "GET",
	schema: {
		summary: "Get user",
		description: "Gets a user.",
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
		let user = await database.Users.get({ usertag: tag });

		if (user) {
			if (user.state === "BANNED")
				return reply.send({
					message:
						"This user has been banned for violating our Community Guidelines.",
					error: true,
				});

			return reply.send(user);
		} else
			return reply.status(404).send({
				message:
					"We couldn't fetch any information about this user in our database",
				error: true,
			});
	},
};
