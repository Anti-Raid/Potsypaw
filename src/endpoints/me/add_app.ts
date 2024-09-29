import * as database from "../../Serendipy/prisma.js";
import firebase from "firebase-admin";
import { FastifyReply, FastifyRequest } from "fastify";

export default {
	method: "POST",
	url: "/users/applications",
	schema: {
		summary: "Create an Developer Application",
		description:
			"Returns boolean value indicating whether the creation was successful or not.",
		tags: ["@me"],
		body: {
			type: "object",
			properties: {
				name: { type: "string" },
				logo: { type: "string" },
			},
			required: ["name", "logo"],
		},
		security: [
			{
				apiKey: [],
			},
		],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { name, logo }: any = request.body;
			const Authorization: any = request.headers.authorization;

			const userInfo = await firebase
				.auth()
				.verifyIdToken(Authorization, true);
			const dbUser = await database.Users.get({
				userid: userInfo.uid,
			});

			if (dbUser) {
				const apps = await database.Applications.createApp(
					dbUser?.userid,
					name,
					logo
				);

				return reply.send(apps);
			} else
				return reply.send({
					token: Authorization,
					error: true,
					message: "User does not exist.",
				});
		} catch (error) {
			reply.status(500).send({
				error: "Internal Server Error",
				message: error.errorInfo.message,
			});
		}
	},
};
