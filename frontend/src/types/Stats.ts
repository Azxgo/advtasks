import type { TaskAttribute } from "./Tasks";

export type TotalStatsAttributes = {
    [key in TaskAttribute]: number;
};

export type DailyStat = {
    date: string;
    completedTasks: number;
    totalTasks: number;
    score: number;
};
