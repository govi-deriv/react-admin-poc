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
import { AccountShow } from "./views/AccountShow";

export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider}>
    <Resource name="users" list={UserList} show={UserShow}/>
    <Resource name="account" list={ListGuesser} show={AccountShow} />
  </Admin>
);
