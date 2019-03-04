import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export default StyleSheet.create({
  container: {},
  inputContainer: {
    height: 46,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.input.borderColor,
  },
  inputTitle: {
    position: 'absolute',
    left: 14,
    top: -8,
    color: colors.input.titleColor,
    backgroundColor: colors.input.titleBackgroundColor,
    paddingHorizontal: 4,
  },
  input: {
    color: colors.input.textColor,
    fontSize: 14,
    height: 46,
    paddingLeft: 16,
    paddingTop: 13,
    paddingBottom: 13,
  },
});
