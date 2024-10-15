import { FC } from "react";
import { TUser } from "../types";
import { authApi } from "../api/api";
import { useQuery } from "react-query";

interface LeaderboardProps {}

const Leaderboard: FC<LeaderboardProps> = () => {
  const { data } = useQuery("leaderboard", async () => {
    const response = await authApi.get<TUser[]>("/leaderboard");
    return response;
  });

  return (
    <div>
      <h1 className="text-6xl text-white mb-12">Топ гонщиків</h1>

      <div className="bg-slate-900 rounded-xl shadow p-5">
        <table className="w-full text-start  text-white ">
          <thead className="border-b border-white/20">
            <tr>
              <th className="p-2 text-start">Місце</th>
              <th className="p-2 text-start">Рейтинг</th>
              <th className="p-2 text-start">Імʼя</th>
            </tr>
          </thead>
          <tbody className="p-5">
            {data?.data.map((user, i) => (
              <tr className="" key={user.id}>
                <td className="p-2 text-start">{i + 1}</td>
                <td className="p-2 text-start">{user.rating}</td>
                <td className="p-2 text-start">{user.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
