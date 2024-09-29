import * as database from "../../Serendipy/prisma.js";
import firebase from "firebase-admin";
import { FastifyReply, FastifyRequest } from "fastify";

export default {
	method: "GET",
	url: "/users/applications",
	schema: {
		summary: "Get list of Developer Applications",
		description:
			"Returns all information about your Developer Applications.",
		tags: ["@me"],
		security: [
			{
				apiKey: [],
			},
		],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const Authorization: any = request.headers.authorization;

			const userInfo = await firebase
				.auth()
				.verifyIdToken(Authorization, true);
			const dbUser = await database.Users.get({
				userid: userInfo.uid,
			});

			if (dbUser) {
				let apps = await database.Applications.getAllApplications(
					dbUser?.userid
				);

				if (apps) return reply.send(apps);
				else
					return reply.status(404).send({
						message:
							"We couldn't fetch any Developer Applications under your profile. Please create one, and try again!",
						token: Authorization,
						error: true,
					});
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
