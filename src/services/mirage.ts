import { faker } from "@faker-js/faker";
import {
  createServer,
  Factory,
  JSONAPISerializer,
  Model,
  Response,
} from "miragejs";

type User = {
  name: string;
  email: string;
  created_at: string;
};

interface queryParamsData {
  page?: string;
  per_page?: string;
}

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
      server.createList("user", 100);
    },
    serializers: {
      application: JSONAPISerializer,
    },
    routes() {
      this.namespace = "api";
      this.timing = 750; // test loading

      this.get("/users", function (schema, request) {
        const { page = "1", per_page = "10" } =
          request.queryParams as queryParamsData;
        const total = schema.all("user").length;
        const pageStart = (Number(page) - 1) * Number(per_page);
        const pageEnd = pageStart + Number(per_page);
        const users = schema.all("user").slice(pageStart, pageEnd);
        return new Response(200, { "x-total-count": String(total) }, { users });
      });
      this.get("/users/:id");
      this.post("/users");

      this.namespace = ""; // hack to not ocurrence problems with api routes nextjs
      this.passthrough();
    },
  });

  return server;
}
