import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const FavoritesContext = createContext();

const FAVORITES_STORAGE_KEY = '@favorites_product';

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = async (countryCode) => {
    try {
      const newFavorites = [...favorites, countryCode];
      setFavorites(newFavorites);
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(newFavorites)
      );
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (countryCode) => {
    try {
      const newFavorites = favorites.filter((code) => code !== countryCode);
      setFavorites(newFavorites);
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(newFavorites)
      );
      console.log("dfgsdds",newFavorites);
      
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  };

  const toggleFavorite = async (countryCode) => {
    if (isFavorite(countryCode)) {
      await removeFavorite(countryCode);
    } else {
      await addFavorite(countryCode);
    }
  };

  const isFavorite = (countryCode) => {
    return favorites.includes(countryCode);
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    isLoading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};

