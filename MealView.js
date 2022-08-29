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
import MealItem from "./MealItem";
import Icon from "react-native-vector-icons/FontAwesome5";
import moment from "moment";

class MealView extends React.Component {
    constructor() {
        super();

        this.state = {
            mealsRaw: [],
            mealsComponents: [],
            editModalVisible: false,
            addModalVisible: false,

            addName: "",
            addDate: "",

            editId: 0,
            editName: "",
            editDate: "",
        }
    }

    /**
     * On first load, fetch the user data from the `/activities` endpoint.
     *
     */
    componentDidMount() {
        this.updateMeals();
    }

    // Called when we need to update the activities
    updateMeals() {
        fetch("http://cs571.cs.wisc.edu:5000/meals", {
            method: "GET",
            headers: { "x-access-token": this.props.accessToken },
        })
            .then((res) => res.json())
            .then((res) => {
                this.setState({
                    mealsRaw: res.meals,
                });
            })
            .then(() => this.getMeals());
    }

    setAddModalVisible = (visible) => {
        this.setState({ addModalVisible: visible });
        this.updateMeals();
    }

    setEditModalVisible = (visible) => {
        this.setState({ editModalVisible: visible });
        this.updateMeals();
    }

    /**
     * Go through the meal data we got from the server and it into components
     * Also calculates total meal on the way through
     */
    getMeals() {
        let exe = [];
        for (let meal of this.state.mealsRaw) {
            // Need name, duration, date, and calories burned
            exe.push(
                <MealItem
                    key={meal.id}
                    name={meal.name}
                    date={meal.date}
                    id={meal.id}
                    delete={this.deleteMeal}
                    edit={this.editMeal}
                    today={false}
                >
                </MealItem>
            );
        }
        this.setState({ mealsComponents: exe });
    }

    // Called when submitting to add a new meal
    addMeal() {
        // First have to create the valid date
        let dateFormat = 'MM/DD/YYYY hh:mm:ss';

        let _body;
        if (moment(this.state.addDate, dateFormat, true).isValid()) {
            let dte = moment(this.state.addDate, dateFormat, true).format();
            _body = JSON.stringify({
                name: this.state.addName,
                date: dte
            })
        } else {
            console.log("Invalid date, using today's date")
            _body = JSON.stringify({
                name: this.state.addName,
            })
        }
        // POST mapping call here using state stuff
        fetch("http://cs571.cs.wisc.edu:5000/meals", {
            method: "POST",
            headers: {
                "x-access-token": this.props.accessToken,
                "Content-Type": "application/json"
            },
            body: _body
        }).then(() => this.setAddModalVisible(!this.state.addModalVisible));

        // Clear all fields
        // this.setState({
        //     addDate: '',
        //     addName: '',
        //     addDuration: 0.0,
        //     addCalories: 0.0,
        // })

    }

    // Callback to be called when we want to delete an meal
    deleteMeal = (id) => {
        fetch("http://cs571.cs.wisc.edu:5000/meals/" + id, {
            method: "DELETE",
            headers: { "x-access-token": this.props.accessToken },
        }).then(() => this.updateMeals())
    }

    // Callback for when we want to edit an meal, prob gonna pass everything into this one
    editMeal = (id, name, calories, duration, date) => {
        this.setState({
            editId: id,
            editName: name,
            editDate: date,
        })

        this.setEditModalVisible(!this.state.editModalVisible);
    }

    // Called when we press save to update an meal from the edit screen
    submitEdit = () => {
        let dateFormat = 'MM/DD/YYYY hh:mm:ss';

        let _body;
        if (moment(this.state.editDate, dateFormat, true).isValid()) {
            let dte = moment(this.state.editDate, dateFormat, true).format();
            _body = JSON.stringify({
                name: this.state.editName,
                date: dte
            })
        } else {
            console.log("Invalid date, using existing date")
            _body = JSON.stringify({
                name: this.state.editName,
            })
        }

        fetch("http://cs571.cs.wisc.edu:5000/meals/" + this.state.editId, {
            method: "PUT",
            headers: {
                "x-access-token": this.props.accessToken,
                "Content-Type": "application/json"
            },
            body: _body
        }).then(() => this.setEditModalVisible(!this.state.editModalVisible));

        // Clear all fields
        // this.setState({
        //     editDate: '',
        //     editName: '',
        //     editDuration: 0.0,
        //     editCalories: 0.0,
        //     editId: 0,
        // })
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
                            <Text style={styles.bigText}>Add Meal</Text>

                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
                                Meal Name
                            </Text>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="Meal"
                                placeholderTextColor="#d9bebd"
                                autoCapitalize="none"
                                onChangeText={(name) => this.setState({ addName: name })} />

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
                                onPress={() => this.addMeal()}
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
                            <Text style={styles.bigText}>Edit Meal</Text>

                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
                                Meal Name
                            </Text>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="Meal"
                                placeholderTextColor="#d9bebd"
                                autoCapitalize="none"
                                value={this.state.editName}
                                onChangeText={(name) => this.setState({ editName: name })} />

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
                <Text style={styles.bigText}>Meals</Text>
                <View style={styles.spaceSmall}></View>
                <Pressable
                    accessible={true}
                    accessibilityLabel="Add Meal"
                    accessibilityHint="Opens a screen to create a new meal"
                    onPress={() => this.setAddModalVisible(true)}>
                    <View style={styles.cont}>
                        <Icon
                            name="plus"
                            color="#942a21"
                            size={50}
                        />
                    </View>
                </Pressable>
                {this.state.mealsComponents}
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

export default MealView;
