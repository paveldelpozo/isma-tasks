<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'

const taskStore = useTasksStore()
const {
    loading,
    //error,
    tasks,
    filter,
    search,
    totalTasks,
    page,
    //size,
    //sort,
    from,
    to,
    firstPage,
    lastPage,
} = storeToRefs(taskStore)
const { getTasks, getDoneTasks, addTask, updateTask, deleteTask, formatDate } =
    taskStore

const newTask = ref('')
const showSearch = ref(false)
const searchTimeout = ref(0)
const confirmDeletion = ref(0)

const onAddTask = async () => {
    await addTask(newTask.value)
    refresh()
    newTask.value = ''
}

const onUpdateTask = async (task: any) => {
    await updateTask(task.id, task.description, !task.completed)
    refresh()
}

const onDeleteTask = async (id: number) => {
    if (confirmDeletion.value === 0) {
        confirmDeletion.value = id
    } else {
        await deleteTask(id)
        refresh()
        confirmDeletion.value = 0
    }
}

const refresh = () => {
    getTasks()
    getDoneTasks()
}

watch(search, value => {
    clearTimeout(searchTimeout.value)
    searchTimeout.value = setTimeout(() => {
        refresh()
    }, 500)
})

watch([page, filter], () => {
    refresh()
})

onMounted(async () => {
    refresh()
})
</script>

