const { receiptRepository } = require('./../repositories/resource.repo');

/**
 * @description Fastify routes for managing resources in MongoDB
 */
module.exports = async function (fastify, opts) {
  // Get all receipts
  fastify.get('/api/mongo/receipts', async (request, reply) => {
    try {
      const receipts = await receiptRepository.find();
      reply.send(receipts);
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  });

  // Get receipt by ID
  fastify.get('/api/mongo/receipts/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const receipt = await receiptRepository.findById(id);
      reply.send(receipt);
    } catch (error) {
      reply.status(404).send({ error: error.message });
    }
  });

  // Create a new receipt
  fastify.post('/api/mongo/receipts', async (request, reply) => {
    try {
      const receiptId = await receiptRepository.create(request.body);
      reply.status(201).send({ id: receiptId });
    } catch (error) {
      reply.status(400).send({ error: error.message });
    }
  });

  // Update receipt by ID
  fastify.put('/api/mongo/receipts/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const updatedReceipt = await receiptRepository.update(id, request.body);
      reply.send(updatedReceipt);
    } catch (error) {
      reply.status(400).send({ error: error.message });
    }
  });

  // Delete receipt by ID
  fastify.delete('/api/mongo/receipts/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      await receiptRepository.delete(id);
      reply.status(204).send();
    } catch (error) {
      reply.status(404).send({ error: error.message });
    }
  });
};
