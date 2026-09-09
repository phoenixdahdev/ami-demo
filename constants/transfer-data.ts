import { ImageSourcePropType } from 'react-native';

/**
 * Fixtures for the transfer flow (Figma 431:4374 and the screens after it).
 * No backend, so the recipient and the quick actions are seeded here.
 */
export type Recipient = {
  id: string;
  name: string;
  handle: string;
  iban: string;
  avatar: ImageSourcePropType;
};

export type QuickActionItem = {
  id: string;
  title: string;
  description: string;
};

export const MY_HANDLE = '@ulvinomarov';

/** The minimum the Send screen will accept, as the frame states it. */
export const MIN_AMOUNT = 2;

export const RECIPIENT: Recipient = {
  id: 'alvin-klein',
  name: 'Alvin Klein',
  handle: '@ulvinomarov',
  iban: 'GU68 7099 3233 9586 6589',
  avatar: require('../assets/images/user-avatar.webp'),
};

export const TRANSFER_QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: 'scheduled',
    title: 'Scheduled',
    description: 'Add or check scheduled payments',
  },
  {
    id: 'split-bill',
    title: 'Split bill',
    description: 'Split a bill with a friend or group',
  },
  {
    id: 'payment-link',
    title: 'Payment link',
    description: 'Send or request money with a link',
  },
];

export const TRANSFER_FILTERS = [
  { id: 'friends', label: 'Friends', count: 3 },
  { id: 'anipay', label: 'Anipay', count: 6 },
];
