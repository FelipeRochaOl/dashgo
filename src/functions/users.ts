import { faker } from "@faker-js/faker";
import { Handler } from "@netlify/functions";

type User = {
  id: string;
  name: string;
  email: string;
  created_at: Date;
};

const storage: User[] = [];

const getAllUsers = async (): Promise<User[]> => {
  let i = 0;
  do {
    storage.push({
      id: String(i),
      name: faker.name.fullName(),
      email: faker.internet.email(),
      created_at: faker.date.recent(10),
    });
    i++;
  } while (i < 100);
  return storage;
};

const addUsers = async (data: string): Promise<User[]> => {
  const dataJson = JSON.parse(data);
  storage.push(dataJson);
  return storage;
};

const handler: Handler = async (event, context) => {
  console.log(event, context);
  let users: User[] = [];
  if (event.httpMethod === "GET") {
    users = await getAllUsers();
  }
  if (event.httpMethod === "POST") {
    users = await addUsers(event.body);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ users, totalCount: users.length }),
  };
};

export { handler };
