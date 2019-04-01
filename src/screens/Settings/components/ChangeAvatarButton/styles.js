import { StyleSheet } from 'react-native';
import { colors, dimensions } from '../../../../styles';

export default StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    position: 'absolute',
    bottom: -15,
    alignSelf: 'center',
  },
  button: {
    borderRadius: 10,
    paddingTop: dimensions.indent * 0.4,
    paddingBottom: dimensions.indent * 0.4,
    padding: dimensions.indent * 0.6,
  },
  view: {
    backgroundColor: colors.button.backgroundColor,
    borderColor: colors.button.borderColor,
    borderWidth: 1,
    flexDirection: 'row',
  },
  text: {
    textAlign: 'center',
  },
});
