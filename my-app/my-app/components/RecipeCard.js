import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const RecipeCard = ({ recipe, onPress, onDelete, onToggleFavorite, isFavorite, showDeleteButton = false }) => {
  const handleFavoritePress = (e) => {
    e.stopPropagation();
    onToggleFavorite(recipe.id, !isFavorite);
  };

  const handleDeletePress = (e) => {
    e.stopPropagation();
    onDelete(recipe.id);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        source={recipe.image} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.overlay}>
        <View style={styles.topRow}>
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={handleFavoritePress}
          >
            <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteActive]}>
              {isFavorite ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
          
          {showDeleteButton && (
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={handleDeletePress}
            >
              <Text style={styles.deleteIcon}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>⏱</Text>
            <Text style={styles.detailText}>{recipe.cookTime}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>👥</Text>
            <Text style={styles.detailText}>{recipe.servings}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📊</Text>
            <Text style={styles.detailText}>{recipe.difficulty}</Text>
          </View>
        </View>
        
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{recipe.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  favoriteButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 20,
    color: '#ccc',
  },
  favoriteActive: {
    color: '#e74c3c',
  },
  deleteButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#636e72',
  },
  categoryContainer: {
    alignSelf: 'flex-start',
  },
  category: {
    backgroundColor: '#00b894',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default RecipeCard;

