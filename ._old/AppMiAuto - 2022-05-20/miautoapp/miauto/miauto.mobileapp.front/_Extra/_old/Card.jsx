import * as React from 'react';
import { Dimensions, StyleSheet, useWindowDimensions, View, Text } from 'react-native';
import { Avatar, Button, Card as MCard, Title, Paragraph } from 'react-native-paper';


export default function Card() {
    // const { height, width } = useWindowDimensions();

    return (
        <MCard style={styles.card} >
            {/* <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent} />*/}
            {/* <Card.Title title="Card Title" subtitle="Card Subtitle"  /> */}
            <MCard.Content style={styles.content}>
                <Title>Card title</Title>
                <Paragraph>Card content</Paragraph>
            </MCard.Content>
            {/* <MCard.Cover style={styles.cover} source={{ uri: 'https://picsum.photos/700' }} /> */}
            <MCard.Actions style={styles.actions}>
                <Button>Cancel</Button>
                <Button>Ok</Button>
            </MCard.Actions>
            <View style={styles.card}>
                <Text style={styles.content}>asd</Text>
                <Text style={styles.actions}>zxc</Text>
            </View>
        </MCard>
    );
};

const styles = StyleSheet.create( {
    card: {
        backgroundColor: 'purple',
        // width: Dimensions.get('screen').width - 50
        // width: useWindowDimensions().width 
        width: `${100 - 10}%`,
        height: 128,
        flex: 0,
        alignItems: 'stretch',
        justifyContent: 'center',
        flexDirection: "row",
        direction: 'LTR'
    },
    cover: {
        // flex:0,
        width: 130,
        height: 130,
        margin: 10,
        resizeMode: 'cover',
        borderRadius: 100,
        opacity: 0.9,

    },
    content: {
        flex: 0,
        backgroundColor: 'blue',
        width: 100,
        height: 100,

    },
    actions: {
        flex: 0,
        backgroundColor: 'orange',
        width: 100,
        height: 100,

    }
} );


