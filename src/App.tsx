import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
  Show,
} from "react-admin";
import { Layout } from "./Layout";
import  dataProvider  from "./dataProvider";
import { UserList } from "./views/UserList";
import { UserShow } from "./views/UserShow";

export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider}>
    <Resource name="users" list={UserList} show={UserShow}/>
    <Resource name="account" list={ListGuesser} />
    {/* <Resource name="client" list={ListGuesser} />
    <Resource name="contract" list={ListGuesser} />
    <Resource name="payment" list={ListGuesser} />
    <Resource name="payment_gateway" list={ListGuesser} />
    <Resource name="payment_gateway_type" list={ListGuesser} />
    <Resource name="transaction" list={ListGuesser} />
    <Resource name="loginid" list={ListGuesser} /> */}
  </Admin>
);
