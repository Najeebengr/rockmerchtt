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
    // You can add other homepage sections here
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