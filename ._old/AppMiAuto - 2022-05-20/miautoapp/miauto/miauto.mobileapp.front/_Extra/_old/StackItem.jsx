// import React from 'react'; // ! Verificar al hacer Bundle si solo aparece 1 vez esta línea
import { Dimensions, Image, useWindowDimensions, View, Text } from 'react-native';
import { Badge, Paragraph, Surface, Title, withTheme } from 'react-native-paper';
import Styles from './StackItem.styles'


function StackItem( { adress, cover, desc_short, rating, title, theme } ) {
    // const { height, width } = useWindowDimensions();

    return (
        <Surface style={ Styles.card }>
            <Image style={ Styles.cover } source={ { uri: cover } } />
            <View style={ Styles.content }>
                <View style={ Styles.textContent }>
                    <Title>{ title }</Title>
                    <Paragraph>{ adress }</Paragraph>
                    <Paragraph>{ desc_short }</Paragraph>
                </View>
                <Badge style={ Styles.badge }>{ rating }</Badge>
            </View>
        </Surface>
    );
};

export default withTheme( StackItem );
