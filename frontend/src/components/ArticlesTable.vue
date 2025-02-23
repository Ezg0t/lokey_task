<template>
  <q-page>
    <div class="q-mb-md">
      <q-btn
        @click="openAddArticleDialog"
        label="Add article"
        color="primary"
      />
    </div>

    <q-table
      :rows="articles"
      :columns="columns"
      row-key="article_id"
      :pagination="pagination"
    >
      <template v-slot:top-right>
        <q-btn label="Refresh" color="secondary" @click="fetchArticles" />
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            @click="openEditArticleDialog(props.row)"
            icon="edit"
            color="primary"
            flat
          />
          <q-btn
            @click="deleteArticle(props.row)"
            icon="delete"
            color="negative"
            flat
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showAddDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Add new article</div>
          <q-input v-model="articleForm.title" label="Title" outlined />
          <q-input v-model="articleForm.content" label="Content" outlined />
        </q-card-section>
        <q-card-actions>
          <q-btn @click="saveArticle" label="Save" color="primary" />
          <q-btn
            @click="resetFormAndCloseDialog"
            label="Cancel"
            color="secondary"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { defineComponent } from 'vue'; 
import { useQuasar } from 'quasar';
import { Article } from './models';
import { fetchArticles as fetchArticlesApi, 
createArticle as createArticleApi, updateArticle as updateArticleApi, deleteArticle as deleteArticleApi } from '../api/shop';

export default defineComponent({
  setup() {
    const $q = useQuasar();

    const articles = ref<Article[]>([]);
    const columns = ref([
      { name: 'title', label: 'Title', align: 'left', field: 'title' },
      { name: 'content', label: 'Content', align: 'left', field: 'content' },
      { name: 'actions', label: 'Actions', align: 'center', field: 'actions' },
    ]);
    const pagination = ref({ rowsPerPage: 10 });

    const showAddDialog = ref(false);
    const isEditing = ref(false);
    const articleForm = ref({
      article_id: 0,
      title: '',
      content: '',
    });

    const fetchArticles = async () => {
      try {
        const response = await fetchArticlesApi();
        articles.value = response;
      } catch (error) {
        console.error('Error during fetching articcles:', error);
      }
    };

    const openAddArticleDialog = () => {
      isEditing.value = false;
      articleForm.value.title = '';
      articleForm.value.content = '';
      showAddDialog.value = true;
    };

    const openEditArticleDialog = (article: Article) => {
      isEditing.value = true;
      articleForm.value.article_id = article.article_id;
      articleForm.value.title = article.title;
      articleForm.value.content = article.content;
      showAddDialog.value = true;
    };

   const saveArticle = async () => {
  const articleData: Article = {
    article_id: isEditing.value ? articleForm.value.article_id : articles.value.length + 1,
    author_user_id: 1,
    title: articleForm.value.title,
    content: articleForm.value.content,
    created_at: new Date().toISOString(),
    release_date: new Date().toISOString(),
  };

  try {
    if (isEditing.value) {
      const updatedArticle = await updateArticleApi(articleData.article_id, articleData);
      const index = articles.value.findIndex((a) => a.article_id === articleData.article_id);
      if (index !== -1) {
        articles.value[index] = updatedArticle;
      }
      notify('Article edited!', 'positive');
    } else {
      const savedArticle = await createArticleApi(articleData);
      articles.value.push(savedArticle);
      notify('New article saved!', 'positive');
    }
    showAddDialog.value = false;
    articleForm.value.title = '';
    articleForm.value.content = '';
  } catch (error) {
    console.error('Error during saving:', error);
    notify('Error during saving article.', 'negative');
  }
};

    const resetFormAndCloseDialog = () => {
      articleForm.value.title = '';
      articleForm.value.content = '';
      showAddDialog.value = false;
    };

    const deleteArticle = async (article: Article) => {
      try {
        await deleteArticleApi(article.article_id);
        articles.value = articles.value.filter((a) => a.article_id !== article.article_id);
        notify('Article deleted!', 'negative');
      } catch (error) {
        console.error('Error during deleting:', error);
        notify('Error deleting the article', 'negative');
      }
    };

    const notify = (message: string, color: string) => {
      $q.notify({
        message: message,
        color: color,
        position: 'top',
        timeout: 2000,
        actions: [{ label: 'OK', color: 'white' }],
      });
    };

    onMounted(() => {
      fetchArticles();
    });

    return {
      articles,
      columns,
      pagination,
      showAddDialog,
      articleForm,
      fetchArticles,
      openAddArticleDialog,
      openEditArticleDialog,
      saveArticle,
      resetFormAndCloseDialog,
      deleteArticle,
      notify,
    };
  },
});
</script>
