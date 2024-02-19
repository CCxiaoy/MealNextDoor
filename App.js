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
      <Text style={styles.line}>
        <Text style={styles.title}>当前 </Text> 
        <Text style={styles.content}>{year}/{month}/{day} 17:54</Text>
      </Text>
      <Text style={{...styles.title, ...styles.line}}>计划-下一顿</Text>
      <View style={styles.line}>{(() => {
        const now = date.getHours();
        if (now < 10) {
          return mealLists.breakfast.length > 0 ? mealLists.breakfast.map((meal, i) => {
            return <Text key={meal.id} style={styles.listItem}>{(i+1) + ". " +meal.name}</Text>
          }) : <Text style={styles.listItem}>还没想好哦</Text>
        } else if (now < 14) {
          return mealLists.lunch.length > 0 ? mealLists.lunch.map((meal, i) => {
            return <Text key={meal.id} style={styles.listItem}>{(i+1) + ". " +meal.name}</Text>
          }) : <Text style={styles.listItem}>还没想好哦</Text>
        } else {
          return mealLists.dinner.length > 0 ? mealLists.dinner.map((meal, i) => {
            return <Text key={meal.id} style={styles.listItem}>{(i+1) + ". " +meal.name}</Text>
          }) : <Text style={styles.listItem}>还没想好哦</Text>
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
    padding: 16,
  },
  line: {
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  content: {
    fontSize: 16,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 8,
  }
});
