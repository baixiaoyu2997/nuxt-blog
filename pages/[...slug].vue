<template>
  <div class="prose">
    <nav>
      <!-- 所有md的导航 -->
      <ContentNavigation v-slot="{ navigation }">
        <ul>
          <li v-for="link of navigation" :key="link._path">
            <NuxtLink :to="link._path">{{ link.title }}</NuxtLink>
          </li>
        </ul>
      </ContentNavigation>
    </nav>
    <div class="content__wrap">
      <ContentDoc class="markdown-body"></ContentDoc>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.content__wrap {
  display: flex;
}
</style>
