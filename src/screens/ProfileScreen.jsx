import React from 'react';
import { View, Text, ScrollView, Image, Dimensions, StyleSheet, SafeAreaView } from 'react-native';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ data }) {
  const dashboard = data?.dashboard;
  const primaryColor = dashboard?.color?.dynamic_color || "#BD0B75";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{data?.user?.name}</Text>
        </View>

        {/* Carousel */}
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {dashboard?.carousel?.map((url, index) => (
            <Image 
              key={index} 
              source={{ uri: url }} 
              style={styles.banner} 
            />
          ))}
        </ScrollView>

        {/* Amount Card */}
        <View style={[styles.amountCard, { backgroundColor: primaryColor }]}>
          <Text style={styles.cardLabel}>Total Amount</Text>
          <Text style={styles.cardValue}>₹{dashboard?.amount?.Total}</Text>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View>
              <Text style={styles.subLabel}>Paid</Text>
              <Text style={styles.subValue}>₹{dashboard?.amount?.Paid}</Text>
            </View>
            <View style={styles.alignEnd}>
              <Text style={styles.subLabel}>Due</Text>
              <Text style={[styles.subValue, { color: '#FFCDD2' }]}>₹{dashboard?.amount?.due}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { padding: 20 },
  welcomeText: { color: '#9E9E9E', fontSize: 14 },
  nameText: { fontSize: 24, fontWeight: 'bold', color: '#212121' },
  banner: { width: width - 40, height: 180, borderRadius: 20, marginHorizontal: 20 },
  amountCard: { margin: 20, padding: 25, borderRadius: 30, elevation: 5 },
  cardLabel: { color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  cardValue: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginTop: 5 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  subLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  subValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  alignEnd: { alignItems: 'flex-end' }
});