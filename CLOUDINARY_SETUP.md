# Cloudinary Configuration for EESA Frontend

This document explains how to configure Cloudinary for your EESA frontend application to handle media files uploaded from your Django backend.

## Prerequisites

1. A Cloudinary account (free tier available at [cloudinary.com](https://cloudinary.com))
2. Django backend configured to upload files to Cloudinary
3. Next.js frontend (this project)

## Step 1: Get Cloudinary Credentials

1. Sign up for a Cloudinary account if you don't have one
2. Go to your Cloudinary Dashboard
3. Note down these values:
   - Cloud Name
   - API Key
   - API Secret

## Step 2: Configure Environment Variables

### For Development (.env.local)

Update your `.env.local` file with your Cloudinary credentials:

```bash
# Frontend Environment Variables
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_DJANGO_ADMIN_URL=http://localhost:8000/eesa

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret
```

### For Production (Vercel Environment Variables)

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add these variables:
   - `NEXT_PUBLIC_API_BASE_URL`: Your production API URL
   - `NEXT_PUBLIC_DJANGO_ADMIN_URL`: Your production Django admin URL
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `NEXT_PUBLIC_CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

## Step 3: Django Backend Configuration

Ensure your Django backend is configured to upload files to Cloudinary:

### Install Cloudinary in Django

```bash
pip install cloudinary
```

### Django Settings

```python
# settings.py
import cloudinary
import cloudinary.uploader
import cloudinary.api

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': 'your-cloud-name',
    'API_KEY': 'your-api-key',
    'API_SECRET': 'your-api-secret',
}

cloudinary.config(**CLOUDINARY_STORAGE)

# Use Cloudinary for file storage
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
```

### Model Configuration

```python
# models.py
from cloudinary.models import CloudinaryField

class AcademicResource(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    file = CloudinaryField('file', resource_type='auto')  # This handles PDFs, images, etc.
    # ... other fields
```

## Step 4: Frontend Features

The frontend includes several features for handling Cloudinary files:

### 1. PDF Viewer with Embedded Display
- Files are displayed in an embedded PDF viewer
- Support for page navigation, zoom controls
- Download option available

### 2. Cloudinary Optimizations
- Automatic format optimization
- Image thumbnails for PDF files
- Responsive image loading

### 3. File Type Detection
- Automatic detection of Cloudinary URLs
- Fallback handling for non-Cloudinary files

## Step 5: CORS Configuration

If you encounter CORS issues, configure Cloudinary CORS settings:

1. Go to your Cloudinary console
2. Navigate to Settings > Security
3. Add your domain to the "Allowed fetch domains" list
4. Include both development (`localhost:3000`) and production domains

## Step 6: Testing

### Test PDF Upload Flow

1. Upload a PDF through your Django admin
2. Verify the file appears in your Cloudinary media library
3. Check that the frontend displays the PDF with:
   - Thumbnail preview
   - Embedded viewer
   - Download functionality

### Test Different File Types

The system supports:
- PDF files (with embedded viewing)
- Image files (with optimization)
- Document files (with download options)

## Troubleshooting

### Common Issues

1. **PDF not displaying**: Check CORS settings and ensure the URL is accessible
2. **Thumbnails not loading**: Verify Cloudinary transformations are enabled
3. **Download not working**: Check the download URL generation and browser permissions

### Error Handling

The frontend includes error handling for:
- Failed PDF loads (fallback to download option)
- Network errors (retry mechanisms)
- CORS restrictions (alternative viewing methods)

## Security Considerations

1. **API Keys**: Only expose `NEXT_PUBLIC_*` variables to the frontend
2. **File Access**: Cloudinary URLs can be made private or public based on your needs
3. **Upload Security**: Handle file uploads securely in your Django backend

## Performance Optimization

1. **Image Optimization**: Cloudinary automatically optimizes images
2. **Lazy Loading**: PDF thumbnails are loaded as needed
3. **Caching**: Cloudinary provides CDN caching by default

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Django Cloudinary Integration](https://pypi.org/project/django-cloudinary-storage/)
- [Next.js Image Optimization](https://nextjs.org/docs/api-reference/next/image)
