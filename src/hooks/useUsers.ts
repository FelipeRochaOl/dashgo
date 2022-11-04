import { useQuery } from "react-query";
import { api } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface UserData {
  users: {
    models: User[];
  };
}

type GetUsersResponse = {
  users: User[];
  totalCount: number;
};

export async function getUsers(page: number): Promise<GetUsersResponse> {
  const response = await api.get("/users", {
    params: {
      page,
    },
  });
  const totalCount = Number(response.headers["x-total-count"]);
  const data: UserData = response.data;
  const users = data.users.models.map((user) => {
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
}

export function useUsers(page: number) {
  return useQuery(["users", page], () => getUsers(page), {
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
