export const productsType = {
    name: 'products',
    title: 'Products', 
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: Rule => Rule.required()
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
        validation: Rule => Rule.required()
      },
      {
        name: 'category',
        title: 'Category',
        type: 'string',
        options: {
          list: [
            { title: 'Men', value: 'men' },
            { title: 'Women', value: 'women' },
            { title: 'Children', value: 'children' }
          ]
        },
        validation: Rule => Rule.required()
      },
      {
        name: 'price',
        title: 'Price',
        type: 'number',
        validation: Rule => Rule.required().positive()
      },
      {
        name: 'sale',
        title: 'Sale Settings',
        type: 'object',
        fields: [
          {
            name: 'isOnSale',
            title: 'Is On Sale',
            type: 'boolean',
            initialValue: false
          },
          {
            name: 'saleType',
            title: 'Sale Type',
            type: 'string',
            options: {
              list: [
                { title: 'Percentage Off', value: 'percentage' },
                { title: 'Fixed Price', value: 'fixed' }
              ]
            },
            hidden: ({ parent }) => !parent?.isOnSale
          },
          {
            name: 'saleValue',
            title: 'Sale Value',
            type: 'number',
            validation: Rule => Rule.custom((value, { parent }) => {
              if (!parent?.isOnSale) return true;
              if (!value) return 'Sale value is required when item is on sale';
              if (parent.saleType === 'percentage' && (value <= 0 || value > 100)) {
                return 'Percentage must be between 0 and 100';
              }
              if (parent.saleType === 'fixed' && value <= 0) {
                return 'Fixed price must be greater than 0';
              }
              return true;
            }),
            hidden: ({ parent }) => !parent?.isOnSale
          }
        ]
      },
      {
        name: 'images',
        title: 'Product Images',
        type: 'array',
        of: [
          {
            type: 'image',
            options: { hotspot: true }
          }
        ],
        validation: Rule => Rule.required().min(1).max(3)
          .warning('You can only add up to 3 images')
      },
      {
        name: 'filterBrands',
        title: 'Brand',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'brand' }] }],
        validation: Rule => Rule.required().length(1)
      },
      {
        name: 'filterColor',
        title: 'Available Colors',
        type: 'array',
        of: [{ type: 'string' }],
        validation: Rule => Rule.required()
      },
      {
        name: 'sizeQuantities',
        title: 'Sizes and Quantities',
        type: 'array',
        of: [{
          type: 'object',
          fields: [
            {
              name: 'size',
              title: 'Size',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: Rule => Rule.required().min(0)
            }
          ]
        }],
        validation: Rule => Rule.required()
      }
    ],
    preview: {
      select: {
        title: 'title',
        subtitle: 'description',
        media: 'images.0'
      }
    }
}