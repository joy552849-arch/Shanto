
import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import { User, Settings, PaymentRequest, CreditPackage } from '../types';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../config';

interface GlobalState {
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  payments: PaymentRequest[];
  settings: Settings;
  isInitialized: boolean;
}

type Action =
  | { type: 'INITIALIZE_STATE'; payload: GlobalState }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SIGNUP'; payload: User }
  | { type: 'UPDATE_CREDITS'; payload: { userId: string; credits: number } }
  | { type: 'ADD_PAYMENT_REQUEST'; payload: PaymentRequest }
  | { type: 'UPDATE_PAYMENT_STATUS'; payload: { paymentId: string; status: 'approved' | 'rejected' } }
  | { type: 'UPDATE_SETTINGS'; payload: Settings };

const initialState: GlobalState = {
  currentUser: null,
  isAuthenticated: false,
  users: [],
  payments: [],
  settings: {
    paymentDetails: {
      methodName: 'Bkash/Nagad',
      accountNumber: '01700000000',
      qrCodeUrl: 'https://i.ibb.co/6rC6sT0/placeholder-qr.png'
    },
    creditPackages: [
      { id: 'pkg1', name: 'Starter Pack', credits: 100, price: 50 },
      { id: 'pkg2', name: 'Pro Pack', credits: 500, price: 200 },
      { id: 'pkg3', name: 'Power User', credits: 1200, price: 450 },
      { id: 'pkg4', name: 'Enterprise', credits: 3000, price: 1000 },
    ]
  },
  isInitialized: false,
};

const globalStateReducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case 'INITIALIZE_STATE':
        return { ...action.payload, isInitialized: true };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        currentUser: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        currentUser: null,
      };
    case 'SIGNUP':
      return {
        ...state,
        users: [...state.users, action.payload],
        isAuthenticated: true,
        currentUser: action.payload,
      };
    case 'UPDATE_CREDITS': {
      const updatedUsers = state.users.map(user =>
        user.id === action.payload.userId ? { ...user, credits: action.payload.credits } : user
      );
      const updatedCurrentUser = state.currentUser && state.currentUser.id === action.payload.userId
        ? { ...state.currentUser, credits: action.payload.credits }
        : state.currentUser;
      return { ...state, users: updatedUsers, currentUser: updatedCurrentUser };
    }
    case 'ADD_PAYMENT_REQUEST':
      return { ...state, payments: [...state.payments, action.payload] };
    case 'UPDATE_PAYMENT_STATUS': {
        let updatedUsers = [...state.users];
        const updatedPayments = state.payments.map(p => {
            if (p.id === action.payload.paymentId) {
                if (action.payload.status === 'approved' && p.status === 'pending') {
                    updatedUsers = updatedUsers.map(u => {
                        if (u.id === p.userId) {
                            return { ...u, credits: u.credits + p.packageCredits };
                        }
                        return u;
                    });
                }
                return { ...p, status: action.payload.status };
            }
            return p;
        });
        return { ...state, payments: updatedPayments, users: updatedUsers };
    }
    case 'UPDATE_SETTINGS':
        return { ...state, settings: action.payload };
    default:
      return state;
  }
};

const GlobalStateContext = createContext<{ state: GlobalState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(globalStateReducer, initialState);

  useEffect(() => {
    try {
      const persistedState = localStorage.getItem('shanto-ai-state');
      if (persistedState) {
        dispatch({ type: 'INITIALIZE_STATE', payload: JSON.parse(persistedState) });
      } else {
        dispatch({ type: 'INITIALIZE_STATE', payload: initialState });
      }
    } catch (error) {
      console.error("Could not load state from localStorage", error);
      dispatch({ type: 'INITIALIZE_STATE', payload: initialState });
    }
  }, []);

  useEffect(() => {
    if (state.isInitialized) {
        try {
            const stateToPersist = { ...state };
            delete stateToPersist.isInitialized;
            localStorage.setItem('shanto-ai-state', JSON.stringify(stateToPersist));
        } catch (error) {
            console.error("Could not save state to localStorage", error);
        }
    }
  }, [state]);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {state.isInitialized ? children : 
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
          <svg className="animate-spin h-8 w-8 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      }
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context.state;
};

export const useGlobalDispatch = () => {
    const context = useContext(GlobalStateContext);
    if (context === undefined) {
      throw new Error('useGlobalDispatch must be used within a GlobalStateProvider');
    }
    return context.dispatch;
};
