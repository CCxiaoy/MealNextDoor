/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import { Alert, StyleSheet, Text, TextInput, View} from 'react-native';
import {API_URL as baseUrl} from '@env'; // import API_URL from @env and rename it to baseUrl
import {Picker} from '@react-native-picker/picker';

function App(): React.JSX.Element {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // initialize the current meal period according to the current time
  const [currentMealPeriod, setCurrentMealPeriod] = useState(
    date.getHours() < 10
      ? 'breakfast'
      : date.getHours() < 14
      ? 'lunch'
      : date.getHours() < 21
      ? 'dinner'
      : 'midnight',
  ); // ['breakfast', 'lunch', 'dinner', 'midnight'] 早餐 午餐 晚餐 夜宵
  const [mealLists, setMealLists] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    midnight: [],
  });
  const [newMealText, setNewMealText] = useState('');
  const [newMealCategory, setNewMealCategory] = useState('');

  // call alert to show the prompt information
  const informationPrompt = (message : string) => {
    Alert.alert(message);
  };

  const reuseOperationPrompt = (name: string, category: string) => {
    Alert.alert(
      '复用信息',
      '请选择要复用的就餐时段',
      // the buttons in the prompt, exclude the category of the meal itself
      (() => {
        if (category === 'breakfast') {
          return [{
            text: '午餐',
            onPress: () => {
              reuseCreateNewMeal(name, 'lunch');
            },
          }, {
            text: '晚餐',
            onPress: () => {
              reuseCreateNewMeal(name, 'dinner');
            },
          }, {
            text: '夜宵',
            onPress: () => {
              reuseCreateNewMeal(name, 'midnight');
            },
          }];
        } else if (category === 'lunch') {
          return [{
            text: '早餐',
            onPress: () => {
              reuseCreateNewMeal(name, 'breakfast');
            },
          }, {
            text: '晚餐',
            onPress: () => {
              reuseCreateNewMeal(name, 'dinner');
            },
          }, {
            text: '夜宵',
            onPress: () => {
              reuseCreateNewMeal(name, 'midnight');
            },
          }];
        } else if (category === 'dinner') {
          return [{
            text: '早餐',
            onPress: () => {
              reuseCreateNewMeal(name, 'breakfast');
            },
          }, {
            text: '午餐',
            onPress: () => {
              reuseCreateNewMeal(name, 'lunch');
            },
          }, {
            text: '夜宵',
            onPress: () => {
              reuseCreateNewMeal(name, 'midnight');
            },
          }];
        } else {
          return [{
            text: '早餐',
            onPress: () => {
              reuseCreateNewMeal(name, 'breakfast');
            },
          }, {
            text: '午餐',
            onPress: () => {
              reuseCreateNewMeal(name, 'lunch');
            },
          }, {
            text: '晚餐',
            onPress: () => {
              reuseCreateNewMeal(name, 'dinner');
            },
          }];
        }
      })(),
      {
        cancelable: true,
      }
    );
  };

  // get all meal lists from the api
  const getAllMealListsFromApi = async () => {
    const urls = [
      `${baseUrl}/api/breakfastList`,
      `${baseUrl}/api/lunchList`,
      `${baseUrl}/api/dinnerList`,
      `${baseUrl}/api/midnightList`,
    ]; // breakfast, lunch, dinner, midnight

    try {
      const responses = await Promise.all(urls.map(url => fetch(url)));
      const [response1, response2, response3, response4] = responses;

      const {breakfast} = await response1.json();
      const {lunch} = await response2.json();
      const {dinner} = await response3.json();
      const {midnight} = await response4.json();
      console.log(breakfast, lunch, dinner);
      setMealLists({breakfast, lunch, dinner, midnight});
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllMealListsFromApi();
  }, []);

  const getMealElements = (mealList: any) => {
    // return the meal list based on the currentMealPeriod
    if (currentMealPeriod === 'breakfast') {
      // return title breakfast and content list of breakfast
      return (
        <View style={styles.line}>
          {/* <Text style={styles.title}>早餐</Text> */}
          {mealList.breakfast.length > 0 ? (
            mealList.breakfast.map(
              (meal: {id: number; name: string, category: string}, i: number) => {
              return (
                <View key={meal.id} style={styles.listItem}>
                  <Text>{i + 1 + '. ' + meal.name}</Text>
                  <View
                    style={styles.listButtonsContainer}
                  >
                    <Text
                      style={[styles.buttons, styles.reuseButton]}
                      onPress={() => {reuseOperationPrompt(meal.name, meal.category);}}
                    >
                      复用
                    </Text>
                    <Text
                      onPress={() => deleteMeal(meal.id)}
                      style={[styles.buttons, styles.deleteButton]}>
                        删除
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.listItem}>还没想好哦</Text>
          )}
        </View>
      );
    } else if (currentMealPeriod === 'lunch') {
      // return title lunch and content list of lunch
      return (
        <View style={styles.line}>
          {/* <Text style={styles.title}>午餐</Text> */}
          {mealList.lunch.length > 0 ? (
            mealList.lunch.map(
              (meal: {id: number; name: string, category: string}, i: number) => {
                return (
                  <View key={meal.id} style={styles.listItem}>
                    <Text>{i + 1 + '. ' + meal.name}</Text>
                    <View
                      style={styles.listButtonsContainer}
                    >
                      <Text
                        style={[styles.buttons, styles.reuseButton]}
                        onPress={() => {reuseOperationPrompt(meal.name, meal.category);}}
                      >
                        复用
                      </Text>
                      <Text
                        onPress={() => deleteMeal(meal.id)}
                        style={[styles.buttons, styles.deleteButton]}>
                          删除
                      </Text>
                    </View>
                  </View>
                );
              },
            )
          ) : (
            <Text style={styles.listItem}>还没想好哦</Text>
          )}
        </View>
      );
    } else if (currentMealPeriod === 'dinner') {
      // return title dinner and content list of dinner
      return (
        <View style={styles.line}>
          {/* <Text style={styles.title}>晚餐</Text> */}
          {mealList.dinner.length > 0 ? (
            mealList.dinner.map((meal: { id: number; name: string, category: string }, i: number) => {
              return (
                <View key={meal.id} style={styles.listItem}>
                  <Text>{i + 1 + '. ' + meal.name}</Text>
                  <View
                    style={styles.listButtonsContainer}
                  >
                    <Text
                      style={[styles.buttons, styles.reuseButton]}
                      onPress={() => {reuseOperationPrompt(meal.name, meal.category);}}
                    >
                      复用
                    </Text>
                    <Text
                      onPress={() => deleteMeal(meal.id)}
                      style={[styles.buttons, styles.deleteButton]}>
                        删除
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.listItem}>还没想好哦</Text>
          )}
        </View>
      );
    } else {
      // return title midnight and content list of midnight
      return (
        <View style={styles.line}>
          {/* <Text style={styles.title}>夜宵</Text> */}
          {mealList.midnight.length > 0 ? (
            mealList.midnight.map(
              (meal: {id: number; name: string, category: string}, i: number) => {
              return (
                <View key={meal.id} style={styles.listItem}>
                  <Text>{i + 1 + '. ' + meal.name}</Text>
                  <View
                    style={styles.listButtonsContainer}
                  >
                    <Text
                      style={[styles.buttons, styles.reuseButton]}
                      onPress={() => {reuseOperationPrompt(meal.name, meal.category);}}
                    >
                      复用
                    </Text>
                    <Text
                      onPress={() => deleteMeal(meal.id)}
                      style={[styles.buttons, styles.deleteButton]}>
                        删除
                    </Text>
                  </View>
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

  // show user the prompt information success if they delete a meal successfully
  const deleteSuccess = () => {
    informationPrompt('删除成功!');
  };

  // show user the prompt information fail if they delete a meal fail
  const deleteFail = () => {
    informationPrompt('删除失败!');
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
      deleteSuccess(); // show the prompt information
    } catch (error) {
      console.error(error);
      deleteFail(); // show the prompt information
    }
  };

  // empty check for new meal input
  const isInputEmpty = () => {
    // check if newMealText is empty
    if (newMealText === '') {
      informationPrompt('请输入食物名字!');
      return true;
    }
    // check if newMealCategory is empty
    else if (newMealCategory === '') {
      informationPrompt('请选择食物类型!');
      return true;
    }
    return false;
  };

  // show user the prompt information success if they add a new meal successfully
  const addSuccess = () => {
    informationPrompt('添加成功!');
  };

  // show user the prompt information fail if they add a new meal fail
  const addFail = () => {
    informationPrompt('添加失败!');
  };

  function reuseSuccess() {
    informationPrompt('复用成功!');
  }

  function reuseFail() {
    informationPrompt('复用失败!');
  }

  // add new meal to the list, need to pass the meal name and category as the body in post request type
  const addNewMeal = async () => {
    // check if the input is empty
    if (isInputEmpty()) {
      return;
    }
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
      // setNewMealCategory(''); // clear the input box (comment this line, because it cause user to select the category again and again in real cases, which is not user-friendly)
      getAllMealListsFromApi(); // refresh the meal list
      addSuccess(); // show the prompt information
    } catch (error) {
      console.error(error);
      addFail(); // show the prompt information
    }
  };

  const reuseCreateNewMeal = async (mealName: string, mealCategory: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/addMealItem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: mealName,
          category: mealCategory,
        }),
      });
      const data = await response.json();
      console.log(data);
      getAllMealListsFromApi(); // refresh the meal list
      reuseSuccess(); // show the prompt information
    } catch (error) {
      console.error(error);
      reuseFail(); // show the prompt information
    }
  }


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
      <View style={styles.listHeaderContainer}>
        <Text style={{...styles.title, ...styles.line}}>来看看吃什么吧！</Text>
        <Picker
          selectedValue={currentMealPeriod}
          onValueChange={(itemValue) => setCurrentMealPeriod(itemValue)}
          style={styles.selectCurrentMealPeriod}
        >
          <Picker.Item label="早餐" value="breakfast" />
          <Picker.Item label="午餐" value="lunch" />
          <Picker.Item label="晚餐" value="dinner" />
          <Picker.Item label="夜宵" value="midnight" />
        </Picker>
      </View>
      {getMealElements(mealLists)}
      <View style={styles.newMealContainer}>
        <View style={styles.newMealInput}>
          <TextInput
            value={newMealText}
            onChangeText={setNewMealText}
            placeholder="还想吃些什么!?"
            style={styles.inputNewMeal}
          />
          <Picker
            selectedValue={newMealCategory}
            onValueChange={(itemValue) => setNewMealCategory(itemValue)}
            style={styles.selectNewMealCategory}
          >
            {/* placeholder */}
            <Picker.Item enabled={false} label="类型" value="" />
            {/* real options */}
            <Picker.Item label="早餐" value="breakfast" />
            <Picker.Item label="午餐" value="lunch" />
            <Picker.Item label="晚餐" value="dinner" />
            <Picker.Item label="夜宵" value="midnight" />
          </Picker>
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
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  selectCurrentMealPeriod: {
    width: 120,
    borderColor: 'black',
    borderWidth: 1,
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
  listButtonsContainer: {
    flexDirection: 'row',
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
    alignItems: 'center',
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
  selectNewMealCategory: {
    width: 120,
    borderColor: 'black',
    borderWidth: 1,
  },
  buttons: {
    width: '12%',
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    marginRight: -16,
    borderRadius: 8,
    backgroundColor: '#96EABD',
  },
  reuseButton: {
    borderRadius: 8,
    backgroundColor: '#FFD700',
    width: 44,
    marginRight: 8,
  },
  deleteButton: {
    borderRadius: 8,
    backgroundColor: '#FF6B6B',
    width: 44,
  },
});

export default App;


