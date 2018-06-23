module.exports = [
  {
    name: "default",
    type: "postgres",
    host: "localhost",
    port: "5432",
    username: "something",
    password: "something",
    database: "something",
    synchronize: true,
    logging: false,
    entities: [
      "entity/*.js"
    ],
    cli: {
      entitiesDir: "entity",
    },
  },
  {
    name: "test",
    type: "postgres",
    host: "localhost",
    port: "5432",
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [
      "entity/*.js"
    ],
    cli: {
      entitiesDir: "entity",
    },
  },
];
