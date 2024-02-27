/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, TextInput, View} from 'react-native';
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
  const [newMealText, setNewMealText] = useState('');
  const [newMealCategory, setNewMealCategory] = useState('');

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
                <View key={meal.id} style={styles.listItem}>
                  <Text>{i + 1 + '. ' + meal.name}</Text>
                  <Text
                    onPress={() => deleteMeal(meal.id)}
                    style={styles.buttons}>
                      删除
                  </Text>
                </View>
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
                  <View key={meal.id} style={styles.listItem}>
                    <Text>{i + 1 + '. ' + meal.name}</Text>
                  <Text
                    onPress={() => deleteMeal(meal.id)}
                    style={styles.buttons}>
                      删除
                  </Text>
                  </View>
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
                <View key={meal.id} style={styles.listItem}>
                  <Text>{i + 1 + '. ' + meal.name}</Text>
                  <Text
                    onPress={() => deleteMeal(meal.id)}
                    style={styles.buttons}>
                      删除
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.listItem}>还没想好哦</Text>
          )}
        </View>
      );
    }
  };

  // delete meal from the list, need to pass the meal id as the params in delete request type
  const deleteMeal = async (mealId: number) => {
    try {
      const response = await fetch(`${baseUrl}/api/deleteMealItem/${mealId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      console.log(data);
      getAllMealListsFromApi(); // refresh the meal list
    } catch (error) {
      console.error(error);
    }
  };

  // add new meal to the list, need to pass the meal name and category as the body in post request type
  const addNewMeal = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/addMealItem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newMealText,
          category: newMealCategory,
        }),
      });
      const data = await response.json();
      console.log(data);
      setNewMealText(''); // clear the input box
      setNewMealCategory(''); // clear the input box
      getAllMealListsFromApi(); // refresh the meal list
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.line}>
        <Text style={styles.title}>当前 </Text>
        <Text style={styles.content}>
          {year}/{month}/{day}
          {/* current time in this form xx:xx hour:minute like 04:07  */}
          {' '}
          {date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}
          :
          {date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}
        </Text>
      </Text>
      <Text style={{...styles.title, ...styles.line}}>计划-下一顿</Text>
      {getMealElements(mealLists)}
      <View style={styles.newMealContainer}>
        <View style={styles.newMealInput}>
          <TextInput value={newMealText} onChangeText={setNewMealText} style={styles.inputNewMeal} />
          <TextInput value={newMealCategory} onChangeText={setNewMealCategory} style={styles.inputNewMealCategory} />
        </View>
        <Text
          onPress={addNewMeal}
          style={[styles.buttons, styles.addButton]}>
            添加
        </Text>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 16,
    marginBottom: 8,
  },
  newMealContainer: {
    width: '100%',
    paddingLeft: 16,
    // set two elements in a row, one is TextInput element, the other is a Text element
    flexDirection: 'row',
    // set the two elements in the center of the container
    alignItems: 'center',
    // set the space between the two elements
    justifyContent: 'space-between',
    // set this container to the bottom of the screen
    position: 'absolute',
    bottom: 16,
  },
  newMealInput: {
    flexDirection: 'row',
    width: '80%',
  },
  inputNewMeal: {
    // Top-left and bottom-left radius of the input box should be 10
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderColor: '#707070',
    borderStyle: 'solid',
    borderWidth: 1,
    fontSize: 8,
    width: '70%',
    // height just bigger enough to show the text
    height: 32,
  },
  inputNewMealCategory: {
    // Top-left and bottom-left radius of the input box should be 10
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: '#707070',
    borderStyle: 'solid',
    borderWidth: 1,
    fontSize: 8,
    width: '30%',
    height: 32,
  },
  buttons: {
    width: '12%',
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    marginRight: -16,
  },
});

export default App;
