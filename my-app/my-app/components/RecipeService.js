import { database, auth } from '../firebaseConfig';
import { ref, push, remove, onValue, off, set } from 'firebase/database';

class RecipeService {
  constructor() {
    this.recipesRef = null;
    this.favoritesRef = null;
    this.listeners = [];
  }

  getUserRecipesRef() {
    const user = auth.currentUser;
    if (!user) return null;
    return ref(database, `users/${user.uid}/recipes`);
  }

  getUserFavoritesRef() {
    const user = auth.currentUser;
    if (!user) return null;
    return ref(database, `users/${user.uid}/favorites`);
  }

  async addRecipe(recipe) {
    try {
      const recipesRef = this.getUserRecipesRef();
      if (!recipesRef) throw new Error('User not authenticated');
      const newRecipeRef = push(recipesRef);
      await set(newRecipeRef, {
        ...recipe,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      
      return newRecipeRef.key;
    } catch (error) {
      console.error('Error adding recipe:', error);
      throw error;
    }
  }
  async deleteRecipe(recipeId) {
    try {
      const recipesRef = this.getUserRecipesRef();
      if (!recipesRef) throw new Error('User not authenticated');
      const recipeRef = ref(database, `users/${auth.currentUser.uid}/recipes/${recipeId}`);
      await remove(recipeRef);
      // Remove from favorites if it exists
      const favoriteRef = ref(database, `users/${auth.currentUser.uid}/favorites/${recipeId}`);
      await remove(favoriteRef);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  }
  async toggleFavorite(recipeId, isFavorite) {
    try {
      const favoritesRef = this.getUserFavoritesRef();
      if (!favoritesRef) throw new Error('User not authenticated');
      const favoriteRef = ref(database, `users/${auth.currentUser.uid}/favorites/${recipeId}`);
      if (isFavorite) {
        await set(favoriteRef, {
          recipeId,
          addedAt: Date.now()
        });
      } else {
        await remove(favoriteRef);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }
  subscribeToUserRecipes(callback) {
    const recipesRef = this.getUserRecipesRef();
    if (!recipesRef) return () => {};

    const unsubscribe = onValue(recipesRef, (snapshot) => {
      const data = snapshot.val();
      const recipes = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) : [];
      callback(recipes);
    });

    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  subscribeToUserFavorites(callback) {
    const favoritesRef = this.getUserFavoritesRef();
    if (!favoritesRef) return () => {};

    const unsubscribe = onValue(favoritesRef, (snapshot) => {
      const data = snapshot.val();
      const favoriteIds = data ? Object.keys(data) : [];
      callback(favoriteIds);
    });

    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  cleanup() {
    this.listeners.forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    this.listeners = [];
  }
}

export default new RecipeService();

