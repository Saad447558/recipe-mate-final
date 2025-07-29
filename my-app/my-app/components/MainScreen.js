import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,Alert} from 'react-native';
import { useAuth } from './AuthContext';
import RecipeCard from './RecipeCard';
import RecipeDetail from './RecipeDetail';
import AddRecipeScreen from './AddRecipeScreen';
import RecipeService from './RecipeService';
import { localRecipes } from '../data/localRecipes';

const MainScreen = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [userRecipes, setUserRecipes] = useState([]);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState([]);

  useEffect(() => {
    const unsubscribeRecipes = RecipeService.subscribeToUserRecipes((recipes) => {
      setUserRecipes(recipes);
    });

    const unsubscribeFavorites = RecipeService.subscribeToUserFavorites((favoriteIds) => {
      setFavoriteRecipeIds(favoriteIds);
    });

    return () => {
      unsubscribeRecipes();
      unsubscribeFavorites();
      RecipeService.cleanup();
    };
  }, []);

  const handleAddRecipe = async (recipe) => {
    try {
      await RecipeService.addRecipe(recipe);
      setShowAddRecipe(false);
      Alert.alert('Success', 'Recipe added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add recipe. Please try again.');
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await RecipeService.deleteRecipe(recipeId);
              Alert.alert('Success', 'Recipe deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete recipe. Please try again.');
            }
          }
        }
      ]
    );
  };
  const handleToggleFavorite = async (recipeId, isFavorite) => {
    try {
      await RecipeService.toggleFavorite(recipeId, isFavorite);
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorite. Please try again.');
    }
  };
  const getAllRecipes = () => {
    return [...localRecipes, ...userRecipes];
  };
  const getFilteredRecipes = () => {
    let recipes = [];
    switch (activeTab) {
      case 'all':
        recipes = getAllRecipes();
        break;
      case 'my':
        recipes = userRecipes;
        break;
      case 'favorites':
        recipes = getAllRecipes().filter(recipe => 
          favoriteRecipeIds.includes(recipe.id)
        );
        break;
      default:
        recipes = getAllRecipes();
    }
    if (searchQuery.trim()) {
      recipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return recipes;
  };
  const isRecipeFavorite = (recipeId) => {
    return favoriteRecipeIds.includes(recipeId);
  };
  if (selectedRecipe) {
    return (
      <RecipeDetail 
        recipe={selectedRecipe} 
        onBack={() => setSelectedRecipe(null)}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isRecipeFavorite(selectedRecipe.id)}
      />
    );
  }

  if (showAddRecipe) {
    return (
      <AddRecipeScreen 
        onSave={handleAddRecipe}
        onCancel={() => setShowAddRecipe(false)}
      />
    );
  }

  const filteredRecipes = getFilteredRecipes();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recipe Mate</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All Recipes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my' && styles.activeTab]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
            My Recipes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
            My Favorites
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recipe List */}
      <ScrollView style={styles.recipeList} showsVerticalScrollIndicator={false}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onPress={() => setSelectedRecipe(recipe)}
              onDelete={handleDeleteRecipe}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isRecipeFavorite(recipe.id)}
              showDeleteButton={activeTab === 'my' && recipe.isUserRecipe}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {activeTab === 'my' 
                ? 'No recipes added yet. Tap the + button to add your first recipe!'
                : activeTab === 'favorites'
                ? 'No favorite recipes yet. Tap the heart icon on any recipe to add it to favorites!'
                : 'No recipes found matching your search.'}
            </Text>
          </View>
        )}
      </ScrollView>
      {/* Add Recipe Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddRecipe(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#d63031',
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  searchInput: {
    backgroundColor: '#f1f2f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#00b894',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#636e72',
  },
  activeTabText: {
    color: 'white',
  },
  recipeList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
    lineHeight: 24,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00b894',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MainScreen;

