import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const [mealLists, setMealLists] = useState({
    breakfast: [], 
    lunch: [],
    dinner: [],
  })

  const mealListUrl = `${process.env.EXPO_PUBLIC_API_URL}/api/allmeallist`;
  
  const getAllMealListsFromApi = async () => {
    try {
      const response = await fetch(mealListUrl);
      const json = await response.json();
      console.log(json);
      setMealLists(json);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getAllMealListsFromApi();
  }, []);

  return (
    <View style={styles.container}>
      <Text>当前 {year}/{month}/{day} 17:54</Text>
      <Text>计划-下一顿</Text>
      <View>{(() => {
        const now = date.getHours();
        if (now < 10) {
          return mealLists.breakfast.length > 0 ? mealLists.breakfast.map(meal => {
            return <Text key={meal.id}>{meal.name}</Text>
          }) : <Text>还没想好哦</Text>
        } else if (now < 14) {
          return mealLists.lunch.length > 0 ? mealLists.lunch.map(meal => {
            return <Text key={meal.id}>{meal.name}</Text>
          }) : <Text>还没想好哦</Text>
        } else {
          return mealLists.dinner.length > 0 ? mealLists.dinner.map(meal => {
            return <Text key={meal.id}>{meal.name}</Text>
          }) : <Text>还没想好哦</Text>
        }
      })()}</View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
