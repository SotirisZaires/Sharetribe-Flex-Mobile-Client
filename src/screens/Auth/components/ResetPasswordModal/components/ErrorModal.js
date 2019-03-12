import React from 'react';
import { View } from 'react-native';
import T from 'prop-types';
import { Text, Button, IconFonts } from '../../../../../components';
import s from '../styles';
import i18n from '../../../../../i18n';
import { colors } from '../../../../../styles';

const RootModal = ({ resetPassword }) => (
  <View style={s.contentContainer}>
    <IconFonts
      style={s.icon}
      name="baseline-error-24px"
      size={80}
      tintColor={colors.icon.tintColorOrange}
    />
    <Text bold xxmediumSize black style={s.heading}>
      {i18n.t('auth.somethingWentWrong')}
    </Text>
    <Text style={s.text}>
      {i18n.t('auth.resetPasswordErrorInstruction')}
    </Text>
    <Button
      primary
      onPress={() => resetPassword()}
      containerStyle={s.buttonResultContainer}
    >
      {i18n.t('auth.tryAgain')}
    </Button>
  </View>
);

RootModal.propTypes = {
  resetPassword: T.func,
};

export default RootModal;