export default {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    {
      name: 'imgSrc',
      title: 'Testimonial Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'quote',
      title: 'Quote',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'author',
      title: 'Author Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'avatar',
      title: 'Author Avatar',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'relatedProduct',
      title: 'Related Product',
      type: 'reference',
      to: [{ type: 'product' }]
    }
  ]
} 