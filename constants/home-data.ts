import { ImageSourcePropType } from 'react-native';

/**
 * The home screen's contents, as the Figma frame (271:1148) shows them.
 *
 * There is no backend, so this is the fixture the screen renders. It is shaped
 * the way an API response would be, which is what a real data layer would drop
 * into.
 */

export type BankCard = {
  id: string;
  label: string;
  last4: string;
  balance: string;
  /** The card's own fill. */
  background: string;
  /** The little card-art rectangle, which the kit paints as a gradient. */
  artGradient: [string, string];
  scheme: ImageSourcePropType;
};

export type Transaction = {
  id: string;
  merchant: string;
  category: string;
  amount: string;
  date: string;
  logo: ImageSourcePropType;
};

export type TodoItem = {
  id: string;
  label: string;
  avatar: ImageSourcePropType;
};

export type Suggestion = {
  id: string;
  title: string;
  background: string;
};

export const TOTAL_BALANCE = '$34 950';

export const CARDS: BankCard[] = [
  {
    id: 'mastercard-6098',
    label: 'Mastercard',
    last4: '6098',
    balance: '$20 750',
    background: '#2C64E3',
    artGradient: ['#55B8FF', '#D361FC'],
    scheme: require('../assets/images/brand-mastercard.webp'),
  },
  {
    id: 'payoneer-4107',
    label: 'Payoneer',
    last4: '4107',
    balance: '$4 083',
    // The kit paints this one as a gradient card; a single stop keeps the
    // component simple until a second gradient card earns it.
    background: '#FF8A3D',
    artGradient: ['#FF7E55', '#FFA800'],
    scheme: require('../assets/images/brand-visa.webp'),
  },
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: 'starbucks-21-02-21',
    merchant: 'Starbucks',
    category: 'Coffee & restaurants',
    amount: '- 1.33 USD',
    date: '21.02.21',
    logo: require('../assets/images/brand-starbucks.webp'),
  },
];

export const TODOS: TodoItem[] = [
  {
    id: 'contact',
    label: 'How can we reach you?',
    avatar: require('../assets/images/todo-verify.webp'),
  },
  {
    id: 'verify',
    label: 'How can we reach you?',
    avatar: require('../assets/images/todo-contact.webp'),
  },
];

export const SUGGESTIONS: Suggestion[] = [
  {
    id: 'direct-deposits',
    title: 'Speed up your direct deposits',
    background: '#D8FF6F',
  },
  {
    id: 'direct-deposits-2',
    title: 'Speed up your direct deposits',
    background: '#D7E5FF',
  },
];
