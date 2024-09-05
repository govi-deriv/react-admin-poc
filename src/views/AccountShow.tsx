import { Datagrid, DateField, NumberField, ReferenceField, ReferenceManyField, Show, SimpleList, SimpleShowLayout, TextField } from 'react-admin';

export const AccountShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="client_loginid" />
            <TextField source="currency_code" />
            <NumberField source="balance" />
            <ReferenceManyField reference="transaction" target="account_id">
            <SimpleList
                primaryText={(record) => record.action_type.toUpperCase()}
                secondaryText={(record) => record.transaction_time}
                tertiaryText={(record) => record.amount.toFixed(2)}
            />
            </ReferenceManyField>
        </SimpleShowLayout>
    </Show>
);
