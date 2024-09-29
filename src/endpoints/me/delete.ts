import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../Serendipy/prisma.js";
import firebase from "firebase-admin";

export default {
	url: "/users/@me",
	method: "DELETE",
	schema: {
		summary: "Delete @me",
		description:
			"Returns boolean value indicating whether the deletion was successful or not.",
		tags: ["@me"],
		security: [
			{
				apiKey: [],
			},
		],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const Authorization: any = request.headers.authorization;

		const userInfo = await firebase
			.auth()
			.verifyIdToken(Authorization, true);
		const user = await database.Users.get({
			userid: userInfo.uid,
		});

		if (user) {
			await database.Users.delete(userInfo.uid);
			await firebase.auth().deleteUser(userInfo.uid);

			return reply.send({
				success: true,
			});
		} else
			reply.status(404).send({
				message:
					"We couldn't fetch any information about you in our database",
				token: Authorization,
				error: true,
			});
	},
};
