# Recipe Mate - React Native Expo App

A complete recipe management system built with React Native Expo and Firebase, featuring user authentication, local recipe storage, real-time database integration, and favorite recipe functionality.

## Features

### ✅ Authentication System
- **Email/Password Login**: Secure user authentication with Firebase Auth
- **User Registration**: New user signup with email validation
- **Session Management**: Persistent login state across app sessions

### ✅ Recipe Management
- **11 Pre-built Recipes**: Local recipes with images, ingredients, and instructions
- **Add Custom Recipes**: Users can create their own recipes with photos
- **Delete Recipes**: Remove user-created recipes
- **Recipe Categories**: Breakfast, Main Course, Dessert, Salad, Soup
- **Difficulty Levels**: Easy, Medium, Hard

### ✅ Favorite Recipe System
- **Mark as Favorite**: Users can favorite any recipe (local or custom)
- **My Favorites Tab**: Dedicated section to view all favorite recipes
- **Heart Icon**: Visual indicator for favorite status
- **Real-time Sync**: Favorite status syncs across devices via Firebase

### ✅ User Interface
- **Modern Design**: Clean, mobile-friendly interface
- **Recipe Cards**: Beautiful cards displaying recipe information with favorite hearts
- **Detailed View**: Full recipe details with ingredients and step-by-step instructions
- **Search Functionality**: Search recipes by title or category
- **Triple Tab Navigation**: Switch between "All Recipes", "My Recipes", and "My Favorites"

### ✅ Firebase Integration
- **Real-time Database**: User recipes and favorites stored in Firebase Realtime Database
- **User-specific Data**: Each user's recipes and favorites are stored separately
- **Real-time Updates**: Changes sync instantly across devices

### ✅ Image Handling
- **Local Images**: Pre-built recipes use local images for fast loading
- **User Photos**: Users can add photos to their custom recipes
- **Image Picker**: Easy photo selection from device gallery

## Project Structure

```
my-app/
├── App.js                      # Main app component
├── firebaseConfig.js           # Firebase configuration
├── app/
│   ├── _layout.tsx            # App layout configuration
│   └── index.tsx              # Entry point
├── components/
│   ├── AuthContext.js         # Authentication context provider
│   ├── AuthScreen.js          # Authentication screen wrapper
│   ├── LoginScreen.js         # Login interface
│   ├── SignupScreen.js        # Registration interface
│   ├── MainScreen.js          # Main app interface with tabs
│   ├── RecipeCard.js          # Recipe card component with favorite button
│   ├── RecipeDetail.js        # Recipe detail view with favorite toggle
│   ├── AddRecipeScreen.js     # Add recipe interface
│   └── RecipeService.js       # Firebase database operations
├── data/
│   └── localRecipes.js        # Pre-built recipe data
└── assets/
    └── recipes/               # Recipe images
        ├── honey_garlic_chicken.jpg
        ├── pancakes_waffles.jpg
        ├── chicken_pasta_salad.jpg
        └── ... (8 more recipe images)
```

## Pre-built Recipes

The app includes 11 carefully curated recipes:

1. **Honey Garlic Chicken** - 15 min, Easy, Main Course
2. **Classic Pancakes** - 20 min, Easy, Breakfast  
3. **Chicken Pasta Salad** - 25 min, Easy, Salad
4. **Pizza Pasta Salad** - 20 min, Easy, Salad
5. **Chocolate Mousse Cake** - 45 min, Medium, Dessert
6. **One Bowl Chocolate Cake** - 35 min, Easy, Dessert
7. **Vegetable Stir-Fry Soup** - 25 min, Easy, Soup
8. **Beef and Broccoli Stir-Fry** - 20 min, Medium, Main Course
9. **Berry Waffle Breakfast** - 15 min, Easy, Breakfast
10. **Mediterranean Quinoa Salad** - 20 min, Easy, Salad
11. **Easy Beginner Pasta** - 15 min, Easy, Main Course

Each recipe includes:
- High-quality food images
- Detailed ingredient lists
- Step-by-step cooking instructions
- Cook time, servings, and difficulty level
- Category classification
- Favorite functionality

## Firebase Configuration

The app is configured to work with your Firebase project:

- **Database URL**: `https://recipe-mate-b1a23-default-rtdb.firebaseio.com/`
- **API Key**: `AIzaSyAYP1Rva4S1cw-N-3vYI2ifSqdTLY6mpd4`

### Database Structure
```
users/
  {userId}/
    recipes/
      {recipeId}/
        title: "Recipe Name"
        cookTime: "30 minutes"
        servings: "4"
        difficulty: "Easy"
        category: "Main Course"
        ingredients: ["ingredient1", "ingredient2"]
        instructions: ["step1", "step2"]
        image: "image_uri"
        createdAt: timestamp
        updatedAt: timestamp
    favorites/
      {recipeId}/
        recipeId: "recipe_id"
        addedAt: timestamp
```

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install Expo CLI** (if not already installed)
   ```bash
   npm install -g @expo/cli
   ```

3. **Start Development Server**
   ```bash
   npx expo start
   ```

4. **Run on Different Platforms**
   - **Web**: Press `w` in the terminal or visit `http://localhost:8081`
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Android**: Press `a` or scan QR code with Expo Go app

## Dependencies

- **expo**: ~53.0.0
- **react-native**: 0.76.3
- **firebase**: ^11.1.0
- **expo-image-picker**: ~16.0.3
- **expo-router**: ~4.0.14
- **react**: 18.3.1

## Usage Instructions

### For Users:
1. **Sign Up**: Create a new account with email and password
2. **Browse Recipes**: View all 11 pre-built recipes
3. **View Details**: Tap any recipe to see full details
4. **Add to Favorites**: Tap the heart icon on any recipe to favorite it
5. **My Favorites**: Switch to "My Favorites" tab to see only favorited recipes
6. **Add Recipe**: Use the + button to create custom recipes
7. **My Recipes**: Switch to "My Recipes" tab to see only your creations
8. **Search**: Use the search bar to find specific recipes
9. **Delete**: Remove your custom recipes with the delete button

### For Developers:
- All components are modular and reusable
- Firebase operations are centralized in `RecipeService.js`
- Local recipes are stored in `data/localRecipes.js`
- Images are optimized and stored in `assets/recipes/`
- Authentication state is managed globally via React Context
- Favorite functionality is integrated throughout the app

## Testing

The app has been tested with:
- ✅ User registration and login
- ✅ Recipe browsing and search
- ✅ Recipe detail viewing
- ✅ Add recipe functionality
- ✅ Delete recipe functionality
- ✅ Favorite/unfavorite recipes
- ✅ My Favorites tab functionality
- ✅ Firebase database integration
- ✅ Image handling
- ✅ Responsive design

## New Features Added

### Favorite Recipe System
- **Heart Icons**: Added heart icons to all recipe cards and detail views
- **Toggle Functionality**: Users can tap hearts to favorite/unfavorite recipes
- **My Favorites Tab**: New tab showing only favorited recipes
- **Firebase Integration**: Favorites are stored in Firebase and sync across devices
- **Visual Feedback**: Heart icons change color when recipes are favorited
- **Real-time Updates**: Favorite status updates instantly

## Notes

- The app works on web, iOS, and Android platforms
- Images for user recipes are stored as URIs (in production, use Firebase Storage)
- Firebase connection requires proper project configuration
- All pre-built recipes load instantly from local storage
- User recipes and favorites sync in real-time across devices
- Favorite functionality works for both local and user-created recipes

## Support

For any issues or questions, please check the Firebase console and ensure your project configuration is correct.

