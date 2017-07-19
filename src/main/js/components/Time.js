import moment from 'moment';
import React from 'react';

export const RelativeTime = ({ ts }) => <span>{moment(ts).fromNow()}</span>;
