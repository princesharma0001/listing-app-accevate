# ListAndSell - Countries App


## Features

✅ **Country List View**
- Display countries with name, flag, and region
- Search countries by name (case-insensitive)
- Filter by region (Africa, Americas, Asia, Europe, Oceania, Antarctic)
- Pull-to-refresh functionality
- Optimized FlatList with React.memo and useCallback

✅ **Country Detail View**
- Detailed information: population, languages, currencies, timezones
- Large flag display
- Favorite toggle

✅ **Favorites**
- Mark/unmark countries as favorites
- Persisted using AsyncStorage
- Accessible from both list and detail screens


   **Android:**
   ```bash
   npm run android
   ```



### State Management

**Context API** is used for:
- **Theme Management**: Centralized theme state with light/dark mode support
- **Favorites**: Global favorites state with AsyncStorage persistence

### Navigation

**React Navigation v7** with:
- **Stack Navigator**: For Countries List → Detail navigation
- **Tab Navigator**: For main app navigation (Countries, Settings)
- Themed navigation headers and tab bars

### Performance Optimizations

1. **React.memo**: Country list items are memoized to prevent unnecessary re-renders
2. **useCallback**: Event handlers are memoized to maintain referential equality
3. **useMemo**: Filtered country list is memoized to avoid recalculation
4. **FlatList Optimizations**:
   - `keyExtractor` for efficient key generation
   - `removeClippedSubviews` for better scroll performance
   - `maxToRenderPerBatch` and `windowSize` tuned for performance
   - `initialNumToRender` set for optimal initial load

### API Integration

- **List View**: Fetches minimal fields (`name`, `flags`, `region`, `cca2`, `cca3`) for performance
- **Detail View**: Fetches full country details when navigating to detail screen
- Error handling with retry functionality
- Loading states for better UX

### Data Persistence

- **AsyncStorage**: Used for:
  - Favorites list (country codes)
  - Theme preference (light/dark)

- **Reusable Components**: 
  - CountryItem component is memoized and reusable
  - DetailRow component for consistent detail display

- **Custom Hooks**: 
  - `useTheme()` for theme access
  - `useFavorites()` for favorites management

## Key Technologies

- **React Native 0.83.1**
- **React Navigation 7**
- **AsyncStorage** for persistence
- **React Native Vector Icons** for icons
- **REST Countries API** for country data

## API Endpoint

The app uses the [REST Countries API](https://restcountries.com/):
- List: `https://restcountries.com/v3.1/all?fields=name,flags,region,cca2,cca3`
- Details: `https://restcountries.com/v3.1/alpha/{code}`

## Development Notes

- The app uses JavaScript (not TypeScript)
- All components are functional components with hooks


**Theme not persisting:**
- Check AsyncStorage permissions
- Verify theme context is properly wrapped


