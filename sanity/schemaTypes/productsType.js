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
        name: 'oldPrice',
        title: 'Old Price',
        type: 'number'
      },
      {
        name: 'mainImage',
        title: 'Main Image',
        type: 'image',
        options: {
          hotspot: true
        },
        fields: [
          {
            name: 'alt',
            type: 'string',
            title: 'Alternative text',
            description: 'Important for SEO and accessibility.'
          }
        ]
      },
      {
        name: 'hoverImage',
        title: 'Hover Image',
        type: 'image',
        options: {
          hotspot: true
        },
        fields: [
          {
            name: 'alt',
            type: 'string',
            title: 'Alternative text'
          }
        ]
      },
      {
        name: 'imgSrc',
        title: 'Main Image URL (External)',
        type: 'string',
        description: 'Optional: Use this for external image URLs'
      },
      {
        name: 'imgHover',
        title: 'Hover Image URL (External)',
        type: 'string',
        description: 'Optional: Use this for external hover image URLs'
      },
      {
        name: 'isOnSale',
        title: 'Is On Sale',
        type: 'boolean',
        initialValue: false
      },
      {
        name: 'salePercentage',
        title: 'Sale Percentage',
        type: 'string'
      },
      {
        name: 'inStock',
        title: 'In Stock',
        type: 'boolean',
        initialValue: true
      },
      {
        name: 'colors',
        title: 'Color Variants',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'bgColor',
                title: 'Color Class',
                type: 'string'
              },
              {
                name: 'variantImage',
                type: 'image',
                title: 'Variant Image',
                options: {
                  hotspot: true
                }
              },
              {
                name: 'imgSrc',
                title: 'External Image URL',
                type: 'string',
                description: 'Optional: Use this for external image URLs'
              }
            ]
          }
        ]
      },
      {
        name: 'filterBrands',
        title: 'Brands',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'brand' }] }]
      },
      {
        name: 'filterColor',
        title: 'Available Colors',
        type: 'array',
        of: [{ type: 'string' }]
      },
      {
        name: 'filterSizes',
        title: 'Available Sizes',
        type: 'array',
        of: [{ type: 'string' }]
      },
      {
        name: 'tabFilterOptions',
        title: 'Category Filters',
        type: 'array',
        of: [{ type: 'string' }]
      },
      {
        name: 'tabFilterOptions2',
        title: 'Additional Filters',
        type: 'array',
        of: [{ type: 'string' }]
      },
      {
        name: 'rating',
        title: 'Rating',
        type: 'number',
        validation: Rule => Rule.min(0).max(5)
      },
      {
        name: 'reviews',
        title: 'Number of Reviews',
        type: 'number'
      },
      {
        name: 'countdown',
        title: 'Sale Countdown (in seconds)',
        type: 'number'
      }
    ],
    preview: {
      select: {
        title: 'title',
        media: 'mainImage'
      }
    }
  }