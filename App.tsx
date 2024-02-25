/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
// import API_URL from @env and rename it to baseUrl
import {API_URL as baseUrl} from '@env';


function App(): React.JSX.Element {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const [mealLists, setMealLists] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  const getAllMealListsFromApi = async () => {
    const urls = [
      `${baseUrl}/api/breakfastList`,
      `${baseUrl}/api/lunchList`,
      `${baseUrl}/api/dinnerList`,
    ]; // breakfast, lunch, dinner

    try {
      const responses = await Promise.all(urls.map(url => fetch(url)));
      const [response1, response2, response3] = responses;

      const {breakfast} = await response1.json();
      const {lunch} = await response2.json();
      const {dinner} = await response3.json();
      console.log(breakfast, lunch, dinner);
      setMealLists({breakfast, lunch, dinner});
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllMealListsFromApi();
  }, []);

  const getMealElements = (mealList: any) => {
    // check the current time
    const now = date.getHours();
    // return the meal list based on the current time
    if (now < 10) {
      // return title breakfast and content list of breakfast
      return (
        <View style={styles.line}>
          <Text style={styles.title}>早餐</Text>
          {mealList.breakfast.length > 0 ? (
            mealList.breakfast.map(
              (meal: {id: number; name: string, category: string}, i: number) => {
              return (
                <Text key={meal.id} style={styles.listItem}>
                  {i + 1 + '. ' + meal.name}
                </Text>
              );
            })
          ) : (
            <Text style={styles.listItem}>还没想好哦</Text>
          )}
        </View>
      );
    } else if (now < 14) {
      // return title lunch and content list of lunch
      return (
        <View style={styles.line}>
          <Text style={styles.title}>午餐</Text>
          {mealList.lunch.length > 0 ? (
            mealList.lunch.map(
              (meal: {id: number; name: string, category: string}, i: number) => {
                return (
                  <Text key={meal.id} style={styles.listItem}>
                    {i + 1 + '. ' + meal.name}
                  </Text>
                );
              },
            )
          ) : (
            <Text style={styles.listItem}>还没想好哦</Text>
          )}
        </View>
      );
    } else {
      // return title dinner and content list of dinner
      return (
        <View style={styles.line}>
          <Text style={styles.title}>晚餐</Text>
          {mealList.dinner.length > 0 ? (
            mealList.dinner.map((meal: { id: number; name: string, category: string }, i: number) => {
              return (
                <Text key={meal.id} style={styles.listItem}>
                  {i + 1 + '. ' + meal.name}
                </Text>
              );
            })
          ) : (
            <Text style={styles.listItem}>还没想好哦</Text>
          )}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.line}>
        <Text style={styles.title}>当前 </Text>
        <Text style={styles.content}>
          {year}/{month}/{day} 4:07 AM
        </Text>
      </Text>
      <Text style={{...styles.title, ...styles.line}}>计划-下一顿</Text>
      {getMealElements(mealLists)}
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
  },
});

export default App;
