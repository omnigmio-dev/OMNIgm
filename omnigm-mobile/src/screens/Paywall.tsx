import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { getOfferings, purchaseMonthly, restore, initPurchases, isPro } from '../lib/iap';

export default function Paywall({ onUnlock }: { onUnlock: () => void }) {
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState('$4.99');

  useEffect(() => {
    (async () => {
      await initPurchases();
      const offerings = await getOfferings();
      const pkg = offerings?.[0]?.availablePackages?.[0];
      if (pkg?.product?.priceString) setPrice(pkg.product.priceString);
      const pro = await isPro();
      if (pro) onUnlock();
      setLoading(false);
    })();
  }, [onUnlock]);

  if (loading) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading...</Text>
      </View>
    );
  }

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const ok = await purchaseMonthly();
      if (ok) onUnlock();
      else Alert.alert('Purchase failed', 'Try again.');
    } catch (e:any) {
      Alert.alert('Error', e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    const ok = await restore();
    if (ok) onUnlock();
    else Alert.alert('No purchases found');
    setLoading(false);
  };

  return (
    <View style={{ flex:1, padding:24, gap:12, justifyContent:'center' }}>
      <Text style={{ fontSize:28, fontWeight:'800', textAlign:'center' }}>OMNIgm Pro</Text>
      <Text style={{ textAlign:'center', color:'#555', marginVertical:6 }}>
        Unlock lineup advice, trade analyzer, boom/bust radar & more.
      </Text>

      <Pressable onPress={handleSubscribe} style={{ backgroundColor:'#2563eb', padding:14, borderRadius:12 }}>
        <Text style={{ color:'white', textAlign:'center', fontWeight:'700' }}>
          Start Pro • {price}/mo
        </Text>
      </Pressable>

      <Pressable onPress={handleRestore} style={{ padding:10 }}>
        <Text style={{ textAlign:'center', color:'#2563eb' }}>
          Restore Purchases
        </Text>
      </Pressable>
    </View>
  );
}
