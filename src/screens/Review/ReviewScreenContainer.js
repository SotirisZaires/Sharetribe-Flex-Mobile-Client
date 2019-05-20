import {
  compose,
  hoistStatics,
  withStateHandlers,
  withHandlers,
} from 'recompose';

import { inject } from 'mobx-react/custom';
import R from 'ramda';
import ReviewScreenView from './ReviewScreenView';
import { withParamsToProps } from '../../utils/enhancers';

export default hoistStatics(
  compose(
    withParamsToProps('transaction'),
    inject((stores, { transaction }) => ({
      displayName: R.pathOr(
        '',
        [
          'relationships',
          'listing',
          'relationships',
          'author',
          'profile',
          'displayName',
        ],
        transaction,
      ),
      user: R.pathOr(
        '',
        ['relationships', 'listing', 'relationships', 'author'],
        transaction,
      ),
      transaction,
    })),
    withStateHandlers(
      (props) => ({
        activeField: '',
        review: '',
        rating: '',
      }),
      {
        onChange: () => (field, value) => ({
          [field]: value,
        }),
      },
    ),
    withHandlers({
      onSentReview: ({ transaction, review }) => () => {
        try {
          transaction.sentReview.run({ content: review });
        } catch (err) {
          console.log(err);
        }
      },
    }),
  ),
)(ReviewScreenView);
