export const homepageType = {
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'heroSlides',
      title: 'Hero Slider Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Slider Image',
              type: 'image',
              options: { hotspot: true },
              validation: Rule => Rule.required()
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'link',
              title: 'Link (Optional)',
              type: 'string'
            }
          ]
        }
      ],
      validation: Rule => Rule.max(2).warning('You can only add up to 2 hero slides')
    },
    {
      name: 'bannerCollection',
      title: 'Banner Collection Section',
      type: 'object',
      fields: [
        {
          name: 'leftBanner',
          title: 'Left Banner',
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: Rule => Rule.required()
            },
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
              name: 'link',
              title: 'Link',
              type: 'string',
              validation: Rule => Rule.required()
            }
          ]
        },
        {
          name: 'rightBanner',
          title: 'Right Banner',
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: Rule => Rule.required()
            },
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
              name: 'link',
              title: 'Link',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'isWhiteText',
              title: 'Use White Text',
              type: 'boolean',
              default: true
            }
          ]
        }
      ]
    },
    {
      name: 'shopGram',
      title: 'Shop Instagram Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string',
          description: 'Main heading for the Shop Instagram section',
          initialValue: 'Shop Instagram'
        },
        {
          name: 'subheading',
          title: 'Subheading',
          type: 'string',
          description: 'Subheading text below the main heading',
          initialValue: 'Elevate your wardrobe with fresh finds today!'
        },
        {
          name: 'images',
          title: 'Gallery Images',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  options: { hotspot: true },
                  validation: Rule => Rule.required()
                },
                {
                  name: 'productId',
                  title: 'Product ID',
                  type: 'string',
                  description: 'ID of the linked product',
                  validation: Rule => Rule.required()
                },
                {
                  name: 'delay',
                  title: 'Animation Delay',
                  type: 'string',
                  initialValue: '0s',
                  options: {
                    list: [
                      { title: 'No delay', value: '0s' },
                      { title: '0.2s', value: '0.2s' },
                      { title: '0.4s', value: '0.4s' },
                      { title: '0.6s', value: '0.6s' },
                      { title: '0.8s', value: '0.8s' }
                    ]
                  }
                }
              ]
            }
          ],
          validation: Rule => Rule.max(5).warning('You can only add up to 5 images')
        }
      ]
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string'
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text'
        }
      ]
    }
  ]
} 