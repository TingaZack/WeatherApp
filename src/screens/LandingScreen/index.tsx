import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import styles from "./styles";

const LandingScreen: React.FC = () => {

    const cloudyBg = {
        styles: { backgroundColor: '#54717A', },
        img: require('../../assets/Images/forest_cloudy.png'),
    };
    const rainyBg = {
        styles: { backgroundColor: '#57575D', },
        img: require('../../assets/Images/forest_rainy.png'),
    };
    const sunnyBg = {
        styles: { backgroundColor: '#47AB2F', },
        img: require('../../assets/Images/forest_sunny.png'),
    };


    return (
        <View style={styles.container}>
            <View style={styles.weatherContainer}>
                <Image source={cloudyBg.img} resizeMode="cover" style={{ height: '100%', width: '100%', }} />
                <View style={styles.weatherTemp}>
                    <Text style={styles.tempP}>25°</Text>
                    <Text style={styles.weatherCond}>Sunny</Text>
                </View>
            </View>
            <View style={[styles.weatherListContainer, cloudyBg.styles]}>
                <View style={[styles.listItemsContainer, {
                    borderBottomColor: 'white',
                    borderWidth: 1,
                }]}>
                    <View>
                        <Text style={[styles.p, { fontWeight: "bold" }]}>16°</Text>
                        <Text style={styles.p}>min</Text>
                    </View>
                    <View>
                        <Text style={[styles.p, { fontWeight: "bold" }]}>18°</Text>
                        <Text style={styles.p}>Current</Text>
                    </View>
                    <View>
                        <Text style={[styles.p, { fontWeight: "bold" }]}>16°</Text>
                        <Text style={styles.p}>max</Text>
                    </View>
                </View>

                <ScrollView>
                    <View style={styles.listItemsContainer}>
                        <Text style={[styles.p, { flex: 1, textAlign: 'left' }]}>Tuesday</Text>
                        <Text style={[styles.p, { flex: 1 }]}>Icon</Text>
                        <Text style={[styles.p, { flex: 1, textAlign: 'right' }]}>20°</Text>
                    </View>
                    <View style={styles.listItemsContainer}>
                        <Text style={[styles.p, { flex: 1, textAlign: 'left' }]}>Wednesday</Text>
                        <Text style={[styles.p, { flex: 1 }]}>Icon</Text>
                        <Text style={[styles.p, { flex: 1, textAlign: 'right' }]}>20°</Text>
                    </View>
                    <View style={styles.listItemsContainer}>
                        <Text style={[styles.p, { flex: 1, textAlign: 'left' }]}>Thursday</Text>
                        <Text style={[styles.p, { flex: 1 }]}>Icon</Text>
                        <Text style={[styles.p, { flex: 1, textAlign: 'right' }]}>20°</Text>
                    </View>
                    <View style={styles.listItemsContainer}>
                        <Text style={[styles.p, { flex: 1, textAlign: 'left' }]}>Friday</Text>
                        <Text style={[styles.p, { flex: 1 }]}>Icon</Text>
                        <Text style={[styles.p, { flex: 1, textAlign: 'right' }]}>20°</Text>
                    </View>
                    <View style={styles.listItemsContainer}>
                        <Text style={[styles.p, { flex: 1, textAlign: 'left' }]}>Saturday</Text>
                        <Text style={[styles.p, { flex: 1 }]}>Icon</Text>
                        <Text style={[styles.p, { flex: 1, textAlign: 'right' }]}>20°</Text>
                    </View>
                </ScrollView>

            </View>
        </View>
    )
};

export default LandingScreen;

