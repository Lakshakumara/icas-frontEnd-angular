export interface Beneficiary {
    id: any,
    name: string,
    nic: string,
    relationship: string,
    registerDate:any,
    registrationYear:any,
    percent: any,
    deleted:boolean
}
export const BeneficiaryColumns = [
    {
        key: 'id',
        type: 'number',
        label: 'ID',
        required: false,
    },
    {
        key: 'name',
        type: 'text',
        label: 'Name',
        required: true,
    },
    {
        key: 'nic',
        type: 'string',
        label: 'NIC',
        required: false,
    },
    {
        key: 'relationship',
        type: 'string',
        label: 'Relationship',
    },
    {
        key: 'percent',
        type: 'number',
        label: 'Percent',
    },
    {
        key: 'star',
        type: 'icon',
        label: '',
    },
];