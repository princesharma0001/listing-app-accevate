import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  ScrollView,
  RefreshControl,
  Alert,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Recommended for UI icons

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [dashboards, setDashboard] = useState(null);
  const [banner, setBanners] = useState([]);
  const [users, setUsers] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const primaryColor = dashboards?.color?.dynamic_color || '#BD0B75';

  const fetchDashboard = async () => {
    try {
      const token = await AsyncStorage.getItem('acceToken');
      const response = await axios.post(
        'https://aapsuj.accevate.co/flutter-api/dashboard.php',
        {},
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status) {
        setDashboard(response.data?.dashboard);
        setUsers(response.data?.user);
        const formattedBanners = response.data.dashboard.carousel.map((url, index) => ({
          id: index,
          imageUrl: url,
        }));
        setBanners(formattedBanners);
      }
    } catch (error) {
      console.error('Dashboard Error:', error.message);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboard();
    setRefreshing(false);
  }, []);

  return (
    <View style={[styles.mainContainer,{ backgroundColor: primaryColor}]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      {/* 1. Header Area */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.greetingText}>Hello,</Text>
          <Text style={styles.nameHeader}>{users?.name || 'User'}</Text>
        </View>
        <TouchableOpacity style={[styles.profileCircle, { borderColor: primaryColor }]}>
           <AntDesign name="user" size={24} color={primaryColor} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} colors={[primaryColor]} />
        }
      >
        {/* 2. Modern Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={banner}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.bannerWrapper}>
                <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} resizeMode="cover" />
              </View>
            )}
          />
        </View>

        {/* 3. User Info Card */}
        <View style={styles.infoSection}>
          <View style={styles.glassCard}>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{users?.mobile || 'N/A'}</Text>
            </View>
            <View style={[styles.verticalDivider, { backgroundColor: primaryColor + '40' }]} />
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{users?.userid || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* 4. Financial Summary Card */}
        <View style={styles.financialSection}>
          <View style={[styles.mainAmountCard, { backgroundColor: primaryColor }]}>
            <Text style={styles.collectionLabel}>Total amount</Text>
            <Text style={styles.collectionValue}>₹{dashboards?.amount?.Total?.toLocaleString() || '0'}</Text>
            
            <View style={styles.cardFooter}>
              <View style={styles.footerItem}>
                <Text style={styles.footerLabel}>Paid</Text>
                <Text style={styles.footerValue}>₹{dashboards?.amount?.Paid?.toLocaleString()}</Text>
              </View>
              <View style={styles.footerItem}>
                <Text style={styles.footerLabel}>Due</Text>
                <Text style={[styles.footerValue, { color: '#FFD700' }]}>₹{dashboards?.amount?.due?.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 5. Logout Action */}
        <TouchableOpacity onPress={() => Alert.alert("Logout", "Are you sure?", [{text: "Cancel"}, {text: "Logout", onPress: () => navigation.navigate('login')}])} style={styles.logoutBtn}>
          <AntDesign name="logout" size={22} color="red" />
          <Text style={styles.logoutText}>Logout Session</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  headerContainer: { flexDirection: 'row',marginTop:20, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
  greetingText: { fontSize: 14, color: '#999', fontWeight: '500' },
  nameHeader: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  profileCircle: { width: 48, height: 48, borderRadius: 24, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  carouselContainer: { marginTop: 15 },
  bannerWrapper: { width: SCREEN_WIDTH, paddingHorizontal: 20 },
  bannerImage: { width: '100%', height: 180, borderRadius: 24 },
  infoSection: { paddingHorizontal: 20, marginTop: 25 },
  glassCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, padding: 18, alignItems: 'center', justifyContent: 'space-around', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 15, fontWeight: '600', color: '#333' },
  verticalDivider: { width: 1, height: 25 },
  financialSection: { paddingHorizontal: 20, marginTop: 20 },
  mainAmountCard: { padding: 25, borderRadius: 32, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  collectionLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '700', uppercase: true, letterSpacing: 1 },
  collectionValue: { color: '#fff', fontSize: 36, fontWeight: '800', marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' },
  footerLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' },
  footerValue: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 2 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, gap: 10 },
  logoutText: { color: 'red', fontWeight: '700', fontSize: 16 }
});