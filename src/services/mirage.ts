import { faker } from "@faker-js/faker";
import { createServer, Factory, Model } from "miragejs";

type User = {
  name: string;
  email: string;
  created_at: string;
};

export function makeServer() {
  const server = createServer({
    models: {
      user: Model.extend<Partial<User>>({}),
    },
    factories: {
      user: Factory.extend({
        name() {
          return faker.name.fullName();
        },
        email() {
          return faker.internet.email().toLowerCase();
        },
        createdAt() {
          return faker.date.recent(10);
        },
      }),
    },
    seeds(server) {
      server.createList("user", 10);
    },
    routes() {
      this.namespace = "api";
      this.timing = 750; // test loading

      this.get("/users");
      this.post("/users");

      this.namespace = ""; // hack to not ocurrence problems with api routes nextjs
      this.passthrough();
    },
  });

  return server;
}
