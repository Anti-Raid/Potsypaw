import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../Serendipy/prisma.js";

export default {
	url: "/validate/username",
	method: "GET",
	schema: {
		summary: "Validate username",
		description: "Validates a username.",
		tags: ["validate"],
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

		if (user)
			return reply.send({
				exists: true,
			});
		// it do be existing
		else
			return reply.send({
				exists: false,
			}); // it do not be existing
	},
};
