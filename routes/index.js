const { echoRouter } = require("./echo");
const { resourcesRouter } = require("./resources");
const { pgResourcesRouter } = require("./pgResources"); // PostgreSQL routes
const { mongoResourcesRouter } = require("./mongoResources"); // MongoDB routes

/**
 * Patch the routing of the fastify instance
 * @param {import("fastify").FastifyInstance} fastify
 */
module.exports.patchRouting = (fastify) => {
  // Handle 404 responses
  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({ error: "Not Found" });
  });

  // Add a global error handler if needed
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error); // Log the error
    reply.status(500).send({ error: "Internal Server Error" });
  });

  // Register routes
  fastify.register(echoRouter);
  fastify.register(resourcesRouter);

  // PostgreSQL-specific routes
  fastify.register(pgResourcesRouter, { prefix: "/api/pg" });

  // MongoDB-specific routes
  fastify.register(mongoResourcesRouter, { prefix: "/api/mongo" });
};
