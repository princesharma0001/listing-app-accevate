import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation, data }) {
  const bannerFlatListRef = useRef < FlatList > null;
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const dashboard = data?.dashboard;
  const primaryColor = dashboard?.color?.dynamic_color || '#e5e5e5';
  const [dashboards, setDashboard] = useState([]);
  const [banner, setBanners] = useState([]);
  console.log("adfsgsa",banner);
  const [refreshing,setRefreshing] = useState(null)
  const [users, setUsers] = useState({});

  console.log('asfgsgsf', dashboards);
  console.log('usersusers', users);

  const banners = [
    {
      id: 1,
      imageUrl: 'https://aapsuj.accevate.co/flutter-api/img/banner-1.png',
    },
    {
      id: 2,
      imageUrl: 'https://aapsuj.accevate.co/flutter-api/img/banner-2.png',
    },
  ];

  const fetchDashboard = async () => {
    try {
      // Retrieve token from storage (CLI version)
      const token = await AsyncStorage.getItem('acceToken');

      const response = await axios.post(
        'https://aapsuj.accevate.co/flutter-api/dashboard.php',
        {}, // 1. Empty body required to reach the headers argument
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // 2. Bearer token from Postman
          },
        },
      );

      if (response.data.status) {
        console.log('Dashboard Data:', response.data);
        setDashboard(response.data?.dashboard);
        setUsers(response.data?.user);
        // Inside your API success block
        if (response.data.status) {
          const apiCarousel = response.data.dashboard.carousel;

          // Convert ["url1", "url2"] to [{id: 0, imageUrl: "url1"}, ...]
          const formattedBanners = apiCarousel.map((url, index) => ({
            id: index,
            imageUrl: url,
          }));

          setBanners(formattedBanners);
        }

        // Process your carousel, student, and amount data here
      }
    } catch (error) {
      console.error('Dashboard Error:', error.response?.data || error.message);
      // Use an Alert or custom toast for error feedback
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const logoutHandler = async () => {
    await AsyncStorage.removeItem('acceToken');
    navigation.navigate('login');
  };

  const onBannerScroll = (event: any) => {
    if (banners.length === 0) return;
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index >= 0 && index < banners.length) {
      setCurrentBannerIndex(index);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchDashboard(); // Re-fetch all data
    setRefreshing(false);
  }, []);


 

  return (
    <ScrollView style={[
      styles.container,
      { backgroundColor: dashboards?.color?.dynamic_color ?? '#BD0B75' },
    ]}
    
  refreshControl={
    <RefreshControl
      refreshing={refreshing} 
      onRefresh={onRefresh} 
      tintColor="#fff" // For iOS
      colors={[dashboards?.color?.dynamic_color ?? '#BD0B75']} // For Android
    />
  }
    >

   
    <View
      style={[
        styles.container,
        { backgroundColor: dashboards?.color?.dynamic_color ?? '#BD0B75' },
      ]}
    >
      <Text style={styles.title}>Dashboard Screen</Text>
      <View style={styles.card}>
        <View>
          <Text style={{ fontWeight: 500 }}>Mobile number</Text>
          <Text>{users?.mobile ?? 'N/A'}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: 500 }}>User Name</Text>
          <Text>{users?.name ?? 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.bannerContainer}>
        <FlatList
          // ref={bannerFlatListRef}
          data={banner}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{paddingLeft:20}}
          onMomentumScrollEnd={onBannerScroll}
          onScrollToIndexFailed={info => {
            // Handle scroll to index failure
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              bannerFlatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
          getItemLayout={(data, index) => ({
            length: SCREEN_WIDTH - 40,
            offset: (SCREEN_WIDTH - 40) * index,
            index,
          })}
          renderItem={({ item }) => (
            <View style={styles.bannerSlide}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            </View>
          )}
        />
        <View style={[styles.amountCard, { backgroundColor: primaryColor }]}>
          <Text style={styles.cardLabel}>Total Amount</Text>
          <Text style={styles.cardValue}>₹{dashboards?.amount?.Total}</Text>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View>
              <Text style={styles.subLabel}>Paid</Text>
              <Text style={styles.subValue}>₹{dashboards?.amount?.Paid}</Text>
            </View>
            <View style={styles.alignEnd}>
              <Text style={styles.subLabel}>Due</Text>
              <Text style={[styles.subValue, { color: '#000' }]}>
                ₹{dashboards?.amount?.due}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={logoutHandler}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
          marginTop: 20,
        }}
      >
        <AntDesign name="logout" size={27} color={'red'} />
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  categoryContent: {
    flex: 1,
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  statusText: {
    marginTop: 6,
    fontSize: 12,
    color: '#6DCDF7',
    fontWeight: '600',
  },
  header: { padding: 20 },
  welcomeText: { color: '#9E9E9E', fontSize: 14 },
  nameText: { fontSize: 24, fontWeight: 'bold', color: '#212121' },
  banner: {
    width: width - 40,
    height: 180,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  amountCard: { margin: 20, padding: 25, borderRadius: 20, elevation: 5 },
  cardLabel: { color: '#000', fontWeight: '600' },
  cardValue: { color: '#000', fontSize: 32, fontWeight: 'bold', marginTop: 5 },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 20,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  subLabel: { color: 'rgba(0, 0, 0, 0.7)', fontSize: 12 },
  subValue: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  alignEnd: { alignItems: 'flex-end' },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    paddingVertical: 30,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 15,
    backgroundColor:'#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  bannerContainer: {
    marginBottom: 24,
    marginTop: 8,
  },
  bannerSlide: {
    width: SCREEN_WIDTH - 40,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 20,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  bannerDescription: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  bannerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  bannerIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D0D0D0',
    marginHorizontal: 4,
  },
});
