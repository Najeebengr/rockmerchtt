const customer = {
  name: 'customer',
  title: 'Customer',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string'
    },
    {
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        {name: 'street', title: 'Street', type: 'string'},
        {name: 'city', title: 'City', type: 'string'},
        {name: 'state', title: 'State', type: 'string'},
        {name: 'zipCode', title: 'ZIP Code', type: 'string'},
        {name: 'country', title: 'Country', type: 'string'}
      ]
    },
    {
      name: 'orders',
      title: 'Orders',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'order'}]}]
    }
  ]
}

export default customer 