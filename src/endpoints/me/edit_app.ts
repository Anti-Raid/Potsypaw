import * as database from "../../Serendipy/prisma.js";
import firebase from "firebase-admin";
import { FastifyReply, FastifyRequest } from "fastify";

export default {
	method: "PATCH",
	url: "/users/applications",
	schema: {
		summary: "Update an Developer Application",
		description:
			"Returns boolean value indicating whether the update was successful or not.",
		tags: ["@me"],
		body: {
			type: "object",
			properties: {
				token: { type: "string" },
				name: { type: "string" },
				logo: { type: "string" },
				permissions: { type: "array" },
				active: { type: "boolean" },
			},
			required: ["token", "name", "logo", "permissions", "active"],
		},
		security: [
			{
				apiKey: [],
			},
		],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { token, name, logo, permissions, active }: any =
				request.body;
			const Authorization: any = request.headers.authorization;

			const userInfo = await firebase
				.auth()
				.verifyIdToken(Authorization, true);
			const dbUser = await database.Users.get({
				userid: userInfo.uid,
			});

			if (dbUser) {
				const apps = await database.Applications.updateApp(token, {
					name: name,
					logo: logo,
					permissions: permissions,
					active: active,
				});

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
