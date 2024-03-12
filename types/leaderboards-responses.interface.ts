export interface LeaderBoardsResponsesType {
  leaderboards: LeaderboardType[];
}

export interface LeaderboardType {
  user: User;
  score: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}
