import { Datagrid, DateField, EmailField, NumberField, ReferenceField, ReferenceManyField, ReferenceOneField, Show, SimpleList, SimpleShowLayout, TabbedShowLayout, TextField } from 'react-admin';

export const UserShow = () => (
    <Show>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="summary">
                <TextField source="id" />
                <EmailField source="email" />
                <TextField source="phone" />
                <DateField source="created_at" />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="Accounts">
                <ReferenceManyField reference="account" target="binary_user_id" >
                    <Datagrid bulkActionButtons={false} rowClick="show">
                        <TextField source="id" />
                        <ReferenceOneField label="Currency" reference="account_summary" target="account_id">
                            <TextField source="currency_code" />
                        </ReferenceOneField>
                        <ReferenceOneField label="Balance" reference="account_summary" target="account_id">
                            <NumberField source="balance" transform={(value) => value.toFixed(2)} />
                        </ReferenceOneField>
                        <ReferenceOneField label="Deposit" reference="account_summary" target="account_id">
                            <NumberField source="deposit" transform={(value) => value.toFixed(2)} />
                        </ReferenceOneField>
                        <ReferenceOneField label="Withdrawal" reference="account_summary" target="account_id">
                            <NumberField source="withdrawal" transform={(value) => value.toFixed(2)} />
                        </ReferenceOneField>
                        <ReferenceOneField label="Status" reference="account_summary" target="account_id">
                            <TextField source="status" />
                        </ReferenceOneField>
                    </Datagrid>
                </ReferenceManyField>
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Show>
);
