module.exports = async function (fastify, opts) {
    fastify.get(
        "/",
        {
            onRequest: [fastify.verifyJWT],
            preValidation: [fastify.auth.hasRole([fastify.roles.ADMIN])],
        },
        async function (req, res) {
            const [err, orgs] = await fastify.to(
                fastify.prisma.organization.findMany({
                    where: {},
                })
            );

            if (err) {
                return res.badRequest();
            }

            return orgs;
        }
    );

    fastify.delete(
        "/:username",
        {
            onRequest: [fastify.verifyJWT],
            preValidation: [fastify.auth.hasRole([fastify.roles.ADMIN])],
        },
        async (req, res) => {
            const { username } = req.params;

            const [err, orgs] = await fastify.to(
                fastify.prisma.organization.delete({
                    where: {
                        username,
                    },
                })
            );

            console.log(err);
            if (err) {
                return res.internalServerError();
            }

            return { ...orgs };
        }
    );
};
