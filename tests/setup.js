const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  // Skip MongoDB Memory Server setup in CI or if already connected
  if (process.env.CI || mongoose.connection.readyState === 1) {
    return;
  }

  try {
    mongoServer = await MongoMemoryServer.create({
      binary: {
        version: "5.0.0", // Use smaller, faster version
        downloadDir: "./mongodb-binaries",
      },
      instance: {
        dbName: "testdb",
      },
    });
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(
      "Failed to start MongoDB Memory Server, using existing connection"
    );
  }
}, 60000);

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
});