<template>
    <section class="add-task">
        <form @submit.prevent="onAddTask">
            <div class="field-container">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>checkbox-marked-circle-plus-outline</title>
                        <path
                            d="M14.3 21.7C13.6 21.9 12.8 22 12 22C6.5 22 2 17.5 2 12S6.5 2 12 2C13.3 2 14.6 2.3 15.8 2.7L14.2 4.3C13.5 4.1 12.8 4 12 4C7.6 4 4 7.6 4 12S7.6 20 12 20C12.4 20 12.9 20 13.3 19.9C13.5 20.6 13.9 21.2 14.3 21.7M7.9 10.1L6.5 11.5L11 16L21 6L19.6 4.6L11 13.2L7.9 10.1M18 14V17H15V19H18V22H20V19H23V17H20V14H18Z"
                        />
                    </svg>
                </div>
                <input
                    v-model.trim="newTask"
                    type="text"
                    placeholder="Comprar leche y pan..."
                    required
                    autofocus
                />
                <button type="submit" :disabled="loading">Añadir tarea</button>
            </div>
        </form>
    </section>

    <section class="tasks">
        <main>
            <h3>
                Tareas

                <span class="filter">
                    <button
                        :class="{ selected: filter === 'all' }"
                        @click="filter = 'all'"
                    >
                        Todas
                    </button>
                    <button
                        :class="{ selected: filter === 'pending' }"
                        @click="filter = 'pending'"
                    >
                        Pendientes
                    </button>
                    <button
                        :class="{ selected: filter === 'completed' }"
                        @click="filter = 'completed'"
                    >
                        Completadas
                    </button>
                </span>

                <button type="button" @click="showSearch = !showSearch">
                    Buscar
                </button>
            </h3>

            <div v-if="showSearch" class="search-task">
                <div class="field-container">
                    <div class="icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <title>magnify</title>
                            <path
                                d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
                            />
                        </svg>
                    </div>
                    <input
                        v-model.trim="search"
                        type="search"
                        placeholder="Buscar tareas..."
                        autofocus
                    />
                    <span class="sr-only">Buscar tarea</span>
                </div>
            </div>

            <article
                v-if="search === '' && tasks.length === 0"
                class="no-tasks"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>robot-happy-outline</title>
                    <path
                        d="M10.5 15.5C10.5 15.87 10.4 16.2 10.22 16.5C9.88 15.91 9.24 15.5 8.5 15.5S7.12 15.91 6.78 16.5C6.61 16.2 6.5 15.87 6.5 15.5C6.5 14.4 7.4 13.5 8.5 13.5S10.5 14.4 10.5 15.5M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16M15.5 13.5C14.4 13.5 13.5 14.4 13.5 15.5C13.5 15.87 13.61 16.2 13.78 16.5C14.12 15.91 14.76 15.5 15.5 15.5S16.88 15.91 17.22 16.5C17.4 16.2 17.5 15.87 17.5 15.5C17.5 14.4 16.61 13.5 15.5 13.5Z"
                    />
                </svg>
                <h3>¡Felicidades!</h3>
                <div>No tienes ninguna tarea pendiente.</div>
            </article>

            <article
                v-if="search !== '' && tasks.length === 0"
                class="no-search"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>selection-search</title>
                    <path
                        d="M19.27 18.9C19.7 18.21 19.95 17.38 19.95 16.5C19.95 14 17.95 12 15.46 12S10.96 14 10.96 16.5 12.96 21 15.46 21C16.33 21 17.15 20.75 17.84 20.32L20.96 23.39L22.35 22L19.27 18.9M15.46 19C14.07 19 12.96 17.88 12.96 16.5S14.07 14 15.46 14 17.95 15.12 17.95 16.5 16.84 19 15.46 19M22 14H21.45C21.12 13.19 20.62 12.47 20 11.86V10H22V14M20 4H17V2H20C21.11 2 22 2.9 22 4V7H20V4M14 4H10V2H14V4M4 2H7V4H4V7H2V4C2 2.89 2.9 2 4 2M12 22H10V20C10.5 20.82 11.2 21.5 12 22M4 20H7V22H4C2.9 22 2 21.11 2 20V17H4V20M4 14H2V10H4V14Z"
                    />
                </svg>
                <div>
                    No se ha encontrado ninguna tarea que coincida con la
                    búsqueda.
                </div>
            </article>

            <div v-if="tasks.length > 0" class="tasks-list">
                <article
                    v-for="(task, t) in tasks"
                    :class="[
                        'task',
                        task.completed ? 'completed' : '',
                        t % 2 === 0 ? 'even' : 'odd',
                    ]"
                >
                    <button
                        :class="[
                            'mark-as-done',
                            task.completed ? 'completed' : '',
                        ]"
                        type="button"
                        @click="onUpdateTask(task)"
                    >
                        <svg
                            v-if="!task.completed"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <title>circle-outline</title>
                            <path
                                d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                            />
                        </svg>
                        <svg
                            v-if="task.completed"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <title>checkbox-marked-circle-outline</title>
                            <path
                                d="M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2,4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"
                            />
                        </svg>
                        <span class="sr-only">{{
                            task.completed
                                ? 'Marcar como no completado'
                                : 'Marcar como completado'
                        }}</span>
                    </button>
                    <div class="description">
                        {{ task.description }}
                        <span class="date">{{
                            formatDate(task.updated_at)
                        }}</span>
                    </div>
                    <button
                        class="remove"
                        type="button"
                        @click="onDeleteTask(task.id)"
                    >
                        <svg
                            v-if="confirmDeletion !== task.id"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <title>delete</title>
                            <path
                                d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                            />
                        </svg>
                        <svg
                            v-if="confirmDeletion === task.id"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <title>delete-empty</title>
                            <path
                                d="M20.37,8.91L19.37,10.64L7.24,3.64L8.24,1.91L11.28,3.66L12.64,3.29L16.97,5.79L17.34,7.16L20.37,8.91M6,19V7H11.07L18,11V19A2,2 0 0,1 16,21H8A2,2 0 0,1 6,19Z"
                            />
                        </svg>
                        <span class="sr-only">Borrar tarea</span>
                    </button>
                </article>
            </div>

            <footer>
                <div class="summary">
                    Mostrando resultados del {{ from }} al {{ to }} de un total
                    de {{ totalTasks }} tareas.
                </div>
                <div class="paginator">
                    <button
                        @click="page = firstPage"
                        :disabled="loading || page === 1"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <title>page-first</title>
                            <path
                                d="M18.41,16.59L13.82,12L18.41,7.41L17,6L11,12L17,18L18.41,16.59M6,6H8V18H6V6Z"
                            />
                        </svg>
                        <span class="sr-only">Primera</span>
                    </button>
                    <button
                        @click="page = page - 1"
                        :disabled="loading || page === 1"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <title>chevron-left</title>
                            <path
                                d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
                            />
                        </svg>
                        <span class="sr-only">Anterior</span>
                    </button>
                    <button
                        @click="page = page + 1"
                        :disabled="loading || page === lastPage"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <title>chevron-right</title>
                            <path
                                d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
                            />
                        </svg>
                        <span class="sr-only">Siguiente</span>
                    </button>
                    <button
                        @click="page = lastPage"
                        :disabled="loading || page === lastPage"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <title>page-last</title>
                            <path
                                d="M5.59,7.41L10.18,12L5.59,16.59L7,18L13,12L7,6L5.59,7.41M16,6H18V18H16V6Z"
                            />
                        </svg>
                        <span class="sr-only">Última</span>
                    </button>
                </div>
            </footer>
        </main>
    </section>
</template>
