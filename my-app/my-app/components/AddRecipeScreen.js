import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert,
  Image,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
const AddRecipeScreen = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [category, setCategory] = useState('Main Course');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    try {
      // Check if we're on web platform
      if (Platform.OS === 'web') {
        // Create a hidden file input element
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        
        // Add the input to the document
        document.body.appendChild(input);
        
        // Set up the change event handler
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
              Alert.alert('Error', 'Image size should be less than 5MB');
              document.body.removeChild(input);
              return;
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
              Alert.alert('Error', 'Please select a valid image file');
              document.body.removeChild(input);
              return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
              setImage(e.target.result);
              Alert.alert('Success', 'Image selected successfully!');
            };
            reader.onerror = () => {
              Alert.alert('Error', 'Failed to read the image file');
            };
            reader.readAsDataURL(file);
          }
          // Clean up
          document.body.removeChild(input);
        };
        
        // Trigger the file picker
        input.click();
        return;
      }

      // For mobile platforms
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. You can still save the recipe without an image.');
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const updateInstruction = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const removeInstruction = (index) => {
    if (instructions.length > 1) {
      const newInstructions = instructions.filter((_, i) => i !== index);
      setInstructions(newInstructions);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a recipe title');
      return;
    }

    if (!cookTime.trim()) {
      Alert.alert('Error', 'Please enter cook time');
      return;
    }

    if (!servings.trim()) {
      Alert.alert('Error', 'Please enter number of servings');
      return;
    }

    const validIngredients = ingredients.filter(ing => ing.trim());
    const validInstructions = instructions.filter(inst => inst.trim());

    if (validIngredients.length === 0) {
      Alert.alert('Error', 'Please add at least one ingredient');
      return;
    }

    if (validInstructions.length === 0) {
      Alert.alert('Error', 'Please add at least one instruction');
      return;
    }

    const recipe = {
      title: title.trim(),
      cookTime: cookTime.trim(),
      servings: servings.trim(),
      difficulty,
      category,
      ingredients: validIngredients,
      instructions: validInstructions,
      image: image || require('../assets/recipes/beginner_recipes.png'), // Default image if none selected
      isUserRecipe: true
    };

    onSave(recipe);
  };

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const categories = ['Breakfast', 'Main Course', 'Dessert', 'Salad', 'Soup'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Recipe</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.selectedImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>Add Photo</Text>
                <Text style={styles.imagePlaceholderSubtext}>Click to select image</Text>
              </View>
            )}
          </TouchableOpacity>
          {image && (
            <TouchableOpacity 
              style={styles.removeImageButton} 
              onPress={() => setImage(null)}
            >
              <Text style={styles.removeImageText}>Remove Image</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Recipe Title"
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Cook Time (e.g., 30 minutes)"
              value={cookTime}
              onChangeText={setCookTime}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Servings"
              value={servings}
              onChangeText={setServings}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Difficulty</Text>
              <View style={styles.pickerContainer}>
                {difficulties.map((diff) => (
                  <TouchableOpacity
                    key={diff}
                    style={[
                      styles.pickerOption,
                      difficulty === diff && styles.pickerOptionSelected
                    ]}
                    onPress={() => setDifficulty(diff)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      difficulty === diff && styles.pickerOptionTextSelected
                    ]}>
                      {diff}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.pickerOption,
                      category === cat && styles.pickerOptionSelected
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      category === cat && styles.pickerOptionTextSelected
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <TouchableOpacity onPress={addIngredient} style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {ingredients.map((ingredient, index) => (
            <View key={index} style={styles.listItemContainer}>
              <TextInput
                style={[styles.input, styles.listInput]}
                placeholder={`Ingredient ${index + 1}`}
                value={ingredient}
                onChangeText={(value) => updateIngredient(index, value)}
              />
              {ingredients.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeIngredient(index)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <TouchableOpacity onPress={addInstruction} style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {instructions.map((instruction, index) => (
            <View key={index} style={styles.listItemContainer}>
              <TextInput
                style={[styles.input, styles.listInput]}
                placeholder={`Step ${index + 1}`}
                value={instruction}
                onChangeText={(value) => updateInstruction(index, value)}
                multiline
              />
              {instructions.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeInstruction(index)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelText: {
    color: '#6c757d',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#00b894',
    borderRadius: 8,
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageButton: {
    width: 200,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00b894',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    color: '#00b894',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePlaceholderSubtext: {
    color: '#6c757d',
    fontSize: 12,
    marginTop: 4,
  },
  removeImageButton: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#d63031',
    borderRadius: 6,
  },
  removeImageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  addButton: {
    backgroundColor: '#00b894',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pickerOption: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  pickerOptionSelected: {
    backgroundColor: '#00b894',
    borderColor: '#00b894',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#2d3436',
  },
  pickerOptionTextSelected: {
    color: 'white',
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  removeButton: {
    backgroundColor: '#d63031',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddRecipeScreen;

