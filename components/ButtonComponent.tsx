import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface ButtonComponentProps {
  onPress: () => void;
  text: string;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ onPress, text }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ButtonComponent;
