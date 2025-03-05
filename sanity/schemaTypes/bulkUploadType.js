export const bulkUploadType = {
  name: 'bulkUpload',
  title: 'Bulk Upload',
  type: 'document',
  fields: [
    {
      name: 'uploadDate',
      title: 'Upload Date',
      type: 'datetime'
    },
    {
      name: 'fileName',
      title: 'File Name',
      type: 'string'
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Processing', value: 'processing' },
          { title: 'Completed', value: 'completed' },
          { title: 'Failed', value: 'failed' }
        ]
      }
    },
    {
      name: 'totalRecords',
      title: 'Total Records',
      type: 'number'
    },
    {
      name: 'successfulUploads',
      title: 'Successful Uploads',
      type: 'number'
    },
    {
      name: 'failedRecords',
      title: 'Failed Records',
      type: 'number'
    }
  ]
} 