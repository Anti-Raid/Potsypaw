import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../Serendipy/prisma.js";

export default {
	url: "/partners/get",
	method: "GET",
	schema: {
		summary: "Get Partner Info",
		description: "Returns information about one of our partners.",
		tags: ["partners"],
		querystring: {
			type: "object",
			properties: {
				id: { type: "string" },
			},
			required: ["id"],
		},
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const { id }: any = request.query;

		if (id || id != "") {
			const partner = await database.Partners.get({
				id: id,
			});
			return reply.send(partner);
		} else
			return reply.status(404).send({
				error: "You did not provide a valid Partner ID.",
			});
	},
};
