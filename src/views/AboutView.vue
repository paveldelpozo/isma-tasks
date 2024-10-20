<script setup lang="ts">
</script>


<template>
    <section class="about">
        <h1>Made with</h1>

        <span class="relative flex h-16 w-16">
            <svg class="animate-ping absolute inline-flex w-16 h-16 fill-red-500 opacity-75" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>heart</title><path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" /></svg>
            <svg class="relative inline-flex h-16 w-16 fill-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>heart</title><path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" /></svg>
        </span>

        <h3>by</h3>

        <img src="@/assets/logo_paveldelpozo.svg" alt="paveldelpozo" class="logo" />

        <p>con las siguientes tecnologías:</p>

        <div class="logos">
            <a href="https://vuejs.org/" target="_blank">
                <img src="@/assets/vue.svg" alt="Vue" />
                Vue
            </a>
            <a href="https://tailwindcss.com/" target="_blank">
                <img src="@/assets/tailwind.svg" alt="Tailwind" />
                Tailwind
            </a>
        </div>
    </section>
</template>

<style>

</style>
