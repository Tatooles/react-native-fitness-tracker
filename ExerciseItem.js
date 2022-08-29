import React from "react";
import {
    Text,
    Dimensions,
    StyleSheet,
    View,
    Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

class ExerciseItem extends React.Component {
    constructor() {
        super();
    }

    /**
     * Will render differently depending on whether this component is in the day or exercises view
     *  
     */
    render() {
        if (this.props.today) {
            return (
                <View style={styles.contDay}>
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>{this.props.name}</Text>
                    <Text>Duration: {this.props.duration} minutes</Text>
                    <Text>Cals Burned: {this.props.calories}</Text>
                    <Text>Date: {this.props.date}</Text>
                </View>
            )
        } else {
            return (
                <View style={styles.cont}>
                    <View style={styles.mainContainer}>
                        <Text style={{ fontWeight: "bold", fontSize: 20 }}>{this.props.name}</Text>
                        <Text>Duration: {this.props.duration} minutes</Text>
                        <Text>Cals Burned: {this.props.calories}</Text>
                        <Text>Date: {this.props.date}</Text>
                    </View>
                    <View style={styles.subContainer}>
                        <Pressable
                            accessible={true}
                            accessibilityLabel="Edit Exercise"
                            accessibilityHint="Opens a screen which allows you to edit this exercise"
                            onPress={() => this.props.edit(this.props.id, this.props.name, this.props.calories, this.props.duration, this.props.date)}>
                            <Icon
                                name="edit"
                                color="#942a21"
                                size={30}
                            />
                        </Pressable>
                        <View style={styles.spaceSmall}></View>
                        <Pressable
                            accessible={true}
                            accessibilityLabel="Delete Exercise"
                            accessibilityHint="Deletes this exercise from the list"
                            onPress={() => this.props.delete(this.props.id)}>
                            <Icon
                                name="trash"
                                color="#942a21"
                                size={30}
                            />
                        </Pressable>
                    </View>
                </View>
            );
        }
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
    contDay: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        marginBottom: 5,
        padding: 5,
        width: 300,
        height: 100,
    },
    mainContainer: {
        flex: 2,
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    subContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
        margin: 10,
        padding: 0,
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

export default ExerciseItem;
