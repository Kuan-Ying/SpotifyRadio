import _ from 'lodash';
import { createSelector } from 'reselect';
import { currentUserInfoSelector } from '../../redux/modules/user';

export const extractedUserInfoSelector = createSelector([
  currentUserInfoSelector,
], (userInfo) => {
  if (_.isEmpty(userInfo)) {
    return {};
  }
  const {
    id,
    images,
    display_name: name,
  } = userInfo;

  return {
    id,
    name,
    image: images[0].url,
  };
});

export const mock = null;
