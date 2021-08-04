import React, {useState, Component} from 'react';  
import {Platform, StyleSheet, Text, View, Button, Modal} from 'react-native';  




const EllipsisMenu = ({children}) => {
    const [isVisible, setVisible] = useState(false);
    return (  
      <View style = {[styles.container]}>  
        <Modal            
          animationType = {"slide"}  
          transparent = {true}  
          visible = {isVisible}  
          onRequestClose = {() =>{ console.log("Modal has been closed.") } }
          style={{flex: 0.5}}>  
          {/*All views of Modal*/}  
          <View style = {styles.modal}>
            <Text style = {styles.text}>Modal is open!</Text>  
            <Button title="Click To Close Modal" onPress = {() => {  
                setVisible(!isVisible)}}/> 
          </View>  
        </Modal>  
        {/*Button will change state to true and view will re-render*/}  
        <Button   
           title="Click To Open Modal"   
           onPress = {() => {setVisible(true)}}  
        />  
        {children}
      </View>  
    );  
}
//export default class EllipsisMenu extends Component {  
//   state = {  
//     isVisible: false, //state of modal default false  
//   }  
//   render() {  
    
//   }  
// }  
  
const styles = StyleSheet.create({  
  container: {
    flex: 1,
    alignItems: 'center',  
    justifyContent: 'center',  
    backgroundColor: 'green',  
  },  
  modal: {  
    justifyContent: 'center',  
    alignItems: 'center',   
    // backgroundColor : "#00BCD4",   
    backgroundColor: 'yellow',
    height: '20%' ,  
    width: '80%',  
    borderRadius:10,  
    borderWidth: 1,  
    borderColor: '#fff',    
    marginTop: 80,  
    marginLeft: 40,  
   },  
   text: {  
      color: '#3f2949',  
      marginTop: 10  
   }  
});

export default EllipsisMenu;