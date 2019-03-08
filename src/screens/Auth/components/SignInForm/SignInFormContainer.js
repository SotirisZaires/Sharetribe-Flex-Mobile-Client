import {
  compose,
  withStateHandlers,
  withHandlers,
  withPropsOnChange,
} from 'recompose';
import { inject } from 'mobx-react';
import SignInFormView from './SignInFormView';
import { isValidEmail } from '../../../../utils/regExp';
import { withModal } from '../../../../utils/enhancers';
import ResetPasswordModal from '../ResetPasswordModal/ResetPasswordModal';

export default compose(
  inject((stores) => ({
    auth: stores.auth,
    isSigningIn: stores.auth.loginUser.inProgress,
    isResetingPassword: stores.auth.resetPassword.inProgress,
  })),

  withStateHandlers(
    {
      email: '',
      password: '',
      activeField: '',
      isValidFields: false,
      resetPasswordEmail: '',
      isVisibleResetPasswordModal: false,
    },
    {
      onChange: () => (field, value) => ({
        [field]: value,
      }),
    },
  ),

  withHandlers({
    signIn: (props) => () => {
      props.auth.loginUser.run({
        email: props.email,
        password: props.password,
      });
    },

    resetPassword: (props) => () => {
      props.auth.resetPassword.run({
        email: props.resetPasswordEmail,
      });
      props.onChange('isVisibleResetPasswordModal', false);
      props.onChange('activeField', '');
    },
  }),

  withPropsOnChange(['email', 'password'], (props) => {
    props.onChange(
      'isValidFields',
      props.password.trim().length > 8 && isValidEmail(props.email),
    );
  }),

  withModal(
    (props) => ({
      isVisible: props.isVisibleResetPasswordModal,
      onChange: props.onChange,
      resetPasswordEmail: props.resetPasswordEmail,
      resetPassword: props.resetPassword,
      activeField: props.activeField,
      // isLoading: props.isResetingPassword,
    }),
    ResetPasswordModal,
  ),
)(SignInFormView);