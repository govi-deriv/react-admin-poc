// guessed list for users

import { useMediaQuery, Theme } from "@mui/material";
import { Datagrid, DateField, EmailField, List, SimpleList, TextField } from 'react-admin';

export const UserList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    return (<List>
        {isSmall ? <SimpleList
            primaryText={(record) => record.id}
            secondaryText={(record) => record.email}
            tertiaryText={(record) => record.phone}
        /> : <Datagrid>
            <TextField source="id" />
            <EmailField source="email" />
            <TextField source="phone" />
            <DateField source="created_at" />
        </Datagrid>}
    </List>)
};