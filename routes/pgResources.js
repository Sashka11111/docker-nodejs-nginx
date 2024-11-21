const { resourceRepository } = require('./../repositories/resource.repo');

/**
 * @description Fastify routes for managing resources in PostgreSQL
 */
module.exports = async function (fastify, opts) {
  // Get all resources
  fastify.get('/api/pg/resources', async (request, reply) => {
    try {
      const resources = await resourceRepository.find(request.query);
      reply.send(resources);
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  });

  // Get resource by ID
  fastify.get('/api/pg/resources/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const resource = await resourceRepository.findByPK(id);
      reply.send(resource);
    } catch (error) {
      reply.status(404).send({ error: error.message });
    }
  });

  // Create a new resource
  fastify.post('/api/pg/resources', async (request, reply) => {
    try {
      const newResource = await resourceRepository.create(request.body);
      reply.status(201).send(newResource);
    } catch (error) {
      reply.status(400).send({ error: error.message });
    }
  });

  // Update resource by ID
  fastify.put('/api/pg/resources/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const updatedResource = await resourceRepository.update(id, request.body);
      reply.send(updatedResource);
    } catch (error) {
      reply.status(400).send({ error: error.message });
    }
  });

  // Delete resource by ID
  fastify.delete('/api/pg/resources/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      await resourceRepository.delete(id);
      reply.status(204).send();
    } catch (error) {
      reply.status(404).send({ error: error.message });
    }
  });
};
