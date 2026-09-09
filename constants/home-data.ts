import { ImageSourcePropType } from 'react-native';

/**
 * The home screen's furniture, as the Figma frame (271:1148) shows it.
 *
 * What is here is presentation that never moves: the card artwork, the to-dos,
 * the suggestion tiles. Anything that changes as the simulation runs — balances
 * and transactions — lives in the ledger store instead.
 */

export type BankCard = {
  id: string;
  label: string;
  /** Also the link to the account behind it — see `accountByLast4`. */
  last4: string;
  /** The card's own fill. */
  background: string;
  /** The little card-art rectangle, which the kit paints as a gradient. */
  artGradient: [string, string];
  scheme: ImageSourcePropType;
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

export const CARDS: BankCard[] = [
  {
    id: 'mastercard-6098',
    label: 'Mastercard',
    last4: '6098',
    background: '#2C64E3',
    artGradient: ['#55B8FF', '#D361FC'],
    scheme: require('../assets/images/brand-mastercard.webp'),
  },
  {
    id: 'payoneer-4107',
    label: 'Payoneer',
    last4: '4107',
    // The kit paints this one as a gradient card; a single stop keeps the
    // component simple until a second gradient card earns it.
    background: '#FF8A3D',
    artGradient: ['#FF7E55', '#FFA800'],
    scheme: require('../assets/images/brand-visa.webp'),
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
