import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../services/api";
import { fakeResponse } from "../services/mirage";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface UserData {
  users: User[];
}

export type GetUsersResponse = {
  users: User[];
  totalCount: number;
};

export async function getUsers(page: number): Promise<GetUsersResponse> {
  try {
    const response = await api.get("/users", {
      params: {
        page,
      },
    });
    const totalCount = Number(response.headers["x-total-count"]);
    const data: UserData = response.data;
    const users = data.users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: new Date(user.createdAt).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      };
    });
    return { users, totalCount };
  } catch (error) {
    console.error(error);
    return fakeResponse;
  }
}

export function useUsers(page: number, options?: UseQueryOptions) {
  return useQuery(["users", page], () => getUsers(page), {
    cacheTime: 1000 * 60 * 10,
    ...options,
  }) as UseQueryResult<GetUsersResponse, unknown>;
}
