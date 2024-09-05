import { combineDataProviders } from "react-admin";
import supabaseDataProvider from "./supabaseDataProvider";

const clientDataProvider = supabaseDataProvider(
  import.meta.env.VITE_CLIENT_DB_API_URL, import.meta.env.VITE_CLIENT_DB_API_KEY,
);

const loginDataProvider = supabaseDataProvider(
  import.meta.env.VITE_LOGIN_DB_API_URL, import.meta.env.VITE_LOGIN_DB_API_KEY,
)

const dataProvider = combineDataProviders(resource => {
  switch (resource) {
    case 'account':
    case 'contract':
    case 'client':
    case 'payment':
    case 'payment_gateway':
    case 'payment_gateway_type':
    case 'transaction':
    case 'account_summary':
      return clientDataProvider;
    case 'users':
    case 'loginid':
      return loginDataProvider;
    default:
      throw new Error('Invalid resource');
  }
}) 

export default dataProvider;
