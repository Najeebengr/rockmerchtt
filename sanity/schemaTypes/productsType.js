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
        name: 'mainImage',
        title: 'Main Image',
        type: 'image',
        options: {
          hotspot: true
        },
        validation: Rule => Rule.required()
      },
      {
        name: 'quantity',
        title: 'Quantity',
        type: 'number',
        validation: Rule => Rule.required().min(0)
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
        name: 'filterSizes',
        title: 'Available Sizes',
        type: 'array',
        of: [{ type: 'string' }],
        validation: Rule => Rule.required()
      }
    ],
    preview: {
      select: {
        title: 'title',
        media: 'mainImage'
      }
    }
}