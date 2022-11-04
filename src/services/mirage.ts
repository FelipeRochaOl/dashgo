import { faker } from "@faker-js/faker";
import {
  ActiveModelSerializer,
  createServer,
  Factory,
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

export const fakeResponse = {
  users: [],
  totalCount: 1,
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
      server.createList("user", 100);
    },
    serializers: {
      application: ActiveModelSerializer,
    },
    routes() {
      this.namespace = "api";
      // this.timing = 750; // test loading

      this.get("/users", function (schema, request) {
        try {
          const queryParams = request.queryParams as queryParamsData;
          const page = queryParams.page ?? "1";
          const per_page = queryParams.per_page ?? "10";
          const total = schema.all("user").length;
          const pageStart = (Number(page) - 1) * Number(per_page);
          const pageEnd = pageStart + Number(per_page);
          const users = schema.all("user").slice(pageStart, pageEnd);
          return new Response(
            200,
            { "x-total-count": String(total) },
            { users: users.models, totalCount: String(total) }
          );
        } catch (error) {
          console.error(error);
          return new Response(
            200,
            { "x-total-count": String(1) },
            fakeResponse
          );
        }
      });
      this.get("/users/:id", function (schema, request) {
        try {
          const { id } = request.params;
          return schema.findBy("user", { id });
        } catch (error) {
          console.error(error);
          return new Response(
            200,
            { "x-total-count": String(1) },
            fakeResponse
          );
        }
      });
      this.post("/users");

      this.namespace = ""; // hack to not ocurrence problems with api routes nextjs
      this.passthrough();
    },
  });

  return server;
}
