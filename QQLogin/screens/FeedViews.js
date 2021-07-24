import React, {useState} from 'react';
import { View, StyleSheet, Dimensions, StatusBar, Text, TouchableOpacity, FlatList, } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import {useNavigation} from '@react-navigation/native';


const homeposts = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
    body: 'This is a sample post!',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
    body: 'Who\'s playing at Sun God today at 7pm?',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
    body: 'Which dining hall has the best special today?',
  },
  {
    id: '58894a0f-3da1-471f-bd96-145571e29d82',
    title: 'Fourth Item',
    body: 'Which dining hall has the best special today?',
  },
  {
    id: '38bd68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Fifth Item',
    body: 'What games do you all play?',
  },
  {
    id: '20bd68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Sixth Item',
    body: 'What\'s Poppin? Brand new whip, just hopped in yuh',
  },
];

const allposts = [
  {
    id: '38bd68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Fifth Item',
    body: 'What games do you all play?',
  },
  {
    id: '20bd68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Sixth Item',
    body: 'What\'s Poppin? Brand new whip, just hopped in yuh',
  },
];

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    {/* <Text style={[styles.title, textColor]}>{item.title}</Text> */}
    <Text style={[styles.bodyText, textColor]}>{item.body}</Text>
  </TouchableOpacity>
);
  

const FirstRoute = () => {
  const [selectedId, setSelectedId] = useState(null);
  const navigation = useNavigation();

  //renderItem function
  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#FFCC15' : '#FFFFFF';
    const color = item.id === selectedId ? 'white' : 'black';
    return(
      <Item
        item={item}
        onPress={() => {setSelectedId(item.id); navigation.navigate('Post View')}}
        backgroundColor={{backgroundColor}}
        textColor={{color}}
      />
    );
  };

  return(
    // <StyledFeedContainer>
    //     <StatusBar style="black" />
    //     <InnerContainer/>
        <View style={{backgroundColor: '#EFEFEF', paddingTop: 2.5}}>
          <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={homeposts}
                    keyExtractor={(item) => item.id}
                    extraData={selectedId}
                    renderItem={renderItem}
          />

        </View>
    // </StyledFeedContainer>
  );
    
};

const SecondRoute = () => {
  const [selectedId, setSelectedId] = useState(null);
  const navigation = useNavigation();
  //renderItem function
  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#FFCC15' : '#FFFFFF';
    const color = item.id === selectedId ? 'white' : 'black';
    return(
      <Item
        item={item}
        onPress={() => {setSelectedId(item.id); navigation.navigate('Post View')}}
        backgroundColor={{backgroundColor}}
        textColor={{color}}
      />
    );
  };

  return(
    // <StyledFeedContainer style={{backgroundColor: 'pink'}}>
    //     <StatusBar style="black" />
    //     <InnerContainer/>
        <View style={{backgroundColor: '#EFEFEF', paddingTop: 2.5}}>
          <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={allposts}
                    keyExtractor={(item) => item.id}
                    extraData={selectedId}
                    renderItem={renderItem}
          />
        </View>
    // </StyledFeedContainer>
  );
};

const initialLayout = { width: Dimensions.get('window').width};

const renderScene = SceneMap({
  home: FirstRoute,
  all: SecondRoute,
});

const renderTabBar = (props) => (
  <TabBar 
    {...props}
    indicatorStyle={{backgroundColor: '#FFCC15'}}
    activeColor={'#FFCC15'}
    inactiveColor={'#BDBDBD'}
    style={{backgroundColor: 'white'}}
  />
);

export default function FeedViews({navigation}) {

    const [index, setIndex] = React.useState(0);
    const[routes] = React.useState([
        {key: 'home', title: 'Home'},
        {key: 'all', title: 'All'}
    ]);


  return (
     
        <TabView
          navigationState={{ index, routes}}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          style={styles.container}
        />
  );
}

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    // marginTop: StatusBar.currentHeight,
    flex: 4,
    justifyContent: 'flex-start',
  },
  scene: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  item:{
    padding: 30,
    marginVertical: 2.5,
    //marginHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  bodyText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  touchableStyle:{
    position: 'absolute',
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: width * 0.18,
    height: width * 0.18,
  }
});
