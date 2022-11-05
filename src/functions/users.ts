import { faker } from "@faker-js/faker";
import { Handler } from "@netlify/functions";
import { Event } from "@netlify/functions/dist/function/event";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

const storage: User[] = [];

const getAllUsers = async (event: Event, total = 100): Promise<User[]> => {
  const { page = 1, per_page = 10 } = event.queryStringParameters;
  let i = 0;
  do {
    storage.push({
      id: String(i),
      name: faker.name.fullName(),
      email: faker.internet.email(),
      createdAt: faker.date.recent(10),
    });
    i++;
  } while (i < total);
  const pageStart = (Number(page) - 1) * Number(per_page);
  const pageEnd = pageStart + Number(per_page);
  return storage.slice(pageStart, pageEnd);
};

const selectUser = async (event: Event): Promise<User> => {
  const urlParts = event.path.split("/");
  const id = urlParts[urlParts.length - 1];
  if (!Number.isNaN(id)) {
    return storage.find((user) => user.id === id);
  }
  return undefined;
};

const addUsers = async (data: string): Promise<User[]> => {
  console.log(data);
  const dataJson: Omit<User, "id" | "created_at"> = JSON.parse(data);
  console.log(dataJson);
  const user = {
    id: String(storage.length + 1),
    createdAt: new Date(),
    ...dataJson,
  };
  storage.push(user);
  return storage;
};

const handler: Handler = async (event, context) => {
  console.log(event, context);
  try {
    let users: User[] = [];
    if (event.httpMethod === "GET") {
      users = await getAllUsers(event, 200);
      const selectedUser = await selectUser(event);
      if (selectedUser) {
        return {
          statusCode: 200,
          body: JSON.stringify({ ...selectedUser }),
        };
      }
    }
    if (event.httpMethod === "POST") {
      users = await addUsers(event.body);
    }
    return {
      statusCode: 200,
      headers: { "x-total-count": 100 },
      body: JSON.stringify({ users, totalCount: 100 }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { "x-total-count": 0 },
      body: JSON.stringify({ users: [], totalCount: 0 }),
    };
  }
};

export { handler };
