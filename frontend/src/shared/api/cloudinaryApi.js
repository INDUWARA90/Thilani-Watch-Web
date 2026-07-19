const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const CLOUDINARY_PAYMENT_SLIP_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PAYMENT_SLIP_UPLOAD_PRESET

const requireCloudinaryConfig = (uploadPreset, presetEnvName) => {
  if (!CLOUDINARY_CLOUD_NAME || !uploadPreset) {
    throw new Error(`Cloudinary frontend config is missing. Set VITE_CLOUDINARY_CLOUD_NAME and ${presetEnvName} in frontend .env.`)
  }
}

const uploadOneFile = async (file, uploadPreset, presetEnvName, resourceType = 'image') => {
  requireCloudinaryConfig(uploadPreset, presetEnvName)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, {
    method: 'POST',
    body: formData,
  })
  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'Cloudinary file upload failed.')
  }

  return {
    bytes: payload.bytes,
    fileName: payload.original_filename,
    format: payload.format,
    publicId: payload.public_id,
    resourceType: payload.resource_type,
    url: payload.secure_url || payload.url,
  }
}

export const cloudinaryApi = {
  async uploadImage(file) {
    return uploadOneFile(file, CLOUDINARY_UPLOAD_PRESET, 'VITE_CLOUDINARY_UPLOAD_PRESET')
  },

  async uploadPaymentSlip(file) {
    return uploadOneFile(
      file,
      CLOUDINARY_PAYMENT_SLIP_UPLOAD_PRESET,
      'VITE_CLOUDINARY_PAYMENT_SLIP_UPLOAD_PRESET',
      file.type.startsWith('image/') ? 'image' : 'raw',
    )
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
