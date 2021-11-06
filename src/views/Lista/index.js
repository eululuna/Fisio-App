import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View } from 'react-native';
import { ListItem } from 'react-native-elements'
import db from '../../config/Database/firebase'

class Lista extends Component {
    dbRef = db.firestore().collection('paciente');
    constructor() {
        super();
        this.state = {
            isLoading: true,
            userArr: []
        };
    }

    componentDidMount() {
        this.unsubscribe = this.dbRef.onSnapshot(this.getCollection);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    getCollection = (querySnapshot) => {
        const pacientArr = [];
        querySnapshot.forEach((res) => {
            const { data, id, paciente } = res.data();
            pacientArr.push({
                id,
                data,
                paciente
            });
        });
        this.setState({
            pacientArr,
            isLoading: false,
        });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.preloader}>
                    <ActivityIndicator size="large" color="#1E3464" />
                </View>
            )
        }
        return (
            <ScrollView style={styles.container}>
                {
                    this.state.pacientArr.map((item, i) => {
                        return (
                            <ListItem
                                key={i}
                                chevron
                                bottomDivider
                                title={item.paciente}
                                subtitle={item.data}
                                onPress={() => {
                                    this.props.navigation.navigate('Prontuario', {
                                        prontId: item.id
                                    });
                                }} />
                        );
                    })
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 22
    },
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Lista;