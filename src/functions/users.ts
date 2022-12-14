import { faker } from "@faker-js/faker";
import { Handler } from "@netlify/functions";
import { Event } from "@netlify/functions/dist/function/event";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

let storage: User[] = [];

const initStorage = (total: number): void => {
  if (!storage.length) {
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
  }
};

const getAllUsers = async (event: Event, total = 100): Promise<User[]> => {
  initStorage(total);
  const { page = 1, per_page = 10 } = event.queryStringParameters;
  const pageStart = (Number(page) - 1) * Number(per_page);
  const pageEnd = pageStart + Number(per_page);
  return storage
    .slice(pageStart, pageEnd)
    .sort(
      (userA, userB) => userB.createdAt.valueOf() - userA.createdAt.valueOf()
    );
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
  const dataJson: User = JSON.parse(data);
  const user = {
    id: String(storage.length + 1),
    createdAt: new Date(),
    email: dataJson.email,
    name: dataJson.name,
  };
  storage.push(user);
  return storage;
};

const handler: Handler = async (event, context) => {
  console.log("aqui");
  try {
    const totalCount = 200;
    let users: User[] = await getAllUsers(event, totalCount);

    if (event.httpMethod === "GET") {
      console.log("entrou");
      const selectedUser = await selectUser(event);
      console.log(selectedUser);
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
    console.log(storage);
    return {
      statusCode: 200,
      headers: { "x-total-count": totalCount },
      body: JSON.stringify({ users, totalCount }),
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
