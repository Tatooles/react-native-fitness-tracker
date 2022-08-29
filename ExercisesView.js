import React from "react";
import {
    ScrollView,
    Text,
    Dimensions,
    StyleSheet,
    View,
    Pressable,
    Modal,
    Button,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import ExerciseItem from "./ExerciseItem";
import Icon from "react-native-vector-icons/FontAwesome5";
import moment from "moment";

class ExerciseView extends React.Component {
    constructor() {
        super();

        this.state = {
            activities: [],
            exercises: [],
            editModalVisible: false,
            addModalVisible: false,

            addName: "",
            addCalories: 0.0,
            addDuration: 0.0,
            addDate: "",

            editId: 0,
            editName: "",
            editCalories: 0.0,
            editDuration: 0.0,
            editDate: "",
        }
    }

    /**
     * On first load, fetch the user data from the `/activities` endpoint.
     *
     */
    componentDidMount() {
        this.updateActivities();
    }

    // Called when we need to update the activities
    updateActivities() {
        fetch("http://cs571.cs.wisc.edu:5000/activities", {
            method: "GET",
            headers: { "x-access-token": this.props.accessToken },
        })
            .then((res) => res.json())
            .then((res) => {
                this.setState({
                    activities: res.activities,
                });
            })
            .then(() => this.getExercises());
    }

    setAddModalVisible = (visible) => {
        this.setState({ addModalVisible: visible });
        this.updateActivities();
    }

    setEditModalVisible = (visible) => {
        this.setState({ editModalVisible: visible });
        this.updateActivities();
    }

    /**
     * Go through the activity data we got from the server and it into components
     * Also calculates total activity on the way through
     */
    getExercises() {
        let exe = [];
        for (let exercise of this.state.activities) {
            // Need name, duration, date, and calories burned
            exe.push(
                <ExerciseItem
                    key={exercise.id}
                    name={exercise.name}
                    calories={exercise.calories}
                    date={exercise.date}
                    duration={exercise.duration}
                    id={exercise.id}
                    delete={this.deleteExercise}
                    edit={this.editExercise}
                    today={false}
                >
                </ExerciseItem>
            );
        }
        this.setState({ exercises: exe });
    }

    // Called when submitting to add a new exercise
    addExercise() {
        // First have to create the valid date
        let dateFormat = 'MM/DD/YYYY hh:mm:ss';

        let _body;
        if (moment(this.state.addDate, dateFormat, true).isValid()) {
            let dte = moment(this.state.addDate, dateFormat, true).format();
            _body = JSON.stringify({
                name: this.state.addName,
                duration: this.state.addDuration,
                calories: this.state.addCalories,
                date: dte
            })
        } else {
            console.log("Invalid date, using today's date")
            _body = JSON.stringify({
                name: this.state.addName,
                duration: this.state.addDuration,
                calories: this.state.addCalories,
            })
        }
        // POST mapping call here using state stuff
        fetch("http://cs571.cs.wisc.edu:5000/activities", {
            method: "POST",
            headers: {
                "x-access-token": this.props.accessToken,
                "Content-Type": "application/json"
            },
            body: _body
        }).then(() => this.setAddModalVisible(!this.state.addModalVisible));

        // Clear all fields
        this.setState({
            addDate: '',
            addName: '',
            addDuration: 0.0,
            addCalories: 0.0,
        })

    }

    // Callback to be called when we want to delete an exercise
    deleteExercise = (id) => {
        fetch("http://cs571.cs.wisc.edu:5000/activities/" + id, {
            method: "DELETE",
            headers: { "x-access-token": this.props.accessToken },
        }).then(() => this.updateActivities())
    }

    // Callback for when we want to edit an exercise, prob gonna pass everything into this one
    editExercise = (id, name, calories, duration, date) => {
        this.setState({
            editId: id,
            editName: name,
            editCalories: calories,
            editDuration: duration,
            editDate: date,
        })

        this.setEditModalVisible(!this.state.editModalVisible);
    }

    // Called when we press save to update an exercise from the edit screen
    submitEdit = () => {
        let dateFormat = 'MM/DD/YYYY hh:mm:ss';

        let _body;
        if (moment(this.state.editDate, dateFormat, true).isValid()) {
            let dte = moment(this.state.editDate, dateFormat, true).format();
            _body = JSON.stringify({
                name: this.state.editName,
                duration: this.state.editDuration,
                calories: this.state.editCalories,
                date: dte
            })
        } else {
            console.log("Invalid date, using existing date")
            _body = JSON.stringify({
                name: this.state.editName,
                duration: this.state.editDuration,
                calories: this.state.editCalories,
            })
        }

        fetch("http://cs571.cs.wisc.edu:5000/activities/" + this.state.editId, {
            method: "PUT",
            headers: {
                "x-access-token": this.props.accessToken,
                "Content-Type": "application/json"
            },
            body: _body
        }).then(() => this.setEditModalVisible(!this.state.editModalVisible));

        // Clear all fields
        this.setState({
            editDate: '',
            editName: '',
            editDuration: 0.0,
            editCalories: 0.0,
            editId: 0,
        })
    }

    render() {
        return (
            <ScrollView
                style={styles.mainContainer}
                contentContainerStyle={{
                    flexGrow: 11,
                    alignItems: "center",
                }}
            >
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.addModalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        this.setAddModalVisible(!this.state.addModalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.bigText}>Add Exercise</Text>

                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
                                Exercise Name
                            </Text>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="Exercise"
                                placeholderTextColor="#d9bebd"
                                autoCapitalize="none"
                                onChangeText={(name) => this.setState({ addName: name })} />

                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
                                Duration (minutes)
                            </Text>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="Duration"
                                placeholderTextColor="#d9bebd"
                                autoCapitalize="none"
                                onChangeText={(duration) =>
                                    this.setState({
                                        addDuration: !duration
                                            ? 0
                                            : parseFloat(duration),
                                    })
                                } />

                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
                                Calories Burned
                            </Text>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="Calories"
                                placeholderTextColor="#d9bebd"
                                autoCapitalize="none"
                                onChangeText={(calories) =>
                                    this.setState({
                                        addCalories: !calories
                                            ? 0
                                            : parseFloat(calories),
                                    })
                                } />

                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
                                Date
                            </Text>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="MM/DD/YYYY hh:mm:ss"
                                placeholderTextColor="#d9bebd"
                                autoCapitalize="none"
                                onChangeText={(date) => {
                                    this.setState({
                                        addDate: date
                                    })
                                }} />

                            <Button
                                color="#942a21"
                                style={styles.buttonInline}
                                onPress={() => this.addExercise()}
                                title="Submit"
                            >
                            </Button>
                            <Button
                                color="#942a21"
                                style={styles.buttonInline}
                                onPress={() => this.setAddModalVisible(!this.state.addModalVisible)}
                                title="Hide Modal"
                            >
                            </Button>
                        </View>
                    </View>
                </Modal>


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.editModalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        this.setEditModalVisible(!this.state.editModalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.bigText}>Edit Exercise</Text>

                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
                                Exercise Name
                            </Text>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="Exercise"
                                placeholderTextColor="#d9bebd"
                                autoCapitalize="none"
                                value={this.state.editName}
                                onChangeText={(name) => this.setState({ editName: name })} />

                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
                                Duration (minutes)
                            </Text>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="Duration"
                                placeholderTextColor="#d9bebd"
                                autoCapitalize="none"
                                value={this.state.editDuration}
                                onChangeText={(duration) =>
                                    this.setState({
                                        editDuration: !duration
                                            ? 0
                                            : parseFloat(duration),
                                    })
                                } />

                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
                                Calories Burned
                            </Text>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="Calories"
                                placeholderTextColor="#d9bebd"
                                autoCapitalize="none"
                                value={this.state.editCalories}
                                onChangeText={(calories) =>
                                    this.setState({
                                        editCalories: !calories
                                            ? 0
                                            : parseFloat(calories),
                                    })
                                } />

                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
                                Date
                            </Text>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="MM/DD/YYYY hh:mm:ss"
                                placeholderTextColor="#d9bebd"
                                autoCapitalize="none"
                                value={this.state.editDate}
                                onChangeText={(date) => {
                                    this.setState({
                                        editDate: date
                                    })
                                }} />
                            <Button
                                color="#942a21"
                                style={styles.buttonInline}
                                onPress={() => this.submitEdit()}
                                title="Submit"
                            >
                            </Button>
                            <Button
                                color="#942a21"
                                style={styles.buttonInline}
                                onPress={() => this.setEditModalVisible(!this.state.editModalVisible)}
                                title="Hide Modal"
                            >
                            </Button>
                        </View>
                    </View>
                </Modal>

                <View style={styles.space} />
                <Text style={styles.bigText}>Exercises</Text>
                <View style={styles.spaceSmall}></View>
                <Pressable
                    accessible={true}
                    accessibilityLabel="Add Exercise"
                    accessibilityHint="Opens a screen to create a new exercise"
                    onPress={() => this.setAddModalVisible(true)}>
                    <View style={styles.cont}>
                        <Icon
                            name="plus"
                            color="#942a21"
                            size={50}
                        />
                    </View>
                </Pressable>
                {this.state.exercises}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        height: Dimensions.get("window").height,
    },
    cont: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        marginBottom: 5,
        padding: 5,
        width: 300,
        height: 100,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    mainContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        width: Dimensions.get("window").width / 2,
        height: Dimensions.get("window").height / 2,
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

export default ExerciseView;
