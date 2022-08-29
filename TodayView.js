import React, { useState, useEffect } from "react";
import {
    ScrollView,
    Text,
    Dimensions,
    StyleSheet,
    View,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import ExerciseItem from "./ExerciseItem";
import MealItem from "./MealItem";

function TodayView(props, { navigation }) {

    const [activities, setActivities] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [currentDailyActivity, setCurrentDailyActivity] = useState(0.0);
    const [goalDailyActivity, setGoalDailyActivity] = useState(0.0);
    const [goalDailyCalories, setGoalDailyCalories] = useState(0.0);
    const [goalDailyCarbs, setGoalDailyCarbs] = useState(0.0);
    const [goalDailyFat, setGoalDailyFat] = useState(0.0);
    const [goalDailyProtein, setGoalDailyProtein] = useState(0.0);


    const [mealsRaw, setMealsRaw] = useState([]);
    const [mealComponents, setMealComponents] = useState([]);

    /**
       * On first load, gonna have to grab data - activities and daily activity goal
       *
       */
    useEffect(() => {
        fetch("http://cs571.cs.wisc.edu:5000/activities", {
            method: "GET",
            headers: { "x-access-token": props.accessToken },
        })
            .then((res) => res.json())
            .then((res) => {
                setActivities(res.activities);
            });

        fetch("http://cs571.cs.wisc.edu:5000/users/" + props.username, {
            method: "GET",
            headers: { "x-access-token": props.accessToken },
        })
            .then((res) => res.json())
            .then((res) => {
                setGoalDailyActivity(res.goalDailyActivity);
                setGoalDailyCalories(res.goalDailyCalories);
                setGoalDailyProtein(res.goalDailyProtein);
                setGoalDailyCarbs(res.goalDailyCarbohydrates);
                setGoalDailyFat(res.goalDailyFat);
            });
    }, []);


    const updateScreen = () => {
        // Get activities
        fetch("http://cs571.cs.wisc.edu:5000/activities", {
            method: "GET",
            headers: { "x-access-token": props.accessToken },
        })
            .then((res) => res.json())
            .then((res) => {
                setActivities(res.activities);
            });

        // Get meals
        fetch("http://cs571.cs.wisc.edu:5000/meals", {
            method: "GET",
            headers: { "x-access-token": props.accessToken },
        })
            .then((res) => res.json())
            .then((res) => {
                setMealsRaw(res.meals);
            });

        // Get daily activity goal
        fetch("http://cs571.cs.wisc.edu:5000/users/" + props.username, {
            method: "GET",
            headers: { "x-access-token": props.accessToken },
        })
            .then((res) => res.json())
            .then((res) => {
                setGoalDailyActivity(res.goalDailyActivity);
                setGoalDailyCalories(res.goalDailyCalories);
                setGoalDailyProtein(res.goalDailyProtein);
                setGoalDailyCarbs(res.goalDailyCarbohydrates);
                setGoalDailyFat(res.goalDailyFat);
            });
    }

    useEffect(() => {
        getItems();
    }, [activities]);

    useEffect(() => {
        getItems();
    }, [mealsRaw]);

    useFocusEffect(
        React.useCallback(() => {
            updateScreen();
        }, [])
    );

    /**
     * Go through the activity data we got from the server and it into components
     * Also calculates total activity on the way through
     * 
     */
    const getItems = () => {
        let activity = 0;
        let exe = [];
        let today = new Date();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        let year = today.getFullYear();

        for (let exercise of activities) {
            // Only display the exercises from today
            if (year === parseInt(exercise.date.slice(0, 4)) && month === parseInt(exercise.date.slice(5, 7)) && day === parseInt(exercise.date.slice(8, 10))) {
                activity += exercise.duration;
                // Need name, duration, date, and calories burned
                exe.push(
                    <ExerciseItem
                        key={exercise.id}
                        name={exercise.name}
                        calories={exercise.calories}
                        date={exercise.date}
                        duration={exercise.duration}
                        id={exercise.id}
                        today={true}
                    >
                    </ExerciseItem>
                );
            }
        }
        setExercises(exe);
        setCurrentDailyActivity(activity);

        let mea = [];
        for (let meal of mealsRaw) {
            if (year === parseInt(meal.date.slice(0, 4)) && month === parseInt(meal.date.slice(5, 7)) && day === parseInt(meal.date.slice(8, 10))) {
                mea.push(
                    <MealItem
                        key={meal.id}
                        name={meal.name}
                        date={meal.date}
                        id={meal.id}
                        today={true}
                    >
                    </MealItem>
                )
            }
        }
        setMealComponents(mea);
    }

    return (
        <ScrollView
            style={styles.mainContainer}
            contentContainerStyle={{
                flexGrow: 11,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={styles.bigText}>Today</Text>
            <Text>What's going on with your health and fitness today?</Text>
            <View style={styles.space}></View>
            <Text style={styles.bigText}>Goals</Text>
            <Text>Daily Activity Progress: </Text>
            <Text>{currentDailyActivity} / {goalDailyActivity} minutes</Text>
            <Text>Daily Meal Progress: </Text>
            <Text>x / {goalDailyCalories} grams</Text>
            <Text>x / {goalDailyProtein} grams</Text>
            <Text>x / {goalDailyCarbs} grams</Text>
            <Text>x / {goalDailyFat} grams</Text>
            <View style={styles.space}></View>
            <Text style={styles.bigText}>Exercises</Text>
            {exercises}
            <View style={styles.space}></View>
            <Text style={styles.bigText}>Meals</Text>
            {mealComponents}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        height: Dimensions.get("window").height,
    },
    mainContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    bigText: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 5,
    },
    spaceSmall: {
        width: 20, // or whatever size you need
        height: 10,
    },
    space: {
        width: 20, // or whatever size you need
        height: 20,
    },
    spaceHorizontal: {
        display: "flex",
        width: 20,
    },
    buttonInline: {
        display: "flex",
        margin: 5,
        padding: 10,
    },
    input: {
        width: 200,
        padding: 10,
        margin: 5,
        height: 40,
        borderColor: "#c9392c",
        borderWidth: 1,
    },
    inputInline: {
        flexDirection: "row",
        display: "flex",
        width: 200,
        padding: 10,
        margin: 5,
        height: 40,
        borderColor: "#c9392c",
        borderWidth: 1,
    },
    bottomButtons: {
        flexDirection: "row",
        display: "flex",
        margin: 5,
    },
});

export default TodayView;
