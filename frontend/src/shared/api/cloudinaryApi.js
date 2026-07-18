const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const CLOUDINARY_PAYMENT_SLIP_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PAYMENT_SLIP_UPLOAD_PRESET

const requireCloudinaryConfig = (uploadPreset, presetEnvName) => {
  if (!CLOUDINARY_CLOUD_NAME || !uploadPreset) {
    throw new Error(`Cloudinary frontend config is missing. Set VITE_CLOUDINARY_CLOUD_NAME and ${presetEnvName} in frontend .env.`)
  }
}

const uploadOneImage = async (file, uploadPreset, presetEnvName) => {
  requireCloudinaryConfig(uploadPreset, presetEnvName)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

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
    return uploadOneImage(file, CLOUDINARY_UPLOAD_PRESET, 'VITE_CLOUDINARY_UPLOAD_PRESET')
  },

  async uploadPaymentSlip(file) {
    return uploadOneImage(file, CLOUDINARY_PAYMENT_SLIP_UPLOAD_PRESET, 'VITE_CLOUDINARY_PAYMENT_SLIP_UPLOAD_PRESET')
  },

  async uploadWatchImages(files) {
    const selectedFiles = Array.from(files).slice(0, 5)
    const images = []

    for (const file of selectedFiles) {
      images.push(await cloudinaryApi.uploadImage(file))
    }

    return { images }
  },
}
