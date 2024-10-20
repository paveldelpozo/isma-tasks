import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTasksStore = defineStore('tasksStore', () => {
    const baseUrl = 'http://api_tasks_crud.test/api'
    const error = ref<any>(null)
    const loading  = ref(false)
    const tasks = ref([])
    const totalTasks = ref(0)
    const doneTasks = ref(0)
    const from = ref(0)
    const to = ref(0)
    const search = ref('')
    const filter = ref<'all'|'completed'|'pending'>('all')
    const page = ref(1)
    const firstPage = ref(1)
    const lastPage = ref(1)
    const size = ref(10)
    const sort = ref('-created_at')

    const filterToCompletedParam = (filter: 'all'|'completed'|'pending') => {
        if (filter === 'all') return ''
        if (filter === 'completed') return true
        if (filter === 'pending') return false
        return ''
    }

    const getTasks = async () => {
        error.value = null
        loading.value = true
        try {
            const response = await fetch(`${baseUrl}/tasks?search=${search.value}&completed=${filterToCompletedParam(filter.value)}&sort=${sort.value}&page=${page.value}&size=${size.value}`)
            const data = await response.json()
            tasks.value = data.data
            page.value = data.current_page
            totalTasks.value = data.total
            from.value = data.from
            to.value = data.to
            firstPage.value = data.first_page
            lastPage.value = data.last_page
        } catch (e) {
            console.error(e)
            error.value = e
        }
        loading.value = false
    }

    const getDoneTasks = async () => {
        error.value = null
        loading.value = true
        try {
            const response = await fetch(`${baseUrl}/tasks?search=${search.value}&completed=${filterToCompletedParam('completed')}&size=1`)
            const data = await response.json()
            doneTasks.value = data.total
        } catch (e) {
            console.error(e)
            error.value = e
        }
        loading.value = false
    }

    const addTask = async (description: string) => {
        error.value = null
        loading.value = true
        try {
            await fetch(`${baseUrl}/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    description,
                }),
            })
        } catch (e) {
            console.error(e)
            error.value = e
        }
        loading.value = false
    }

    const updateTask = async (id: number, description: string, completed: boolean) => {
        error.value = null
        loading.value = true
        try {
            await fetch(`${baseUrl}/tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    description,
                    completed,
                }),
            })
        } catch (e) {
            console.error(e)
            error.value = e
        }
        loading.value = false
    }

    const deleteTask = async (id: number) => {
        error.value = null
        loading.value = true
        try {
            await fetch(`${baseUrl}/tasks/${id}`, {
                method: "DELETE"
            })
        } catch (e) {
            console.error(e)
            error.value = e
        }
        loading.value = false
    }

    const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Los meses en JavaScript empiezan desde 0
        const year = date.getUTCFullYear();
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }

    return {
        loading,
        tasks,
        totalTasks,
        doneTasks,
        search,
        filter,
        page,
        size,
        sort,
        from,
        to,
        firstPage,
        lastPage,
        getTasks,
        getDoneTasks,
        addTask,
        updateTask,
        deleteTask,
        formatDate,
    }
})
