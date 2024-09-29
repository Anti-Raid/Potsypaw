import { FastifyReply, FastifyRequest } from "fastify";
import { getAuth } from "../../auth.js";

export default {
	method: "GET",
	url: "/users/@me",
	schema: {
		summary: "Get @me information",
		description:
			"Returns all information about an user based on the token.",
		tags: ["@me"],
		security: [
			{
				apiKey: [],
			},
		],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const Authorization: any = request.headers.authorization;
		const user = await getAuth(Authorization, "profile.read");

		if (user) return reply.send(user);
		else
			return reply.status(404).send({
				message:
					"We couldn't fetch any information about you in our database",
				token: Authorization,
				error: true,
			});
	},
};
