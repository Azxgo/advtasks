
export const statusMap: Record<string, string> = {
  "pending": "Pendiente",
  "in-progress": "En progreso",
  "done": "Completado",
  "missed": "Incumplida"
};

export const levelColors: Record<number, string> = {
  1: "bg-green-300 dark:bg-green-900 ",
  2: "bg-green-500 dark:bg-green-900/50 ",
  3: "bg-yellow-300 dark:bg-yellow-900 ",
  4: "bg-orange-400 dark:bg-orange-900 ",
  5: "bg-red-500 dark:bg-red-900 ",
};

export const statusStyles: Record<string, string> = {
  pending:
    "bg-gray-100 text-gray-700 border-gray-300 dark:text-white dark:border-zinc-600 dark:bg-zinc-700",

  "in-progress":
    "bg-blue-100 text-blue-700 border-blue-300 dark:text-white dark:border-blue-800 dark:bg-blue-900",
  done:
    "bg-green-100 text-green-700 border-green-300 dark:text-white dark:border-green-800 dark:bg-green-900",
  missed:
    "bg-red-100 text-red-700 border-red-300 dark:text-white dark:border-red-800 dark:bg-red-900"
};

