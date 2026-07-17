const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const requireCloudinaryConfig = () => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary frontend config is missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in frontend .env.')
  }
}

const uploadOneImage = async (file) => {
  requireCloudinaryConfig()

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })
  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'Cloudinary image upload failed.')
  }

  return {
    publicId: payload.public_id,
    url: payload.secure_url || payload.url,
  }
}

export const cloudinaryApi = {
  async uploadImage(file) {
    return uploadOneImage(file)
  },

  async uploadWatchImages(files) {
    const selectedFiles = Array.from(files).slice(0, 5)
    const images = []

    for (const file of selectedFiles) {
      images.push(await uploadOneImage(file))
    }

    return { images }
  },
}
