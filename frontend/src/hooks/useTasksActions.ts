import type { Dispatch, SetStateAction } from "react";
import type { TaskAttribute, TaskItem } from "../types/Tasks";
import { apiClient } from "../config/apiClient";

const BASE_URL = "/api/tasks";

export function useTasksActions(
    updateTask: (task: TaskItem) => void,
    setTasks: Dispatch<SetStateAction<TaskItem[]>>) {


    const isToday = (dateValue: Date | string) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const date = new Date(dateValue)
        today.setHours(0, 0, 0, 0)

        return date.getTime() === today.getTime()
    }


    const handle = async (
        url: string,
        options?: RequestInit,
        onSuccess?: (task: any) => void
    ) => {
        try {
            const res = await apiClient(url, options)

            if (!res.ok) {
                console.log(await res.text())
                return
            }
            const updatedTask = await res.json()
            updateTask(updatedTask);
            onSuccess?.(updatedTask)

            return updatedTask
        } catch (error) {
            console.error(error)
        }
    }

    const toggleCompleted = (id: string, taskDate: Date | string) => {
        if (!isToday(taskDate)) return

        handle(`${BASE_URL}/complete/${id}`, {
            method: "PATCH"
        }
        )
    }

    const changeDificult = (id: string, taskDate: Date | string) => {
        if (!isToday(taskDate)) return

        handle(`${BASE_URL}/changeDifficult/${id}`, {
            method: "PATCH"
        })
    }

    const changeStatus = (id: string, taskDate: Date | string) => {
        if (!isToday(taskDate)) return

        handle(`${BASE_URL}/changeStatus/${id}`, {
            method: "PATCH"
        })
    }

    const changeAtribute = (id: string, attribute: TaskAttribute, taskDate: Date | string) => {
        if (!isToday(taskDate)) return

        handle(`${BASE_URL}/handleAtributes/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ attribute }),
        })
    }

    const changeName = async (id: string, name: string) => {
        setTasks((prev) =>
            prev.map((t) => (t._id === id ? { ...t, name } : t))
        )

        handle(`${BASE_URL}/changeName/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        })
    }

    const saveTime = async (id: string, field: "hour" | "minute", value: number) => {
        handle(`${BASE_URL}/changeTime/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [field]: value }),
        });
    }

    const handleAddTask = async (task: Partial<TaskItem>, currentDate?: Date) => {

        const res = await apiClient(`${BASE_URL}/add`, {
            method: "POST",
            body: JSON.stringify(task),
        });

        const data = await res.json();

        if (Array.isArray(data)) {

            if (currentDate) {
                const filtered = data.filter((task) => {
                    const taskDate = new Date(task.date)

                    return (
                        taskDate.toDateString() ===
                        currentDate.toDateString()
                    )
                })

                setTasks(prev => [...prev, ...filtered])
            }

            return
        }

        if (currentDate) {
            const taskDate = new Date(data.date)

            const sameDay =
                taskDate.toDateString() === currentDate.toDateString()

            if (sameDay) {
                setTasks(prev => [...prev, data])
            }
        }
    }

    const handleDeleteTask = async (id: string) => {
        handle(`${BASE_URL}/delete/${id}`, {
            method: "DELETE",
        })
        setTasks(prev => prev.filter(task => task._id !== id))
    }

    //Falta hacer que se mantenga el order
    const reOrderTasks = async (tasks: { id: string, order: number }[]) => {

        handle(`${BASE_URL}/reorder`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tasks }),
        })
    }

    const addSubTask = async (id: string) => {
        const newSubTask = await handle(`${BASE_URL}/addSubTask/${id}`, {
            method: "POST"
        })

        if (!newSubTask) return

        setTasks(prev =>
            prev.map(task =>
                task._id === id
                    ? {
                        ...task,
                        subTasks: [...(task.subTasks || []), newSubTask]
                    }
                    : task
            )
        )
    }

    const updateSubTask = async (taskId: string, subTaskId: string, taskDate: Date | string, updates: Partial<TaskItem>) => {
        const blockedFields = ["status", "completed"]

        const filteredUpdates = isToday(taskDate)
            ? updates
            : Object.fromEntries(
                Object.entries(updates).filter(
                    ([key]) => !blockedFields.includes(key)
                )
            )
        if (Object.keys(filteredUpdates).length === 0) return


        setTasks(prev =>
            prev.map(task => {
                if (task._id !== taskId) return task

                return {
                    ...task,
                    subTasks: task.subTasks.map(sub =>
                        sub._id === subTaskId
                            ? { ...sub, ...filteredUpdates }
                            : sub
                    )
                }
            })
        )

        handle(`${BASE_URL}/updateSubTask/${taskId}/${subTaskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updates)
        })
    }

    const deleteSubTask = async (taskId: string, subTaskId: string) => {
        setTasks(prev =>
            prev.map(task => {
                if (task._id !== taskId) return task

                return {
                    ...task,
                    subTasks: task.subTasks.filter(
                        sub => sub._id !== subTaskId
                    )
                }
            })
        )
        handle(`${BASE_URL}/deleteSubTask/${taskId}/${subTaskId}`, {
            method: "DELETE"
        })
    }

    const duplicateTask = async (id: string) => {
        const duplicatedTask = await handle(`${BASE_URL}/duplicateTask/${id}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        })

        setTasks(prev => [...prev, duplicatedTask])
    }

    const saveAutomation = async (data: {
        taskId: string,
        daysOfWeek: number[],
        startDate: string,
        endDate: string,
        time: string
    }) => {

        const res = await apiClient("/api/automation", {
            method: "POST",
            body: JSON.stringify(data)
        });

        const automation = await res.json();

        setTasks(prev =>
            prev.map(t =>
                t._id === data.taskId
                    ? { ...t, hasAutomation: true }
                    : t
            )
        );

        return automation
    }

    const deleteAutomation = async (taskId: string) => {

        const res = await apiClient(`/api/automation/${taskId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            console.log(await res.text());
            return;
        }

        setTasks(prev =>
            prev.map(t =>
                t._id === taskId
                    ? { ...t, hasAutomation: false }
                    : t
            )
        );
    };

    const deleteAllTasksByUser = async () => {
        handle(`${BASE_URL}/deleteAllTasksByUser`, {
            method: "DELETE"
        })
        setTasks([]);
    }

    return {
        toggleCompleted,
        changeDificult,
        changeStatus,
        changeAtribute,
        changeName,
        saveTime,
        handleAddTask,
        handleDeleteTask,
        addSubTask,
        updateSubTask,
        deleteSubTask,
        duplicateTask,
        reOrderTasks,
        saveAutomation,
        deleteAutomation,
        deleteAllTasksByUser,
    }
}