import { faker } from "@faker-js/faker";
import { Handler } from "@netlify/functions";
import { Event } from "@netlify/functions/dist/function/event";

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

const selectUser = async (event: Event): Promise<User> => {
  const urlParts = event.path.split("/");
  const id = urlParts[urlParts.length - 1];
  if (!Number.isNaN(id)) {
    return storage.find((user) => user.id === id);
  }
  return undefined;
};

const addUsers = async (data: string): Promise<User[]> => {
  const dataJson: Omit<User, "id"> = JSON.parse(data);
  const user = {
    id: String(storage.length + 1),
    ...dataJson,
  };
  storage.push(user);
  return storage;
};

const handler: Handler = async (event, context) => {
  try {
    console.log(event, context);
    let users: User[] = [];
    if (event.httpMethod === "GET") {
      users = await getAllUsers();
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
      body: JSON.stringify({ users, totalCount: users.length }),
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ users: [], totalCount: 0 }),
    };
  }
};

export { handler };
