import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../Serendipy/prisma.js";

export default {
	url: "/partners/list",
	method: "GET",
	schema: {
		summary: "Get All Partners",
		description: "Returns a list about all of our partners.",
		tags: ["partners"],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const partners = await database.Partners.getAllPartners();
		return reply.send(partners);
	},
};
